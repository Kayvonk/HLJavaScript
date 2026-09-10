import { usePreferences } from "../Contexts/PreferencesContext";
import { useCommentExtractor, extractComments } from "../hooks/useCommentExtractor";
import { useShikiHighlighter } from "../hooks/useShikiHighlighter";
import { useMemo } from "react";
import { useTTS } from "./TTSPlayer";
import SentenceReader from "./SentenceReader";

export default function CodeView({ lesson, kind = "script" }) {
  const prefs = usePreferences();
  const tts = useTTS();
  const isSolution = kind === "solution";
  const source = (isSolution ? lesson?.solution : lesson?.script) ?? "";

  const commentsOnly = !isSolution && !!prefs.commentsOnly[lesson.id];
  const { text } = useCommentExtractor(source, commentsOnly);

  const shikiTheme = prefs.theme === "dark" ? "github-dark" : "github-light";
  const html = useShikiHighlighter(text, "javascript", shikiTheme);

  const sourceKey = lesson ? `comments:${lesson.id}:${kind}` : null;
  const commentSentences = useMemo(
    () => (source ? extractComments(source).map((c) => c.text) : []),
    [source],
  );

  const readAloud = () => {
    if (!commentSentences.length) return;
    const label = commentsOnly
      ? `Reading comments: ${lesson.title}`
      : `Reading ${isSolution ? "solution" : "code"} comments: ${lesson.title}`;
    tts.speak(commentSentences, label, sourceKey);
  };

  const reading = tts.visible && tts.activeSource === sourceKey;

  if (!source) return <p className="muted">This lesson has no {isSolution ? "solution" : "code"} file.</p>;

  return (
    <div className="code-view">
      <div className="content-actions">
        {!isSolution && (
          <div className="segmented" role="group" aria-label="Code view mode">
            <button
              className={!commentsOnly ? "active" : ""}
              onClick={() => prefs.setCommentsOnly(lesson.id, false)}
            >
              Full code
            </button>
            <button
              className={commentsOnly ? "active" : ""}
              onClick={() => prefs.setCommentsOnly(lesson.id, true)}
            >
              Comments only
            </button>
          </div>
        )}
        <button className="btn" onClick={readAloud}>
          🔊 Read {commentsOnly ? "comments" : "code comments"} aloud
        </button>
      </div>
      {html ? (
        <div className="code-block" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className="code-fallback">
          <code>{text}</code>
        </pre>
      )}
      {reading && commentSentences.length > 0 && (
        <SentenceReader sentences={commentSentences} sourceKey={sourceKey} />
      )}
    </div>
  );
}
