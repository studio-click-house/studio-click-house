---
name: Studio Click House
description: Premium post-production visual design system
colors:
  brand-green: "#7ea641"
  brand-dark: "#20211f"
  brand-light: "#f7f7f2"
  brand-paper: "#eeeee7"
  brand-mist: "#d9ddd6"
  brand-coral: "#d45d43"
  brand-acid: "#c9ff5a"
typography:
  display:
    fontFamily: "DM Serif Display, ui-serif, Georgia, serif"
    fontSize: "clamp(3rem, 7vw, 7.5rem)"
    fontWeight: 400
    lineHeight: 0.91
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Switzer, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  mono:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.68rem"
    fontWeight: 500
    letterSpacing: "0.2em"
rounded:
  none: "0px"
  sm: "4px"
  md: "8px"
spacing:
  shell: "min(100% - 2rem, 90rem)"
  space-y: "clamp(4rem, 7vw, 7rem)"
---

# Design System: Studio Click House

## Overview

**Creative North Star: "The Editorial Darkroom"**

Studio Click House is designed as a refined, high-end editorial gallery for photography and video post-production. The interface recedes to allow the media assets to stand at the forefront. A fine grain overlay runs across the viewport, giving the digital workspace a tactile, analogue film-strip quality. 

**Key Characteristics:**
- High typographic contrast (elegant serifs paired with technical monospace labels and Swiss sans-serif body text).
- Asymmetric layouts resembling luxury editorial lookbooks.
- Seamless scrollytelling transitions powered by GSAP and Lenis.
- Sophisticated, organic brand green (`#7ea641`) and rich dark elements (`#20211f`) set against warm paper white (`#f7f7f2`).

## Colors

The color palette is derived from classic darkrooms and photographic paper, balancing clinical precision with warm editorial organic tones.

### Primary
- **Brand Green** (`#7ea641`): Used for key brand signifiers, accent markers, and active interactive highlights. 10% maximum usage rule.

### Secondary
- **Brand Dark** (`#20211f`): Used for primary text and high-contrast dark sections.
- **Brand Light** (`#f7f7f2`): The main background color, representing warm paper stocks.

### Neutral
- **Brand Paper** (`#eeeee7`): Used for cards, containers, and table backgrounds.
- **Brand Mist** (`#d9ddd6`): Subtle borders, dividers, and secondary details.

### Accent
- **Brand Coral** (`#d45d43`): Used very rarely for warning states or micro-indicators.
- **Brand Acid** (`#c9ff5a`): A high-visibility green-yellow for highlighting active, technical interactive states.

## Typography

**Display Font:** DM Serif Display
**Body Font:** Switzer
**Label/Mono Font:** IBM Plex Mono

### Hierarchy
- **Display** (400, `clamp(3rem, 7vw, 7.5rem)`, 0.91): Large editorial headlines.
- **Headline** (400, `clamp(2rem, 5vw, 4rem)`, 1.0): Section headers.
- **Title** (600, `1.25rem`, 1.3): Cards, list items, and minor headers.
- **Body** (400, `1rem`, 1.5): Standard paragraphs, max line length 65ch.
- **Label** (500, `0.68rem`, `0.2em`, uppercase): Eyebrows, buttons, and system telemetry.

## Layout

- **Grid System**: 12-column asymmetric grids.
- **Spacing Rhythm**: Vertical sections use `.section-space` (`padding-block: clamp(4rem, 7vw, 7rem)`).
- **Shell**: Main content is constrained within `.site-shell` (`width: min(100% - 2rem, 90rem); margin-inline: auto`).

## Elevation & Depth

This system is flat-by-default, emphasizing raw paper layers. Depth is conveyed using solid borders (`1px solid var(--color-brand-mist)`), tonal contrast shifts (e.g., from `brand-light` background to `brand-paper` containers), and layered WebGL overlays rather than soft drop shadows.

## Shapes

- **Corner Strategy**: Strict corners. Containers and structural layout cards use flat angles (`rounded-none`).
- **Interactive Radius**: Small interactive elements (buttons, inputs) may use a subtle radius (`rounded-sm` or `rounded-md`) but prefer hard editorial crops.

## Components

### Buttons
- **Primary**: Solid background with hard-edged styling, monospace label, uppercase, and subtle arrow indicators. Hover shifts scale or border accent.
- **Ghost**: Raw text with `text-link` underline behavior, expanding gaps on hover.

### Cards / Containers
- **Background**: Solid `bg-brand-paper` or `bg-brand-dark` with no shadows.
- **Dividers**: Clean `border-t border-brand-mist/40` hair-thin lines.

## Do's and Don'ts

### Do:
- **Do** wrap all pages in the grain preloader shell.
- **Do** use responsive fonts clamped between viewport extremes.
- **Do** clean up all GSAP timelines and Three.js objects on component unmount.

### Don't:
- **Don't** use standard box shadows or soft blurred glow filters.
- **Don't** use generic Tailwind blue/red colors; stick strictly to the calibrated theme tokens.
- **Don't** separate pricing tables from the main narrative page flow.
