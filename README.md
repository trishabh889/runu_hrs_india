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

## 🔐 Default Department Login Credentials

| Username | Password | Role / Department | Access Level |
| :--- | :--- | :--- | :--- |
| **`ANAND`** | **`ADMIN`** | **ADMIN** | Full System Access (All Departments, Approvals & Users) |
| **`VIKRAM`** | **`USER123`** | **SALES** | Sales Pipeline, Customer Quotes & PO Status Tracking |
| **`PRIYA`** | **`USER123`** | **COMMERCIAL** | Costing, Hot Runner Specifications & Quote Status |
| **`ROHIT`** | **`USER123`** | **DESIGN** | 2D / 3D Design Engineering Lifecycle & R&D |
| **`MANISH`** | **`USER123`** | **ACCOUNTS** | Tally Accounting, Double Entry Vouchers & Ledgers |
| **`RAJESH`** | **`USER123`** | **STORE** | BUSY Inventory, Stock Ledger & Reorder Warnings |
| **`SURESH`** | **`USER123`** | **PURCHASE** | Material Procurement Orders & Indents |

*(Note: Protected root administrator account `ANAND` cannot be deleted. Passwords can be changed via the User Management modal).*

---

## ✨ Features & Capabilities (Ported & Enhanced from Java Swing MIS)

1. **Department Role-Based Access Control (RBAC)**:
   - Dynamic sidebar navigation filtering based on user role (`ADMIN`, `SALES`, `COMMERCIAL`, `DESIGN`, `ACCOUNTS`, `STORE`, `PURCHASE`, `ENGINEER`, `OPERATOR`).
   - Strict access isolation ensuring each department sees only their authorized workspaces.

2. **Tally-Style Accounting Workspace (15 Functional Tabs)**:
   - Tabbed financial accounting: `ALL`, `SALES`, `PURCHASE`, `PAYMENT`, `RECEIPT`, `CONTRA`, `JOURNAL`, `DEBIT NOTE`, `CREDIT NOTE`, `BANK/CASH`, `LEDGER`, `TRIAL BAL`, `P&L`, `BAL SHEET`, `VOUCHERS`.
   - Real-time financial KPI cards: Total Sales, Total Purchases, Net Receivables, Net Payables, Cash in Hand, Bank Balance.
   - Comprehensive Double-Entry Voucher entry dialog (`SALES`, `PURCHASE`, `RECEIPT`, `PAYMENT`, `JOURNAL`) with Dr/Cr allocation.
   - Running Balance Ledger view with searchable transactions.

3. **BUSY-Style Store & Inventory Workspace (13 Functional Tabs)**:
   - Tabbed stock management: `ALL ITEMS`, `STOCK SUMMARY`, `RAW MATERIAL`, `NOZZLES`, `HEATERS`, `THERMOCOUPLES`, `VALVE PINS`, `PURCHASE INDENTS`, `STOCK ISSUE`, `STOCK RETURN`, `GODOWN / LOCATION`, `REORDER REPORT`, `STOCK LEDGER`.
   - Item Master with part code, category, godown allocation, unit of measure, minimum stock level, reorder quantity, and unit price.
   - Visual **Low Stock / Reorder Warning Banner** alerting procurement when stock drops below safety thresholds.
   - Stock transactions logger for Goods Receipts, Material Issues, and Adjustments with automatic inventory quantity calculation.

4. **Commercial Hot-Runner Costing & Specifications**:
   - Technical hot runner specifications: Nozzle Drop count, Tip Type, Manifold Geometry, Runner Diameter, Resin Type, Shot Weight, Mold Dimensions, Target Delivery.
   - Live in-place **Quote Status Dropdown** (`Quote Send`, `Quote Pending`, `Order Cancel`, `Approved`).
   - Multi-criteria technical filters for quick quoting comparisons.

5. **2D / 3D Design Engineering Lifecycle**:
   - Milestone tracking for R&D and Tooling Design:
     - `2dStart` -> `2dEnd`
     - `3dStart` -> `3dEnd`
     - `designSend`
   - Business rule validation: Requires valid Quote (`Quote Send` / `Approved`) and PO confirmation (`RECEIVED`) before design initiation. Requires both 2D and 3D completion before final CAD dispatch.

6. **Sales Pipeline & PO Tracking**:
   - Pipeline view tracking quotation dates, values, quote statuses, and PO receipt indicators.
   - Instant quick-action buttons for updating Quote Status and PO Receipt.

7. **Enhanced Customer Directory**:
   - Dedicated **Contact Person** and **Designation** tracking for every client account.
   - Live **Category Breakdown Badges** showing project distribution across:
     - `HRS` (Hot Runner Systems)
     - `HRTC` (Hot Runner Temperature Controllers)
     - `SPARE-HRS` / `SPARE-HRTC`
   - Financial Year and Category filter dropdowns with instant search.

8. **Export to Excel & Formatted PDF**:
   - **Excel Export**: Generates native Excel XML spreadsheet (`.xls`) for Accounts, Store, Projects, and Customer tables with formatted headers and auto-filtered action buttons.
   - **Printable PDF**: Generates branded printable documents via styled print dialog with corporate header, timestamp, and formatted tables.

9. **Manufacturing Workflow Tracker (7 Stages)**:
   - 7-Stage production tracking for Hot Runner Systems:
     1. *Design & CAD*
     2. *CNC Machining*
     3. *Gun Drilling (0.4 Ra)*
     4. *Hardening / Vacuum Heat Treatment (48-50 HRC)*
     5. *Assembly & Nozzle Fitment*
     6. *Wiring & Heater Resistance Testing*
     7. *Final Quality Inspection & Dispatch*
   - Interactive progress bar with milestone status updates.

10. **Embedded Offline JSON Database**:
    - Zero-configuration storage: Automatically created in `%APPDATA%/runo-hrs-mis/` or `./data/`.
    - 100% offline, atomic write operations, and persists across application restarts.

---

## 🛠️ Rebuilding the Standalone `.exe`
Whenever updates are made to the codebase, rebuild the executable package anytime with:
```bash
cd "runo HRS"
node build_exe.js
```
The newly built package is instantly available at:
`runo HRS/dist/RUNO_HRS_INDIA_MIS/RUNO_HRS_INDIA_MIS.exe`.

