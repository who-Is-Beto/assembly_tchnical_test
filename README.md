# 📸 Pexels Showcase

Discover, favorite, and deep dive into Pexels imagery with an Unsplash-inspired experience built on Next.js 15, Tailwind CSS 4, and TypeScript.

<p align="center">
  <em>Light ↔ Dark theme toggle with smooth transitions, infinite scroll, favorites rail, and quick-look modal.</em>
</p>

## ✨ Feature Highlights

- **Daily spotlight** – curated “Top Photos Today” grid sourced from the Pexels curated endpoint.
- **Dynamic theme system** – persistent light/dark modes with animated toggle and CSS variable driven palettes.
- **Infinite photo feed** – server-rendered first page and client-side infinite scrolling via Pexels search API.
- **Quick-look modal** – high-res preview with rich metadata, download link, and favorite shortcut.
- **Favorites rail** – localStorage-backed carousel to revisit saved shots instantly.
- **Robust testing** – Jest + Testing Library coverage for all major components and API routes.

## 🧱 Tech Stack

| Layer | Details |
| --- | --- |
| Framework | Next.js 15 (App Router, Server Components) |
| Styling | Tailwind CSS 4 with custom CSS variables for theming |
| Language | TypeScript (strict, app + tests) |
| API | Pexels REST API (`search`, `curated`, `photos/:id`) |
| Testing | Jest 29 + @testing-library/react + @testing-library/user-event |

## 🗃️ Project Structure

```
src/
├─ app/
│  ├─ api/pexels/search/route.ts      # API route proxying Pexels search
│  ├─ page.tsx                        # Server page orchestrating initial fetch + sections
│  └─ layout.tsx                      # Global layout with ThemeProvider & fonts
├─ components/
│  ├─ hero.tsx                        # Hero banner + search form + theme toggle
│  ├─ feed/
│  │  ├─ photo-feed.tsx              # Client component managing feed state/infinite scroll
│  │  ├─ photo-card.tsx              # Individual photo tile
│  │  ├─ favorites-rail.tsx          # Locally stored favorites carousel
│  │  ├─ photo-modal.tsx             # Quick-look modal overlay
│  │  ├─ skeleton-card.tsx           # Loading skeleton placeholder
│  │  └─ constants.ts                # Shared identifiers (storage key, modal id)
│  ├─ theme/
│  │  ├─ theme-provider.tsx          # Context for theme persistence + toggling
│  │  └─ theme-toggle.tsx            # Animated toggle button
├─ services/
│  └─ pexels/index.ts                # Typed service layer for Pexels endpoints
├─ lib/
│  ├─ strings.ts                     # `titleCase` helper
│  └─ cn.ts                          # Utility className combiner
└─ components/__tests__/             # Jest+RTL specs for hero/feed components
```

## ⚙️ Environment Setup

1. **Install dependencies** (Node 18+ recommended):

   ```bash
   npm install
   ```

2. **Configure Pexels API key** (required for data fetching):

   ```bash
   cp .env.example .env.local
   # then edit .env.local and set PEXELS_API_KEY=your-key-here
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   ```

   Visit **http://localhost:3000** to explore the gallery. Use the hero search form to try new queries; scroll to load more results; toggle the theme via the top right switch.

## 🧪 Testing

Execute the full Jest suite (component + API route tests):

```bash
npm test -- --runInBand
```

This validates infinite scroll behavior, favorites interactions, modal actions, hero rendering, and API validation logic.

## 🧠 Core Concepts

- **Server-first data** – the main page fetches initial search results on the server for fast first paint, handing control to the client feed for pagination.
- **Composable design system** – CSS variables + Tailwind utility classes provide consistent theming across components.
- **Context-driven theming** – `ThemeProvider` syncs user preference to `localStorage` and `<html data-theme>` enabling instant, animated palette swaps.
- **API abstraction** – Pexels service centralizes fetch logic, query building, error handling, and typing for maintainable feature additions.

## 🚀 Deployment

The app is optimized for Vercel deployments: install dependencies, set `PEXELS_API_KEY` in project environment variables, and build with:

```bash
npm run build
```

Then deploy via `vercel`, GitHub integration, or your preferred provider.

## 🙌 Credits

- Photography by the amazing creators on [Pexels](https://www.pexels.com/)
- UI/UX inspiration from [Unsplash](https://unsplash.com/)
- Built with ❤️ using Next.js + Tailwind CSS + TypeScript

Enjoy exploring! 🌈
