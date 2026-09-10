import { NavLink } from "react-router";
import ThemeToggle from "./ThemeToggle";
import FontSizeControl from "./FontSizeControl";
import { useManifest } from "../Contexts/ManifestContext";
import { usePreferences } from "../Contexts/PreferencesContext";

export default function Navbar({ onToggleSidebar, showSidebarToggle }) {
  const { modules } = useManifest();
  const prefs = usePreferences();
  const total = modules.reduce((n, m) => n + m.lessons.length, 0);
  const done = modules.reduce(
    (n, m) => n + m.lessons.filter((l) => prefs.completedLessons[l.id]).length,
    0,
  );

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {showSidebarToggle && (
          <button
            className="icon-btn sidebar-toggle"
            onClick={onToggleSidebar}
            aria-label="Toggle curriculum menu"
          >
            ☰
          </button>
        )}
        <NavLink to="/" className="brand">
          <span className="brand-mark">{"{ }"}</span>
          <span className="brand-name">High-Level JS</span>
        </NavLink>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" end className="nav-link">Modules</NavLink>
        </li>
        <li>
          <NavLink to="/about" className="nav-link">About</NavLink>
        </li>
      </ul>
      <div className="navbar-right">
        {total > 0 && (
          <span className="progress-pill" title="Lessons complete">
            {done} / {total}
          </span>
        )}
        <FontSizeControl />
        <ThemeToggle />
      </div>
    </nav>
  );
}
