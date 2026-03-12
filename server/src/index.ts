import express from "express";
import cors from "cors";
import "dotenv/config";
import { notesRouter } from "./routes/notes.js";
import { aiRouter } from "./routes/ai.js";
import { authRouter } from "./routes/auth.js";

const app = express();

// Allow the frontend origin (Netlify in prod, Vite dev server locally)
const allowedOrigins = [
  process.env.CLIENT_URL ?? "http://localhost:5173",
  "http://localhost:5173",
];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// health check
app.get("/health", (_, res) => res.json({ ok: true }));

app.use("/auth", authRouter);
app.use("/notes", notesRouter);
app.use("/ai", aiRouter);

const port = process.env.PORT ?? 3001;
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
