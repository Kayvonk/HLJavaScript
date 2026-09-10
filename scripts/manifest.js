import fs from "node:fs";
import path from "node:path";

function toId(p) {
  return p.split(path.sep).join("/");
}

function humanize(name) {
  return name
    .replace(/^\d+[-_. ]*/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function orderPrefix(name) {
  const m = name.match(/(\d+)/);
  return m ? Number(m[1]) : 9999;
}

function readTitleFromReadme(absReadmePath) {
  try {
    const text = fs.readFileSync(absReadmePath, "utf8");
    const line = text.split(/\r?\n/).find((l) => /^\s*#\s+/.test(l));
    if (line) return line.replace(/^\s*#\s+/, "").trim();
  } catch {}
  return null;
}

export function buildManifest(contentDir) {
  const abs = path.resolve(contentDir);
  if (!fs.existsSync(abs)) {
    console.warn(`[manifest] content dir not found: ${abs}`);
    return { modules: [], contentDir: abs };
  }

  const modules = [];
  const moduleEntries = fs
    .readdirSync(abs, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .sort((a, b) => orderPrefix(a.name) - orderPrefix(b.name) || a.name.localeCompare(b.name));

  for (const modEntry of moduleEntries) {
    const modDir = path.join(abs, modEntry.name);
    const lessonEntries = fs
      .readdirSync(modDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .sort((a, b) => orderPrefix(a.name) - orderPrefix(b.name) || a.name.localeCompare(b.name));

    const lessons = [];
    for (const lessonEntry of lessonEntries) {
      const lessonDir = path.join(modDir, lessonEntry.name);
      const readmeAbs = path.join(lessonDir, "README.md");
      const scriptAbs = path.join(lessonDir, "script.js");
      const solutionAbs = path.join(lessonDir, "solutions", "script.js");

      const hasReadme = fs.existsSync(readmeAbs);
      const hasScript = fs.existsSync(scriptAbs);
      const hasSolution = fs.existsSync(solutionAbs);
      if (!hasReadme && !hasScript) continue;

      const lessonId = toId(path.relative(abs, lessonDir));
      const title = hasReadme
        ? readTitleFromReadme(readmeAbs) || humanize(lessonEntry.name)
        : humanize(lessonEntry.name);
      lessons.push({
        id: lessonId,
        title,
        slug: lessonEntry.name,
        order: orderPrefix(lessonEntry.name),
        readmePath: hasReadme ? readmeAbs : null,
        scriptPath: hasScript ? scriptAbs : null,
        solutionPath: hasSolution ? solutionAbs : null,
      });
    }

    if (!lessons.length) continue;
    const moduleId = toId(path.relative(abs, modDir));
    modules.push({
      id: moduleId,
      title: humanize(modEntry.name),
      slug: modEntry.name,
      order: orderPrefix(modEntry.name),
      lessons,
    });
  }

  return { modules, contentDir: abs };
}
