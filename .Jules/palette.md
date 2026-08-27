## 2023-10-27 - Input form validation accessibility
**Learning:** Proper form validation requires clear communication to assistive technologies. Using `aria-invalid` allows screen readers to announce when a field is in an error state. Coupling this with `aria-describedby` linking to the error message (which uses `role="alert"`) ensures the error is both discoverable when navigating to the field and announced immediately when it appears.
**Action:** When creating reusable input or form components that support error states, always include `aria-invalid={!!error}` and map `aria-describedby` to the error message element's `id`.

## 2026-08-26 - Tab navigation accessibility
**Learning:** For tabbed interfaces, it's crucial to implement WAI-ARIA roles correctly to let screen readers know they are navigating a tablist. A `<nav>` or container should have `role="tablist"`, buttons should have `role="tab"`, `aria-selected` reflecting state, `aria-controls` pointing to the panel ID, and `tabIndex` should be `0` for the active tab and `-1` for inactive tabs. The content area should be wrapped in a container with `role="tabpanel"`, `aria-labelledby` pointing to the active tab ID, and `tabIndex={0}`.
**Action:** When building custom tab components, always include the `tablist`, `tab`, and `tabpanel` roles and correctly wire `aria-controls` and `aria-labelledby` with matching IDs.
