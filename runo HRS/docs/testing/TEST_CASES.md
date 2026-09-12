# RUNO HRS MIS - Automation Test Suite: Test Cases Catalog

Comprehensive index of automated test cases implemented across Unit, Integration, and E2E layers.

---

## 1. Test Layer Overview & Matrix

| Category | Test File | Test IDs Covered | Execution Engine | Isolation Target |
| :--- | :--- | :--- | :--- | :--- |
| **Smoke / Boot** | `boot-smoke.spec.js` | BOOT-01 | Playwright (Electron) | `RUNO_TEST_ROOT` |
| **Authentication** | `auth-lifecycle.spec.js` | AUTH-01, AUTH-02, AUTH-03 | Playwright (Electron) | Fresh workspace per test |
| **RBAC / Navigation** | `rbac-permissions.spec.js` | RBAC-01 | Playwright (Electron) | Fresh workspace per test |
| **Customer Mgmt** | `customers.spec.js` | CUST-01, CUST-02 | Playwright (Electron) | Fresh workspace per test |
| **Projects** | `projects-workflow.spec.js` | PROJ-01, SALES-01 | Playwright (Electron) | Fresh workspace per test |
| **Dashboard** | `overview-dashboard.spec.js` | DASH-01 | Playwright (Electron) | Fresh workspace per test |
| **Persistence** | `data-durability.spec.js` | DATA-01 | Playwright (Electron) | Reused workspace across restart |
| **Core Accounting** | `accounting-math.test.js` | ACCT-01, ACCT-02 | `node:test` (Unit) | In-memory Mock Data |
| **Inventory Store** | `store-inventory.test.js` | STORE-01, STORE-02 | `node:test` (Unit) | In-memory Mock Data |
| **Customer Repo** | `customer-repo.test.js` | CUST-02, CUST-03 | `node:test` (Integration) | In-memory Mock Data |
| **User Repo** | `user-repo.test.js` | AUTH-01, AUTH-03, USER-01 | `node:test` (Integration) | In-memory Mock Data |
| **Indian FY Math** | `financial-year.test.js` | FY-01, FY-02 | `node:test` (Unit) | Pure math / Date functions |
| **IPC Bridge Security**| `ipc-contracts.test.js` | RBAC-02 | `node:test` (Integration) | Contract inspection |

---

## 2. Test Case Specifications

### BOOT-01: Real Electron Window Shell Smoke
- **Level**: E2E (@smoke)
- **Objective**: Verify Electron process initializes without crashes, opens main viewport, and clean teardown succeeds.
- **Verification**: Title contains `RUNO`, main window is visible, and log file is directed to `RUNO_TEST_ROOT`.

### AUTH-01: Credentials Authentication
- **Level**: E2E & Unit
- **Objective**: Reject invalid credentials; authenticate valid synthetic Admin credentials and render application dashboard.
- **Verification**: Error message on incorrect password; sidebar navigations become visible on correct credentials.

### AUTH-02: User Session Logout
- **Level**: E2E (@smoke)
- **Objective**: Ensure session clears on logout and returns to clean login state.
- **Verification**: Clicking logout button transitions `#view-login` back to visible state.

### AUTH-03: User Registration & Pending Status
- **Level**: E2E & Integration
- **Objective**: Registration creates an unapproved user; login is blocked with approval notice modal.
- **Verification**: `ACCOUNT APPROVAL REQUIRED` modal prevents login until approved by Admin.

### RBAC-01: Role-Based Navigation Rendering
- **Level**: E2E
- **Objective**: Validate role-specific menu visibility between ADMIN and restricted roles (e.g. SALES).
- **Verification**: SALES engineer can access Sales/Projects/Customers but cannot access restricted administrative routes.

### CUST-01 & CUST-02: Customer Management & Live Filtering
- **Level**: E2E & Integration
- **Objective**: Create new customer with required fields; verify immediate row rendering and live search filtering.
- **Verification**: Row added to table with matching name; query filters match target company and omit non-matches.

### PROJ-01 & SALES-01: Projects Creation & Search
- **Level**: E2E
- **Objective**: Add project through New Project view; verify project persists and search by description/code works.
- **Verification**: Form submission redirects to Projects list with newly added record visible.

### DASH-01: Executive Overview Counters
- **Level**: E2E
- **Objective**: Verify KPI cards (total customers, active projects) display synthetic seed values without crashing.
- **Verification**: `#kpi-total-projects` in overview dashboard matches loaded dataset count.

### DATA-01: Data Durability Across Full Restart
- **Level**: E2E
- **Objective**: Create entity, shut down Electron process completely, and relaunch using the same test workspace.
- **Verification**: Persisted records are read back from disk without re-seeding.

### ACCT-01 & ACCT-02: Financial Ledger Math & Order Invariance
- **Level**: Unit (`accounting-math.test.js`)
- **Objective**: Compute balance from transactions independently of insertion order; verify debit/credit math.
- **Verification**: 1000 sales + 250 receipt = 750 balance, regardless of chronological sequence.

### STORE-01 & STORE-02: Stock In/Issue & Reorder Thresholds
- **Level**: Unit (`store-inventory.test.js`)
- **Objective**: Stock issue reduces balance; threshold warning triggers when balance <= reorder point.
- **Verification**: 10 in minus 3 issued leaves 7; raises reorder status flag when threshold is 7.
