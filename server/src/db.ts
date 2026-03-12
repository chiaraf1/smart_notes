import Database from "better-sqlite3";

export const db = new Database(process.env.DB_PATH ?? "smart-notes.db");

// Users table
db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    createdAt TEXT NOT NULL
);
`);

// Notes table
db.exec(`
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    createdAt TEXT NOT NULL,
    note TEXT NOT NULL,
    title TEXT NOT NULL,
    tags TEXT NOT NULL,
    summary TEXT NOT NULL,
    actionItems TEXT NOT NULL
);
`);

// Add userId column to notes if it doesn't exist yet (migration)
try {
  db.exec(`ALTER TABLE notes ADD COLUMN userId INTEGER`);
} catch {
  // Column already exists — ignore
}
