// ==========================================================================
// RUNO HRS MIS - Unit & Integration Test Runner (Node.js native test runner)
// ==========================================================================

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const testDirs = [
  path.join(__dirname, '..', '..', 'runo HRS', 'tests', 'unit'),
  path.join(__dirname, '..', '..', 'runo HRS', 'tests', 'integration')
];

function findTestFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(findTestFiles(fullPath));
    } else if (item.isFile() && item.name.endsWith('.test.js')) {
      results.push(fullPath);
    }
  }
  return results;
}

let testFiles = [];
for (const d of testDirs) {
  testFiles = testFiles.concat(findTestFiles(d));
}

if (testFiles.length === 0) {
  console.log('No unit test files found.');
  process.exit(0);
}

console.log(`\n▶ Running ${testFiles.length} unit/integration test files via node:test...\n`);

const result = spawnSync(process.execPath, ['--test', ...testFiles], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'test' }
});

process.exit(result.status || 0);
