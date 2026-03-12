import type { SummarizeResponse } from "../types";

type Props = {
  selectedId: number | null;
  noteText: string;
  ai: SummarizeResponse | null;
  loadingAI: boolean;
  loadingNote: boolean;
  saving: boolean;
  error: string;
  toast: string;
  onNew: () => void;
  onSave: () => void;
  onSummarize: () => void;
};

export function EditorToolbar({
  selectedId,
  noteText,
  ai,
  loadingAI,
  loadingNote,
  saving,
  error,
  toast,
  onNew,
  onSave,
  onSummarize,
}: Props) {
  return (
    <>
      <div className="mainHeader">
        <h1 className="h1">Editor</h1>

        <div className="actions">
          <button
            className="btn"
            onClick={onNew}
            disabled={loadingAI || loadingNote || saving}
            title="New note (⌘N)"
          >
            New
          </button>

          <button
            className="btn"
            onClick={onSave}
            disabled={!noteText.trim() || !ai || loadingAI || loadingNote || saving}
            title={selectedId !== null ? "Update note (⌘S)" : "Save note (⌘S)"}
          >
            {saving ? "Saving…" : selectedId !== null ? "Update" : "Save"}
          </button>

          <button
            className="btn primary"
            onClick={onSummarize}
            disabled={!noteText.trim() || loadingAI}
            title="Summarize with AI (⌘↵)"
          >
            {loadingAI ? "Summarizing…" : "Summarize"}
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
