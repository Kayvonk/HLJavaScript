import { usePreferences } from "../Contexts/PreferencesContext";
import CodeView from "./CodeView";

export default function SolutionReveal({ lesson }) {
  const prefs = usePreferences();
  if (!lesson?.hasSolution) return <p className="muted">This lesson has no solution file.</p>;
  const revealed = !!prefs.solutionsRevealed[lesson.id];

  if (!revealed) {
    return (
      <div className="solution-gate">
        <div className="solution-gate-inner">
          <div className="lock" aria-hidden="true">🔒</div>
          <h3>Try the lesson first</h3>
          <p className="muted">
            The solution is here whenever you want it — but you'll learn more if you attempt the TODOs in the
            <strong> Code </strong> tab yourself.
          </p>
          <button className="btn primary" onClick={() => prefs.revealSolution(lesson.id)}>
            Reveal solution
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="solution-view">
      <div className="solution-header">
        <span className="badge">Solution revealed</span>
        <button className="btn ghost" onClick={() => prefs.hideSolution(lesson.id)}>
          Hide again
        </button>
      </div>
      <CodeView lesson={lesson} kind="solution" />
    </div>
  );
}
