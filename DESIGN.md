# SEAPEDIA Design System — Oceanic Commerce

> **Source:** Extracted from Stitch MCP project "SEAPEDIA Multi-Role Marketplace UI/UX"
> **Design System Name:** Oceanic Commerce
> **Color Mode:** Light
> **Font Family:** Inter
> **Border Radius Base:** 8px (Round Eight)

---

## Brand & Style

The design system is built on a **Corporate Modern** foundation with a distinct maritime-inspired vibrancy. It aims to evoke a sense of vast opportunity and deep reliability, essential for a multi-role marketplace. The personality is efficient yet approachable — professional enough for B2B transactions while remaining energetic and friendly for everyday consumers.

The visual style prioritizes high clarity and structural integrity. It uses ample white space and subtle depth to organize complex information hierarchies. This ensures that whether a user is an Admin managing logistics or a Buyer browsing products, the interface feels predictable, scalable, and trustworthy.

---

## Color Palette

### Brand Colors (Override)

| Role        | Hex       | Usage                                          |
|-------------|-----------|-------------------------------------------------|
| Primary     | `#0066ff` | Core actions, navigation, brand-heavy elements  |
| Secondary   | `#ff7043` | "Buy Now" buttons, flash sales, notifications   |
| Tertiary    | `#26a69a` | Supporting info, alternate roles (e.g. Driver)   |
| Neutral     | `#f8fafc` | Background, surfaces                            |

### Full Named Color Tokens

#### Primary

| Token                     | Hex       |
|---------------------------|-----------|
| `primary`                 | `#0050cb` |
| `on-primary`              | `#ffffff` |
| `primary-container`       | `#0066ff` |
| `on-primary-container`    | `#f8f7ff` |
| `inverse-primary`         | `#b3c5ff` |
| `primary-fixed`           | `#dae1ff` |
| `primary-fixed-dim`       | `#b3c5ff` |
| `on-primary-fixed`        | `#001849` |
| `on-primary-fixed-variant`| `#003fa4` |

#### Secondary

| Token                        | Hex       |
|------------------------------|-----------|
| `secondary`                  | `#ac3509` |
| `on-secondary`               | `#ffffff` |
| `secondary-container`        | `#fe6f42` |
| `on-secondary-container`     | `#631800` |
| `secondary-fixed`            | `#ffdbd0` |
| `secondary-fixed-dim`        | `#ffb59f` |
| `on-secondary-fixed`         | `#3a0a00` |
| `on-secondary-fixed-variant` | `#852300` |

#### Tertiary

| Token                        | Hex       |
|------------------------------|-----------|
| `tertiary`                   | `#00655d` |
| `on-tertiary`                | `#ffffff` |
| `tertiary-container`         | `#008076` |
| `on-tertiary-container`      | `#defff9` |
| `tertiary-fixed`             | `#84f5e8` |
| `tertiary-fixed-dim`         | `#66d9cc` |
| `on-tertiary-fixed`          | `#00201d` |
| `on-tertiary-fixed-variant`  | `#005049` |

#### Surface & Background

| Token                       | Hex       |
|-----------------------------|-----------|
| `background`                | `#f7f9fb` |
| `on-background`             | `#191c1e` |
| `surface`                   | `#f7f9fb` |
| `on-surface`                | `#191c1e` |
| `on-surface-variant`        | `#424656` |
| `surface-bright`            | `#f7f9fb` |
| `surface-dim`               | `#d8dadc` |
| `surface-tint`              | `#0054d6` |
| `surface-variant`           | `#e0e3e5` |
| `surface-container-lowest`  | `#ffffff` |
| `surface-container-low`     | `#f2f4f6` |
| `surface-container`         | `#eceef0` |
| `surface-container-high`    | `#e6e8ea` |
| `surface-container-highest` | `#e0e3e5` |
| `inverse-surface`           | `#2d3133` |
| `inverse-on-surface`        | `#eff1f3` |

#### Outline

| Token             | Hex       |
|-------------------|-----------|
| `outline`         | `#727687` |
| `outline-variant` | `#c2c6d8` |

#### Error

| Token                | Hex       |
|----------------------|-----------|
| `error`              | `#ba1a1a` |
| `on-error`           | `#ffffff` |
| `error-container`    | `#ffdad6` |
| `on-error-container` | `#93000a` |

### Color Usage Guidelines

- **Primary Blue** — Core actions, navigation links (active state), brand-heavy elements.
- **Coral Orange (Secondary)** — Reserved for "Buy Now" buttons, flash sales, and critical notifications. Use sparingly.
- **Teal (Tertiary)** — Supporting information or alternate roles (e.g., Driver features).
- **Neutrals (Surface tokens)** — Cool grays and off-whites define the background "sea," ensuring cards and inputs remain the focal point.

---

## Typography

**Font:** Inter (all roles — headlines, body, labels)

### Type Scale

| Token                | Size   | Weight | Line Height | Letter Spacing |
|----------------------|--------|--------|-------------|----------------|
| `display-lg`         | 48px   | 700    | 56px        | -0.02em        |
| `headline-lg`        | 32px   | 700    | 40px        | -0.01em        |
| `headline-lg-mobile` | 24px   | 700    | 32px        | —              |
| `headline-md`        | 20px   | 600    | 28px        | —              |
| `body-lg`            | 16px   | 400    | 24px        | —              |
| `body-md`            | 14px   | 400    | 20px        | —              |
| `label-md`           | 12px   | 600    | 16px        | 0.05em         |
| `label-sm`           | 11px   | 500    | 14px        | —              |

### Typography Guidelines

