# DUCA Website (duca-club.github.io)

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/small.svg)](https://astro.build)

The official website for **DUCA** (Deakin University Cybersecurity Association). Built with modern web standards, focusing on high-quality design aesthetics, accessibility, and smooth user interactions.

---

## Tech Stack

- **Framework**: [Astro 5.16+](https://astro.build/) (Static Site Generator)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS variables
- **Logic / Components**: [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/) (respecting user `prefers-reduced-motion` settings)
- **Quality Control**: [Prettier](https://prettier.io/) & [ESLint](https://eslint.org/) (configured with strict accessibility rule verification)

---

## Key Features

- **Interactive Events Hub**: Contains a dynamic, filterable monthly events calendar and full search/tag system for previous events.
- **Dynamic Team Grid**: Allows users to interactively switch between leadership teams and divisions for different years (e.g., 2025, 2026).
- **Accessibility (A11y) First**: Complies with WCAG guidelines by utilizing semantic HTML, skip navigation links, high-contrast outlines, screen-reader-only labels, and the Atkinson Hyperlegible font for improved readability.
- **Partner Tiers**: Displays categorized Gold, Silver, and Bronze sponsor listings alongside past collaborators.
- **Micro-interactions**: Incorporates aurora gradients, wobble card effects, spotlit grids, and terminal-styled text generation.

---

## Directory Structure

```text
src/
├── assets/          # Static assets, logos, and images
├── components/      # Reusable Astro & React components
│   ├── sections/    # Page-level sections (e.g., MeetTheTeamSection, FeaturedEventsSection)
│   └── ui/          # Low-level UI blocks (e.g., CardSpotlight, WobbleCard)
├── content/         # Markdown content collections
│   ├── blog/        # MDX files for blog posts
│   └── events/      # MDX files for events
├── data/            # Static data structures
│   ├── partners.ts  # List of partners, sponsors, and collaborators
│   └── team.ts      # Executives and divisions definition by year
├── layouts/         # Layout wraps (e.g., DefaultLayout.astro)
├── pages/           # Application page routes (index, join, meet-the-team, partners, contact)
├── styles/          # Global styles, variables, and typography definitions
└── utils/           # Helper functions and utilities (e.g., discord count fetching)
```

---

## Development Instructions

### Local Setup

Ensure you have [Node.js](https://nodejs.org/) installed, then clone the repository and run:

```bash
# Install dependencies
npm install

# Run the local development server (starts at localhost:4321)
npm run dev

# Perform static analysis (TypeScript & Astro types verification)
npm run check

# Build production distribution files (compiled to the ./dist/ folder)
npm run build

# Preview the built production site locally
npm run preview
```

---

## Content Management Guide

### Adding or Modifying Events

Events are stored as markdown files under `src/content/events/`. To add an event, create a file named `YYYY-MM-DD-your-event-slug.md` with the following structure:

```yaml
---
title: "Your Event Name"
description: "A short description of the event"
eventDate: 2026-07-17T17:00:00+10:00 # ISO format date
endDate: 2026-07-17T19:00:00+10:00   # ISO format end date
location: "Deakin Burwood Campus, Room LC2.105"
locationUrl: "https://maps.google.com/?q=Deakin+University+Burwood"
registrationUrl: "https://www.humanitix.com/au/your-event-link"
featuredImage: "/events/your-event-banner.png"
tags: ["Workshop", "Beginner"]
featured: true
slug: "your-event-slug-2026"
---

## Event Details

Markdown content explaining what the event is about goes here.
```

### Updating Team Members and Divisions

Modify [src/data/team.ts](file:///mnt/1A8E55ED8E55C1C5/ComputerFiles/Documents/Github/duca-club/duca-club.github.io/src/data/team.ts) to manage:
- The **executives** dictionary containing the core leadership team for each year.
- The **divisions** dictionary containing division details (Development, Capture The Flag, Presentation, Advertising, General Committee) and their respective team leads/members.

### Modifying Partners and Sponsors

Modify [src/data/partners.ts](file:///mnt/1A8E55ED8E55C1C5/ComputerFiles/Documents/Github/duca-club/duca-club.github.io/src/data/partners.ts) to manage the list of sponsors (Gold, Silver, Bronze), collaborators, and partner logos.

---

## Fun Easter Eggs

1. **Access Granted Flash**: Type `sudo` on any page to trigger an `ACCESS GRANTED` green hacking terminal flashing overlay.
2. **Retro Team Sunglasses**: Click anywhere in the hero section on the `/about` page 5 times to apply a retro neon filter to the executive profiles.
