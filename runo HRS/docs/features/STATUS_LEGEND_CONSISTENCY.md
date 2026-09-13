# Consistent Status Legends

Updated: 2026-09-13

Design, Purchase, Manufacturing, Sales, Commercial, Assembly & Testing,
Customer Service and User Management share compact legends with the same title,
typography, circular markers and spacing.

## Presentation

- Each status uses a 14 x 14 px circle followed by its label with an 8 px gap.
- Labels appear outside the marker, in the application font and natural title case,
  with no visible color annotations.
- Circles have a subtle inset highlight and a soft glow inherited from their
  actual status background. The footer has a light shadow and a compact surface.
- Each legend reuses its module's table status classes so status meanings and
  existing colors stay aligned. Manufacturing's On Hold legend now matches its badge.
- Commercial shows Submitted, Received, Cancel and Order Cancel as separate items.
- Design retains its separate Stage Action Legend with 22 px action symbols and
  the same soft glow on its non-interactive examples.
- Assembly & Testing includes In Progress, In Review and Completed statuses.
- Customer Service has separate Status and Priority rows. Priority includes
  Critical, High and Normal, using the existing table badge colors.
- User Management has Status (Approved, Pending Approval) and Role (Admin,
  Department User) rows. Department User covers non-admin department roles,
  matching the table's shared role color.
- Legend items wrap within the available space; the title aligns with the first row.
- Actual buttons, including active pagination controls, remain shadow-free.

## Files

- `src/css/components/status-legends.css`: shared legend component.
- `src/css/components/flat-buttons.css`: application button shadow override.
- `src/index.html`: loads the shared component.
- `src/partials/{design,purchase,mfg,sales,commercial}.html`: semantic legend markup.
- `src/partials/{assembly,service,users}.html`: added status, priority and role legends.

Existing table/filter dimensions, status logic, actions and data are preserved.
The two existing unpacked Windows packages contain the updated legend markup
and shared styles; an application restart loads them.

## Verification

The isolated Electron visual review covered all eight screens at 1440 px and
1100 px, in source and the primary packaged EXE (32 screen/size checks).
It checked circle dimensions and rounding, external label spacing, glow,
semantic colors, container bounds,
absence of visible color annotations, and absence of button shadows.
Assembly, Service and User table badges were also checked against their legends
to confirm every displayed status, priority and role group has a matching marker.
A same-DOM stylesheet comparison confirmed table and filter dimensions are unchanged.
Screenshots were visually reviewed. Synthetic test profiles were removed afterward.

Review helper: `scratch/ui-legends/review.cjs` at workspace root.
Review artifacts: `test-results/ui-legends/circles/{source,packaged}/` at workspace root.
