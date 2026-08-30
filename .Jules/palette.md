## 2026-08-26 - Tab navigation accessibility
**Learning:** For tabbed interfaces, it's crucial to implement WAI-ARIA roles correctly to let screen readers know they are navigating a tablist. A `<nav>` or container should have `role="tablist"`, buttons should have `role="tab"`, `aria-selected` reflecting state, `aria-controls` pointing to the panel ID, and `tabIndex` should be `0` for the active tab and `-1` for inactive tabs. The content area should be wrapped in a container with `role="tabpanel"`, `aria-labelledby` pointing to the active tab ID, and `tabIndex={0}`.
**Action:** When building custom tab components, always include the `tablist`, `tab`, and `tabpanel` roles and correctly wire `aria-controls` and `aria-labelledby` with matching IDs.

## 2024-05-24 - Form Input Accessibility with Error States
**Learning:** Components with error states (like custom Inputs) must explicitly map screen reader expectations. Using `aria-invalid="true"` informs the user an error occurred, while `aria-describedby` linked to the error element's ID (with `role="alert"`) ensures the error text is announced when the input receives focus.
**Action:** Always ensure that any reusable form control with inline validation visually displays the error and programmatically links it to the input control using ARIA attributes (like `aria-invalid={!!error}`, `aria-describedby`, and `role="alert"`).

## 2023-11-04 - Icon-only buttons accessibility
**Learning:** Icon-only buttons without an explicit `aria-label` attribute cannot be identified by screen readers, rendering them inaccessible to visually impaired users. This was observed in `DashboardShell.tsx` for the mobile drawer toggle and sidebar collapse buttons.
**Action:** When implementing buttons that only contain icons (such as SVG elements), always include a descriptive `aria-label` attribute. If the component supports multiple languages (like Persian and English), ensure the `aria-label` dynamically reflects the active language.