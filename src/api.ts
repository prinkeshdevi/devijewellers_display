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
    const rootCause = error.cause ? String(error.cause) : error.stack;
    const isDbUnconfigured = rootCause && rootCause.includes('ECONNREFUSED 127.0.0.1') || 
                             error.message && error.message.includes('ECONNREFUSED 127.0.0.1');
    const msg = isDbUnconfigured 
      ? 'Database requires configuration. Please add POSTGRES_URL or DATABASE_URL environment variables to your deployment.'
      : error.message || 'Internal Server Error';
    res.status(500).json({ error: msg });
  }
});

apiRouter.post("/rates/sync", async (req, res) => { // Manual sync trigger
  try {
    await syncRates();
    res.json({ success: true });
  } catch (error: any) {
    const rootCause = error.cause ? String(error.cause) : error.stack;
    const isDbUnconfigured = rootCause.includes('ECONNREFUSED 127.0.0.1') || 
                             error.message.includes('ECONNREFUSED 127.0.0.1');
    const msg = isDbUnconfigured 
      ? 'Database requires configuration. Please add POSTGRES_URL or DATABASE_URL environment variables to your deployment.'
      : error.message + ' | CAUSE: ' + rootCause;
    res.status(500).json({ error: msg });
  }
});

// Allow GET for easy Synology NAS / External Cron integrations
apiRouter.get("/init-db", async (req, res) => {
  try {
    // Database schema is managed via Drizzle migrations internally in AI Studio.
    // However, for external deployments (like Vercel), we allow creating tables here.
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uid TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS rates (
        id SERIAL PRIMARY KEY,
        gold_24k_sale INTEGER NOT NULL,
        gold_24k_purchase INTEGER NOT NULL,
        gold_22k_sale INTEGER NOT NULL,
        gold_22k_purchase INTEGER NOT NULL,
        gold_18k_sale INTEGER NOT NULL,
        gold_18k_purchase INTEGER NOT NULL,
        silver_sale INTEGER NOT NULL,
        silver_purchase INTEGER NOT NULL,
        platinum_sale INTEGER NOT NULL,
        platinum_purchase INTEGER NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS rate_history_logs (
        id SERIAL PRIMARY KEY,
        source_api_response JSONB,
        gold_24k_sale INTEGER NOT NULL,
        gold_24k_purchase INTEGER NOT NULL,
        gold_22k_sale INTEGER NOT NULL,
        gold_22k_purchase INTEGER NOT NULL,
        gold_18k_sale INTEGER NOT NULL,
        gold_18k_purchase INTEGER NOT NULL,
        silver_sale INTEGER NOT NULL,
        silver_purchase INTEGER NOT NULL,
        platinum_sale INTEGER NOT NULL,
        platinum_purchase INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sync_logs (
        id SERIAL PRIMARY KEY,
        status TEXT NOT NULL,
        api_response JSONB,
        error_message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS calculation_settings (
        id SERIAL PRIMARY KEY,
        sync_interval_minutes INTEGER NOT NULL DEFAULT 1,
        silver_purchase_offset INTEGER NOT NULL DEFAULT 5000,
        platinum_purchase_offset INTEGER NOT NULL DEFAULT 4000,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    res.json({ success: true, message: "Database initialized successfully! All required tables are structured." });
  } catch (error: any) {
    if (error.message?.includes("permission denied")) {
      return res.json({ success: true, message: "On AI Studio, database is already managed by drizzle. Initialization skipped." });
    }
    const rootCause = error.cause ? String(error.cause) : error.stack;
    res.status(500).json({ error: error.message + ' | CAUSE: ' + rootCause });
  }
});

apiRouter.get("/rates/sync", async (req, res) => {
  try {
    await syncRates();
    res.json({ success: true });
  } catch (error: any) {
    const rootCause = error.cause ? String(error.cause) : error.stack;
    const isDbUnconfigured = rootCause.includes('ECONNREFUSED 127.0.0.1') || 
                             error.message.includes('ECONNREFUSED 127.0.0.1');
    const msg = isDbUnconfigured 
      ? 'Database requires configuration. Please add POSTGRES_URL or DATABASE_URL environment variables to your deployment.'
      : error.message + ' | CAUSE: ' + rootCause;
    res.status(500).json({ error: msg });
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
