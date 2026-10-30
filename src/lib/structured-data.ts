import { siteConfig, siteLinks } from '../data/site';
import { siteMetadata, type SocialImage } from '../data/metadata';

export interface BreadcrumbItem {
  name: string;
  url: string | URL;
}

export interface StructuredDataInput {
  canonical: string | URL;
  title: string;
  description: string;
  image?: SocialImage;
  article?: boolean;
  headline?: string;
  author?: string;
  authorUrl?: string | URL;
  publishedTime?: string;
  tags?: readonly string[];
  breadcrumbs?: readonly BreadcrumbItem[];
  noIndex?: boolean;
}

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
interface JsonObject {
  [key: string]: JsonValue;
}

export interface StructuredDataGraph {
  '@context': 'https://schema.org';
  '@graph': JsonObject[];
}

function canonicalUrl(value: string | URL, base: URL): string {
  const url = new URL(value, base);
  url.search = '';
  url.hash = '';
  return url.href;
}

function authorProfile(value?: string | URL): string | undefined {
  if (!value) return;
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' || url.protocol === 'http:') return url.href;
  } catch {
    // Authors may have a byline without a public profile.
  }
}

/** Describe the published content using the same data as its visible page. */
export function buildStructuredData(input: StructuredDataInput): StructuredDataGraph | null {
  if (input.noIndex) return null;

  const site = new URL(siteConfig.url);
  const siteUrl = canonicalUrl(site, site);
  const canonical = canonicalUrl(input.canonical, site);
  const organizationId = `${siteUrl}#organization`;
  const websiteId = `${siteUrl}#website`;
  const pageId = `${canonical}#webpage`;
  const imageId = `${canonical}#primaryimage`;
  const articleId = `${canonical}#article`;
  const breadcrumbId = `${canonical}#breadcrumb`;
  const headline = input.headline ?? input.title;
  const graph: JsonObject[] = [
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: siteConfig.fullName,
      alternateName: siteConfig.name,
      url: siteUrl,
      description: siteConfig.description,
      email: siteConfig.email,
      logo: {
        '@type': 'ImageObject',
        '@id': `${siteUrl}#logo`,
        url: new URL(siteConfig.logos.mark, site).href,
      },
      sameAs: [siteLinks.github, siteLinks.discord, siteLinks.membership],
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: siteUrl,
      name: siteConfig.name,
      alternateName: siteConfig.fullName,
      description: siteConfig.description,
      publisher: { '@id': organizationId },
      inLanguage: 'en-AU',
    },
  ];

  const page: JsonObject = {
    '@type': 'WebPage',
    '@id': pageId,
    url: canonical,
    name: input.title,
    description: input.description,
    isPartOf: { '@id': websiteId },
    inLanguage: 'en-AU',
  };

  if (input.image) {
    const image: JsonObject = {
      '@type': 'ImageObject',
      '@id': imageId,
      url: new URL(input.image.src, site).href,
      contentUrl: new URL(input.image.src, site).href,
      caption: input.image.alt,
    };
    if (input.image.width) image.width = input.image.width;
    if (input.image.height) image.height = input.image.height;
    if (input.image.type) image.encodingFormat = input.image.type;
    graph.push(image);
    page.primaryImageOfPage = { '@id': imageId };
  }

  // A typical reading path is more useful than turning arbitrary URL segments
  // into breadcrumb labels. Non-article routes provide their visible labels.
  const breadcrumbs = input.breadcrumbs ?? (input.article ? [
    { name: 'Home', url: siteUrl },
    { name: 'Blog', url: new URL('/blog/', site) },
    { name: headline, url: canonical },
  ] : []);
  if (breadcrumbs.length >= 2) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: canonicalUrl(item.url, site),
      })),
    });
    page.breadcrumb = { '@id': breadcrumbId };
  }

  if (input.article) {
    const article: JsonObject = {
      '@type': 'BlogPosting',
      '@id': articleId,
      url: canonical,
      headline,
      description: input.description,
      mainEntityOfPage: { '@id': pageId },
      isPartOf: { '@id': websiteId },
      publisher: { '@id': organizationId },
      inLanguage: 'en-AU',
    };
    if (input.image) article.image = { '@id': imageId };
    if (input.publishedTime) article.datePublished = input.publishedTime;
    if (input.author) {
      if (input.author === siteMetadata.author) {
        article.author = { '@id': organizationId };
      } else {
        const author: JsonObject = { '@type': 'Person', name: input.author };
        const profile = authorProfile(input.authorUrl);
        if (profile) author.url = profile;
        article.author = author;
      }
    }
    const tags = [...new Set((input.tags ?? []).map(tag => tag.trim()).filter(Boolean))];
    if (tags.length) article.keywords = tags;
    graph.push(article);
    page.mainEntity = { '@id': articleId };
  }

  graph.push(page);
  return { '@context': 'https://schema.org', '@graph': graph };
}

/** Keep page text inside its JSON-LD script, including a literal </script>. */
export function serializeStructuredData(data: StructuredDataGraph): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
