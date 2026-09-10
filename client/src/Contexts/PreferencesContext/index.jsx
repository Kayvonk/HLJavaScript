import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const LS_KEY = "hljs-prefs-v1";

const DEFAULTS = {
  theme: "dark",
  fontSize: "md",
  ttsVoice: null,
  ttsRate: 1.0,
  ttsPitch: 1.0,
  ttsVolume: 1.0,
  commentsOnly: {},
  solutionsRevealed: {},
  completedLessons: {},
  completedModules: {},
};

function readLS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

function writeLS(state) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {}
}

export const PreferencesContext = createContext(null);

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used inside <PreferencesProvider>");
  return ctx;
}

export default function PreferencesProvider({ children }) {
  const [state, setState] = useState(readLS);

  useEffect(() => {
    writeLS(state);
    document.documentElement.setAttribute("data-theme", state.theme);
    document.documentElement.setAttribute("data-font-size", state.fontSize);
  }, [state]);

  const patch = useCallback((p) => setState((s) => ({ ...s, ...(typeof p === "function" ? p(s) : p) })), []);

  const api = useMemo(
    () => ({
      ...state,
      setTheme: (theme) => patch({ theme }),
      toggleTheme: () => patch((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      setFontSize: (fontSize) => patch({ fontSize }),
      setTTSVoice: (ttsVoice) => patch({ ttsVoice }),
      setTTSRate: (ttsRate) => patch({ ttsRate }),
      setTTSPitch: (ttsPitch) => patch({ ttsPitch }),
      setTTSVolume: (ttsVolume) => patch({ ttsVolume }),
      setCommentsOnly: (lessonId, value) =>
        patch((s) => ({ commentsOnly: { ...s.commentsOnly, [lessonId]: value } })),
      revealSolution: (lessonId) =>
        patch((s) => ({ solutionsRevealed: { ...s.solutionsRevealed, [lessonId]: true } })),
      hideSolution: (lessonId) =>
        patch((s) => {
          const next = { ...s.solutionsRevealed };
          delete next[lessonId];
          return { solutionsRevealed: next };
        }),
      setLessonComplete: (lessonId, value) =>
        patch((s) => {
          const next = { ...s.completedLessons };
          if (value) next[lessonId] = { completedAt: new Date().toISOString() };
          else delete next[lessonId];
          return { completedLessons: next };
        }),
      setModuleComplete: (moduleId, value) =>
        patch((s) => {
          const next = { ...s.completedModules };
          if (value) next[moduleId] = { completedAt: new Date().toISOString() };
          else delete next[moduleId];
          return { completedModules: next };
        }),
      isLessonComplete: (lessonId) => !!state.completedLessons[lessonId],
      isModuleComplete: (moduleId, lessonIds) => {
        if (state.completedModules[moduleId]) return true;
        if (!lessonIds || !lessonIds.length) return false;
        return lessonIds.every((id) => !!state.completedLessons[id]);
      },
      lessonCompletedAt: (lessonId) => state.completedLessons[lessonId]?.completedAt ?? null,
    }),
    [state, patch],
  );

  return <PreferencesContext.Provider value={api}>{children}</PreferencesContext.Provider>;
}
