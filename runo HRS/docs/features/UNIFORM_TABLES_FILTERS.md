# Uniform Tables, Filters, and Flat Buttons Specification

**Document Version:** 2.0.0 (Master Standard)  
**Status:** Implemented & Verified  
**Updated:** September 2026  
**Scope:** Universal consistency across all 12 modules in RUNO HRS INDIA MIS  

---

## 1. Executive Summary & Design System Rationale

The RUNO HRS INDIA application incorporates an industrial dark-navy aesthetic (`#0F172A` / `#0B1220`) tailored for multi-department operations. To ensure a cohesive, professional user experience across Design, Manufacturing, Purchase, Commercial, Sales, Accounts, Store, Approvals, and Customer Management, this specification establishes:

1. **Uniform Filter Dimensions:** Standardized height (36px), dedicated fixed widths for search boxes, dropdown selects, date inputs, and action buttons.
2. **Standardized Table Density & Geometry:** Predictable header tiers (40px per tier), uniform populated row heights (52px), content-aware cell padding (8px 12px), and smooth horizontal scroll containers.
3. **Flat Interaction Architecture:** Complete elimination of intrusive drop-shadows, button glows, and icon text-shadows, replaced by subtle borders and high-visibility accessible focus rings.
4. **Universal Date Range Filtering:** Standardized 2-point date inputs (`Start Date`, `End Date`, and `Reset`) wired to universal date normalization routines (`normalizeDateStr`).
5. **Consistent Action & Status Elements:** Uniform status badge dimensions (104px × 26px) and crisp square action icon buttons (30px × 30px with white `#FFFFFF` foregrounds).

---

## 2. Global Design Tokens & Dimensions

All sizing is defined using centralized CSS custom properties in `src/css/components/`:

### 2.1 Sizing Reference Table

| Component | Selector / Class | Width | Height | Padding / Geometry |
| :--- | :--- | :--- | :--- | :--- |
| **Search Box Container** | `.search-box`, `.pr-search-box`, `.mfg-search-container` | **280px** | **36px** | Input text indented 36px (left-aligned SVG icon) |
| **Filter Dropdowns** | `.filter-select-compact`, `.pr-filter-select`, `.mfg-select-filter` | **180px** | **36px** | Custom chevron SVG background; 12px font |
| **Custom Dropdown Trigger** | `.filter-group .custom-dropdown-btn` | **180px** | **36px** | Ellipsis overflow; matching border & background |
| **Date Inputs (Individual)**| `input[type="date"]`, `.pr-date-range-box input` | **140px** | **36px** | 0 10px padding; standard calendar picker |
| **Date Filter Container** | `.filter-date-box`, `.pr-date-range-box`, `.mfg-date-range`| Auto (gap: 8px) | **36px** | Holds From Date + To Date + Reset button |
| **Filter / Reset Action** | `.btn-action-secondary`, `.btn-pr-filter-btn`, `.btn-filter-action`| **88px** | **36px** | Centered text; flex-shrink 0; 6px radius |
| **Table Header Tier** | `thead th` | Content-based | **40px** | 8px 12px padding; 11px uppercase; weight 700 |
| **Two-Tier Header (Design)**| `th.group-header` & spanned sub-headers | Content-based | **40px / 80px** | 40px per tier; row-spanning headers cover 80px |
| **Populated Row** | `tbody tr td` | Content-based | **52px** | Vertical align middle; single-line 16px height |
| **Status Badge / Pill** | `.badge`, `.pr-status-badge`, `.status-pill`, `.mfg-badge` | **Min 104px** | **26px** | Line-height 24px; font 10.5px; pill radius |
| **Action Icon Button** | `.btn-icon`, `.pr-action-btn` | **30px** | **30px** | 6px border radius; white foreground; centered SVG |

### 2.2 CSS Variables Definition

```css
:root {
  /* Filter Control Dimensions */
  --filter-height: 36px;
  --filter-select-width: 180px;
  --filter-search-width: 280px;
  --filter-date-width: 140px;
  --filter-action-width: 88px;
  --control-radius: 6px;

  /* Table Geometry Dimensions */
  --table-header-height: 40px;
  --table-row-height: 52px;
  --table-cell-padding: 8px 12px;
  --table-radius: 8px;

  /* Color Tokens for Controls */
  --bg-toolbar: #0D1626;
  --border-subtle: rgba(255, 255, 255, 0.08);
  --bg-input: #131E32;
  --bg-input-border: rgba(255, 255, 255, 0.12);
  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --focus-outline-color: #FFC398;
}
```

