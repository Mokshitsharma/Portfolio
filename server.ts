import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { handleContact } from "./api/_lib/handle.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: "32kb" }));
  app.use(express.urlencoded({ extended: false, limit: "32kb" }));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Same handler as the Vercel function in api/contact.ts.
  app.post("/api/contact", async (req, res) => {
    const { status, json } = await handleContact(req.body, req.ip || "local");
    res.status(status).json(json);
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve the prerendered pages; unknown paths get the prerendered 404 page.
    const dist = path.join(__dirname, "dist");
    app.use(express.static(dist, { extensions: ["html"] }));
    app.use((req, res) => {
      res.status(404).sendFile(path.join(dist, "404.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
