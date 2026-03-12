import { useEffect, useMemo, useState } from "react";
import type { NoteListItem, NoteRecord, SummarizeRequest, SummarizeResponse } from "../types";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export function useNoteEditor(
  selectedId: number | null,
  active: NoteRecord | null,
  authHeader: () => HeadersInit,
  logout: () => void,
  fetchNotesList: () => Promise<NoteListItem[] | undefined>,
  loadNote: (id: number) => Promise<NoteRecord | null>
) {
  const [noteText, setNoteText] = useState("");
  const [ai, setAi] = useState<SummarizeResponse | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  // Sync editor when a note is loaded externally
  useEffect(() => {
    if (active) {
      setNoteText(active.note);
      setAi({
        title: active.title,
        tags: active.tags,
        summary: active.summary,
        actionItems: active.actionItems,
      });
    } else {
      setNoteText("");
      setAi(null);
    }
  }, [active]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const wordCount = useMemo(() => {
    const t = noteText.trim();
    return t ? t.split(/\s+/).length : 0;
  }, [noteText]);

  const readingTime = useMemo(() => {
    if (wordCount < 100) return null;
    return `~${Math.ceil(wordCount / 200)} min read`;
  }, [wordCount]);

  async function summarize() {
    setLoadingAI(true);
    setError("");
    try {
      const payload: SummarizeRequest = { note: noteText };
      const r = await fetch(`${API_BASE}/ai/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(payload),
      });
      if (r.status === 401) { logout(); return; }
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
      const headers = { "Content-Type": "application/json", ...authHeader() };

      if (selectedId !== null) {
        const r = await fetch(`${API_BASE}/notes/${selectedId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });
        if (r.status === 401) { logout(); return; }
        if (!r.ok) throw new Error(await r.text());
        await fetchNotesList();
        setToast("Note updated");
      } else {
        const r = await fetch(`${API_BASE}/notes`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
        if (r.status === 401) { logout(); return; }
        if (!r.ok) throw new Error(await r.text());
        const list = await fetchNotesList();
        if (list && list.length > 0) await loadNote(list[0].id);
        setToast("Note saved");
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to save note");
    } finally {
      setSaving(false);
    }
  }

  function newNote() {
    setNoteText("");
    setAi(null);
    setError("");
  }

  function clearError() {
    setError("");
  }

  return {
    noteText,
    setNoteText,
    ai,
    loadingAI,
    saving,
    toast,
    error,
    clearError,
    wordCount,
    readingTime,
    summarize,
    saveNote,
    newNote,
  };
}
