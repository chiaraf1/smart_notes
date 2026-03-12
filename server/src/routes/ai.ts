import { Router } from "express";
import rateLimit from "express-rate-limit";
import OpenAI from "openai";
import { requireAuth } from "../middleware/auth.js";

export const aiRouter = Router();

const summarizeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: { error: "Too many summarize requests. Try again in an hour." },
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

aiRouter.post("/summarize", requireAuth, summarizeLimiter, async (req, res) => {
  const { note } = req.body as { note?: string };

  if (!note || typeof note !== "string") {
    return res.status(400).json({ error: "note must be a string" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Missing OPENAI_API_KEY in server/.env" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are a smart notes assistant. Return ONLY valid JSON. No markdown, no extra text."
        },
        {
          role: "user",
          content: `
Analyze the note below and return JSON with EXACTLY this shape:

{
  "title": string,
  "tags": string[],
  "summary": string,
  "actionItems": string[]
}

Rules:
- title: short, specific
- tags: 3-6 lowercase tags
- summary: 3-6 bullet points as a single string (each bullet starts with "• ")
- actionItems: 0-8 items, written as short tasks (start with a verb)

Note:
"""${note}"""
`
        }
      ]
    });

    const raw = completion.choices?.[0]?.message?.content;

    if (!raw) return res.status(500).json({ error: "Empty response from model" });

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}");
      if (start === -1 || end === -1) {
        return res.status(500).json({ error: "Model did not return JSON", raw });
      }
      parsed = JSON.parse(raw.slice(start, end + 1));
    }

    res.json({
      title: typeof parsed.title === "string" ? parsed.title : "Untitled note",
      tags: Array.isArray(parsed.tags) ? parsed.tags : ["general"],
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : []
    });
  } catch (err: any) {
    console.error("OpenAI error:", err?.message ?? err);
    res.status(500).json({ error: "Failed to generate AI summary" });
  }
});
