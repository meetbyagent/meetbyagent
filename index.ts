#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const ASP_DIR = join(homedir(), '.asp');
const isInitialized = existsSync(join(ASP_DIR, 'manifest.yaml'));

console.log('\n  meetbyagent — your agent schedules for you\n');

if (!isInitialized) {
  console.log('  First, let\'s create your ASP identity.\n');
  const check = spawnSync('asp', ['--version'], { stdio: 'ignore' });
  if (check.status !== 0) {
    console.log('  Installing asp-protocol...');
    spawnSync('npm', ['install', '-g', 'asp-protocol'], { stdio: 'inherit' });
  }
  spawnSync('asp', ['init', '--skills', 'scheduling', '--tags', 'scheduling'], { stdio: 'inherit' });
  spawnSync('asp', ['index', 'add'], { stdio: 'inherit' });
}

const action = process.argv[2];

if (action === 'invite') {
  const target = process.argv[3];
  const text = process.argv[4] || 'Let\'s meet!';
  if (!target) {
    console.log('  Usage: meetbyagent invite <asp-url> "message"\n');
    process.exit(1);
  }
  spawnSync('asp', ['message', target, '--intent', 'negotiate', '--text', text], { stdio: 'inherit' });
  console.log(`\n  Sent meeting invite to ${target}`);
  console.log('  Their agent will respond when they accept.\n');
} else {
  console.log('  Your scheduling identity is ready.\n');
  console.log('  Usage:');
  console.log('    meetbyagent invite <url> "Coffee?"   Send a meeting invite');
  console.log('    asp inbox                          Check responses\n');
  console.log('  Share your ASP URL so others can schedule with you.\n');
}
