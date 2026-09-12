# Application Color and Contrast Review

Reviewed: 2026-09-12.
Reference: the supplied dark navy purchase table with orange identifiers and distinct status colors.

## Scope

This update changes colors and icon contrast only. Font family, font sizes, weights,
spacing, dimensions, badge shapes, page structure, labels and application logic are unchanged.
Existing SVG icons remain; their foreground/background colors and calendar-icon filter
are adjusted where needed for visibility. No generated images or new icon dependency.

## Review findings and changes

- Purchase Pending badges used orange with white text; the reference uses yellow with dark text.
- White text on existing green, orange and pale purple badge backgrounds was difficult to read.
- Table surfaces and headings used inconsistent navy shades across departments.
- Some project-category controls, profile initials, notification counters and modal actions
  had insufficient contrast against their backgrounds.
- Dim helper text, table metadata and calendar icons needed clearer foreground colors.

The revised palette uses navy tables, slightly lighter alternating rows, a blue hover
surface, off-white primary text, readable secondary text and orange identifiers.
Purchase status colors now match the reference's meaning: yellow Pending, blue Approved,
green PO Released/Received, purple In Transit, orange In Review and red Cancelled.
Existing status classes and business-state assignments are preserved in other modules.
Legends and KPI icon backgrounds are coordinated with their corresponding status colors.

## Structure

Color overrides load after existing module styles in `src/index.html`:

| File | Responsibility |
| --- | --- |
| `src/css/contrast/palette.css` | Shared surface, text, accent and status color tokens. |
| `src/css/contrast/surfaces.css` | Shell, cards, tables, labels, login panels and subdued text. |
| `src/css/contrast/controls.css` | Buttons, inputs, hover/focus colors and existing icons. |
| `src/css/contrast/statuses.css` | Badge foreground/background pairs and matching legends. |

Each new stylesheet is under 200 lines. Overrides contain color-related declarations only.
Specific overrides accommodate existing inline colors without changing renderer controllers.
Keep typography and geometry in their original module files.

## Measured palette contrast

These ratios use the final opaque foreground/background colors, independently calculated
from their RGB values. Text uses a 4.5:1 minimum review target, or 3:1 for large text.

| Pair | Foreground | Background | Ratio |
| --- | --- | --- | --- |
| Pending | `#17202a` | `#facc15` | 10.74:1 |
| Approved | `#ffffff` | `#1d5ce0` | 5.74:1 |
| Completed / received | `#ffffff` | `#047857` | 5.48:1 |
| Transit | `#ffffff` | `#6d28d9` | 7.10:1 |
| Review / primary action | `#ffffff` | `#c2410c` | 5.18:1 |
| Danger | `#ffffff` | `#b91c1c` | 6.47:1 |
| Secondary text on row hover | `#cad8e5` | `#14334a` | 9.03:1 |

## Verification performed

- Launched real Electron with isolated test profiles and synthetic fixtures.
- Reviewed screenshots and sampled rendered text on 41 screens/modal states, including
  login, registration, all sidebar departments, new project, completed projects and approvals.
- The initial 17-state pass flagged 140 text instances. The final 41-state pass had no
  remaining candidates below the review target in the sampled text.
- Compared the same live DOM with the color layer enabled/disabled: no changes to measured
  font, dimensions, padding, margins, border widths/radii, positioning or grid properties.
- Checked nine hover/focus states, including purchase rows/actions/search, design actions,
  project categories, profile menu and login: no remaining sampled text contrast candidates.
- Validated all four stylesheets contain only color-related properties and meet the file-size rule.
- Updated color assets and stylesheet links in both existing distribution folders.
- Launched the primary packaged EXE with an isolated profile and verified the purchase
  table loads the new yellow Pending palette with no sampled contrast failures.

Rendered-text sampling estimates gradient backgrounds from the first stop and excludes
checkbox/radio glyphs from text measurement. It is a targeted visual/color review, not
a complete accessibility certification or business-workflow regression run. Modal shells
with dynamic content were checked without creating real records or sending/exporting anything.

## Review artifacts and future updates

- Screenshots and measurements: `test-results/ui-contrast/verified/`.
- Hover/focus evidence: `test-results/ui-contrast/interactions/`.
- Packaged-app evidence: `test-results/ui-contrast/packaged/`.
- Review helpers: `scratch/ui-contrast/`; these are outside the shipped application.
- Re-run from repository root: `node scratch/ui-contrast/capture.cjs verified`.
- Interaction check: `node scratch/ui-contrast/capture.cjs interactions`.
- Packaged check: `node scratch/ui-contrast/capture.cjs packaged`.

The existing packager copies `src/`, so future builds include the new stylesheets.
Reopen an already running application to load the updated colors.
