import { eq, desc } from "drizzle-orm";
import { db } from "./db/index.js";
import { rates, rateHistoryLogs, syncLogs, calculationSettings } from "./db/schema.js";

const API_URL = "https://www.businessmantra.info/gold_rates/devi_gold_rate/api.php";

let syncTimer: NodeJS.Timeout | null = null;
let broadcastCallback: ((data: any) => void) | null = null;

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
    
    const response = await fetch(API_URL);
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
      platinumPurchase
    };

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

    // Broadcast via websockets
    if (broadcastCallback) {
      broadcastCallback({ type: "sync_success", data: rateData });
    }

  } catch (error: any) {
    console.error("Rate Sync Error:", error);
    try {
      await db.insert(syncLogs).values({
        status: "error",
        errorMessage: error.message || String(error)
      });
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
  // Run once immediately on startup
  try {
    await syncRates();
  } catch (e) {
    console.error("Initial syncRates failed:", e);
  }
};
