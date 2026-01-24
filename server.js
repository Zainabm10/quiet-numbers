// server.js (ESM) - Express + SQLite
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import {
  initDB,
  getAllTransactions,
  addTransaction,
  deleteTransactionById,
} from "./db.js";

const app = express();
const PORT = 3000;

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Init DB once
await initDB();

// Test API
app.get("/api/test", (req, res) => {
  res.json({ ok: true, message: "API works ✅" });
});

// GET all transactions
app.get("/api/transactions", async (req, res) => {
  try {
    const rows = await getAllTransactions();
    res.json({ ok: true, transactions: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "DB error" });
  }
});

// POST create transaction
app.post("/api/transactions", async (req, res) => {
  try {
    const { title, description, category, type, amount } = req.body;

    // support both title/description from front-end
    const desc = (description ?? title ?? "").toString().trim();

    const created = await addTransaction({
      description: desc,
      category,
      type,
      amount,
    });

    res.json({ ok: true, transaction: created });
  } catch (e) {
    const msg = e?.message || "Bad request";
    res.status(400).json({ ok: false, error: msg });
  }
});

// DELETE by id
app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ ok: false, error: "Bad id" });

    const changes = await deleteTransactionById(id);
    if (changes === 0) return res.status(404).json({ ok: false, error: "Not found" });

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "DB error" });
  }
});

// Home fallback
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start
app.listen(PORT, () => {
  console.log("✅ Server is running:");
  console.log(`http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}/api/test`);
});
