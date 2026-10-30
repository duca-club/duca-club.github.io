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
- `src/data/`: editable staff profiles, yearly rosters, authors, partners, links, and repeated page content. See the editing guide below.
- `src/styles/team.css`: team cards and mobile grids, with two executive columns and three committee columns.
- `public/`: local logos, portraits, partner images, About photographs, and licensed fonts.
- `claude-design/`: the original supplied design export and extracted reference.
- `old-site/`: the archived Astro website, retained for reference.

The five matching blog preview titles/descriptions retain the design export's editorial copy; the articles retain their original text. The export's sample article and duplicate committee placeholders are replaced with the actual imported records. Event listings use the Markdown collection, and the homepage highlights the next scheduled event.

Blog covers are rendered above the article body. If the first Markdown image uses the same file as `featuredImage`, `src/lib/remark-blog-cover.mjs` omits that repeated body image during the build. Other photos, later uses of the cover, and the Markdown source remain intact.

Run `npm test` for the event scheduling, filtering, and Discord count caching checks. Edit an event's Markdown file to update its title, start time, location, or registration link. End times are shown only when supplied; events with no known end time move to history at the end of their Melbourne calendar date.

## Managing content

Edit the data files below; components read them directly. Rebuild and redeploy to publish changes. Blog posts and events retain their validated Markdown collections so their metadata and body stay together.

| Content | Edit here |
| --- | --- |
| Staff names, portraits, LinkedIn URLs, biographies | `src/data/people.ts` |
| Executive roles, committee assignments, division descriptions, years | `src/data/team.ts` |
| Blog author records and byline overrides | `src/data/authors.json` |
| Partners, sponsors, featured partner, logos and spotlight copy | `src/data/partners.ts` |
| Website address, email, logos, Discord invite, membership and social links | `src/data/site.json` |
| Page titles and descriptions, default author, locale and social image details | `src/data/metadata.ts` |
| Hero heading and footer social-link labels | `src/data/site.ts` |
| Navigation, statistics, ticker, galleries, club activities, values, CTF categories, membership benefits, join steps and FAQs | `src/data/site-content.ts` |
| Optional blog card titles, summaries, categories and display dates | `src/data/blog-previews.ts` |
| Blog text, publication date, tags, author ID and featured image | `src/content/blog/<post>/index.md` |
| Event dates, descriptions, categories, locations and registration links | `src/content/events/*.md` |

### Staff and committee years

Add or update a profile once in `people.ts`, using a stable ID such as `new-person`. Keep that ID when a person's name changes. Image paths refer to files in `public/`, for example `/team/new-person.png`.

Assign that person to a year in `team.ts` using their ID and role:

```ts
{ personId: 'new-person', role: 'Secretary' }
```

The same profile can appear in several years or divisions with different roles. Add a year to `teamRosters` to make it available in the selector; the newest configured year is selected automatically. Division names and descriptions are edited in `divisionDefinitions` in the same file.

### Authors

A staff author can inherit their name, portrait, biography, and LinkedIn URL from their profile:

```json
"new-person": { "personId": "new-person" }
```

The author record can override `name`, `image`, `bio`, or `link` for a separate byline, portrait, or author biography. Guest authors do not need a staff profile:

```json
"guest-writer": {
  "name": "Guest Writer",
  "image": "/authors/guest-writer.png",
  "bio": "Guest author biography.",
  "link": "https://example.com/"
}
```

Set the post's frontmatter to `author: guest-writer`. Unknown author or person IDs fail with an explanatory error during the build. `npm test` also checks staff references, local portraits, author inheritance, and guest authors.

### Repeated page content

Partner `group` values control placement: one `featured` partner, plus `sponsor` and `partner` records. The homepage tickers use the same list, so a logo or name only needs updating once.

