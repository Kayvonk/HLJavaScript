import { useState } from "react";
import { NavLink, useParams } from "react-router";
import { useManifest } from "../Contexts/ManifestContext";
import { usePreferences } from "../Contexts/PreferencesContext";

export default function Sidebar({ open, onClose }) {
  const { modules, loading } = useManifest();
  const { moduleId, lessonId } = useParams();
  const prefs = usePreferences();
  const [filter, setFilter] = useState("");

  const q = filter.trim().toLowerCase();
  const filtered = modules
    .map((m) => ({
      ...m,
      lessons: q ? m.lessons.filter((l) => l.title.toLowerCase().includes(q) || l.slug.toLowerCase().includes(q)) : m.lessons,
    }))
    .filter((m) => (q ? m.lessons.length > 0 || m.title.toLowerCase().includes(q) : true));

  return (
    <aside className={`sidebar ${open ? "open" : ""}`} aria-label="Curriculum navigation">
      <div className="sidebar-header">
        <input
          className="sidebar-filter"
          placeholder="Filter lessons…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter lessons"
        />
      </div>
      <nav className="sidebar-nav">
        {loading && <p className="muted">Loading…</p>}
        {!loading && modules.length === 0 && <p className="muted">No modules found.</p>}
        {filtered.map((m) => {
          const completedCount = m.lessons.filter((l) => prefs.completedLessons[l.id]).length;
          const isModCurrent = moduleId && decodeURIComponent(moduleId) === m.id;
          const modComplete = prefs.isModuleComplete(m.id, m.lessons.map((l) => l.id));
          return (
            <details key={m.id} className={`sidebar-module ${modComplete ? "is-complete" : ""}`} open={isModCurrent || !!q}>
              <summary>
                <span className="module-title">{m.title}</span>
                <span className="module-progress" aria-label={`${completedCount} of ${m.lessons.length} lessons complete`}>
                  {modComplete ? "✓" : `${completedCount}/${m.lessons.length}`}
                </span>
              </summary>
              <ul>
                {m.lessons.map((l) => {
                  const done = !!prefs.completedLessons[l.id];
                  const active = lessonId && decodeURIComponent(lessonId) === l.id;
                  return (
                    <li key={l.id}>
                      <NavLink
                        to={`/modules/${encodeURIComponent(m.id)}/${encodeURIComponent(l.id)}`}
                        className={`sidebar-lesson ${active ? "active" : ""} ${done ? "done" : ""}`}
                        onClick={onClose}
                      >
                        <span className="lesson-check" aria-hidden="true">
                          {done ? "✓" : "○"}
                        </span>
                        <span className="lesson-title">{l.title}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </details>
          );
        })}
      </nav>
    </aside>
  );
}
