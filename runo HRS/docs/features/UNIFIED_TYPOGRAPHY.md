# Unified Application Typography

## Goal

Use the login page's Cambria-based typography throughout the RUNO HRS MIS application
so every workspace has a consistent visual identity.

## Implementation

- `src/css/theme.css` defines the shared `--font-primary` typography token.
- The application body uses the token, so all normal content inherits the login font.
- Buttons, inputs, selects and textareas explicitly inherit the application font instead
  of using Chromium's native control font.
- Design project codes, design notes and manufacturing code labels use the same shared
  token instead of screen-specific sans-serif, monospace or Georgia overrides.
- Inline table identifiers and generated Excel/PDF reports use the Cambria family.
- Login styles retain their existing Cambria stack and match the shared token.

## Maintenance

Use `var(--font-primary)` when a component needs an explicit font declaration. Prefer
normal inheritance for other elements, and avoid adding screen-specific font stacks.

## Verification

- Compare login text with dashboard, sidebar, tables, forms and modal text.
- Check buttons, inputs, dropdowns and textareas for the same font family.
- Open Design and Manufacturing views and confirm their labels match the rest of the app.
- Confirm fallback rendering works on Windows when Cambria is unavailable.
