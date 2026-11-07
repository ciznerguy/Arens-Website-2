---
name: EduVibrant Modern Hebrew
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2151da'
  primary: '#0037b0'
  on-primary: '#ffffff'
  primary-container: '#1d4ed8'
  on-primary-container: '#cad3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#004f35'
  on-tertiary: '#ffffff'
  tertiary-container: '#006a48'
  on-tertiary-container: '#60eeb1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b5'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-hero:
    fontFamily: Rubik
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 58px
  display-hero-mobile:
    fontFamily: Rubik
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
  headline-xl:
    fontFamily: Rubik
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-xl-mobile:
    fontFamily: Rubik
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
  headline-lg:
    fontFamily: Rubik
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Rubik
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  headline-sm:
    fontFamily: Rubik
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Rubik
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Rubik
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Rubik
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Rubik
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Rubik
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  label-sm:
    fontFamily: Rubik
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  margin-lg: 4rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system channels the energetic, tactile, and highly engaging spirit of progressive public spaces and cultural institutions, adapted for an innovative 6-year high school community ('משה ארנס - מצמיח אדם וחברה'). The brand personality blends optimism, academic vitality, human-centric collaboration, and youth agency.

### Visual Style & Tone
- **Dynamic Tactile Modularism:** Bold, chunky card structures with generous radii (`rounded-2xl` to `rounded-3xl`), saturated primary color blocks, crisp contrast levels, and interactive pill-shaped elements.
- **RTL-Native Ergonomics:** Built ground-up for Hebrew typography, prioritizing natural eye sweep, rhythmic hierarchy, and comfortable reading across multifaceted student/parent/staff cohorts.
- **Atmosphere:** Warm, welcoming, forward-looking, and active. It replaces institutional austerity with the playful clarity of an exploratory learning museum.

## Colors

The color palette directly adopts the warm-bright contrast visible in modern experiential learning hubs:

- **Primary (`#1d4ed8` - Royal Cobalt Blue):** Anchors hero cards, essential action banners, section headers, and prominent badges.
- **Secondary (`#f59e0b` - Golden Amber):** High-energy accent used for prominent call-to-action buttons, key deadlines, active state indicators, and notice callouts. Complemented by `#f97316` (Vibrant Coral Orange) for high-urgency notifications and festive cards.
- **Tertiary (`#10b981` - Fresh Emerald):** Symbolic of growth and community impact; used for project highlights, ecological initiatives, and positive status feedback.
- **Canvas & Surfaces:**
  - Base canvas: `#f8fafc` (Ultra-light Slate) and `#eff6ff` (Soft Sky Tint).
  - Surface cards: Pure `#ffffff` with subtle borders or tonal color fills (e.g., `#dbeafe`, `#fef3c7`, `#ecfdf5`).
- **Typography & Neutral (`#0f172a` - Ink Navy):** Deep, crisp contrast ensuring accessible legibility on light and colored surfaces.

## Typography

The typography system relies on **Rubik** for both Hebrew and Latin glyphs. Its geometric curves, rounded terminals, and clear baseline render natural warmth and high legibility across screens of any density.

### Typography Hierarchy & Usage
- **Display & Section Headers:** Set in bold/black weights (`700`/`800`) with tight line spacing to create impactful punchy editorial statements reminiscent of educational pavilions.
- **RTL Considerations:** Hebrew displays with balanced open counters; ensure optical alignment for numbers and bi-directional strings (e.g., date ranges, school track codes like י"ב 3).
- **Body & Captions:** Ample line height (`1.5` to `1.6`) prevents line collisions in multi-line Hebrew script.

## Layout & Spacing

### Grid Philosophy
The layout is built around a **modular 12-column responsive fluid grid** with generous gutter spacing to allow modular cards to sit playfully side by side or stack vertically.

- **Desktop (>= 1024px):** 12 columns, `gutter: 1.5rem`, `margin: 4rem`. Modular layouts leverage 8/4 splits for showcase feeds or balanced 4/4/4 and 3/3/3/3 card grids.
- **Tablet (768px - 1023px):** 8 columns, `gutter: 1.25rem`, `margin: 2rem`. Cards auto-collapse into 2-column sets.
- **Mobile (< 768px):** 4 columns, `gutter: 1rem`, `margin: 1rem`. Full-width modular stacking with horizontal scroll-snap bays for event feeds and visual photo galleries.
- **RTL Structural Flow:** Flexbox and grid order map to `dir="rtl"`, aligning primary titles, event icons, and start anchors to the right edge.

## Elevation & Depth

Visual hierarchy emphasizes clean tonal surfaces and playful physical cards over heavy realistic shadows.

### Depth Mechanics
1. **Flat Base Layers:** High-contrast background tints (e.g., `#eff6ff`) separate wide thematic zones without drop shadows.
2. **Modular Floating Cards:** Cards use low-opacity ambient shadows: `box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)`.
3. **Hover & Interactive State:** Elevated cards translate vertically `-4px` with an expanded warm or neutral glow: `0 12px 28px -4px rgba(29, 78, 216, 0.12)`.
4. **Card Outlines:** Subtle, low-opacity strokes (`1px solid rgba(15, 23, 42, 0.08)`) frame white content blocks, preventing washout against pale sky backdrops.

## Shapes

The design system embraces high roundedness to express energy, friendliness, and approachability.

- **Cards & Visual Containers:** Standardize on `rounded-2xl` (1.25rem / 20px) to `rounded-3xl` (1.75rem / 28px) for large banners and featured highlight cards.
- **Buttons & Tags:** Fully pill-shaped (`rounded-full` / 9999px) for buttons, badges, time-stamps, and navigation pills.
- **Media Thumbnails:** Nested image blocks within cards match internal radii cleanly (`rounded-xl` to `rounded-2xl`) with tight 4px to 8px padding gaps.

## Components

### Buttons
- **Primary CTA:** Saturated Golden Amber (`#f59e0b`) or Royal Blue (`#1d4ed8`) pill with bold ink text, clear inner padding (`px-6 py-3`), and an inline chevron pointing left (RTL direction).
- **Secondary CTA:** Coral Orange (`#f97316`) or Sky Blue outlined pill with `border-2` and bold color text.
- **Interactive State:** Tactile spring scaling (`active:scale-95`).

### Event & Schedule Cards
- Horizontal card pattern featuring a divided layout: 
  - Right: Bold timestamp block with high-contrast label (e.g., `09:00 - 10:30`).
  - Center: Headline, age/grade tag, and short descriptive summary.
  - Left: Thumbnail visual preview with `rounded-xl`.
- Background: `#ffffff` with subtle border and `rounded-2xl`.

### Badges & Pill Tags
- Ultra-rounded tags (`px-3 py-1 text-xs font-bold rounded-full`).
- Thematic category colors:
  - Green Tint: Ecology & Community (`bg-emerald-100 text-emerald-800`).
  - Amber Tint: Dates & Urgent Alerts (`bg-amber-100 text-amber-800`).
  - Blue Tint: Academic & High School Tracks (`bg-blue-100 text-blue-800`).

### Interactive Modular Cards
- Image background cards with internal gradient overlay (`linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)`) and bottom-pinned bold white typography.
- Solid color announcement cards (Cobalt blue `#1d4ed8` with amber CTAs stacked vertically).

### Form Inputs & Search
- Inputs feature `rounded-full` or `rounded-2xl` shapes, heavy inner padding, light grey borders (`border-slate-200`), right-aligned Hebrew placeholder text, and high-visibility blue focus rings (`ring-2 ring-blue-500`).