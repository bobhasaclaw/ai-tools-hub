# Canonical UI Spec (v1)

Applies to: `index.html`, `reviews.html`, `about.html`, `compare.html`, `quiz.html`, and article pages in `articles/*.html`.

Source of truth: `styles/design-system.css`.

## 1) Tokens

- **Container**
  - `--ui-max-width: 1200px`
  - `--ui-max-width-reading: 820px`
  - `--ui-gutter: clamp(16px, 2.2vw, 28px)`
- **Spacing scale**
  - `--ui-space-1..12` (`0.25rem` to `3rem`)
- **Radii**
  - `--ui-radius-sm: 10px`
  - `--ui-radius-md: 14px`
  - `--ui-radius-lg: 18px`
- **Elevation & border**
  - `--ui-card-border: rgba(99, 102, 241, 0.24)`
  - `--ui-card-shadow: 0 10px 26px rgba(2, 8, 23, 0.32)`
  - `--ui-card-shadow-hover: 0 16px 36px rgba(2, 8, 23, 0.44)`
- **Text (AA-oriented)**
  - `--ui-text-strong`, `--ui-text-soft`, `--ui-text-muted`
- **Focus**
  - `--ui-focus: #8b9dff`

## 2) Spacing + Width Rules

- Shared page container on all key templates:
  - `.container, nav .container, .nav__container, .footer__container`
- Reading width for long-form article content:
  - `article .container { max-width: var(--ui-max-width-reading); }`
- Section rhythm:
  - `section` vertical spacing is standardized via `clamp(...)`

## 3) Components

- **Nav**
  - Sticky at top
  - Backdrop blur
  - Consistent border and link spacing
  - Dropdown behavior standardized (`.nav-item-dropdown`, `.dropdown-menu`)

- **Buttons**
  - Unified radius, weight, min height
  - Consistent hover motion and focus-visible ring

- **Cards**
  - Unified border, shadow, radius, hover lift
  - Applies to `.card`, `.article-card`, `.tool-card`, `.related-card`, CTA and pros/cons blocks

- **Footer**
  - Shared top margin, top padding, border
  - Shared link layout with wrapping

## 4) Article Template Rules

- Uniform bottom rhythm for:
  - `.tool-header`, `.article-hero`, `.pros-cons`, `.share-buttons`, `.cta-box`, `.author-bio`, `.related-articles`
- Round social/share buttons
- Responsive single-column pros/cons on mobile

## 5) Accessibility Guardrails

- AA-oriented text token defaults for dark/light
- Global `:focus-visible` ring applied to interactive elements
- Typography line-height targets for readability

