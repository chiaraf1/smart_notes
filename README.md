# Smart Notes

A note-taking app where you write something and the AI does the boring part — gives it a title, pulls out the key points, finds action items, and adds tags so you can find it later.

Live: [smart-notes on Netlify](https://smartnts.netlify.app) 
API: [Render](https://smart-notes-lc14.onrender.com)

---

## What it does

- Write any kind of note — meeting recap, ideas, brain dump, whatever
- Hit **Summarize** and it comes back with a title, a summary, action items, and tags (powered by GPT-4o mini)
- Click any tag to filter your notes by it
- Search by keyword across all your notes
- Edit the AI-generated title if you don't like it
- Dark mode, mobile friendly
- Your notes are yours — everything is tied to your account

## Tech stack

**Frontend** — React + TypeScript, Vite, plain CSS (no UI library)

**Backend** — Node.js + Express, SQLite via better-sqlite3, JWT auth

**AI** — OpenAI API (gpt-4o-mini)

**Tests** — Cypress E2E

**Deployed** — Netlify (frontend) + Render (backend)

## Running locally

You'll need Node 18+ and an OpenAI API key.

**Backend:**
```bash
cd server
cp .env.example .env   # fill in your OPENAI_API_KEY and JWT_SECRET
npm install
npm run dev
```

**Frontend:**
```bash
cd client
cp .env.example .env   # set VITE_API_URL=http://localhost:3001
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Project structure

```
smart_notes/
├── client/          # React app
│   ├── src/
│   │   ├── components/   # NoteList, NoteEditor, AIOutput, Sidebar...
│   │   ├── context/      # AuthContext, ThemeContext
│   │   ├── hooks/        # useNotes, useNoteEditor, useKeyboardShortcuts
│   │   └── pages/        # LandingPage, AuthPage, DashboardPage
│   └── cypress/     # E2E tests
└── server/          # Express API
    └── src/
        ├── routes/  # auth, notes, ai
        └── db.ts    # SQLite setup
```

## Notes

The backend runs on Render's free tier so it might take ~30 seconds to wake up on the first request. The Cypress timeouts are set high for this reason.
