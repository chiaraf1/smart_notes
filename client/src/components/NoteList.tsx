import type { NoteListItem } from "../types";

type Props = {
  items: NoteListItem[];
  selectedId: number | null;
  loadingNote: boolean;
  deleting: number | null;
  loading: boolean;
  searchQuery: string;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
};

export function NoteList({
  items,
  selectedId,
  loadingNote,
  deleting,
  loading,
  searchQuery,
  onSelect,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeletonItem">
            <div className="skeletonTitle" />
            <div className="skeletonMeta" />
          </div>
        ))}
      </>
    );
  }

  if (items.length === 0 && !searchQuery.trim()) {
    return (
      <div className="emptyState">
        <div className="emptyStateIcon">📝</div>
        <div className="emptyStateText">No notes yet</div>
        <div className="emptyStateHint">Write something and click Summarize to get started</div>
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="mutedPad">No matches.</div>;
  }

  return (
    <>
      {items.map((n) => (
        <div
          key={n.id}
          className={`noteItem ${selectedId === n.id ? "active" : ""}`}
        >
          <button
            className="noteItemBtn"
            onClick={() => onSelect(n.id)}
            disabled={loadingNote}
          >
            <div className="noteItemTitle">{n.title}</div>
            <div className="noteItemMeta">
              {new Date(n.createdAt).toLocaleString()}
            </div>
          </button>
          <button
            className="noteItemDelete"
            onClick={() => {
              if (confirm("Delete this note?")) onDelete(n.id);
            }}
            disabled={deleting === n.id}
            aria-label="Delete note"
          >
            {deleting === n.id ? "…" : "✕"}
          </button>
        </div>
      ))}
    </>
  );
}
