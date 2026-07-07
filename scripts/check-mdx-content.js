#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const CONTENT_DIR = path.join(__dirname, "..", "content");

const AUTOLINK = /<((?:https?|ftp|mailto):[^\s<>]+)>/gi;

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith(".mdx")) out.push(full);
  }
  return out;
}

const problems = [];
if (fs.existsSync(CONTENT_DIR)) {
  for (const file of walk(CONTENT_DIR)) {
    const lines = fs.readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      let m;
      AUTOLINK.lastIndex = 0;
      while ((m = AUTOLINK.exec(line)) !== null) {
        problems.push({
          file: path.relative(path.join(__dirname, ".."), file),
          line: i + 1,
          bad: m[0],
          fix: `[${m[1]}](${m[1]})`,
        });
      }
    });
  }
}

if (problems.length > 0) {
  console.error(
    "\n✖ MDX content check failed: bare angle-bracket links are not valid in MDX.\n" +
      "  These render fine in plain Markdown but crash the production build.\n" +
      "  In the CMS, write links as [text](url) instead of pasting a raw URL in <angle brackets>.\n"
  );
  for (const p of problems) {
    console.error(`  ${p.file}:${p.line}`);
    console.error(`      found:   ${p.bad}`);
    console.error(`      fix to:  ${p.fix}\n`);
  }
  process.exit(1);
}

console.log("✔ MDX content check passed (no invalid autolinks found).");
