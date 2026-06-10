import express from "express";
import { syncRates } from "./syncService.ts";
import { db } from "./db/index.ts";
import { rates, syncLogs, calculationSettings } from "./db/schema.ts";

export const apiRouter = express.Router();

apiRouter.use(express.json());

apiRouter.get("/rates/current", async (req, res) => {
  try {
    const current = await db.select().from(rates).limit(1);
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
    res.status(500).json({ error: error.message || 'Error syncing' });
  }
});

// Allow GET for easy Synology NAS / External Cron integrations
apiRouter.get("/rates/sync", async (req, res) => {
  try {
    await syncRates();
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error syncing' });
  }
});

apiRouter.get("/settings", async (req, res) => {
  try {
    const current = await db.select().from(calculationSettings).limit(1);
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
    const recentLogs = await db.select().from(syncLogs).orderBy(syncLogs.createdAt).limit(20);
    res.json(recentLogs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
