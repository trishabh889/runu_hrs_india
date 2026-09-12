# RUNO HRS MIS - Automation Test Suite: Known Issues & Findings

This document tracks application behaviors, security gaps, and architectural observations discovered during automation suite development. Per the specification, test expectations reflect genuine requirements rather than masking these behaviors.

---

## 1. Security & Authorization

### SEC-01: Privileged IPC Endpoints Lack Session Validation
- **Severity**: High
- **Observed Behavior**: Handlers in `runo HRS/ipc/auth.js` (such as `user:approve`, `user:delete`, `user:create`) execute without verifying if the caller holds an active administrator session token.
- **Impact**: Any renderer script or DevTools console execution can trigger administrative operations directly via `window.api`.
- **Recommendation**: Validate caller session id or role within each sensitive IPC handler before executing state mutations.

### SEC-02: Role Fallback Defaults to ADMIN Privileges
- **Severity**: Medium
- **Observed Behavior**: In `runo HRS/src/js/auth.js`, unrecognized or null roles default to full `ADMIN` navigation permissions.
- **Impact**: If a user role is misspelled or undefined, they are inadvertently granted root access rather than least privilege.
- **Recommendation**: Default unrecognized roles to `GUEST` or an empty permission set.

---

## 2. DOM & UI Selectors

### UI-01: Duplicate ID `#kpi-total-projects` Across Views
- **Severity**: Low (Harness Impact)
- **Observed Behavior**: The element id `kpi-total-projects` exists both in `dashboard.html` (`#subview-dashboard`) and in `design.html` (`#subview-design`).
- **Impact**: Playwright strict mode locators fail when resolving `page.locator('#kpi-total-projects')` globally.
- **Workaround in Tests**: Scoped to `#subview-dashboard #kpi-total-projects`.
- **Recommendation**: Disambiguate element IDs (e.g. `kpi-dash-total-projects` vs `kpi-design-total-projects`).

### UI-02: Unapproved User Login Notification
- **Severity**: Info
- **Observed Behavior**: When an unapproved user attempts to sign in, the UI displays `#modal-admin-approval-notice` rather than writing inline text to `#login-error`.
- **Impact**: Auth tests must assert modal presence rather than inline element text.

---

## 3. Financial & Store Computations

### ACCT-01: Fixed Multipliers in Overview Statistics
- **Severity**: Low
- **Observed Behavior**: Inventory total value and certain dashboard cash/bank KPIs rely on static calculations rather than dynamic aggregation of item price multiplied by stock quantities.
- **Impact**: Displayed overview metrics do not reflect actual item-level purchase rates.
- **Recommendation**: Implement dynamic aggregation across item batches with weighted average cost.
