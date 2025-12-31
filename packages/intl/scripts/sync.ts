#!/usr/bin/env tsx

import fs from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "../../../");
const APPS_DIR = path.join(ROOT, "apps");
const SOURCE_MESSAGES = path.join(
  ROOT,
  "packages/intl/src/messages"
);

const targetApp = process.argv[2];

function getApps(): string[] {
  if (targetApp) {
    return [targetApp];
  }

  return fs
    .readdirSync(APPS_DIR)
    .filter((name) =>
      fs.statSync(path.join(APPS_DIR, name)).isDirectory()
    );
}

function syncToApp(appName: string) {
  const targetMessages = path.join(
    APPS_DIR,
    appName,
    "messages"
  );

  if (!fs.existsSync(path.join(APPS_DIR, appName))) {
    console.warn(`⚠️ App not found: ${appName}`);
    return;
  }

  fs.mkdirSync(targetMessages, { recursive: true });

  const files = fs.readdirSync(SOURCE_MESSAGES);

  for (const file of files) {
    const from = path.join(SOURCE_MESSAGES, file);
    const to = path.join(targetMessages, file);

    fs.copyFileSync(from, to);
  }

  console.log(`✅ Synced intl messages → apps/${appName}`);
}

function main() {
  if (!fs.existsSync(SOURCE_MESSAGES)) {
    console.error("❌ Source messages not found");
    process.exit(1);
  }

  const apps = getApps();

  if (apps.length === 0) {
    console.warn("⚠️ No apps to sync");
    return;
  }

  apps.forEach(syncToApp);

  console.log("🎉 Intl sync complete");
}

main();
