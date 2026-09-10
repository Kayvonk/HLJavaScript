import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { useManifest } from "../Contexts/ManifestContext";
import CompletionToggle from "../components/CompletionToggle";
import LessonTabs from "../components/LessonTabs";
import ReadmeView from "../components/ReadmeView";
import CodeView from "../components/CodeView";
import SolutionReveal from "../components/SolutionReveal";

export default function LessonView() {
  const { moduleId, lessonId } = useParams();
  const { getModule, getLesson, findNeighbors, loading } = useManifest();

  const decodedModule = moduleId ? decodeURIComponent(moduleId) : null;
  const decodedLesson = lessonId ? decodeURIComponent(lessonId) : null;
  const module = decodedModule ? getModule(decodedModule) : null;
  const lesson = decodedLesson ? getLesson(decodedLesson) : null;
  const { prev, next } = useMemo(
    () => (decodedLesson ? findNeighbors(decodedLesson) : { prev: null, next: null }),
    [decodedLesson, findNeighbors],
  );

  const defaultTab = lesson?.hasReadme ? "readme" : lesson?.hasScript ? "code" : "solution";
  const [tab, setTab] = useState(defaultTab);

  useMemoResetTab(lesson?.id, defaultTab, setTab);

  if (loading) return <p className="muted page">Loading…</p>;
  if (!lesson || !module) {
    return (
      <div className="page">
        <p className="muted">Lesson not found.</p>
        <Link to="/">← Back to all modules</Link>
      </div>
    );
  }

  return (
    <div className="page lesson-view">
      <nav className="crumbs">
        <Link to="/">All modules</Link> <span>/</span>
        <Link to={`/modules/${encodeURIComponent(module.id)}`}>{module.title}</Link>
        <span>/</span> <span>{lesson.title}</span>
      </nav>

      <header className="lesson-header">
        <div>
          <h1>{lesson.title}</h1>
          <p className="muted">{module.title}</p>
        </div>
        <CompletionToggle kind="lesson" lessonId={lesson.id} />
      </header>

      <LessonTabs active={tab} onChange={setTab} lesson={lesson} />

      <div className="tab-panel" role="tabpanel">
        {tab === "readme" && <ReadmeView lesson={lesson} />}
        {tab === "code" && <CodeView lesson={lesson} kind="script" />}
        {tab === "solution" && <SolutionReveal lesson={lesson} />}
      </div>

      <nav className="lesson-nav">
        {prev ? (
          <Link
            className="btn ghost"
            to={`/modules/${encodeURIComponent(module.id)}/${encodeURIComponent(prev.id)}`}
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            className="btn"
            to={`/modules/${encodeURIComponent(module.id)}/${encodeURIComponent(next.id)}`}
          >
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}

function useMemoResetTab(lessonId, defaultTab, setTab) {
  useEffect(() => {
    setTab(defaultTab);
  }, [lessonId, defaultTab, setTab]);
}
