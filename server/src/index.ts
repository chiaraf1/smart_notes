import express from "express";
import cors from "cors";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (_, res) => res.json({ ok: true }));

app.post("/ai/summarize", (req, res) => {
    const { note } = req.body as { note?: string };

    if (!note || typeof note !== "string") {
    return res.status(400).json({ error: "note must be a string" });
    }

    const lines = note
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

    res.json({
    title: lines[0]?.slice(0, 60) || "Untitled note",
    tags: ["general"],
    summary: lines.slice(0, 5).map((l) => `• ${l}`).join("\n"),
    actionItems: []
    });
});


app.listen(3001, () => console.log("Server running on http://localhost:3001"));