---

## 3. Module-by-Module Implementation Matrix

The uniform controls and table standards are active across all application modules:

| Module | Search Control (280px) | Dropdown Filters (180px) | Date Range Filter (140px + 140px + 88px) | Table Layout & Density | Action Buttons (30px White) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Projects Master** | ✅ Project Code / Client | ✅ Status (All, Active, Completed) | ✅ Date Range + Reset | Standard 52px rows | ✅ View, Check, Quote, Delete |
| **Design Module** | ✅ Drawing / Assembly No | ✅ Category (HRS, HRTC) | ✅ Date Range + Reset | Two-tier 80px header; 52px rows | ✅ Milestones, View, Check |
| **Manufacturing** | ✅ Job No / Machine | ✅ Stage Filter (CNC, Gun Drill...) | ✅ Order Date Range + Reset | Standard 52px rows | ✅ View Details, Edit Job |
| **Commercial (HRS/HRTC)**| ✅ Project / ID Card | ✅ Category Tabs + FY Select | ✅ Mfg Date Range + Reset | Horizontal scrolling 12 columns | ✅ View Specifications |
| **Purchase Module** | ✅ PR No / Vendor / Item | ✅ Status & Project Filters | ✅ PR Date Range + Reset | Standard 52px rows | ✅ View, Edit, Attachment, Delete |
| **Sales Pipeline** | ✅ Customer / Inquiry | ✅ Quote Status Filter | ✅ Order Date Range + Reset | Standard 52px rows | ✅ Edit Quote, Send Email |
| **Store & Inventory** | ✅ Item Code / Location | ✅ Category (Raw, Spares, Godown) | ✅ Transaction Date Filter | Standard 52px rows | ✅ Stock In, Material Issue |
| **Accounts (Tally)** | ✅ Particulars / Ref No | ✅ Voucher Type (Sales, Receipt...)| ✅ Voucher Date Filter | Standard 52px rows | ✅ View Voucher, Export |
| **Completed Archive** | ✅ Archive Code / Project | ✅ Completion Year Filter | ✅ Completion Date Range + Reset | Standard 52px rows | ✅ View Archive Specs |
| **Approvals** | ✅ Request / Signoff | ✅ Approval Type Filter | ✅ Submission Date Filter | Standard 52px rows | ✅ Approve (White ✓), Reject (✕) |
| **Customer Master** | ✅ Company / GSTIN / City | ✅ State / Tier Filter | N/A (Directory Mode) | Standard 52px rows | ✅ Edit Profile, View Projects |
| **User Directory** | ✅ Username / Name | ✅ Department / Role Filter | N/A (Directory Mode) | Standard 52px rows | ✅ Edit Role, Reset Pass |

---

## 4. Architectural Component Breakdown

### 4.1 Filter Controls Layer (`src/css/components/filter-controls.css`)
- **Container Structure:** Toolbars (`.table-toolbar`, `.purchase-filter-bar`, `.design-filter-bar`, `.mfg-toolbar`) use `flex-wrap: wrap` to gracefully wrap onto additional rows on compact displays (e.g., 1100px screens) without cutting off controls.
- **Fixed-width Enforcement:** Uses `!important` declarations on `width`, `min-width`, `max-width`, and `flex: 0 0 [width]` to prevent browser flex-shrink from squishing selects or search inputs.
- **Custom Select Styling:** Standard browser arrows are replaced with an embedded, accessible SVG chevron (`%23cad8e5`), vertically centered with 10px right-offset.
- **Search Boxes:** Absolute-positioned magnifier icon at `left: 12px`, with input padding `0 12px 0 36px` to avoid text collision with the icon.

### 4.2 Table Layout & Geometry (`src/css/components/table-layout.css`)
- **Container & Scroll:** Wrapped in `.table-responsive` or `.design-table-wrapper` with custom styled 8px scrollbars (`::-webkit-scrollbar`).
- **Two-Tier Design Headers:**
  - Standard headers are exactly 40px tall.
  - Complex modules like Design utilize group headers (`.group-header` for "2D CAD", "3D CAD", "DISPATCH") with `rowspan="2"` column headers (e.g. "SR NO", "PROJECT CODE", "CUSTOMER NAME") covering both tiers (80px total height).
- **Row Density:** Populated rows are fixed at 52px height with single-line truncation or nowrap layout. Non-empty cells maintain 16px line-height.
- **Empty States:** When a table has 0 results, `td[colspan]` expands naturally to present helpful zero-state messaging without height clipping.

