import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { createServer } from "http";
import { Server } from "socket.io";
import { startSyncService, setBroadcastCallback, syncRates } from "./src/syncService.ts";
import { db } from "./src/db/index.ts";
import { rates, rateHistoryLogs, syncLogs, calculationSettings } from "./src/db/schema.ts";
import { apiRouter } from "./src/api.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  // JSON Body Parser
  app.use(express.json());
  app.set("io", io);

  setBroadcastCallback((data) => {
    io.emit("rate_update", data);
  });

  // Start background fetch worker
  startSyncService();

  // API routes
  app.use("/api", apiRouter);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  
  app.get("/api/users/me", requireAuth, async (req: AuthRequest, res) => {
    try {
      res.json({ uid: req.user?.uid, email: req.user?.email });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
