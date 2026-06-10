import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser
  app.use(express.json());

  // API routes
  app.get("/api/rates", async (req, res) => {
    try {
      const url = req.query.url ? String(req.query.url) : 'https://www.businessmantra.info/gold_rates/devi_gold_rate/api.php';
      const response = await fetch(url);
      if (!response.ok) {
        return res.status(response.status).json({ error: `HTTP ${response.status}` });
      }
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error('Error fetching rates:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
