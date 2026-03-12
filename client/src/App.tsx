import { useEffect, useMemo, useState } from "react";
import type {
  NoteListItem,
  NoteRecord,
  SummarizeRequest,
  SummarizeResponse,
} from "./types";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export default function App() {
  // Sidebar list
  const [notes, setNotes] = useState<NoteListItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [_active, setActive] = useState<NoteRecord | null>(null);

  // Editor + AI output
  const [noteText, setNoteText] = useState("");
  const [ai, setAi] = useState<SummarizeResponse | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // UI state
  const [loadingList, setLoadingList] = useState(false);
  const [loadingNote, setLoadingNote] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  // Mobile drawer
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const wordCount = useMemo(() => {
    const t = noteText.trim();
    return t ? t.split(/\s+/).length : 0;
  }, [noteText]);

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const q = searchQuery.toLowerCase();
    return notes.filter((n) => n.title.toLowerCase().includes(q));
  }, [notes, searchQuery]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  async function fetchNotesList() {
    setLoadingList(true);
    setError("");
    try {
      const r = await fetch(`${API_BASE}/notes`);
      if (!r.ok) throw new Error(await r.text());
      const data: NoteListItem[] = await r.json();
      setNotes(data);
      return data;
    } catch (e: any) {
      setError(e?.message ?? "Failed to load notes list");
      return [];
    } finally {
      setLoadingList(false);
    }
  }

  async function loadNote(id: number) {
    setLoadingNote(true);
    setError("");
    try {
      const r = await fetch(`${API_BASE}/notes/${id}`);
      if (!r.ok) throw new Error(await r.text());
      const data: NoteRecord = await r.json();

      setSelectedId(id);
      setActive(data);
      setNoteText(data.note);
      setAi({
        title: data.title,
        tags: data.tags,
        summary: data.summary,
        actionItems: data.actionItems,
      });

      setSidebarOpen(false);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load note");
    } finally {
      setLoadingNote(false);
    }
  }

  async function summarize() {
    setLoadingAI(true);
    setError("");
    try {
      const payload: SummarizeRequest = { note: noteText };
      const r = await fetch(`${API_BASE}/ai/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!r.ok) throw new Error(await r.text());

      const data: SummarizeResponse = await r.json();
      setAi(data);
    } catch (e: any) {
      setError(e?.message ?? "AI summarize failed");
    } finally {
      setLoadingAI(false);
    }
  }

  async function saveNote() {
    if (!ai) return;

    setSaving(true);
    setError("");
    try {
      const payload = {
        note: noteText,
        title: ai.title,
        tags: ai.tags,
        summary: ai.summary,
        actionItems: ai.actionItems,
      };

      if (selectedId !== null) {
        // Update existing note
        const r = await fetch(`${API_BASE}/notes/${selectedId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!r.ok) throw new Error(await r.text());
        await fetchNotesList();
        setToast("Note updated");
      } else {
        // Create new note
        const r = await fetch(`${API_BASE}/notes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!r.ok) throw new Error(await r.text());
        const list = await fetchNotesList();
        if (list.length > 0) await loadNote(list[0].id);
        setToast("Note saved");
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to save note");
    } finally {
      setSaving(false);
    }
  }

  async function deleteNote(id: number) {
    setDeleting(id);
    setError("");
    try {
      const r = await fetch(`${API_BASE}/notes/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error(await r.text());

      const list = await fetchNotesList();

      if (selectedId === id) {
        if (list.length > 0) {
          await loadNote(list[0].id);
        } else {
          setSelectedId(null);
          setActive(null);
          setNoteText("");
          setAi(null);
        }
      }
      setToast("Note deleted");
    } catch (e: any) {
      setError(e?.message ?? "Failed to delete note");
    } finally {
      setDeleting(null);
    }
  }

  // On first load: fetch list and auto-open newest
  useEffect(() => {
    (async () => {
      const list = await fetchNotesList();
      if (list.length > 0) {
        await loadNote(list[0].id);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function renderNoteList(items: NoteListItem[]) {
    if (items.length === 0 && !searchQuery.trim()) {
      return (
        <div className="mutedPad">
          {loadingList ? "Loading…" : "No notes yet."}
        </div>
      );
    }
    if (items.length === 0) {
      return <div className="mutedPad">No matches.</div>;
    }
    return items.map((n) => (
      <div
        key={n.id}
        className={`noteItem ${selectedId === n.id ? "active" : ""}`}
      >
        <button
          className="noteItemBtn"
          onClick={() => loadNote(n.id)}
          disabled={loadingNote}
        >
          <div className="noteItemTitle">{n.title}</div>
          <div className="noteItemMeta">
            {new Date(n.createdAt).toLocaleString()}
          </div>
        </button>
        <button
          className="noteItemDelete"
          onClick={() => deleteNote(n.id)}
          disabled={deleting === n.id}
          aria-label="Delete note"
        >
          {deleting === n.id ? "…" : "✕"}
        </button>
      </div>
    ));
  }

  return (
    <div className="layout">
      {/* Mobile topbar */}
      <header className="topbar">
        <button
          className="iconBtn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          ☰
        </button>
        <div className="topbarTitle">Smart Notes</div>
        <div className="topbarRight" />
      </header>

      {/* Sidebar (desktop) */}
      <aside className="sidebar desktopOnly">
        <div className="sidebarHeader">
          <div className="sidebarTitle">Notes</div>
        </div>

        <input
          className="searchInput"
          type="search"
          placeholder="Search notes…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="sidebarList">{renderNoteList(filteredNotes)}</div>
      </aside>

      {/* Sidebar drawer (mobile) */}
      <div className={`drawerOverlay ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)}>
        <div className="drawer" onClick={(e) => e.stopPropagation()}>
          <div className="drawerHeader">
            <div className="sidebarTitle">Notes</div>
            <button
              className="iconBtn"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <input
            className="searchInput"
            type="search"
            placeholder="Search notes…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="sidebarList">{renderNoteList(filteredNotes)}</div>

        </div>
      </div>

      {/* Main panel */}
      <main className="main">
        <div className="mainHeader">
          <div>
            <h1 className="h1">Editor</h1>
            <div className="muted">{wordCount} words</div>
          </div>

          <div className="actions">
            <button
              className="btn"
              onClick={() => {
                setActive(null);
                setSelectedId(null);
                setNoteText("");
                setAi(null);
                setError("");
              }}
              disabled={loadingAI || loadingNote || saving}
            >
              New
            </button>

            <button
              className="btn"
              onClick={saveNote}
              disabled={!noteText.trim() || !ai || loadingAI || loadingNote || saving}
            >
              {saving ? "Saving…" : selectedId !== null ? "Update" : "Save"}
            </button>

            <button
              className="btn primary"
              onClick={summarize}
              disabled={!noteText.trim() || loadingAI}
            >
              {loadingAI ? "Summarizing…" : "Summarize"}
            </button>
          </div>
        </div>

        {error && <div className="error">{error}</div>}
        {toast && <div className="toast">{toast}</div>}

        <div className="grid">
          <section className="card">
            <div className="cardTitle">Note</div>
            <textarea
              className="textarea"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write or paste your note…"
            />
          </section>

          <section className="card">
            <div className="cardTitle">AI Output</div>

            {!ai ? (
              <div className="mutedPad">Click "Summarize" to generate output.</div>
            ) : (
              <div className="output">
                <div className="row">
                  <div className="label">Title</div>
                  <div className="value">{ai.title}</div>
                </div>

                <div className="row">
                  <div className="label">Tags</div>
                  <div className="tags">
                    {ai.tags.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="row">
                  <div className="label">Summary</div>
                  <pre className="pre">{ai.summary}</pre>
                </div>

                <div className="row">
                  <div className="label">Action items</div>
                  {ai.actionItems.length ? (
                    <ul className="list">
                      {ai.actionItems.map((x, i) => (
                        <li key={i}>{x}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="muted">(none)</div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
