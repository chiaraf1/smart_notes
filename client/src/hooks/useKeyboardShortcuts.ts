import { useEffect, useRef } from "react";
import type { SummarizeResponse } from "../types";

type ShortcutState = {
  noteText: string;
  ai: SummarizeResponse | null;
  loadingAI: boolean;
  loadingNote: boolean;
  saving: boolean;
};

type ShortcutActions = {
  saveNote: () => void;
  summarize: () => void;
  newNote: () => void;
};

export function useKeyboardShortcuts(state: ShortcutState, actions: ShortcutActions) {
  const stateRef = useRef(state);
  stateRef.current = state;

  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const { noteText, ai, loadingAI, loadingNote, saving } = stateRef.current;
      const { saveNote, summarize, newNote } = actionsRef.current;
      if (e.key === "s") {
        e.preventDefault();
        if (noteText.trim() && ai && !loadingAI && !loadingNote && !saving) saveNote();
      } else if (e.key === "n") {
        e.preventDefault();
        if (!loadingAI && !loadingNote && !saving) newNote();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (noteText.trim() && !loadingAI) summarize();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
