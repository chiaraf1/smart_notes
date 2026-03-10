import express from "express";
import cors from "cors";
import "dotenv/config";
import { notesRouter } from "./routes/notes.js";
import { aiRouter } from "./routes/ai.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// health check
app.get("/health", (_, res) => res.json({ ok: true }));

// notes routes
app.use("/notes", notesRouter);
app.use("/ai", aiRouter);

app.listen(3001, () =>
  console.log("Server running on http://localhost:3001")
);
