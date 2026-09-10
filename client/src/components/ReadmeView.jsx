import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { usePreferences } from "../Contexts/PreferencesContext";
import { useTTS } from "./TTSPlayer";
import { useShikiHighlighter } from "../hooks/useShikiHighlighter";

function CodeBlock({ inline, className, children, ...rest }) {
  const { theme } = usePreferences();
  const shikiTheme = theme === "dark" ? "github-dark" : "github-light";
  const code = String(children ?? "").replace(/\n$/, "");
  const langMatch = /language-(\w+)/.exec(className || "");
  const lang = langMatch ? langMatch[1] : "javascript";
  const html = useShikiHighlighter(inline ? "" : code, lang, shikiTheme);
  if (inline) {
    return <code className={className} {...rest}>{children}</code>;
  }
  if (!html) {
    return <pre className="code-fallback"><code>{code}</code></pre>;
  }
  return <div className="markdown-code" dangerouslySetInnerHTML={{ __html: html }} />;
}

function splitIntoSentences(text) {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return [];
  const re = /[^.!?]+[.!?]+["')\]]*(?=\s|$)|[^.!?]+$/g;
  const out = [];
  let m;
  while ((m = re.exec(trimmed)) !== null) {
    const s = m[0].trim();
    if (s) out.push(s);
  }
  return out.length ? out : [trimmed];
}

function textFromMarkdown(md) {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_>#]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function ReadmeView({ lesson }) {
  const tts = useTTS();
  const md = lesson?.readme ?? "";

  const sentences = useMemo(() => splitIntoSentences(textFromMarkdown(md)), [md]);

  const readAll = () => {
    if (sentences.length) tts.speak(sentences, `Reading: ${lesson.title}`);
  };

  if (!lesson?.hasReadme) return <p className="muted">This lesson has no README.</p>;
  if (!md) return <p className="muted">This README is empty.</p>;

  return (
    <div className="readme-view">
      <div className="content-actions">
        <button className="btn" onClick={readAll} disabled={!sentences.length}>
          🔊 Read aloud
        </button>
      </div>
      <article className="markdown-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code: CodeBlock,
          }}
        >
          {md}
        </ReactMarkdown>
      </article>
    </div>
  );
}
