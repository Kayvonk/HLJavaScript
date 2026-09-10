import { Link, useParams } from "react-router";
import { useManifest } from "../Contexts/ManifestContext";
import { usePreferences } from "../Contexts/PreferencesContext";
import CompletionToggle from "../components/CompletionToggle";
import ProgressRing from "../components/ProgressRing";

export default function ModuleView() {
  const { moduleId } = useParams();
  const { getModule, loading } = useManifest();
  const prefs = usePreferences();
  const decoded = moduleId ? decodeURIComponent(moduleId) : null;
  const module = decoded ? getModule(decoded) : null;

  if (loading) return <p className="muted page">Loading…</p>;
  if (!module) {
    return (
      <div className="page">
        <p className="muted">Module not found.</p>
        <Link to="/">← Back to all modules</Link>
      </div>
    );
  }

  const completed = module.lessons.filter((l) => prefs.completedLessons[l.id]).length;
  const complete = prefs.isModuleComplete(module.id, module.lessons.map((l) => l.id));

  return (
    <div className="page module-view">
      <nav className="crumbs">
        <Link to="/">All modules</Link> <span>/</span> <span>{module.title}</span>
      </nav>
      <header className="module-header">
        <div>
          <h1>{module.title}</h1>
          <p className="muted">
            {module.lessons.length} lesson{module.lessons.length === 1 ? "" : "s"} · {completed} complete
          </p>
        </div>
        <div className="module-header-actions">
          <ProgressRing value={completed} total={module.lessons.length} size={56} stroke={5} />
          <CompletionToggle kind="module" moduleId={module.id} />
        </div>
      </header>

      <ol className="lesson-list">
        {module.lessons.map((l, idx) => {
          const done = !!prefs.completedLessons[l.id];
          return (
            <li key={l.id} className={`lesson-row ${done ? "done" : ""}`}>
              <span className="lesson-num" aria-hidden="true">{idx + 1}</span>
              <Link
                to={`/modules/${encodeURIComponent(module.id)}/${encodeURIComponent(l.id)}`}
                className="lesson-link"
              >
                <span className="lesson-title">{l.title}</span>
                <span className="lesson-meta muted">
                  {l.hasReadme && "README"}
                  {l.hasScript && (l.hasReadme ? " · Code" : "Code")}
                  {l.hasSolution && " · Solution"}
                </span>
              </Link>
              <span className={`lesson-status ${done ? "is-done" : ""}`} aria-hidden="true">
                {done ? "✓" : ""}
              </span>
            </li>
          );
        })}
      </ol>

      {complete && !prefs.completedModules[module.id] && (
        <p className="hint">All lessons complete — module marked done automatically.</p>
      )}
    </div>
  );
}
