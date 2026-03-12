type Props = {
  onGetStarted: () => void;
  onLogin: () => void;
};

export function LandingPage({ onGetStarted, onLogin }: Props) {
  return (
    <div className="landingLayout">
      <nav className="landingNav">
        <div className="landingLogo">Smart Notes</div>
        <button className="btn" onClick={onLogin}>Log in</button>
      </nav>

      <main className="landingMain">
        <div className="landingHero">
          <h1 className="landingHeadline">
            Notes that think<br />with you
          </h1>
          <p className="landingSubtitle">
            Write your thoughts, let AI summarize them, extract action items, and keep everything organized — in seconds.
          </p>
          <button className="authBtn landingCta" onClick={onGetStarted}>
            Get started for free
          </button>
        </div>

        <div className="landingFeatures">
          <div className="landingFeature">
            <div className="landingFeatureIcon">✏️</div>
            <div className="landingFeatureTitle">Write freely</div>
            <div className="landingFeatureDesc">Paste meeting notes, ideas, or anything else. No formatting required.</div>
          </div>
          <div className="landingFeature">
            <div className="landingFeatureIcon">✨</div>
            <div className="landingFeatureTitle">AI summary</div>
            <div className="landingFeatureDesc">One click and your note gets a title, tags, summary, and action items.</div>
          </div>
          <div className="landingFeature">
            <div className="landingFeatureIcon">🗂️</div>
            <div className="landingFeatureTitle">Stay organized</div>
            <div className="landingFeatureDesc">Search by keyword or click any tag to filter your notes instantly.</div>
          </div>
        </div>
      </main>
    </div>
  );
}
