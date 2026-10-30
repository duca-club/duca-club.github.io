# DUCA website

An Astro site based on the **DUCA with Dark MODE** Claude Design export. The exported layout, page copy, typography, colors, and Three.js/GSAP animations are preserved. Dark mode is the default; the theme switch saves each visitor's preference.

## Development

Use Node.js 24 (or a compatible Node.js version listed in `package.json`).

```sh
npm ci
npm run dev
```

The development site runs at `http://localhost:4321`.

```sh
npm run check
npm run build
npm run preview
```

The production build is a static site in `dist/`.

Discord membership numbers come from the original site's public invite API. The build requests the count once and embeds the same number in every page, with no browser requests on visits or navigation. Rebuild to refresh it. If the API is unavailable or returns an invalid count, the build uses the original fallback of 850 members.

## Source and content

- `src/pages/`: Astro routes and static blog article pages.
- `src/components/DesignSite.jsx`: the exported interface, converted to a server-rendered React component hydrated by Astro.
- `src/styles/design.css`: the exported design tokens and hover styles.
- `src/components/BlogArticle.tsx` and `src/styles/article.css`: the exported article styling applied to real Markdown posts.
- `src/content/blog/`: all 15 original posts and images, copied unchanged from the old website. Existing blog URLs are preserved.
- `src/content/events/`: the 13 archived events and new event listings. Upcoming details expand on the events page; past events show their title, date, and category. Dates and times display in Melbourne time.
- `src/data/team.ts`: the original 2025 and 2026 executive and division records. Biographies are available through portrait card tooltips and accessible labels.
- `public/`: local logos, portraits, partner images, About photographs, and licensed fonts.
- `claude-design/`: the original supplied design export and extracted reference.
- `old-site/`: the archived Astro website, retained for reference.

The five matching blog preview titles/descriptions retain the design export's editorial copy; the articles retain their original text. The export's sample article and duplicate committee placeholders are replaced with the actual imported records. Event listings use the Markdown collection, and the homepage highlights the next scheduled event.

Run `npm test` for the event scheduling, filtering, and Discord count caching checks. Edit an event's Markdown file to update its title, start time, location, or registration link. End times are shown only when supplied; events with no known end time move to history at the end of their Melbourne calendar date.

## Deployment

`Dockerfile` builds the new site and serves `dist/` with Nginx. `.dockerignore` excludes the old website and design archive from the build context. `Jenkinsfile` and `docker-compose.yml` retain the existing deployment setup.

```sh
docker build -t duca-site .
docker run --rm -p 8080:80 duca-site
```
