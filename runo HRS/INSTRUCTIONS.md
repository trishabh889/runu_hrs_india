# RUNO HRS INDIA - MIS Architecture & Engineering Guidelines

This document outlines the strict design, architecture, and code quality standards for the **RUNO HRS INDIA Management Information System (MIS)** desktop application.

---

## 1. Core Engineering Directives

### 1.1 Maximum File Length Rule (Strict: <= 200 Lines)
* **No file in this project shall exceed 200 lines of code.**
* If any component, service, or stylesheet approaches 180 lines, it must be split into single-responsibility sub-modules, repositories, or partial views.
* **Why**: Ensures exceptional maintainability, high testability, zero cognitive overload, and prevents monolithic spaghettification.

### 1.2 Mature & Layered Directory Structure
The application follows a clean 4-tier desktop architecture:
1. **Presentation Layer (`src/`)**: 
   - `index.html`: Thin layout shell.
   - `css/`: Modular scoped stylesheets (`theme.css`, `layout.css`, `auth.css`, `tables.css`, etc.).
   - `js/`: Modular state, utilities, authentication, navigation, and dedicated view controllers (`src/js/views/`).
2. **IPC Communication Layer (`ipc/`)**:
   - Strictly isolated handlers for Auth, Projects, Manufacturing, and System Window calls.
3. **Database & Service Layer (`db/`)**:
   - Repository pattern (`repositories/`) isolating data logic per domain entity (`userRepo`, `projectRepo`, `customerRepo`, etc.).
   - Atomic persistence manager (`storage.js`) guaranteeing zero corruption.
4. **Desktop Shell Layer (`main.js` & `preload.js`)**:
   - Context-isolated, sandboxed Electron runtime.

---

## 2. Code Quality & Standards

### 2.1 Separation of Concerns
* **No Inline Styles**: All visual properties belong in modular CSS files.
* **No Monolithic Handlers**: Functions must be single-purpose and under 40 lines.
* **Repository Pattern**: Business logic and data storage must never be coupled directly inside UI handlers.

### 2.2 Security & Context Isolation
* `nodeIntegration` must remain `false`.
* `contextIsolation` must remain `true`.
* Only explicitly whitelisted IPC APIs are exposed via `preload.js`.

### 2.3 Data Integrity & Atomic Storage
* Database writes must use atomic swap patterns (`.tmp` write followed by atomic rename).
* Primary keys must follow clean prefixed semantic identifiers (`usr-`, `cust-`, `proj-`, `appr-`).
* Seed data must always be decoupled into `seedData.js`.

---

## 3. Build & Distribution
* Single-click launcher: `Run_RUNO_MIS.cmd`.
* Development mode: `Run_Dev_Mode.cmd`.
* Direct standalone executable: `dist/RUNO_HRS_INDIA_MIS/RUNO_HRS_INDIA_MIS.exe`.
* Packaging pipeline: `node build_exe.js`.
