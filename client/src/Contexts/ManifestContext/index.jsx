import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const ManifestContext = createContext(null);

export function useManifest() {
  const ctx = useContext(ManifestContext);
  if (!ctx) throw new Error("useManifest must be used inside <ManifestProvider>");
  return ctx;
}

export default function ManifestProvider({ children }) {
  const [manifest, setManifest] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch(`${import.meta.env.BASE_URL}manifest.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`Manifest ${r.status}`);
        return r.json();
      })
      .then((data) => alive && setManifest(data))
      .catch((e) => alive && setError(e));
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo(() => {
    const modules = manifest?.modules ?? [];
    const moduleById = new Map(modules.map((m) => [m.id, m]));
    const lessonById = new Map();
    for (const m of modules) for (const l of m.lessons) lessonById.set(l.id, { ...l, moduleId: m.id });
    return {
      manifest,
      modules,
      loading: !manifest && !error,
      error,
      getModule: (id) => moduleById.get(id) || null,
      getLesson: (id) => lessonById.get(id) || null,
      findNeighbors: (lessonId) => {
        const mod = modules.find((m) => m.lessons.some((l) => l.id === lessonId));
        if (!mod) return { prev: null, next: null };
        const idx = mod.lessons.findIndex((l) => l.id === lessonId);
        return {
          prev: idx > 0 ? mod.lessons[idx - 1] : null,
          next: idx < mod.lessons.length - 1 ? mod.lessons[idx + 1] : null,
        };
      },
    };
  }, [manifest, error]);

  return <ManifestContext.Provider value={value}>{children}</ManifestContext.Provider>;
}
