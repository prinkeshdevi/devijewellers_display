import express from "express";
import { syncRates, latestRatesInMemory, lastSyncAttemptAt } from "./syncService.js";
import { sql, desc } from 'drizzle-orm';
import { db } from "./db/index.js";
import { rates, syncLogs, calculationSettings, globalState } from "./db/schema.js";

export const apiRouter = express.Router();

apiRouter.use(express.json({ limit: '50mb' }));
apiRouter.use(express.urlencoded({ limit: '50mb', extended: true }));

apiRouter.get("/rates/current", async (req, res) => {
  try {
    const settingsLog = await db.select().from(calculationSettings).limit(1).catch(() => [{ syncIntervalMinutes: 1, enableAutoSync: true, storeRatesInDb: true }]);
    const currentSettings = settingsLog[0];
    const isStoreEnabled = !currentSettings || currentSettings.storeRatesInDb !== false;

    // If database rates storage is disabled and we have rates in memory, return memory rates
    if (!isStoreEnabled && latestRatesInMemory) {
      // Lazy sync check (only if auto-sync is enabled)
      const lastUpdate = latestRatesInMemory.updatedAt?.getTime() || Date.now();
      const minutes = currentSettings?.syncIntervalMinutes || 1;
      const isAutoSyncEnabled = !currentSettings || currentSettings.enableAutoSync !== false;
      const lastAttempt = Math.max(lastUpdate, lastSyncAttemptAt);

      if (isAutoSyncEnabled && (Date.now() - lastAttempt > minutes * 60000)) {
        syncRates().catch(e => console.error("Lazy in-memory sync failed in background:", e));
      }
      return res.json(latestRatesInMemory);
    }

    let current = await db.select().from(rates).orderBy(desc(rates.id)).limit(1).catch(async (e) => {
      console.warn("Retrying rate select due to error:", e);
      return await db.select().from(rates).orderBy(desc(rates.id)).limit(1); // retry once
    });
    
    // Lazy sync check (only if enabled)
    if (current[0]) {
      const lastUpdate = current[0].updatedAt?.getTime() || Date.now();
      const minutes = currentSettings?.syncIntervalMinutes || 1;
      const isAutoSyncEnabled = !currentSettings || currentSettings.enableAutoSync !== false;
      const lastAttempt = Math.max(lastUpdate, lastSyncAttemptAt);
      
      if (isAutoSyncEnabled && (Date.now() - lastAttempt > minutes * 60000)) {
        // Fire sync in background, don't await, so it doesn't block clients loading immediately
        syncRates().catch(e => console.error("Lazy sync failed in background:", e));
      }
    } else if (!isStoreEnabled && !latestRatesInMemory) {
      // If we don't have db record and storage is disabled, trigger initial sync
      try {
        await syncRates();
        if (latestRatesInMemory) {
          return res.json(latestRatesInMemory);
        }
      } catch (e) {
        console.error("Initial trigger sync failed:", e);
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
        enable_auto_sync BOOLEAN NOT NULL DEFAULT true,
        store_rates_in_db BOOLEAN NOT NULL DEFAULT true,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Auto-migrate newly added columns for existing users
    await db.execute(sql`
      ALTER TABLE calculation_settings ADD COLUMN IF NOT EXISTS enable_auto_sync BOOLEAN NOT NULL DEFAULT true;
    `).catch(() => {});
    await db.execute(sql`
      ALTER TABLE calculation_settings ADD COLUMN IF NOT EXISTS store_rates_in_db BOOLEAN NOT NULL DEFAULT true;
    `).catch(() => {});

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS global_state (
        id SERIAL PRIMARY KEY,
        module_name TEXT NOT NULL UNIQUE,
        data JSONB NOT NULL,
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
    res.json(current[0] || { syncIntervalMinutes: 1, silverPurchaseOffset: 5000, platinumPurchaseOffset: 4000, enableAutoSync: true });
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

// New Unified API endpoints for Android App (Media, Promos, Configs, Branches, etc.)
apiRouter.get("/state/:module", async (req, res) => {
  try {
    const { module } = req.params;
    let current = await db.select().from(globalState).where(sql`${globalState.moduleName} = ${module}`).limit(1);
    
    if (!current || current.length === 0) {
      return res.json({ success: true, data: null, message: 'Settings not yet configured in DB. Rely on internal defaults.' });
    }
    res.json({ success: true, data: current[0].data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post("/state/:module", async (req, res) => {
  try {
    const { module } = req.params;
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Body must be a JSON object or array' });
    }
    
    await db.insert(globalState).values({ moduleName: module, data: req.body as any }).onConflictDoUpdate({
      target: globalState.moduleName,
      set: { data: req.body as any, updatedAt: new Date() }
    });
    
    // Broadcast to other clients that a state changed
    const io = req.app.get("io");
    if (io) {
      io.emit("state_update", { module, data: req.body });
    }
    
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
