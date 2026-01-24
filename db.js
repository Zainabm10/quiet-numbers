// db.js (ESM) - SQLite helper
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

sqlite3.verbose();

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB file path
const DB_FILE = path.join(__dirname, "database.db");

// Open DB
const db = new sqlite3.Database(DB_FILE);

// --- Promisified helpers ---
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

// --- Init table ---
export async function initDB() {
  await run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Other',
      type TEXT NOT NULL CHECK (type IN ('income','expense')),
      amount REAL NOT NULL CHECK (amount > 0),
      createdAt TEXT NOT NULL
    )
  `);
}

// --- Queries ---
export async function getAllTransactions() {
  return await all(
    `SELECT id, description, category, type, amount, createdAt
     FROM transactions
     ORDER BY id DESC`
  );
}

export async function addTransaction({ description, category, type, amount }) {
  const desc = (description ?? "").toString().trim();
  const cat = (category ?? "Other").toString().trim() || "Other";
  const t = (type ?? "").toString().toLowerCase().trim();
  const a = Number(amount);

  if (!desc) throw new Error("Missing description");
  if (t !== "income" && t !== "expense") throw new Error("Type must be income/expense");
  if (!Number.isFinite(a) || a <= 0) throw new Error("Amount must be > 0");

  const createdAt = new Date().toISOString();

  const result = await run(
    `INSERT INTO transactions (description, category, type, amount, createdAt)
     VALUES (?, ?, ?, ?, ?)`,
    [desc, cat, t, a, createdAt]
  );

  // return inserted row
  const row = await get(
    `SELECT id, description, category, type, amount, createdAt
     FROM transactions WHERE id = ?`,
    [result.lastID]
  );
  return row;
}

export async function deleteTransactionById(id) {
  const result = await run(`DELETE FROM transactions WHERE id = ?`, [id]);
  return result.changes; // 0 or 1
}
