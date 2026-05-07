#!/usr/bin/env node
/**
 * Contracts test runner — vitest with globals.
 * Replaced the placeholder stub with real Midnight Compact tests.
 */
import { execSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
try {
  execSync('node node_modules/vitest/vitest.mjs run --config vitest.config.ts', {
    cwd: root,
    stdio: 'inherit',
  });
} catch {
  process.exit(1);
}
