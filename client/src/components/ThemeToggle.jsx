import { usePreferences } from "../Contexts/PreferencesContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = usePreferences();
  const isDark = theme === "dark";
  return (
    <button
      className="icon-btn"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? "☀" : "☾"}
    </button>
  );
}
