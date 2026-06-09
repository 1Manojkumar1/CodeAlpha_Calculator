# Calculator

A dark-themed, glassmorphism calculator built with React, Vite, and Tailwind CSS v4, featuring interactive bento-grid styled buttons with particle effects and cursor-driven border glow.

Built with the **MagicBento** component from [React Bits](https://reactbits.dev/) for particle, spotlight, and card styling.

## Features

- **Bento-grid layout** — buttons arranged in a responsive 4-column grid with span support
- **Interactive border glow** — both the calculator card and each button have a dynamic purple border glow that follows the cursor
- **Particle effects** — floating star particles animate on the card background (always visible) and on each button (on hover), responding to mouse movement
- **Click ripple** — subtle GSAP-driven ripple on every button and the main card
- **Global spotlight** — a soft radial gradient spotlight follows the cursor across the page background
- **Keyboard support** — type numbers, operators, Enter for `=`, Backspace, and Escape for `C`
- **Calculation logic** — supports `+`, `-`, `×`, `÷`, decimal input, operator chaining, divide-by-zero handling, 8-decimal precision
- **Dark theme** — deep gray-to-black background with purple (`rgb(132, 0, 255)`) accent
- **Responsive** — adjusts font sizes and button heights across mobile, tablet, and desktop
- **Fade-in animation** — calculator card animates in on load

## Tech Stack

| Tool | Version |
|---|---|
| [React](https://react.dev/) | 19.x |
| [Vite](https://vite.dev/) | 8.x |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x |
| [GSAP](https://gsap.com/) | 3.15 |
| [React Bits / MagicBento](https://reactbits.dev/) | — |

## Getting Started

### Prerequisites

- Node.js >= 18
- npm (or pnpm / yarn)

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
calculator/
├── index.html
├── vite.config.js              # Vite + React + Tailwind plugin
├── package.json
├── eslint.config.js
├── src/
│   ├── main.jsx                # Entry point
│   ├── App.jsx                 # Root component with GlobalSpotlight
│   ├── index.css               # Tailwind import + fadeIn keyframe
│   └── components/
│       ├── Calculator.jsx      # Main calculator logic + layout
│       ├── Display.jsx         # Expression and result display
│       └── MagicBento.jsx      # React Bits MagicBento (ParticleCard, GlobalSpotlight)
```

## Key Implementation Details

### Calculation Engine

The `calculate` function (`Calculator.jsx:10`) sanitizes the expression by replacing display characters (`×` → `*`, `÷` → `/`), then evaluates using a strict `Function` constructor. Results are rounded to 8 decimal places. Division by zero returns `"Error"`.

### Operator Handling

- Consecutive operators replace the last one
- After evaluation (`=`), starting a digit clears the result; starting an operator chains onto the result
- Decimal input checks the current operand to prevent multiple dots
- Leading zero is replaced by subsequent digits

### Border Glow (`card--border-glow` / `btn--border-glow`)

Each element tracks `--glow-x`, `--glow-y`, and `--glow-intensity` CSS custom properties. A `::after` pseudo-element with a `radial-gradient` creates the glowing edge using `mask-composite: exclude`. The card retains a perpetual low-intensity glow (`--glow-intensity: 0.25`) that intensifies to `1.0` on cursor proximity, while buttons start at `0` and activate on hover.

### ParticleCard (MagicBento)

Every interactive element is wrapped in a `ParticleCard` which provides:
- Floating star particles animated with GSAP
- Click ripple effect
- Optional tilt and magnetism (disabled for calculator use)
- `keepParticles` prop (new) — when set, particles remain visible at all times rather than only on hover

The main calculator card uses `keepParticles` for persistent background particles; buttons keep the default hover-only behavior.

### GlobalSpotlight

Rendered in `App.jsx`, the spotlight creates a soft radial gradient that follows the cursor across the page background, anchored to a grid reference element.

## Customization

### Glow Color

Edit the `GLOW_COLOR` constant in `Calculator.jsx:6`:

```js
const GLOW_COLOR = '132, 0, 255';  // RGB values only
```

Update the same value in `App.jsx:17`:

```js
glowColor="132, 0, 255"
```

### Particle Count

Adjust `particleCount` on each `ParticleCard`:
- Main card: `particleCount={12}` (`Calculator.jsx:217`)
- Buttons: `particleCount={8}` (`Calculator.jsx:231`)

### Card Style

Modify the `className` and `style` props on the main `ParticleCard` in `Calculator.jsx:207-212`.
