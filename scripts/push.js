#!/usr/bin/env node
import { execSync } from 'child_process'
const arg = process.argv[2]
function run(cmd) {
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (e) {
    // continue on errors (e.g., nothing to commit)
  }
}

if (!arg) {
  console.log('Usage: node scripts/push.js <frontend|backend|all>');
  process.exit(1);
}

if (arg === 'frontend') {
  console.log('Preparing frontend push...');
  run('git add src public vite.config.js package.json');
  run('git commit -m "chore(frontend): update frontend"');
  run('git push origin HEAD:refs/heads/frontend --force');
  process.exit(0);
}

if (arg === 'backend') {
  console.log('Preparing backend push...');
  run('git add backend');
  run('git commit -m "chore(backend): update backend"');
  run('git push origin HEAD:refs/heads/backend --force');
  process.exit(0);
}

if (arg === 'all') {
  console.log('Committing all changes and pushing to main + feature branches...');
  run('git add -A');
  run('git commit -m "chore: update project (frontend+backend)"');
  run('git push origin main');
  run('git push origin HEAD:refs/heads/frontend --force');
  run('git push origin HEAD:refs/heads/backend --force');
  process.exit(0);
}

console.log('Unknown command:', arg);
process.exit(1);
