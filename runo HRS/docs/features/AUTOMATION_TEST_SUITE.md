# RUNO HRS MIS - Automation Test Suite: Gemini Implementation Handoff

Status: implementation specification; the suite has not been built or validated yet.
Prepared: 2026-09-12. Scope: automated testing of this Electron desktop application. Audience: Gemini implementing the suite in the existing repository.

## 1. Objective and working rules

Build a repeatable Windows test suite that launches the real desktop application, checks important workflows, and produces useful failure evidence with one command.
Use synthetic data in isolated storage. Never run tests against business data.
Follow `runo HRS/INSTRUCTIONS.md`: single-responsibility modules, functions under 40 lines, code files at most 200 lines; split approaching 180 lines. Do not pad small files.
Preserve existing uncommitted changes. Inspect the current diff before editing.
Implement the suite and minimal testability hooks; report unrelated product defects separately.
Do not change expected results just to make existing defects pass.

## 2. Verified repository context

Paths below are relative to the repository root unless stated otherwise.

| Existing file / folder | Relevance to implementation |
| --- | --- |
| `package.json` | Root dependencies include Electron and electron-builder; no test scripts currently. |
| `runo HRS/package.json` | Nested app manifest; its entry point is `main.js`. |
| `runo HRS/main.js` | Electron startup, single-instance lock, eager handler imports, window lifecycle. |
| `runo HRS/preload.js` | Renderer-facing `window.api` bridge; also writes an application-directory log. |
| `runo HRS/ipc/` | Authentication, projects, manufacturing, accounts, store and window handlers. |
| `runo HRS/db/index.js` | Exports an eagerly constructed database singleton; schema initialization can write data. |
| `runo HRS/db/storage.js` | Uses Electron userData, or app-local `data/`; JSON writes use temporary-file rename. |
| `runo HRS/db/repositories/` | Constructor-injected repositories suitable for focused tests using fake database objects. |
| `runo HRS/src/js/auth.js` | Role-to-navigation mapping and login/registration behavior. |
| `runo HRS/src/js/views/`, `src/partials/` | Domain controllers and HTML; inspect actual fields before writing locators. |
| `runo HRS/logger.js` | Writes and rotates `elog.txt` beside app source; userData redirection alone will not isolate logs. |
| `runo HRS/scratch/test_*.js` | Two informal scripts: registration approval and customer filters; no reliable suite isolation. |
| `.gitignore` | Currently ignores package-lock.json; address reproducible installs explicitly. |

Treat README descriptions as context. Inspect current implementation for exact status values, payloads, permissions and supported actions; do not invent endpoints or controls.
The scratch scripts use `console.assert`, which is insufficient as a failing test gate; the filter script also duplicates matching logic instead of exercising the real UI.
Do not execute either scratch script before storage isolation exists.

## 3. Proposed tools and test layers

