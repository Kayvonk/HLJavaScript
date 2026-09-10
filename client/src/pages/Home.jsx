import { Link } from "react-router";
import { useManifest } from "../Contexts/ManifestContext";
import { usePreferences } from "../Contexts/PreferencesContext";
import ProgressRing from "../components/ProgressRing";

export default function Home() {
  const { modules, loading, error } = useManifest();
  const prefs = usePreferences();

  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);
  const completedLessons = modules.reduce(
    (n, m) => n + m.lessons.filter((l) => prefs.completedLessons[l.id]).length,
    0,
  );

  return (
    <div className="page module-index">
      <header className="hero">
        <h1>High-Level JavaScript</h1>
        <p className="lede">
          A curriculum on how JavaScript actually works — execution model, closures, async, patterns, and beyond.
          Read the material, listen to it, work through the code, and reveal solutions when you're ready.
        </p>
        {!loading && !error && (
          <div className="hero-progress">
            <ProgressRing value={completedLessons} total={totalLessons} size={64} stroke={6} />
            <div>
              <div className="hero-progress-num">
                {completedLessons} / {totalLessons} lessons complete
              </div>
              <div className="muted">Progress is stored locally in your browser.</div>
            </div>
          </div>
        )}
      </header>

      {loading && <p className="muted">Loading curriculum…</p>}
      {error && <p className="muted">Failed to load manifest: {String(error.message || error)}</p>}

      <section className="module-grid">
        {modules.map((m) => {
          const completed = m.lessons.filter((l) => prefs.completedLessons[l.id]).length;
          const done = prefs.isModuleComplete(m.id, m.lessons.map((l) => l.id));
          return (
            <Link
              to={`/modules/${encodeURIComponent(m.id)}`}
              className={`module-card ${done ? "is-complete" : ""}`}
              key={m.id}
            >
              <div className="module-card-header">
                <h2>{m.title}</h2>
                {done && <span className="badge complete-badge" aria-label="Module complete">✓</span>}
              </div>
              <div className="module-card-body">
                <ProgressRing value={completed} total={m.lessons.length} />
                <div className="module-card-meta">
                  <div>
                    {completed} of {m.lessons.length} lessons
                  </div>
                  <div className="muted">{m.lessons.slice(0, 2).map((l) => l.title).join(" · ")}{m.lessons.length > 2 ? "…" : ""}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
