import { usePreferences } from "../Contexts/PreferencesContext";

function relativeTime(iso) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffSec = Math.round((now - then) / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `${diffH} hr ago`;
  const diffD = Math.round(diffH / 24);
  if (diffD < 7) return `${diffD} day${diffD === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString();
}

export default function CompletionToggle({ lessonId, moduleId, kind = "lesson", size = "md" }) {
  const prefs = usePreferences();
  const isLesson = kind === "lesson";
  const done = isLesson ? !!prefs.completedLessons[lessonId] : !!prefs.completedModules[moduleId];
  const timestamp = isLesson ? prefs.lessonCompletedAt(lessonId) : prefs.completedModules[moduleId]?.completedAt;

  const toggle = () => {
    if (isLesson) prefs.setLessonComplete(lessonId, !done);
    else prefs.setModuleComplete(moduleId, !done);
  };

  return (
    <button
      className={`completion-toggle size-${size} ${done ? "is-done" : ""}`}
      onClick={toggle}
      aria-pressed={done}
      aria-label={done ? "Mark incomplete" : "Mark as complete"}
      title={done && timestamp ? `Completed ${relativeTime(timestamp)}` : undefined}
    >
      <span className="check" aria-hidden="true">{done ? "✓" : ""}</span>
      <span className="label">
        {done ? `Completed${timestamp ? ` · ${relativeTime(timestamp)}` : ""}` : "Mark as complete"}
      </span>
    </button>
  );
}