- **Headlines**: Use Semibold (600) and Bold (700) weights to anchor the eye. Large headlines on mobile are capped at 24px to prevent excessive wrapping.
- **Body Text**: Standardized at 14px for density and 16px for readability.
- **Labels**: Slight tracking (0.05em) and medium-to-semibold weight are used for metadata, status badges, and overlines to distinguish them from actionable body text.

---

## Spacing

**Grid base:** 8px (with 4px micro-adjustments)

| Token            | Value  |
|------------------|--------|
| `base`           | 4px    |
| `xs`             | 4px    |
| `sm`             | 8px    |
| `md`             | 16px   |
| `lg`             | 24px   |
| `xl`             | 32px   |
| `gutter`         | 16px   |
| `margin-mobile`  | 16px   |
| `margin-desktop` | 48px   |

### Layout Guidelines

- **Desktop:** 12-column fluid grid with 24px gutters.
- **Mobile:** 4-column grid with 16px margins.
- **Vertical Rhythm:** Components separated by `md` (16px) or `lg` (24px) spacing.
- **Containment:** Use `md` (16px) padding inside cards and modals.

---

## Border Radius (Shapes)

| Token     | Value     |
|-----------|-----------|
| `sm`      | 0.25rem   |
| `DEFAULT` | 0.5rem    |
| `md`      | 0.75rem   |
| `lg`      | 1rem      |
| `xl`      | 1.5rem    |
| `full`    | 9999px    |

### Shape Guidelines

- **Standard Elements**: 8px (`rounded-md`) for buttons and input fields.
- **Large Containers**: 16px (`rounded-lg`) for product cards and store banners.
- **Badges/Chips**: Fully rounded (pill-shaped) to distinguish them as non-button status indicators.

---

## Elevation & Depth

The system uses **Tonal Layers** combined with **Ambient Shadows**:

| Level | Usage              | Background | Border            | Shadow                                  |
|-------|--------------------|------------|-------------------|-----------------------------------------|
| 0     | Floor / Background | `#f7f9fb`  | —                 | None                                    |
| 1     | Cards / Surface    | `#ffffff`  | 1px `#e0e3e5`     | `0 1px 4px rgba(0,0,0,0.04)`           |
| 2     | Hover / Active     | `#ffffff`  | 1px `#c2c6d8`     | `0 2px 8px rgba(0,0,0,0.08)`           |
| 3     | Modals / Popovers  | `#ffffff`  | —                 | `0 4px 16px rgba(0,0,0,0.12)` + backdrop |

---

## Components

### Buttons

| Variant   | Background  | Text Color  | Usage                              |
|-----------|-------------|-------------|------------------------------------|
| Primary   | `#0066ff`   | `#ffffff`   | Core actions, high emphasis        |
| Secondary | `#ff7043`   | `#ffffff`   | "Add to Cart", "Buy"              |
| Danger    | transparent | `#ba1a1a`   | Ghost border for destructive acts  |
| Ghost     | transparent | `#0066ff`   | Less prominent actions             |

### Form Inputs

- **Default:** 1px gray border (`outline-variant`)
- **Focus:** 2px blue border (`primary`) with soft glow
- **Error:** 1px red border (`error`) with helper text
- **Labels:** Always above the input field. Use placeholder text for examples, not instructions.

### Badges & Status

- **Order Status:** Pill-shaped with low-opacity backgrounds (e.g., 10% green bg + solid green text).
- **Role Badges:**
  - *Admin:* Deep Navy blue
  - *Seller:* Teal
  - *Buyer:* Light Blue
  - *Driver:* Amber/Orange

### Cards

- **Product Card:** Image at top (1:1 ratio) → Title (2 lines max) → Price (bold) → Location/Rating metadata
- **Store Card:** Horizontal layout — Store Logo (circle), Store Name, "Follow" button
- **Order Card:** Summary — "Order ID", "Total Price", Status Badge (top right)

---

## Tailwind Config Reference

Use these values to configure `tailwind.config.ts`:

```typescript
// tailwind.config.ts extend values
colors: {
  primary: "#0050cb",
  "primary-container": "#0066ff",
  "on-primary": "#ffffff",
  "on-primary-container": "#f8f7ff",
  secondary: "#ac3509",
  "secondary-container": "#fe6f42",
  "on-secondary": "#ffffff",
  tertiary: "#00655d",
  "tertiary-container": "#008076",
  "on-tertiary": "#ffffff",
  error: "#ba1a1a",
  "error-container": "#ffdad6",
  surface: "#f7f9fb",
  "on-surface": "#191c1e",
  "on-surface-variant": "#424656",
  "surface-container": "#eceef0",
  "surface-container-low": "#f2f4f6",
  "surface-container-lowest": "#ffffff",
  "surface-container-high": "#e6e8ea",
  "surface-container-highest": "#e0e3e5",
  outline: "#727687",
  "outline-variant": "#c2c6d8",
  "inverse-surface": "#2d3133",
  "inverse-on-surface": "#eff1f3",
  background: "#f7f9fb",
  "on-background": "#191c1e",
},
borderRadius: {
  DEFAULT: "0.5rem",
  lg: "1rem",
  xl: "1.5rem",
  full: "9999px",
},
spacing: {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  gutter: "16px",
  "margin-mobile": "16px",
  "margin-desktop": "48px",
},
fontSize: {
  "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
  "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "700" }],
  "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "700" }],
  "headline-md": ["20px", { lineHeight: "28px", fontWeight: "600" }],
  "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
  "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
  "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
  "label-sm": ["11px", { lineHeight: "14px", fontWeight: "500" }],
},
```

---

> **Note:** This document is the authoritative design reference for all SEAPEDIA UI development. Consult this file before any redesign or new component creation.
