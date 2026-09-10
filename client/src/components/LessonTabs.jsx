export default function LessonTabs({ active, onChange, lesson }) {
  const tabs = [
    { id: "readme", label: "README", available: lesson.hasReadme },
    { id: "code", label: "Code", available: lesson.hasScript },
    { id: "solution", label: "Solution", available: lesson.hasSolution, locked: true },
  ];
  return (
    <div className="lesson-tabs" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          disabled={!t.available}
          className={`lesson-tab ${active === t.id ? "active" : ""}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
          {t.locked && <span className="lock-icon" aria-hidden="true"> 🔒</span>}
        </button>
      ))}
    </div>
  );
}
