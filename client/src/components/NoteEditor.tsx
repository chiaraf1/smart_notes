type Props = {
  value: string;
  onChange: (value: string) => void;
  wordCount: number;
  readingTime: string | null;
};

export function NoteEditor({ value, onChange, wordCount, readingTime }: Props) {
  return (
    <section className="card">
      <div className="cardTitle">Note</div>
      <div className="muted" style={{ marginBottom: "0.5rem", fontSize: "0.8rem" }}>
        {wordCount} words{readingTime ? ` · ${readingTime}` : ""}
      </div>
      <textarea
        className="textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write or paste your note…"
      />
    </section>
  );
}
