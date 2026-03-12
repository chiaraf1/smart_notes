import type { NoteListItem } from "../types";
import { NoteList } from "./NoteList";

type Props = {
  notes: NoteListItem[];
  selectedId: number | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectNote: (id: number) => void;
  onDeleteNote: (id: number) => void;
  loadingList: boolean;
  loadingNote: boolean;
  deleting: number | null;
  userEmail: string | null;
  onLogout: () => void;
  darkToggle: React.ReactNode;
  onClose?: () => void;
};

export function Sidebar({
  notes,
  selectedId,
  searchQuery,
  onSearchChange,
  onSelectNote,
  onDeleteNote,
  loadingList,
  loadingNote,
  deleting,
  userEmail,
  onLogout,
  darkToggle,
  onClose,
}: Props) {
  function handleSelectNote(id: number) {
    onSelectNote(id);
    onClose?.();
  }

  return (
    <>
      <div className="sidebarHeader">
        <div className="sidebarTitle">Notes</div>
        {darkToggle}
        {onClose && (
          <button className="iconBtn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        )}
      </div>

      <input
        className="searchInput"
        type="search"
        placeholder="Search notes…"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="sidebarList">
        <NoteList
          items={notes}
          selectedId={selectedId}
          loadingNote={loadingNote}
          deleting={deleting}
          loading={loadingList}
          searchQuery={searchQuery}
          onSelect={handleSelectNote}
          onDelete={onDeleteNote}
        />
      </div>

      <div className="sidebarFooter">
        <div className="sidebarUser" title={userEmail ?? ""}>{userEmail}</div>
        <button className="smallBtn" onClick={onLogout}>Sign out</button>
      </div>
    </>
  );
}
