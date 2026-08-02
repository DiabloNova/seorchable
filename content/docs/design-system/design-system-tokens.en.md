---
title: "Design System & Tokens"
description: "Enterprise design language, branding guide, colors, typography, glassmorphism, and UI rules."
category: "design-system"
lastUpdated: "2026-08-02"
author: "Design Lead"
keywords: "design, ui, ux, theme, colors, glassmorphism, branding"
---

# Seorchable Enterprise Design System

The visual identity of Seorchable is styled to convey deep tech intelligence, developer accessibility, and enterprise reliability.

## Color Tokens

We utilize CSS custom variables defining our core gradients:

- **Sky Blue**: `--sky-blue-500` (`#38bdf8`)
- **Orange**: `--orange-500` (`#f97316`)
- **Glass Panel CSS**:
  ```css
  .glass-panel {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(12px);
  }
  ```

## Typography

- LTR font: Robust Sans-serif (Inter/Geist) combined with a premium monospace for code blocks.
- RTL font: Persian Vazirmatn / IRANSans / Estedad font, delivering extreme mathematical readability and alignment.
