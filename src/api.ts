import express from "express";
import { syncRates } from "./syncService.js";
import { sql } from 'drizzle-orm';
import { db } from "./db/index.js";
import { rates, syncLogs, calculationSettings } from "./db/schema.js";

export const apiRouter = express.Router();

apiRouter.use(express.json());

apiRouter.get("/rates/current", async (req, res) => {
  try {
    let current = await db.select().from(rates).limit(1).catch(async (e) => {
      console.warn("Retrying rate select due to error:", e);
      return await db.select().from(rates).limit(1); // retry once
    });
    
    // Lazy sync check
    if (current[0]) {
      const lastUpdate = current[0].updatedAt?.getTime() || 0;
      const settingsLog = await db.select().from(calculationSettings).limit(1).catch(() => [{ syncIntervalMinutes: 1 }]);
      const minutes = settingsLog[0]?.syncIntervalMinutes || 1;
      if (Date.now() - lastUpdate > minutes * 60000) {
        try {
          await syncRates(); // update db
          current = await db.select().from(rates).limit(1);
        } catch (syncErr) {
          console.error("Lazy sync failed:", syncErr);
        }
      }
    }
    
    res.json(current[0] || null);
  } catch (error: any) {
    console.error('Error fetching rates:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

apiRouter.post("/rates/sync", async (req, res) => { // Manual sync trigger
  try {
    await syncRates();
    res.json({ success: true });
  } catch (error: any) {
    const rootCause = error.cause ? String(error.cause) : error.stack;
    res.status(500).json({ error: error.message + ' | CAUSE: ' + rootCause });
  }
});

// Allow GET for easy Synology NAS / External Cron integrations
apiRouter.get("/init-db", async (req, res) => {
  try {
    // Database schema is managed via Drizzle migrations internally in AI Studio.
    // The application user does not have DDL privileges, so we do not run CREATE TABLE here.
    res.json({ success: true, message: "Database is managed by drizzle." });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error initializing DB' });
  }
});

apiRouter.get("/rates/sync", async (req, res) => {
  try {
    await syncRates();
    res.json({ success: true });
  } catch (error: any) {
    const rootCause = error.cause ? String(error.cause) : error.stack;
    res.status(500).json({ error: error.message + ' | CAUSE: ' + rootCause });
  }
});

apiRouter.get("/settings", async (req, res) => {
  try {
    let current = await db.select().from(calculationSettings).limit(1).catch(async e => {
      console.warn("Retrying settings...");
      return await db.select().from(calculationSettings).limit(1);
    });
    res.json(current[0] || { syncIntervalMinutes: 1, silverPurchaseOffset: 5000, platinumPurchaseOffset: 4000 });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post("/settings", async (req, res) => {
  try {
    if (req.body) {
      await db.insert(calculationSettings).values({ id: 1, ...req.body }).onConflictDoUpdate({
        target: calculationSettings.id,
        set: { ...req.body, updatedAt: new Date() }
      });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get("/logs", async (req, res) => {
  try {
    const recentLogs = await db.select().from(syncLogs).orderBy(syncLogs.createdAt).limit(20).catch(async e => {
      console.warn("Retrying logs...");
      return await db.select().from(syncLogs).orderBy(syncLogs.createdAt).limit(20);
    });
    res.json(recentLogs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
