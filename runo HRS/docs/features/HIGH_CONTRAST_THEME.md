# High Contrast Dark Theme

## Goal

Keep the RUNO HRS dark navy, orange and teal visual identity while making text,
controls, tables and modal boundaries easier to distinguish.

## Implementation

- `src/css/high-contrast.css` is a final override layer shared by every module.
- Core design tokens use deeper navy surfaces and brighter foreground colors.
- Sidebar selection keeps the existing orange brand treatment with a solid,
  high-visibility active state.
- Inputs, dropdowns, tables, cards and dialogs use stronger borders and clearer
  surface separation.
- Keyboard focus uses a visible orange outline.
- Existing business logic and screen structure are unchanged.

## Maintenance

Adjust shared colors in the `:root` block before adding screen-specific values.
Keep new contrast rules in this file so feature styles remain modular and the
override order stays predictable.

## Verification

- Confirm the active sidebar item remains legible in white on orange.
- Check normal, hover and keyboard-focus states for controls.
- Review tables and modals at common desktop resolutions.
- Confirm status colors remain distinguishable from surrounding navy surfaces.
