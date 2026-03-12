import { useEffect, useMemo, useState } from "react";
import type { NoteListItem, NoteRecord } from "../types";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export function useNotes(
  token: string | null,
  authHeader: () => HeadersInit,
  logout: () => void
) {
  const [notes, setNotes] = useState<NoteListItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [active, setActive] = useState<NoteRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingList, setLoadingList] = useState(false);
  const [loadingNote, setLoadingNote] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState("");

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const q = searchQuery.toLowerCase();
    return notes.filter((n) => n.title.toLowerCase().includes(q));
  }, [notes, searchQuery]);

  async function fetchNotesList() {
    setLoadingList(true);
    setError("");
    try {
      const r = await fetch(`${API_BASE}/notes`, { headers: authHeader() });
      if (r.status === 401) { logout(); return []; }
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
      const r = await fetch(`${API_BASE}/notes/${id}`, { headers: authHeader() });
      if (r.status === 401) { logout(); return null; }
      if (!r.ok) throw new Error(await r.text());
      const data: NoteRecord = await r.json();
      setSelectedId(id);
      setActive(data);
      return data;
    } catch (e: any) {
      setError(e?.message ?? "Failed to load note");
      return null;
    } finally {
      setLoadingNote(false);
    }
  }

  async function deleteNote(id: number, onDeleted: () => void) {
    setDeleting(id);
    setError("");
    try {
      const r = await fetch(`${API_BASE}/notes/${id}`, {
        method: "DELETE",
        headers: authHeader(),
      });
      if (r.status === 401) { logout(); return; }
      if (!r.ok) throw new Error(await r.text());
      const list = await fetchNotesList();
      if (selectedId === id) {
        if (list && list.length > 0) {
          await loadNote(list[0].id);
        } else {
          setSelectedId(null);
          setActive(null);
        }
      }
      onDeleted();
    } catch (e: any) {
      setError(e?.message ?? "Failed to delete note");
    } finally {
      setDeleting(null);
    }
  }

  function clearSelection() {
    setSelectedId(null);
    setActive(null);
  }

  function clearError() {
    setError("");
  }

  // Fetch list on login
  useEffect(() => {
    if (!token) {
      setNotes([]);
      setSelectedId(null);
      setActive(null);
      return;
    }
    (async () => {
      const list = await fetchNotesList();
      if (list && list.length > 0) await loadNote(list[0].id);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return {
    notes,
    filteredNotes,
    selectedId,
    active,
    searchQuery,
    setSearchQuery,
    loadingList,
    loadingNote,
    deleting,
    error,
    clearError,
    fetchNotesList,
    loadNote,
    deleteNote,
    clearSelection,
  };
}
