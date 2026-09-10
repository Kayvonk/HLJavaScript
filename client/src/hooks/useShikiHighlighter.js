import { useEffect, useState } from "react";
import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";

let highlighterPromise = null;
function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const [darkTheme, lightTheme, js, ts, json, css, html, bash, md] = await Promise.all([
        import("@shikijs/themes/github-dark").then((m) => m.default),
        import("@shikijs/themes/github-light").then((m) => m.default),
        import("@shikijs/langs/javascript").then((m) => m.default),
        import("@shikijs/langs/typescript").then((m) => m.default),
        import("@shikijs/langs/json").then((m) => m.default),
        import("@shikijs/langs/css").then((m) => m.default),
        import("@shikijs/langs/html").then((m) => m.default),
        import("@shikijs/langs/bash").then((m) => m.default),
        import("@shikijs/langs/markdown").then((m) => m.default),
      ]);
      return createHighlighterCore({
        themes: [darkTheme, lightTheme],
        langs: [js, ts, json, css, html, bash, md],
        engine: createOnigurumaEngine(import("shiki/wasm")),
      });
    })();
  }
  return highlighterPromise;
}

const SUPPORTED_LANGS = new Set(["javascript", "js", "typescript", "ts", "json", "css", "html", "bash", "sh", "markdown", "md"]);
const SUPPORTED_THEMES = new Set(["github-dark", "github-light"]);

function normalizeLang(lang) {
  if (lang === "js") return "javascript";
  if (lang === "ts") return "typescript";
  if (lang === "sh") return "bash";
  if (lang === "md") return "markdown";
  return lang;
}

export function useShikiHighlighter(code, lang = "javascript", theme = "github-dark") {
  const [html, setHtml] = useState("");

  useEffect(() => {
    let alive = true;
    if (!code) {
      setHtml("");
      return;
    }
    getHighlighter()
      .then((hl) => {
        if (!alive) return;
        try {
          const safeLang = normalizeLang(SUPPORTED_LANGS.has(lang) ? lang : "javascript");
          const safeTheme = SUPPORTED_THEMES.has(theme) ? theme : "github-dark";
          setHtml(hl.codeToHtml(code, { lang: safeLang, theme: safeTheme }));
        } catch (err) {
          console.warn("Shiki highlight failed", err);
          setHtml(`<pre><code>${escapeHtml(code)}</code></pre>`);
        }
      })
      .catch(() => {
        setHtml(`<pre><code>${escapeHtml(code)}</code></pre>`);
      });
    return () => {
      alive = false;
    };
  }, [code, lang, theme]);

  return html;
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
