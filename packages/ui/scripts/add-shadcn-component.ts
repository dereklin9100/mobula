#!/usr/bin/env node

/**
 * add-shadcn-component.ts
 * 1️. Batch call shadcn CLI to add components
 * 2️. Automatically fix imports with @ui aliases
 */

// pnpm tsx scripts/add-shadcn-component.ts

import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

// Component directory
const COMPONENTS_DIR = path.resolve(
  process.cwd(),
  "src/components/base"
);

// Alias replacement rules
const REPLACEMENTS: Array<{
  match: RegExp;
  replace: string;
}> = [
  { match: /src\/lib\/utils/g, replace: "../../lib/utils" },
  { match: /src\/hooks/g, replace: "../../hooks" },
  { match: /src\/components\/base\//g, replace: "./" },
];

// Traverse directory and replace imports
function walk(dir: string) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (/\.(ts|tsx)$/.test(entry.name)) {
      fixImports(fullPath);
    }
  }
}

// Fix imports in a single file
function fixImports(filePath: string) {
  let code = readFileSync(filePath, "utf8");
  let changed = false;

  for (const { match, replace } of REPLACEMENTS) {
    if (match.test(code)) {
      code = code.replace(match, replace);
      changed = true;
    }
  }

  if (changed) {
    writeFileSync(filePath, code, "utf8");
    const relative = path.relative(process.cwd(), filePath);
    console.log(`✅ Fixed imports → ${relative}`);
  }
}

// Adding components using the shadcn CLI
function addComponent(name: string) {
  console.log(`⚡️ Adding shadcn component: ${name}`);

  // process.platform
  // Possible values:
  // | macOS   | `"darwin"` |
  // | Linux   | `"linux"`  |
  // | Windows | `"win32"`  |

  const result = spawnSync(
    "pnpm",
    ["dlx", "shadcn@latest", "add", name],
    {
      stdio: "inherit",
      shell: process.platform === "win32",
    }
  );

  if (result.status !== 0) {
    console.error(`❌ Failed to add component: ${name}`);
    process.exit(result.status ?? 1);
  }
}

// Main execution
const components = process.argv.slice(2);

if (components.length === 0) {
  console.error("❌ Please specify at least one component name");
  process.exit(1);
}

for (const name of components) {
  addComponent(name);
}


// Fix imports
console.log("🎯 Fixing imports...");
walk(COMPONENTS_DIR);
console.log(`🎉 Done! Added ${components.length} component(s) and fixed imports.\n`);
