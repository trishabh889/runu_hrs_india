// ==========================================================================
// RUNO HRS INDIA - Strict File Length Rule Checker (Max 200 Lines)
// Enforces INSTRUCTIONS.md: no file shall exceed 200 lines
// ==========================================================================

const fs = require('fs');
const path = require('path');

const TARGET_DIRS = [
  path.join(__dirname, '..', '..', 'runo HRS', 'testing'),
  path.join(__dirname, '..', '..', 'runo HRS', 'tests'),
  path.join(__dirname)
];

const EXTENSIONS = ['.js', '.cjs', '.mjs', '.html', '.css'];
const MAX_LINES = 200;

function checkDir(dirPath, violations = []) {
  if (!fs.existsSync(dirPath)) return violations;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      checkDir(fullPath, violations);
    } else if (entry.isFile() && EXTENSIONS.includes(path.extname(entry.name))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split(/\r?\n/).length;
      if (lines > MAX_LINES) {
        violations.push({ path: fullPath, lines });
      }
    }
  }
  return violations;
}

const allViolations = [];
for (const d of TARGET_DIRS) {
  checkDir(d, allViolations);
}

if (allViolations.length > 0) {
  console.error('\n❌ [RULE VIOLATION] The following files exceed 200 lines:');
  allViolations.forEach(v => {
    console.error(`  - ${path.relative(process.cwd(), v.path)}: ${v.lines} lines (limit: ${MAX_LINES})`);
  });
  process.exit(1);
} else {
  console.log('✅ All test and testing files adhere to the strict <= 200 lines rule.');
}