Use JavaScript/CommonJS and Playwright Test with its Electron launcher for desktop E2E.
Electron support is experimental: first prove launch, login and shutdown against the
installed Electron version before expanding coverage. See [Playwright Electron API](https://playwright.dev/docs/api/class-electron).
Use Node's built-in test runner and strict assertions for repository/unit tests where
practical; use injected fake `db.data`/`db.save` rather than importing the database singleton.
Use real Electron IPC integration tests to validate bridge calls, authorization and persistence.
UI workflow tests must click/fill actual controls; bridge calls are for fixture setup,
integration tests and independent verification, not substitutes for the UI under test.
Use root devDependencies/scripts as the single dependency entry point. Select compatible
versions, record Node/Electron/Playwright versions, and commit a root lockfile after
narrowly adjusting the existing ignore rule. Do not introduce duplicate nested installs.

## 4. Proposed folder structure

```text
playwright.config.js
scripts/testing/
  run-unit-tests.cjs
  check-test-file-size.cjs
runo HRS/
  testing/                         # Only minimal app-side test bootstrap helpers
    configure-test-runtime.js
  tests/
    fixtures/                     # Electron lifecycle, synthetic data and path guard
      electron.fixture.js
      test-workspace.js
      seed-builder.js
      users.js
      customers.js
      projects.js
    pages/                        # Small UI helpers, split by domain/dialog
      login.page.js
      navigation.page.js
      customers.page.js
      projects.page.js
    helpers/                      # Evidence capture, native dialog stubs, assertions
    unit/                         # One or more focused files per repository/domain
    integration/                  # IPC contracts, authorization and disk persistence
    e2e/                          # Auth, customers, projects, design, accounts, etc.
    README.md                     # Install/run/debug instructions and prerequisites
  docs/testing/
    TEST_CASES.md                  # IDs, prerequisites, steps, expected outcomes, status
    KNOWN_ISSUES.md                # Reproduction, evidence, impact and affected test IDs
    VALIDATION.md                  # Commands, versions, counts and actual results
test-results/                     # Ignored: traces, screenshots, logs and JUnit XML
playwright-report/                # Ignored: HTML report
```

Add domain page/helper files only when tests need them. Keep generated artifacts and temporary databases out of source control and packaged application output.

## 5. Mandatory isolation and lifecycle design

1. Allocate a unique owned temporary workspace per test attempt, including retries.
   Put the test profile, JSON database, logs and exports under that workspace.
2. Proposed launch contract: `RUNO_TEST_MODE=1` plus absolute `RUNO_TEST_ROOT`.
   These are new hooks to implement, not existing supported environment variables.
3. Bootstrap immediately after importing Electron and before logger, handlers or database
   imports. Create validated directories and set userData before any singleton loads or
   the single-instance lock is requested. See [Electron app paths](https://www.electronjs.org/docs/latest/api/app).
4. In test mode, missing/invalid paths must abort startup before any database read/write;
   never fall back to the normal profile or `runo HRS/data/`. Reject production paths,
   filesystem roots and unexpected symlink/junction targets; require an ownership marker.
5. Route logger, preload log writes and log-opening handlers to the same isolated location.
   Outside test mode, preserve normal behavior. Do not add a renderer-exposed reset backdoor.
6. Seed before launch using synthetic schema-compatible fixtures. Account for `ensureSchema()`
   reinserting default entities; assert fixture-specific IDs instead of fragile global counts.
7. Start with `workers: 1`. Preserve the production single-instance lock. Verify the isolated
   test profile does not attach to or focus the user's existing app. Never kill unrelated processes.
8. Remove `ELECTRON_RUN_AS_NODE` only from the child launch environment when present;
   preserve other required environment variables. Use quoted/absolute paths for spaces.
9. Own and close each Electron process in guaranteed teardown, including failed setup.
   Retain evidence first; delete only the validated test-owned workspace after handles close.
10. Restart tests reuse their own workspace across two launches; other tests start fresh.
    Confirm runtime userData and database paths are inside the owned workspace before mutations.
11. Unit tests must not import `db/index.js` or run live storage inadvertently. Storage tests
    need injected paths or a narrow Electron stub, never the application-local fallback.

## 6. Test coverage and independent expected results

P0 = core gate; P1 = full regression. Expand each row into executable cases in TEST_CASES.md.

| ID / priority | Scenario and required outcome |
| --- | --- |
| BOOT-01 P0 | Real Electron window loads login and required partials; no unexpected renderer error or crash; process closes. |
| AUTH-01 P0 | Synthetic approved admin logs in; invalid credentials fail; blank inputs show validation. |
| AUTH-02 P0 | Logout removes current session and returns to login; protected actions after logout must be denied. |
| AUTH-03 P0 | Registration creates pending user; login is blocked until admin approval; approved user can then log in. |
| RBAC-01 P0 | Parameterize ADMIN, SALES, COMMERCIAL, DESIGN, ACCOUNTS, STORE, PURCHASE, ENGINEER, OPERATOR navigation using explicit expected permissions. |
| RBAC-02 P0 | Logged-out/non-admin direct privileged bridge calls must be rejected; hidden sidebar entries alone do not prove authorization. |
| USER-01 P1 | Duplicate registration, password change, user approval and protected root-admin deletion follow intended rules. |
| CUST-01 P0 | Create/edit customer through UI; table and persisted fields match; required-field errors prevent invalid creation. |
| CUST-02 P1 | Search, city/state, financial-year and category filters produce known fixture rows; reset and no-match states work. |
| CUST-03 P1 | HRS, HRTC, SPARE-HRS and SPARE-HRTC fixtures remain distinguishable; check category counts and exact row membership. |
| PROJ-01 P0 | Create a project associated with a fixture customer; project details and relevant list views agree after edit/reload. |
| SALES-01 P1 | Quote and PO status changes persist and appear consistently in sales/commercial/project views. |
| DESIGN-01 P1 | Check quote/PO prerequisites, 2D/3D milestones and final dispatch prerequisites against current UI and business rules. |
| MFG-01 P1 | Manufacturing record creation/edit and stage transitions update progress; invalid ordering is tested where rules require it. |
| APPR-01 P1 | Approval/rejection and remarks persist; verify permitted role and denied role through UI plus IPC. |
| ACCT-01 P1 | Fixture sales 1000 and receipt 250 yield receivable 750; purchase 600 and payment 100 yield payable 500. Test both insertion orders. |
| ACCT-02 P1 | Verify debit/credit ledger math from explicit fixture values, tab/search filters, decimals and malformed input handling. |
| STORE-01 P1 | Stock-in 10 minus issue 3 yields 7 for one item; unrelated item stays unchanged; threshold 7 raises the current <= reorder warning. |
| STORE-02 P1 | Item/godown creation, transaction filters, return behavior, zero/negative quantities and insufficient stock are explicit cases. |
| PURCH-01 P1 | Purchase request creation/status and project/vendor/search filters match saved fixture records. |
| DASH-01 P1 | Dashboard/year-filter counters match relevant fixture records; completed projects agree across list and dashboard. |
| EXPORT-01 P1 | CSV/Excel paths actually exposed by UI yield correct headers, rows and escaped comma/quote/newline values. |
| EXPORT-02 P1 | PDF export creates a nonempty valid PDF with expected fixture text; cancellation writes no destination file. |
| DATA-01 P0 | Create/edit fixture record, close app, relaunch same isolated profile and verify durable fields. |
| DATA-02 P1 | Missing/corrupt JSON and simulated write/rename errors have documented outcomes; failed save must not report durable success. |
| UI-01 P1 | Navigation, modal cancel, theme persistence, keyboard focus and window minimize/maximize/close work at supported sizes. |
| RESET-01 P1 | Clear/reset operates only in test profile; check both immediate result and behavior after restart. |

Derive arithmetic expectations independently; never call the function under test to calculate expected output. Confirm ambiguous business rules and record unresolved cases.
Existing code inspection suggests gaps: auth user-management IPC lacks explicit session
checks; unknown roles fall back to ADMIN in UI; account cash/bank KPIs are constants;
stock value uses a fixed multiplier. Verify and report these, do not call them passing
business calculations. Treat any newly detected rule mismatch as a product finding.

## 7. Reliable execution, exports and reporting

Use roles/labels and existing stable IDs, with minimal `data-testid` additions where needed. Use locator assertions and state-based waits; avoid fixed sleeps and coordinate clicks.
Install event listeners before triggering asynchronous actions; select the main app window explicitly so hidden PDF windows cannot be mistaken for it.
Stub native save dialogs in Electron's main process to owned export paths, including
cancellation; stub `shell.openPath` to avoid opening external viewers. Keep the real export
generation. Native dialogs need this treatment per the [Electron automation reference](https://playwright.dev/docs/api/class-electron).
For the manually launched Electron context, explicitly start/stop traces and attach failure
screenshots/logs in the fixture; do not assume browser-test fixture options capture them.
Produce console summary, HTML and JUnit reports using [Playwright reporters](https://playwright.dev/docs/test-reporters).
Record expected validation errors narrowly; fail on unexpected page errors or app crashes. Use zero local retries initially; surface flaky outcomes if CI retries are later enabled.
Known failures must stay visible with test IDs and evidence; no blanket skips or silent error swallowing.

## 8. Delivery stages, commands and completion criteria

Stage 1: inspect current code, implement isolation, prove Electron launch/close and failure evidence.
Stage 2: deliver P0 suite and unit cases for critical data/permission logic.
Stage 3: deliver P1 domain, export, persistence/error tests and document product findings.
Stage 4: document clean setup and add Windows CI only once local execution is stable.

Expose root commands: `npm test` (unit + integration + E2E, propagate failures),
`npm run test:unit`, `npm run test:integration`, `npm run test:e2e`,
`npm run test:smoke` (P0 tags), `npm run test:report` (open HTML report).
Keep discovery patterns disjoint; use a small Node wrapper if cross-platform file discovery
is needed. Explain that Electron GUI tests require a usable Windows desktop session.

Completion requires two consecutive clean P0 runs, a full suite run with exact
pass/fail/skip counts, and a demonstrated intentional assertion failure producing a
nonzero exit code plus evidence. Remove that intentional failure afterward.
Prove invalid test paths abort before writes, retries get fresh profiles, restart tests
retain only their own data, and teardown leaves no owned Electron process running.
Record baseline product defects separately; failing requirements mean the app is not
fully green even if the test infrastructure is delivered. Verify new code-file sizes,
normal startup compatibility, artifact ignores and test-file exclusion from builds.
Update tests/README.md, TEST_CASES.md, KNOWN_ISSUES.md and VALIDATION.md with actual
results, prerequisites, commands and limitations. Never claim unexecuted checks passed.

## 9. Ready-to-paste instruction for Gemini

Implement the automation test suite specified in `runo HRS/docs/features/AUTOMATION_TEST_SUITE.md`.
Read the current application and `runo HRS/INSTRUCTIONS.md` first. Preserve existing edits and use modular code files under 200 lines.
Start with validated isolated storage and a real Electron smoke test, then complete the documented test layers and coverage. Use synthetic data only.
Run the suite, provide reports and documentation, and distinguish product defects from test-harness problems. Report exact changes, actual results and remaining failures.
