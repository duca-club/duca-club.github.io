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
- `src/components/SiteHeader.jsx` and `src/styles/navigation.css`: the responsive header and animated mobile navigation drawer.
- UI icons use `lucide-react` SVG components. `src/lib/rehype-content-icons.mjs` converts the original posts' decorative emoji to SVG icons at build time without changing their Markdown source.
- `src/styles/design.css`: the exported design tokens and hover styles.
- `src/components/BlogArticle.tsx` and `src/styles/article.css`: the exported article styling applied to real Markdown posts.
- `src/content/blog/`: all 15 original posts and images, copied unchanged from the old website. Existing blog URLs are preserved.
- `src/content/events/`: the 13 archived events and new event listings. Upcoming details expand on the events page; past events show their title, date, and category. Dates and times display in Melbourne time.
- `src/data/team.ts`: the original 2025 and 2026 executive and division records. Biographies are available through portrait card tooltips and accessible labels.
- `src/styles/team.css`: team cards and mobile grids, with two executive columns and three committee columns.
- `public/`: local logos, portraits, partner images, About photographs, and licensed fonts.
- `claude-design/`: the original supplied design export and extracted reference.
- `old-site/`: the archived Astro website, retained for reference.

The five matching blog preview titles/descriptions retain the design export's editorial copy; the articles retain their original text. The export's sample article and duplicate committee placeholders are replaced with the actual imported records. Event listings use the Markdown collection, and the homepage highlights the next scheduled event.

Run `npm test` for the event scheduling, filtering, and Discord count caching checks. Edit an event's Markdown file to update its title, start time, location, or registration link. End times are shown only when supplied; events with no known end time move to history at the end of their Melbourne calendar date.

## Deployment

The existing Jenkins job can continue using the root `Jenkinsfile`. It builds the Astro site in Docker, extracts `/app/dist/` into `.deploy-dist/`, checks that `index.html` exists, copies the files to `/srv/hirusha-duca-site`, and runs `docker compose up -d --remove-orphans`.

The deployment names and server paths match the original site:

| Setting | Value |
| --- | --- |
| Builder image | `hirusha-duca-site-builder:latest` |
| Web image | `nginx:alpine` |
| Compose project, service, and container | `hirusha-duca-site` |
| Server directory | `/srv/hirusha-duca-site` |
| Read-only container mount | `/usr/share/nginx/html` |
| Existing Docker network | `intranet_1` |
| Container port | `80` |

`Dockerfile` uses Node.js 24 to build the static site. The existing Nginx container serves the generated HTML, JavaScript, CSS, and local images; no Node.js process runs on the server. The current reverse proxy and Jenkins server configuration can stay as they are.

`.dockerignore` excludes local dependencies, generated files, previous `.deploy-dist/` output, the old website, and the design archive. `.deploy-dist/` is also ignored by Git. Jenkins removes its temporary extraction container even if copying the files fails.
