#!/usr/bin/env bun
/**
 * ATOM Auto-Tagging Script
 *
 * Generates ATOM tags and integrates with git hooks.
 * Usage: bun run scripts/atom-tag.ts <type> <description>
 */

import { $ } from "bun";
import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

const ATOM_TRAIL_DIR = ".atom-trail";
const COUNTERS_DIR = join(ATOM_TRAIL_DIR, "counters");
const DECISIONS_DIR = join(ATOM_TRAIL_DIR, "decisions");

type AtomType = 'INIT' | 'DOC' | 'ENHANCE' | 'FIX' | 'VERIFY' | 'COMPLETE' | 'KENL' | 'EDIT';

async function ensureDirs() {
  if (!existsSync(ATOM_TRAIL_DIR)) await mkdir(ATOM_TRAIL_DIR);
  if (!existsSync(COUNTERS_DIR)) await mkdir(COUNTERS_DIR);
  if (!existsSync(DECISIONS_DIR)) await mkdir(DECISIONS_DIR);
}

async function getNextCounter(type: string, date: string): Promise<number> {
  const counterFile = join(COUNTERS_DIR, `${type}-${date}.count`);

  if (existsSync(counterFile)) {
    const content = await readFile(counterFile, 'utf-8');
    const count = parseInt(content.trim(), 10) || 0;
    await writeFile(counterFile, String(count + 1));
    return count + 1;
  }

  await writeFile(counterFile, '1');
  return 1;
}

export async function generateAtomTag(type: AtomType, description: string): Promise<string> {
  await ensureDirs();

  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const counter = await getNextCounter(type, date);

  const slug = description
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);

  return `ATOM-${type}-${date}-${counter.toString().padStart(3, '0')}-${slug}`;
}

async function saveDecision(tag: string, type: string, description: string, files: string[]) {
  await ensureDirs();

  const decision = {
    atom_tag: tag,
    type,
    description,
    files,
    timestamp: new Date().toISOString(),
    freshness: 'fresh'
  };

  const filePath = join(DECISIONS_DIR, `${tag}.json`);
  await writeFile(filePath, JSON.stringify(decision, null, 2));

  return filePath;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: bun run scripts/atom-tag.ts <type> <description> [files...]');
    console.log('Types: INIT, DOC, ENHANCE, FIX, VERIFY, COMPLETE, KENL, EDIT');
    process.exit(1);
  }

  const [type, description, ...files] = args;

  if (!['INIT', 'DOC', 'ENHANCE', 'FIX', 'VERIFY', 'COMPLETE', 'KENL', 'EDIT'].includes(type)) {
    console.error(`Invalid type: ${type}`);
    process.exit(1);
  }

  const tag = await generateAtomTag(type as AtomType, description);
  const decisionPath = await saveDecision(tag, type, description, files);

  console.log(tag);
  console.error(`Decision saved: ${decisionPath}`);
}

// Run if called directly
if (import.meta.main) {
  main();
}

export { generateAtomTag, saveDecision };
