import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const site = resolve(here, "..");
const root = resolve(site, "..");
const output = join(site, "public", "courses.json");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if ([".git", "course-site", "node_modules"].includes(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

const text = (value) => value.replace(/^---[\s\S]*?---\s*/, "");
const heading = (value, fallback) => value.match(/^#\s+(.+)$/m)?.[1].trim() || fallback;
const summary = (value) => value
  .replace(/```[\s\S]*?```/g, " ")
  .replace(/[#*_`>\[\]()|-]/g, " ")
  .replace(/\s+/g, " ").trim().slice(0, 190);

const all = await walk(root);
const indexes = all.filter((file) => file.endsWith("/INDEX.md"));
const courses = [];

for (const indexFile of indexes) {
  const courseDir = dirname(indexFile);
  const id = relative(root, courseDir).replaceAll("/", "--");
  const indexMd = text(await readFile(indexFile, "utf8"));
  const lessonFiles = all
    .filter((file) => dirname(file) === join(courseDir, "lessons") && /week\d+\.md$/i.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const lessons = [];
  for (const file of lessonFiles) {
    const markdown = text(await readFile(file, "utf8"));
    lessons.push({
      id: file.match(/week(\d+)/i)?.[1] || String(lessons.length + 1),
      title: heading(markdown, file.split("/").at(-1)),
      summary: summary(markdown),
      markdown
    });
  }
  courses.push({
    id,
    path: relative(root, courseDir),
    title: heading(indexMd, courseDir.split("/").at(-1)),
    summary: summary(indexMd),
    lessons
  });
}

courses.sort((a, b) => a.title.localeCompare(b.title, "vi"));
await mkdir(dirname(output), { recursive: true });
await writeFile(output, JSON.stringify({ generatedAt: new Date().toISOString(), courses }));
console.log(`Built ${courses.length} courses / ${courses.reduce((n, c) => n + c.lessons.length, 0)} lessons → ${relative(root, output)}`);
