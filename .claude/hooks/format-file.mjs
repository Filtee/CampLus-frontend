#!/usr/bin/env node
// PostToolUse hook: format the single file Claude just wrote with Prettier.
// Narrowly scoped — it touches only the edited file. It stays non-blocking (always
// exits 0), but genuine Prettier/bunx execution failures are surfaced on stderr;
// only unsupported, protected, missing, or non-source files are skipped silently.

import { execSync } from 'node:child_process';

let raw = '';
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  let file;
  try {
    file = JSON.parse(raw || '{}')?.tool_input?.file_path;
  } catch {
    return; // malformed hook payload — nothing actionable, skip silently
  }
  if (!file) return;

  const p = String(file).replace(/\\/g, '/');
  const formattable = /\.(ts|tsx|css|json|md)$/.test(p);
  const protectedOrGenerated =
    /\/routeTree\.gen\.ts$/.test(p) ||
    /\/components\/ui\//.test(p) ||
    /\/mockServiceWorker\.js$/.test(p) ||
    /(^|\/)docs\//.test(p);

  // Unsupported / protected / non-source file: skip silently (expected, not a failure).
  if (!formattable || protectedOrGenerated) return;

  try {
    execSync(`bunx prettier --write "${file}"`, { stdio: 'pipe' });
  } catch (error) {
    // Genuine execution failure (prettier/bunx error) — make it visible, but do not block.
    const detail = error?.stderr?.toString() || error?.message || String(error);
    process.stderr.write(`[format-file hook] prettier failed on ${file}:\n${detail}\n`);
  }
});
