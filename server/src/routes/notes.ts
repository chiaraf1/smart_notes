import { Router } from "express";
import { db } from "../db.js";

export const notesRouter = Router();

// GET /notes (list)
notesRouter.get("/", (req, res) => {
const rows = db
    .prepare(
    `
    SELECT id, createdAt, title
    FROM notes
    ORDER BY id DESC
    `
    )
    .all();

res.json(rows);
});

// GET /notes/:id (detail)
notesRouter.get("/:id", (req, res) => {
const id = Number(req.params.id);

  const row = db.prepare(`SELECT * FROM notes WHERE id = ?`).get(id) as
    | {
        id: number;
        createdAt: string;
        note: string;
        title: string;
        tags: string;
        summary: string;
        actionItems: string;
    }
    | undefined;

if (!row) return res.status(404).json({ error: "Not found" });

res.json({
    id: row.id,
    createdAt: row.createdAt,
    note: row.note,
    title: row.title,
    tags: JSON.parse(row.tags),
    summary: row.summary,
    actionItems: JSON.parse(row.actionItems),
});
});

// PUT /notes/:id (update)
notesRouter.put("/:id", (req, res) => {
const id = Number(req.params.id);
const body = req.body as {
    note?: string;
    title?: string;
    tags?: string[];
    summary?: string;
    actionItems?: string[];
};

if (
    !body.note ||
    !body.title ||
    !body.summary ||
    !Array.isArray(body.tags) ||
    !Array.isArray(body.actionItems)
) {
    return res.status(400).json({ error: "Invalid payload" });
}

const info = db
    .prepare(
    `UPDATE notes SET note = ?, title = ?, tags = ?, summary = ?, actionItems = ? WHERE id = ?`
    )
    .run(
        body.note,
        body.title,
        JSON.stringify(body.tags),
        body.summary,
        JSON.stringify(body.actionItems),
        id
    );

if (info.changes === 0) return res.status(404).json({ error: "Not found" });
res.json({ id });
});

// DELETE /notes/:id
notesRouter.delete("/:id", (req, res) => {
const id = Number(req.params.id);
const info = db.prepare(`DELETE FROM notes WHERE id = ?`).run(id);
if (info.changes === 0) return res.status(404).json({ error: "Not found" });
res.json({ id });
});

// POST /notes (create)
notesRouter.post("/", (req, res) => {
const body = req.body as {
    note?: string;
    title?: string;
    tags?: string[];
    summary?: string;
    actionItems?: string[];
};

if (
    !body.note ||
    !body.title ||
    !body.summary ||
    !Array.isArray(body.tags) ||
    !Array.isArray(body.actionItems)
) {
    return res.status(400).json({ error: "Invalid payload" });
}

const createdAt = new Date().toISOString();

const info = db
    .prepare(
    `
        INSERT INTO notes (createdAt, note, title, tags, summary, actionItems)
        VALUES (?, ?, ?, ?, ?, ?)
        `
    )
    .run(
        createdAt,
        body.note,
        body.title,
        JSON.stringify(body.tags),
        body.summary,
        JSON.stringify(body.actionItems)
    );

    res.json({ id: Number(info.lastInsertRowid), createdAt });
});
