import type { SummarizeResponse } from "../types";

type Props = {
  ai: SummarizeResponse | null;
  loading: boolean;
};

export function AIOutput({ ai, loading }: Props) {
  return (
    <section className="card">
      <div className="cardTitle">AI Output</div>

      {loading ? (
        <div className="mutedPad">Summarizing…</div>
      ) : !ai ? (
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
                <span key={t} className="tag">{t}</span>
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
  );
}
