# RUNO HRS INDIA - Management Information System (MIS) Desktop Application

A modern, high-performance Windows desktop application engineered for **RUNO HRS INDIA (Hot Runner Systems)**.

[![Download Windows App](https://img.shields.io/badge/Download-RUNO_HRS_MIS_v1.0.0_(Windows_x64)-FF5722?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/trishabh889/runu_hrs_india/releases/download/v1.0.0/RUNO_HRS_INDIA_MIS_Windows_x64.zip)
[![Release](https://img.shields.io/badge/Release-v1.0.0-10B981?style=for-the-badge)](https://github.com/trishabh889/runu_hrs_india/releases/tag/v1.0.0)
[![Platform](https://img.shields.io/badge/Platform-Windows_10_%7C_11_64--bit-0078D6?style=for-the-badge&logo=windows)](https://github.com/trishabh889/runu_hrs_india/releases/download/v1.0.0/RUNO_HRS_INDIA_MIS_Windows_x64.zip)

<p align="center">
  <img src="runo%20HRS/src/assets/icon.png" width="180" alt="RUNO App Icon" />
</p>

---

## ⚡ 1-Click Download (For Any Windows PC)

> **No installation or coding software (Node.js/Python) required.** The package is completely portable and self-contained.

### 📥 [Click Here to Download `RUNO_HRS_INDIA_MIS_Windows_x64.zip` (v1.0.0)](https://github.com/trishabh889/runu_hrs_india/releases/download/v1.0.0/RUNO_HRS_INDIA_MIS_Windows_x64.zip)

### 🛠️ Quick Start (2 Steps):
1. **Unzip**: Right-click the downloaded zip file and select **"Extract All..."**.
2. **Run**:
   - Double-click **`RUNO_HRS_INDIA_MIS.exe`** to launch the application immediately.
   - Or double-click **`Install_Desktop_Shortcut.cmd`** to create official Desktop and Start Menu shortcuts.

---

## 🔐 Default Login Credentials

| Username | Password | Role | Access Level |
| :--- | :--- | :--- | :--- |
| **`ANAND`** | **`ADMIN`** | **ADMIN** | Full System Access, Approvals & User Management |
| **`VIKRAM`** | **`USER123`** | **ENGINEER** | Projects, Technical Specs, Manufacturing |
| **`RAJESH`** | **`USER123`** | **OPERATOR** | Manufacturing Stage Updates |

*(Note: Credentials can be changed and new users can be created anytime in the **USER MANAGEMENT** section).*

---

## ✨ Features & Capabilities

1. **Brand Aesthetic & Identity**:
   - Matches the exact dark industrial theme and signature orange hot-runner nozzle styling from the original MIS system.
   - Vector SVG logo for crisp rendering at any screen resolution (1080p / 4K).
   - High-tech custom branded application icon.

2. **Dashboard Overview**:
   - Real-time KPI summary widgets:
     - `TOTAL PROJECTS`
     - `PROJECT USERS`
     - `CUSTOMERS`
     - `ACTIVE PROJECTS`
     - `COMPLETED PROJECTS` (with instant filter button)
   - Filter projects dynamically by year (`ALL PROJECTS`, `2026`, `2025`, `2024`).
   - Quick active project preview.

3. **Customers Directory**:
   - Register, search, view, edit, and delete client accounts.
   - Company name, contact person, phone, email, GSTIN, address, and total projects count.
   - Export customers list to CSV.

4. **Projects Management**:
   - Comprehensive technical repository for Hot Runner Systems.
   - Detailed specifications: Nozzle drop count, valve gate vs. open torpedo, manifold type, runner diameter, raw resin (PC/ABS/PMMA), target delivery date, priority, and value.
   - Live search by project code, mould name, or customer.
   - Status filters (`ACTIVE`, `COMPLETED`, `PENDING_APPROVAL`).
   - Export projects to CSV.

5. **Completed Projects Archive**:
   - Dedicated view for delivered and commissioned tooling projects.

6. **New Project Creator**:
   - Professional form to initiate new tooling orders with automatic project code numbering (`RUNO-2026-XXX`).
   - Automatically initializes manufacturing workflow and design approval queue.

7. **Manufacturing Workflow Tracker**:
   - 7-Stage production tracking for Hot Runner Systems:
     1. *Design & CAD*
     2. *CNC Machining*
     3. *Gun Drilling (0.4 Ra)*
     4. *Hardening / Vacuum Heat Treatment (48-50 HRC)*
     5. *Assembly & Nozzle Fitment*
     6. *Wiring & Heater Resistance Testing*
     7. *Final Quality Inspection & Dispatch*
   - Visual progress bar with milestone status updates.

8. **Project Approvals**:
   - Engineering sign-off workflow with approval logs and remarks.

9. **User Management**:
   - Add, edit, and manage accounts and assign roles (`ADMIN`, `ENGINEER`, `OPERATOR`).

10. **Embedded Local Database**:
    - Zero-configuration storage: Automatically created in `%APPDATA%/runo-hrs-mis/` or `./data/`.
    - 100% offline and persists across application restarts.

---

## 🛠️ Rebuilding the `.exe`
If you make changes to HTML, CSS, or JS, simply rebuild the executable package anytime with:
```bash
node build_exe.js
```
The new `.exe` will be generated in `dist/RUNO_HRS_INDIA_MIS/RUNO_HRS_INDIA_MIS.exe`.
