# RUNO HRS MIS - Automation Test Suite

Comprehensive automated test suite for the RUNO HRS MIS Electron application, built with Playwright and Node's built-in `node:test` runner.

---

## 1. Quick Start Commands

Run all tests from the repository root:

```bash
# Run full suite (Lint + Unit + E2E)
npm test

# Run unit and integration tests only (~1-2 seconds)
npm run test:unit

# Run P0 smoke tests against real Electron window (~20 seconds)
npm run test:smoke

# Run full end-to-end desktop test suite
npm run test:e2e

# Verify all test files comply with <= 200 lines rule
npm run test:lint

# View interactive HTML test report
npm run test:report
```

---

## 2. Architecture & Zero-Pollution Isolation

The test harness guarantees that **no production or user data is ever touched or modified**:

1. **Test Environment Variables**: Tests launch Electron with `RUNO_TEST_MODE=1` and `RUNO_TEST_ROOT=<temp-path>`.
2. **Workspace Verification**: `testing/configure-test-runtime.js` checks that `<temp-path>` contains the `.runo-test-workspace` marker file before redirecting `app.setPath('userData')`.
3. **Log File Isolation**: `elog.txt` and preload crash logs are routed exclusively into the temporary test workspace.
4. **Synthetic Seed Builder**: Fixtures (`tests/fixtures/mock-data.js`) inject isolated, schema-valid synthetic records for tests that require pre-existing data.
5. **Guaranteed Teardown**: Each test cleans up its own test process and removes temporary files upon completion.

---

## 3. Directory Layout

```text
runo HRS/tests/
  ├── fixtures/          # Electron launcher, temp workspace manager, synthetic seeds
  ├── pages/             # Page Objects (Login, Navigation, Customers, Projects, Overview)
  ├── unit/              # Pure business math & logic tests (FY, Accounting, Inventory)
  ├── integration/       # Repository tests with mock DBs, IPC security checks
  └── e2e/               # Full desktop Playwright specs (Auth, Customers, Projects, Dashboard)
```

---

## 4. Coding Standards

- **File Length**: Strictly `<= 200 lines` per file (enforced by `npm run test:lint`).
- **Function Length**: `< 40 lines` per function.
- **Single Responsibility**: Small, focused page objects and test modules.
- **No Live DB Singleton in Unit Tests**: Unit tests must inject mock objects and never import `db/index.js`.
