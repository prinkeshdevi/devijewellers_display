import { eq, desc, sql } from "drizzle-orm";
import { db } from "./db/index.js";
import { rates, rateHistoryLogs, syncLogs, calculationSettings } from "./db/schema.js";

const API_URL = "https://www.businessmantra.info/gold_rates/devi_gold_rate/api.php";

let syncTimer: NodeJS.Timeout | null = null;
let broadcastCallback: ((data: any) => void) | null = null;

export let latestRatesInMemory: any = null;

export const setBroadcastCallback = (cb: (data: any) => void) => {
  broadcastCallback = cb;
};

export const syncRates = async () => {
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
    try {
      response = await fetch(API_URL, { signal: controller.signal });
    } finally {
      clearTimeout(timeoutId);
    }
    
    if (!response.ok) {
      throw new Error(`API returned HTTP ${response.status}`);
    }
    const apiData = await response.json();
    
    // According to existing App.tsx logic:
    const raw24k = typeof apiData['24K Gold'] === 'number' ? apiData['24K Gold'] : parseFloat(apiData['24K Gold'] || "0");
    let rawSilver = typeof apiData['Silver'] === 'number' ? apiData['Silver'] : parseFloat(apiData['Silver'] || "0");
    
    if (!isNaN(rawSilver)) {
      rawSilver = rawSilver * 100; // Convert to per kg
    }

    const rawPlatinum = typeof apiData['Platinum'] === 'number' ? apiData['Platinum'] : parseFloat(apiData['Platinum'] || "0");

    if (!raw24k || isNaN(raw24k)) throw new Error("Invalid 24K gold rate from API");

    const gold24kSale = raw24k;
    const gold24kPurchase = Math.round(gold24kSale * 0.985);
    const gold22kSale = Math.round(gold24kSale * 0.92);
    const gold22kPurchase = Math.round(gold24kSale * 0.90);
    const gold18kSale = Math.round(gold24kSale * 0.86);
    const gold18kPurchase = Math.round(gold24kSale * 0.80);
    
    const silverSale = rawSilver;
    const silverPurchase = silverSale - settings.silverPurchaseOffset;

    const platinumSale = rawPlatinum || 0;
    const platinumPurchase = platinumSale ? platinumSale - settings.platinumPurchaseOffset : 0;

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
      // Update current rates (always write to id 1)
      await db.insert(rates)
        .values({ id: 1, ...rateData })
        .onConflictDoUpdate({
          target: rates.id,
          set: { ...rateData, updatedAt: new Date() }
        });

      // History log
      await db.insert(rateHistoryLogs).values({
        sourceApiResponse: apiData,
        ...rateData
      });

      // Sync log success
      await db.insert(syncLogs).values({
        status: "success",
        apiResponse: apiData
      });
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
