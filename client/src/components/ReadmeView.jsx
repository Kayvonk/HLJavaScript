import { useEffect, useMemo, useRef } from "react";
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

// Splits a markdown source into top-level blocks (paragraph, heading, list,
// blockquote, code fence). Blank lines OUTSIDE of a fenced code block are the
// delimiter — fenced code is kept whole so its contents don't get split.
function splitMarkdownIntoBlocks(md) {
  const lines = md.split("\n");
  const blocks = [];
  let current = [];
  let inFence = false;
  const flush = () => {
    const text = current.join("\n").trim();
    if (text) blocks.push(text);
    current = [];
  };
  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      current.push(line);
      continue;
    }
    if (!inFence && line.trim() === "") flush();
    else current.push(line);
  }
  flush();
  return blocks;
}

// Highlighted wrapper around one markdown block. Applies .speaking when the
// currently-spoken sentence belongs to this block, scrolls into view, and
// starts (or jumps) TTS reading from this block when clicked.
function ReadmeBlock({ blockMd, blockIdx, active, onStart }) {
  const ref = useRef(null);
  useEffect(() => {
    if (active && ref.current) {
      ref.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [active]);
  const onClick = (e) => {
    // Let genuine interactive elements (links, buttons) keep their behavior.
    if (e.target.closest("a, button, input, textarea, select")) return;
    onStart(blockIdx);
  };
  return (
    <div
      ref={ref}
      data-block-idx={blockIdx}
      className={`readme-block${active ? " speaking" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      title="Click to read from here"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: CodeBlock }}>
        {blockMd}
      </ReactMarkdown>
    </div>
  );
}

export default function ReadmeView({ lesson }) {
  const tts = useTTS();
  const md = lesson?.readme ?? "";
  const sourceKey = lesson ? `readme:${lesson.id}` : null;

  // Parse markdown into blocks; for each block extract its sentences and record
  // which block each sentence belongs to. TTS still speaks sentence-by-sentence
  // (natural chunks) but highlighting lights up the whole containing block so
  // markdown formatting is preserved.
  const { blocks, sentences, sentenceBlockMap } = useMemo(() => {
    const bs = splitMarkdownIntoBlocks(md);
    const flat = [];
    const map = [];
    bs.forEach((b, i) => {
      const text = textFromMarkdown(b);
      if (!text) return;
      const sentencesInBlock = splitIntoSentences(text);
      sentencesInBlock.forEach((s) => {
        flat.push(s);
        map.push(i);
      });
    });
    return { blocks: bs, sentences: flat, sentenceBlockMap: map };
  }, [md]);

  const readAll = () => {
    if (sentences.length) tts.speak(sentences, `Reading: ${lesson.title}`, sourceKey);
  };

  if (!lesson?.hasReadme) return <p className="muted">This lesson has no README.</p>;
  if (!md) return <p className="muted">This README is empty.</p>;

  const reading = tts.visible && tts.activeSource === sourceKey;
  const activeBlockIdx = reading && tts.currentIndex >= 0 ? sentenceBlockMap[tts.currentIndex] : -1;

  const startFromBlock = (blockIdx) => {
    const startSentence = sentenceBlockMap.indexOf(blockIdx);
    if (startSentence < 0) return;
    if (reading) {
      tts.jumpTo(startSentence);
    } else {
      tts.speak(sentences, `Reading: ${lesson.title}`, sourceKey, startSentence);
    }
  };

  return (
    <div className="readme-view">
      <div className="content-actions">
        <button className="btn" onClick={readAll} disabled={!sentences.length}>
          🔊 Read aloud
        </button>
      </div>
      <article className="markdown-body">
        {blocks.map((b, i) => (
          <ReadmeBlock
            key={i}
            blockMd={b}
            blockIdx={i}
            active={i === activeBlockIdx}
            onStart={startFromBlock}
          />
        ))}
      </article>
    </div>
  );
}
