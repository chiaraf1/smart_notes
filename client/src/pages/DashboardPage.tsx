import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNotes } from "../hooks/useNotes";
import { useNoteEditor } from "../hooks/useNoteEditor";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { Sidebar } from "../components/Sidebar";
import { NoteEditor } from "../components/NoteEditor";
import { AIOutput } from "../components/AIOutput";
import { EditorToolbar } from "../components/EditorToolbar";

export function DashboardPage() {
  const { token, userEmail, authHeader, logout } = useAuth();
  const { darkMode, toggleDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const notes = useNotes(token, authHeader, logout);
  const editor = useNoteEditor(
    notes.selectedId,
    notes.active,
    authHeader,
    logout,
    notes.fetchNotesList,
    notes.loadNote
  );

  useKeyboardShortcuts(
    {
      noteText: editor.noteText,
      ai: editor.ai,
      loadingAI: editor.loadingAI,
      loadingNote: notes.loadingNote,
      saving: editor.saving,
    },
    {
      saveNote: editor.saveNote,
      summarize: editor.summarize,
      newNote: () => {
        editor.newNote();
        notes.clearSelection();
      },
    }
  );

  const darkToggle = (
    <button
      className="iconBtn"
      onClick={toggleDark}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={darkMode ? "Light mode" : "Dark mode"}
    >
      {darkMode ? "☀" : "☽"}
    </button>
  );

  const sidebarProps = {
    notes: notes.filteredNotes,
    selectedId: notes.selectedId,
    searchQuery: notes.searchQuery,
    onSearchChange: notes.setSearchQuery,
    onSelectNote: notes.loadNote,
    onDeleteNote: (id: number) => notes.deleteNote(id, () => editor.newNote()),
    loadingList: notes.loadingList,
    loadingNote: notes.loadingNote,
    deleting: notes.deleting,
    userEmail,
    onLogout: logout,
    darkToggle,
  };

  const combinedError = notes.error || editor.error;

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
        {darkToggle}
      </header>

      {/* Desktop sidebar */}
      <aside className="sidebar desktopOnly">
        <Sidebar {...sidebarProps} />
      </aside>

      {/* Mobile drawer */}
      <div
        className={`drawerOverlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="drawer" onClick={(e) => e.stopPropagation()}>
          <Sidebar
            {...sidebarProps}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Main panel */}
      <main className="main">
        <EditorToolbar
          selectedId={notes.selectedId}
          noteText={editor.noteText}
          ai={editor.ai}
          loadingAI={editor.loadingAI}
          loadingNote={notes.loadingNote}
          saving={editor.saving}
          error={combinedError}
          toast={editor.toast}
          onNew={() => {
            editor.newNote();
            notes.clearSelection();
          }}
          onSave={editor.saveNote}
          onSummarize={editor.summarize}
        />

        <div className="grid">
          <NoteEditor
            value={editor.noteText}
            onChange={editor.setNoteText}
            wordCount={editor.wordCount}
            readingTime={editor.readingTime}
          />
          <AIOutput
            ai={editor.ai}
            loading={editor.loadingAI}
            onTagClick={(tag) => notes.setSearchQuery(tag)}
            onTitleChange={editor.setTitle}
          />
        </div>
      </main>
    </div>
  );
}
