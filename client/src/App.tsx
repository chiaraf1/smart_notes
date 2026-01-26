import { useState } from "react";
import type { SummarizeRequest, SummarizeResponse } from "./types";

const API_BASE = "http://localhost:3001";

export default function App() {
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [ai, setAi] = useState<SummarizeResponse | null>(null);
    const [error, setError] = useState("");

    async function summarize() {
    setLoading(true);
    setError("");
    setAi(null);

    try {
    const payload: SummarizeRequest = { note };

    const r = await fetch(`${API_BASE}/ai/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!r.ok) {
        const msg = await r.text();
        throw new Error(msg || "Request failed");
    }

    const data: SummarizeResponse = await r.json();
    setAi(data);
    } catch (e: any) {
    setError(e?.message ?? "Something went wrong");
    } finally {
    setLoading(false);
    }
}

return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
    <h1>Smart Notes</h1>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
        <h2>Note</h2>
        <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Paste your note..."
            style={{ width: "100%", height: 300, padding: 12 }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={summarize} disabled={!note.trim() || loading}>
            {loading ? "Working..." : "Summarize"}
            </button>
            <button
            onClick={() => {
                setNote("");
                setAi(null);
                setError("");
            }}
            disabled={loading}
            >
            Clear
            </button>
        </div>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
        </div>

        <div>
        <h2>AI Output</h2>
        {!ai && !loading && <p>Click “Summarize”.</p>}

        {ai && (
            <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
            <p><b>Title:</b> {ai.title}</p>
            <p><b>Tags:</b> {ai.tags.join(", ")}</p>
            <p><b>Summary:</b></p>
            <pre style={{ whiteSpace: "pre-wrap" }}>{ai.summary}</pre>
            <p><b>Action items:</b></p>
            {ai.actionItems.length ? (
                <ul>{ai.actionItems.map((t, i) => <li key={i}>{t}</li>)}</ul>
            ) : (
                <p>(none)</p>
            )}
            </div>
        )}
        </div>
    </div>
    </div>
);
}