Partner logos support an optional local `darkSrc` in `partners.ts`. Without a suitable alternate, `darkBacking: 'light'` keeps the original artwork readable on a light surface in dark mode. Logos retain their original colours. The shared logo component also handles the Partners page and its permanently dark spotlight panel.

The downloaded dark-background alternatives are stored locally, unchanged from these sources:

| Local asset | Source |
| --- | --- |
| `public/partners/deakin-cyber-dark.svg` | [Deakin Cyber inverse logo](https://cybercentre.org.au/wp-content/uploads/sites/6/2026/04/cyber-logo-inverse.svg) |
| `public/partners/dusa-dark.png` | [DUSA white-circle logo](https://dusa-website-app-bucket.s3-ap-southeast-2.amazonaws.com/prod/DUSA_CircleLogo-White_w-Text.png), from [club resources](https://www.dusa.org.au/club-resources) |
| `public/partners/accenture-dark.svg` | [Accenture static footer logo](https://www.accenture.com/content/dam/accenture/final/accenture-com/imagery-fy27/q1/Footer-Static-Desktop.svg) |

Deakin Cyber and Accenture use their current published lockups for dark mode; the original light-mode files are retained.

The Discord member statistic and `{memberCount}` placeholders use the count fetched once per build. The events/workshop statistics and Discord channel preview statuses are editable editorial figures in `site-content.ts`; they are not live API data. Blog card overrides are optional and keyed by post slug. Omit a field to use the Markdown metadata, including `publishDate` when no display `date` is supplied.

Page metadata uses the old site's full DUCA description and `DUCA Team` author default. Each main page has its own title and description in `metadata.ts`. Blog previews use the post's real cover, author, publication date, and tags. Canonical and social URLs use the production site address without query parameters. The 404 page is marked `noindex`.

`public/social-preview-image.png` now contains the DUCA logo, replacing the old Astro starter artwork while retaining the preview URL. Default social cards use the square logo; blog cards use their cover image. Update the default image dimensions and alt text in `metadata.ts` when replacing that file. Open Graph fields follow the [protocol reference](https://ogp.me/); indexing directives follow [Google's robots meta reference](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag).

## Search discovery and image performance

- `/sitemap.xml` includes the main pages, all published blog posts, and canonical blog archive pages. `/robots.txt` allows crawling and advertises the sitemap. Redirect aliases and the 404 page are excluded; modification dates are omitted when no reliable source exists.
- Blog pagination uses real links and static `/blog/page/2/` pages onward. The first page stays at `/blog/`; links return to the post list. Search and category filters keep their interactive pagination. Change the list size in `src/lib/blog-pagination.ts`.
- Legacy event URLs redirect to the corresponding row on `/events/`; `/contact/` redirects to `/join/#contact`. Old six-post blog archive URLs redirect to the matching current archive. Individual event detail pages remain removed.
- `src/lib/structured-data.ts` describes the club, website, pages, blog authors, publication dates, cover images, and breadcrumbs as JSON-LD. It uses existing site/content data and omits structured data on noindex pages.
- Team portraits are generated as responsive 320px/600px WebP files by `src/lib/team-images.ts`. Original editable paths and source files remain intact; the browser receives only optimized URLs and dimensions. Below-the-fold portraits load lazily.
- Blog cards, covers, and body photos use responsive WebP files. `src/lib/rehype-content-seo.mjs` limits body photos to 1600px, adds intrinsic dimensions and lazy loading, replaces placeholder alt text with the existing editorial context, and normalizes heading hierarchy. Existing headings retain their visual styles and fragment IDs. The article cover loads eagerly; original Markdown and images remain intact.
- Upcoming event details and join-page answers are included in the initial HTML, with the existing controls revealing them. The Three.js hero, its content, and its animation code are unchanged.

These changes follow Google's guidance on [crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable), [pagination](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading), and [images](https://developers.google.com/search/docs/appearance/google-images). Deployment continues to use the same Jenkins pipeline, Docker names, directory, and network.

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
