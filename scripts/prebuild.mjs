import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildManifest } from "./manifest.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const OUT_FILE = path.join(ROOT, "client", "public", "manifest.json");

function readOrNull(absPath) {
  if (!absPath) return null;
  try {
    return fs.readFileSync(absPath, "utf8");
  } catch {
    return null;
  }
}

const raw = buildManifest(CONTENT_DIR);
if (!raw.modules.length) {
  console.error(`[prebuild] no modules found under ${raw.contentDir}`);
  process.exit(1);
}

const inlined = {
  modules: raw.modules.map((m) => ({
    id: m.id,
    title: m.title,
    slug: m.slug,
    order: m.order,
    lessons: m.lessons.map((l) => ({
      id: l.id,
      title: l.title,
      slug: l.slug,
      order: l.order,
      hasReadme: !!l.readmePath,
      hasScript: !!l.scriptPath,
      hasSolution: !!l.solutionPath,
      readme: readOrNull(l.readmePath),
      script: readOrNull(l.scriptPath),
      solution: readOrNull(l.solutionPath),
    })),
  })),
};

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(inlined));

const lessonCount = inlined.modules.reduce((n, m) => n + m.lessons.length, 0);
const bytes = fs.statSync(OUT_FILE).size;
console.log(`[prebuild] ${inlined.modules.length} modules, ${lessonCount} lessons → ${OUT_FILE} (${(bytes / 1024).toFixed(1)} KB)`);
