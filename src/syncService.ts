import { eq, desc, sql } from "drizzle-orm";
import { db } from "./db/index.js";
import { rates, rateHistoryLogs, syncLogs, calculationSettings } from "./db/schema.js";

const API_URL = "https://www.businessmantra.info/gold_rates/devi_gold_rate/api.php";

let syncTimer: NodeJS.Timeout | null = null;
let broadcastCallback: ((data: any) => void) | null = null;

export let latestRatesInMemory: any = null;
export let lastSyncAttemptAt: number = 0;

export const setBroadcastCallback = (cb: (data: any) => void) => {
  broadcastCallback = cb;
};

export const syncRates = async () => {
  lastSyncAttemptAt = Date.now();
  try {
    let settingsResult;
    try {
      settingsResult = await db.select().from(calculationSettings).limit(1);
    } catch (dbErr: any) {
      console.warn("DB Select Error inside syncRates, assuming dropped connection. Retrying...", dbErr);
      settingsResult = await db.select().from(calculationSettings).limit(1);
    }
    
    let settings = settingsResult[0];
    if (!settings) {
      const inserted = await db.insert(calculationSettings).values({}).returning();
      settings = inserted[0];
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds max

    let response;
    let apiData: any = {};
    
    try {
      if (!settings?.useManualRates) {
        response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`API returned HTTP ${response.status}`);
        }
        apiData = await response.json();
      }
    } catch (err: any) {
      if (!settings?.useManualRates) {
        if (err.name === 'AbortError') {
          throw new Error("Master API timed out after 10 seconds.");
        }
        throw new Error("Master API unreachable: " + (err.message || String(err)));
      }
      // If manual is enabled, we ignore API errors completely
    } finally {
      clearTimeout(timeoutId);
    }
    
    // According to existing App.tsx logic:
    let raw24k = typeof apiData['24K Gold'] === 'number' ? apiData['24K Gold'] : parseFloat(apiData['24K Gold'] || "0");
    let rawSilver = typeof apiData['Silver'] === 'number' ? apiData['Silver'] : parseFloat(apiData['Silver'] || "0");
    let rawPlatinum = typeof apiData['Platinum'] === 'number' ? apiData['Platinum'] : parseFloat(apiData['Platinum'] || "0");

    if (!isNaN(rawSilver)) {
      rawSilver = rawSilver * 100; // Convert to per kg from API
    }

    if (settings && settings.useManualRates) {
      if (settings.manualGold24k > 0) raw24k = settings.manualGold24k;
      if (settings.manualSilver !== undefined) rawSilver = settings.manualSilver;
      if (settings.manualPlatinum !== undefined) rawPlatinum = settings.manualPlatinum;
    }

    if (!raw24k || isNaN(raw24k)) throw new Error("Invalid 24K gold rate from API");

    const m24kPur = settings.gold24kPurMult ?? 0.985;
    const m22kSale = settings.gold22kSaleMult ?? 0.920;
    const m22kPur = settings.gold22kPurMult ?? 0.900;
    const m18kSale = settings.gold18kSaleMult ?? 0.860;
    const m18kPur = settings.gold18kPurMult ?? 0.800;

    const gold24kSale = Math.round(raw24k);
    const gold24kPurchase = Math.round(gold24kSale * m24kPur);
    const gold22kSale = Math.round(gold24kSale * m22kSale);
    const gold22kPurchase = Math.round(gold24kSale * m22kPur);
    const gold18kSale = Math.round(gold24kSale * m18kSale);
    const gold18kPurchase = Math.round(gold24kSale * m18kPur);
    
    const silverSale = Math.round(rawSilver);
    const silverPurchase = Math.round(silverSale - settings.silverPurchaseOffset);

    const platinumSale = Math.round(rawPlatinum || 0);
    const platinumPurchase = Math.round(platinumSale ? platinumSale - settings.platinumPurchaseOffset : 0);

    const rateData = {
      gold24kSale,
      gold24kPurchase,
      gold22kSale,
      gold22kPurchase,
      gold18kSale,
      gold18kPurchase,
      silverSale,
      silverPurchase,
      platinumSale,
      platinumPurchase,
      updatedAt: new Date()
    };

    // Save to in-memory state
    latestRatesInMemory = rateData;

    const isStoreEnabled = !settings || settings.storeRatesInDb !== false;

    if (isStoreEnabled) {
      // Check if rates actually changed
      let hasChanged = true;
      try {
        const lastRateResult = await db.select().from(rates).orderBy(desc(rates.id)).limit(1);
        if (lastRateResult.length > 0) {
          const lastRate = lastRateResult[0];
          if (
            lastRate.gold24kSale === rateData.gold24kSale &&
            lastRate.gold24kPurchase === rateData.gold24kPurchase &&
            lastRate.gold22kSale === rateData.gold22kSale &&
            lastRate.gold22kPurchase === rateData.gold22kPurchase &&
            lastRate.gold18kSale === rateData.gold18kSale &&
            lastRate.gold18kPurchase === rateData.gold18kPurchase &&
            lastRate.silverSale === rateData.silverSale &&
            lastRate.silverPurchase === rateData.silverPurchase &&
            lastRate.platinumSale === rateData.platinumSale &&
            lastRate.platinumPurchase === rateData.platinumPurchase
          ) {
            hasChanged = false;
          }
        }
      } catch (e) {
        console.warn("Could not check last rates for changes", e);
      }

      if (hasChanged) {
        // Insert new rates as history in rates table
        await db.insert(rates).values({ ...rateData });

        // Keep only 40 records in rates
        try {
          const allRates = await db.select({ id: rates.id }).from(rates).orderBy(desc(rates.id)).limit(40);
          if (allRates.length === 40) {
            const oldestIdToKeep = allRates[39].id;
            await db.delete(rates).where(sql`${rates.id} < ${oldestIdToKeep}`);
          }
        } catch (e) {
          console.error("Failed to prune rates table:", e);
        }

        // History log
        await db.insert(rateHistoryLogs).values({
          sourceApiResponse: apiData,
          ...rateData
        });

        // Prune rateHistoryLogs to 40 entries maximum
        try {
          const logs = await db.select({ id: rateHistoryLogs.id }).from(rateHistoryLogs).orderBy(desc(rateHistoryLogs.id)).limit(40);
          if (logs.length === 40) {
            const oldestIdToKeep = logs[39].id;
            await db.delete(rateHistoryLogs).where(sql`${rateHistoryLogs.id} < ${oldestIdToKeep}`);
          }
        } catch (e) {
          console.error("Failed to prune rate history logs:", e);
        }

        // Sync log success
        await db.insert(syncLogs).values({
          status: "success",
          apiResponse: apiData
        });

        // Prune syncLogs to 40 entries maximum as well to keep the database clean
        try {
          const logs = await db.select({ id: syncLogs.id }).from(syncLogs).orderBy(desc(syncLogs.id)).limit(40);
          if (logs.length === 40) {
            const oldestIdToKeep = logs[39].id;
            await db.delete(syncLogs).where(sql`${syncLogs.id} < ${oldestIdToKeep}`);
          }
        } catch (e) {}
      }
    }

    // Broadcast via websockets
    if (broadcastCallback) {
      broadcastCallback({ type: "sync_success", data: rateData });
    }

  } catch (error: any) {
    console.error("Rate Sync Error:", error);
    try {
      // Find out if we can save to synclog (defaults to true if settings aren't loaded)
      let storeSetting = true;
      try {
        const settingsResult = await db.select().from(calculationSettings).limit(1);
        if (settingsResult[0] && settingsResult[0].storeRatesInDb === false) {
          storeSetting = false;
        }
      } catch (e) {}

      if (storeSetting) {
        await db.insert(syncLogs).values({
          status: "error",
          errorMessage: error.message || String(error)
        });
      }
    } catch (logError) {
      console.error("Failed to write to syncLogs:", logError);
    }
    if (broadcastCallback) {
      broadcastCallback({ type: "sync_error", message: error.message });
    }
    throw error;
  }
};

export const startSyncService = async () => {
  // Run once immediately on startup if auto sync is enabled
  try {
    const settings = await db.select().from(calculationSettings).limit(1).catch(() => []);
    const isAutoSyncEnabled = !settings[0] || settings[0].enableAutoSync !== false;
    
    if (isAutoSyncEnabled) {
      console.log("Starting initial automatic rate sync...");
      await syncRates();
    } else {
      console.log("Automatic rate synchronization is disabled by admin setting. Skipping initial sync.");
    }
  } catch (e) {
    console.error("Initial syncRates failed:", e);
  }
};