### 4.3 Flat Buttons Treatment (`src/css/components/flat-buttons.css`)
- **Elimination of Shadows:** Comprehensive CSS rules strip `box-shadow: none !important;`, `text-shadow: none !important;`, and `filter: none !important;` from all buttons, nav items, dropdown items, and icon buttons across:
  - `:default`
  - `:hover`
  - `:active`
  - `:focus`
- **Preserved Card Elevation:** Surface elevation and card border separation are preserved on containers; only interactive clickables adopt the flat treatment.
- **Accessible Focus Indicators:** Focus outlines use `outline: 2px solid #ffc398; outline-offset: 2px;` for WCAG 2.1 AA keyboard accessibility.

### 4.4 Status Badges & Action Icon Standardization
- **Badges:** Fixed at `min-width: 104px`, `height: 26px`, border-radius 13px (pill), font-size 10.5px. Status badges feature distinct contrasting backgrounds (Yellow for Pending, Green for Completed, Purple for In Transit, Blue for Approved, Red for Danger).
- **Action Icons:** Table action buttons (`.btn-icon`, `.pr-action-btn`) are 30px × 30px squares with subtle `rgba(255, 255, 255, 0.1)` border. All icons render in `#FFFFFF` (pure white) with smooth hover transitions (`rgba(255, 255, 255, 0.1)` background).

---

## 5. Universal Date Range Filtering Standard

To resolve previous cross-module date filtering failures, every date filter follows this unified contract:

```
[From Date: 140px] ──> [To Date: 140px] ──> [Reset Button: 88px]
```

### 5.1 Date Normalization Algorithm (`db/dateUtils.js`)
All incoming dates (whether `DD-MM-YYYY`, `YYYY-MM-DD`, `DD/MM/YYYY`, or localized timestamps) are converted to ISO standard `YYYY-MM-DD` strings before comparison:

```javascript
function normalizeDateStr(dateStr) {
  if (!dateStr) return null;
  const s = String(dateStr).trim();
  // Format: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  // Format: DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }
  return null;
}

function isDateInRange(targetDateStr, startDateStr, endDateStr) {
  const normTarget = normalizeDateStr(targetDateStr);
  if (!normTarget) return true;
  if (startDateStr && normTarget < startDateStr) return false;
  if (endDateStr && normTarget > endDateStr) return false;
  return true;
}
```

---

## 6. Verification & Automated Test Coverage

### 6.1 Test Suite Summary
Visual, functional, and layout regression tests verify compliance across all screens:

1. **Unit Test Suite (`date-filter.test.js`):**
   - 24/24 passing unit tests verifying date normalization, leap year handling, and multi-format range inclusion/exclusion.
2. **Playwright Visual Verification (`scratch/test_date_filters.cjs`):**
   - Automated browser session testing live Electron runtime across Design, Manufacturing, Purchase, and Projects tables.
   - Verified that resetting date filters restores full record count in `< 200ms`.
3. **UI Consistency Review (`scratch/ui-consistency/review.cjs`):**
   - Inspected 54 live DOM states.
   - Measured all filter inputs: Verified 100% compliance with 36px height, 280px search, 180px dropdown, 140px date.
   - Confirmed 0 detected button shadows or icon glows across all interaction states.
   - Verified 40px headers, 80px two-tier Design headers, and 52px table rows.

---

## 7. Developer Guidelines & Maintenance

1. **Adding a New View or Table:**
   - Always wrap filter controls inside `<div class="table-toolbar">`.
   - Use `.filter-select-compact` for dropdowns, `.search-box` for search inputs, and `input[type="date"]` for date inputs.
   - Do NOT write custom inline pixel widths (`style="width: 215px"`); rely on the CSS custom properties in `filter-controls.css`.
2. **Modifying Table Columns:**
   - Table columns should specify percentage or content-based widths.
   - Keep `.table-responsive` wrapping the `<table>` to guarantee horizontal scrolling for dense datasets.
3. **Button Styling Rules:**
   - Never add `box-shadow` or `filter: drop-shadow(...)` to buttons.
   - Use `.btn-icon` for table actions and ensure SVGs do not declare hardcoded inline `fill` or `color` that overrides the global `#FFFFFF` standard.
4. **Rebuilding the Executable:**
   - Because `build_exe.js` copies the entire `src/` directory into the packaged app, any stylesheet updates take effect immediately on next run or rebuild.
