import Database from "better-sqlite3";

//  creates a local file-based database
export const db = new Database(process.env.DB_PATH ?? "smart-notes.db");

// Create table if it doesn't exist
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
