import { usePreferences } from "../Contexts/PreferencesContext";

const SIZES = [
  { key: "sm", label: "A", title: "Small" },
  { key: "md", label: "A", title: "Medium" },
  { key: "lg", label: "A", title: "Large" },
];

export default function FontSizeControl() {
  const { fontSize, setFontSize } = usePreferences();
  return (
    <div className="font-size-control" role="group" aria-label="Font size">
      {SIZES.map((s) => (
        <button
          key={s.key}
          className={`icon-btn font-size-${s.key} ${fontSize === s.key ? "active" : ""}`}
          onClick={() => setFontSize(s.key)}
          aria-label={s.title}
          aria-pressed={fontSize === s.key}
          title={s.title}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
