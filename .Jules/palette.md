## 2023-10-27 - Input form validation accessibility
**Learning:** Proper form validation requires clear communication to assistive technologies. Using `aria-invalid` allows screen readers to announce when a field is in an error state. Coupling this with `aria-describedby` linking to the error message (which uses `role="alert"`) ensures the error is both discoverable when navigating to the field and announced immediately when it appears.
**Action:** When creating reusable input or form components that support error states, always include `aria-invalid={!!error}` and map `aria-describedby` to the error message element's `id`.

## 2026-08-26 - Tab navigation accessibility
**Learning:** For tabbed interfaces, it's crucial to implement WAI-ARIA roles correctly to let screen readers know they are navigating a tablist. A `<nav>` or container should have `role="tablist"`, buttons should have `role="tab"`, `aria-selected` reflecting state, `aria-controls` pointing to the panel ID, and `tabIndex` should be `0` for the active tab and `-1` for inactive tabs. The content area should be wrapped in a container with `role="tabpanel"`, `aria-labelledby` pointing to the active tab ID, and `tabIndex={0}`.
**Action:** When building custom tab components, always include the `tablist`, `tab`, and `tabpanel` roles and correctly wire `aria-controls` and `aria-labelledby` with matching IDs.
## 2023-11-04 - Icon-only buttons accessibility
**Learning:** Icon-only buttons without an explicit `aria-label` attribute cannot be identified by screen readers, rendering them inaccessible to visually impaired users. This was observed in `DashboardShell.tsx` for the mobile drawer toggle and sidebar collapse buttons.
**Action:** When implementing buttons that only contain icons (such as SVG elements), always include a descriptive `aria-label` attribute. If the component supports multiple languages (like Persian and English), ensure the `aria-label` dynamically reflects the active language.
