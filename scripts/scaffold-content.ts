import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import rawTools from '../src/data/wave1-s1-tools.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const contentToolsDir = path.join(projectRoot, 'src', 'content', 'tools');

interface ToolEntry {
  lang: string;
  slug: string;
  status: string;
}

const buildTools = (rawTools as ToolEntry[]).filter((t) => t.status === 'build');

let createdCount = 0;

for (const tool of buildTools) {
  const langDir = path.join(contentToolsDir, tool.lang);
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }

  const filePath = path.join(langDir, `${tool.slug}.md`);
  if (!fs.existsSync(filePath)) {
    const stub = `---
title: "TODO"
description: "TODO"
h1: "TODO"
intro: "TODO"
primaryKeyword: "TODO"
formula: "TODO"
example: "TODO"
faq:
  - q: "TODO"
    a: "TODO"
  - q: "TODO"
    a: "TODO"
  - q: "TODO"
    a: "TODO"
  - q: "TODO"
    a: "TODO"
sources: []
updated: "TODO"
related:
  - "TODO"
  - "TODO"
  - "TODO"
  - "TODO"
disclaimer: "TODO"
---

TODO
`;
    fs.writeFileSync(filePath, stub, 'utf8');
    createdCount++;
  }
}

console.log(`Scaffolded ${createdCount} stub content files in src/content/tools.`);
