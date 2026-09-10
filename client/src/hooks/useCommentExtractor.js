import { useMemo } from "react";

const S_NORMAL = 0,
  S_LINE = 1,
  S_BLOCK = 2,
  S_STR = 3,
  S_TPL = 4,
  S_REGEX = 5;

function isRegexContext(prev) {
  if (!prev) return true;
  return /[=(,;:!&|?+*~^%<>{[\n]/.test(prev);
}

function stripDecoration(text) {
  let t = text.replace(/[─│┌┐└┘├┤┬┴┼━┃┏┓┗┛┣┫┳┻╋═║╔╗╚╝╠╣╦╩╬▪▫◆◇]/g, "");
  t = t.replace(/^[-=*\s]+/, "").replace(/[-=*\s]+$/, "");
  t = t.replace(/\s+/g, " ").trim();
  return t;
}

function cleanLineComment(raw) {
  return stripDecoration(raw);
}

function cleanBlockComment(raw) {
  const parts = raw
    .split("\n")
    .map((l) => l.replace(/^\s*\*/, "").trim())
    .filter(Boolean);
  return stripDecoration(parts.join(" "));
}

export function extractComments(src) {
  const comments = [];
  const n = src.length;
  let i = 0;
  let line = 0;
  let state = S_NORMAL;
  let strQuote = "";
  let buf = "";
  let bufLine = 0;
  let prev = "";

  while (i < n) {
    const c = src[i];
    const c2 = src[i + 1];

    if (state === S_NORMAL) {
      if (c === "/" && c2 === "/") {
        state = S_LINE;
        bufLine = line;
        buf = "";
        i += 2;
        continue;
      }
      if (c === "/" && c2 === "*") {
        state = S_BLOCK;
        bufLine = line;
        buf = "";
        i += 2;
        continue;
      }
      if (c === '"' || c === "'") {
        state = S_STR;
        strQuote = c;
        i++;
        continue;
      }
      if (c === "`") {
        state = S_TPL;
        i++;
        continue;
      }
      if (c === "/" && isRegexContext(prev)) {
        state = S_REGEX;
        i++;
        continue;
      }
      if (c === "\n") {
        line++;
        prev = "\n";
      } else if (!/\s/.test(c)) {
        prev = c;
      }
      i++;
      continue;
    }

    if (state === S_LINE) {
      if (c === "\n") {
        const text = cleanLineComment(buf);
        if (text) comments.push({ line: bufLine, text, kind: "line" });
        state = S_NORMAL;
        line++;
        prev = "\n";
        i++;
        continue;
      }
      buf += c;
      i++;
      continue;
    }

    if (state === S_BLOCK) {
      if (c === "*" && c2 === "/") {
        const text = cleanBlockComment(buf);
        if (text) comments.push({ line: bufLine, text, kind: "block" });
        state = S_NORMAL;
        prev = "/";
        i += 2;
        continue;
      }
      if (c === "\n") line++;
      buf += c;
      i++;
      continue;
    }

    if (state === S_STR) {
      if (c === "\\") {
        if (src[i + 1] === "\n") line++;
        i += 2;
        continue;
      }
      if (c === strQuote) {
        state = S_NORMAL;
        prev = strQuote;
        i++;
        continue;
      }
      if (c === "\n") line++;
      i++;
      continue;
    }

    if (state === S_TPL) {
      if (c === "\\") {
        if (src[i + 1] === "\n") line++;
        i += 2;
        continue;
      }
      if (c === "`") {
        state = S_NORMAL;
        prev = "`";
        i++;
        continue;
      }
      if (c === "$" && c2 === "{") {
        let depth = 1;
        i += 2;
        while (i < n && depth > 0) {
          const cc = src[i];
          if (cc === "{") depth++;
          else if (cc === "}") depth--;
          if (cc === "\n") line++;
          i++;
        }
        continue;
      }
      if (c === "\n") line++;
      i++;
      continue;
    }

    if (state === S_REGEX) {
      if (c === "\\") {
        i += 2;
        continue;
      }
      if (c === "[") {
        i++;
        while (i < n && src[i] !== "]") {
          if (src[i] === "\\") i += 2;
          else i++;
        }
        if (i < n) i++;
        continue;
      }
      if (c === "/") {
        state = S_NORMAL;
        i++;
        while (i < n && /[a-z]/i.test(src[i])) i++;
        prev = "/";
        continue;
      }
      if (c === "\n") {
        state = S_NORMAL;
        line++;
        prev = "\n";
        i++;
        continue;
      }
      i++;
      continue;
    }
  }

  if (state === S_LINE) {
    const text = cleanLineComment(buf);
    if (text) comments.push({ line: bufLine, text, kind: "line" });
  }

  return comments;
}

export function useCommentExtractor(source, commentsOnly) {
  return useMemo(() => {
    if (!source) return { text: "", sentences: [] };
    if (!commentsOnly) {
      return { text: source, sentences: splitSentencesFromCode(source) };
    }
    const comments = extractComments(source);
    const text = comments.map((c) => c.text).join("\n");
    const sentences = comments.map((c) => c.text);
    return { text, sentences };
  }, [source, commentsOnly]);
}

function splitSentencesFromCode(src) {
  const comments = extractComments(src);
  return comments.map((c) => c.text);
}
