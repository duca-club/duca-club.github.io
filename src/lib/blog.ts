import { getCollection, type CollectionEntry } from 'astro:content';
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { posix } from 'node:path';
import type { SocialImage } from '../data/metadata';
import { getAuthor, type BlogAuthor } from '../data/authors';
export type { BlogAuthor } from '../data/authors';

const images = import.meta.glob<{ default: ImageMetadata }>(
  '../content/blog/**/*.{png,jpg,jpeg,webp,gif,avif,svg}',
  { eager: true },
);

function featuredImageKey(post: CollectionEntry<'blog'>): string | undefined {
  if (!post.data.featuredImage) return undefined;
  const filename = post.data.featuredImage.replace(/^\.\//, '');
  const folder = post.filePath?.replace(/^.*?src\/content\/blog\//, '').replace(/\/[^/]+$/, '')
    ?? post.data.slug;
  return posix.normalize(`../content/blog/${folder}/${filename}`);
}

// Register only the lead images for optimization. Markdown keeps its original
// source assets; cards and article headers share the same generated WebP.
const featuredImageKeys = new Set((await getCollection('blog')).map(featuredImageKey));
const optimizedImages = new Map<string, Omit<SocialImage, 'alt'> & { srcSet: string }>();
await Promise.all([...featuredImageKeys].map(async key => {
  if (!key) return;
  const source = images[key]?.default;
  if (!source) return;
  const optimized = await getImage({
    src: source,
    width: Math.min(1600, source.width),
    widths: [...new Set([400, 800, 1200, Math.min(1600, source.width)].filter(width => width <= source.width))],
    format: 'webp',
    quality: 85,
  });
  optimizedImages.set(key, {
    src: optimized.src,
    srcSet: optimized.srcSet.attribute,
    width: Number(optimized.attributes.width),
    height: Number(optimized.attributes.height),
    type: 'image/webp',
  });
}));

export interface BlogCard {
  title: string;
  blurb: string;
  date: string;
  isoDate: string;
  tag: string;
  tags: string[];
  slug: string;
  url: string;
  image?: string;
  imageSrcSet?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export interface BlogArticleData {
  title: string;
  description: string;
  date: string;
  isoDate: string;
  slug: string;
  tags: string[];
  image?: string;
  imageSrcSet?: string;
  imageWidth?: number;
  imageHeight?: number;
  author?: BlogAuthor;
}

export function formatPostDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Australia/Melbourne',
  }).format(date).toUpperCase();
}

export function getPostImage(post: CollectionEntry<'blog'>): string | undefined {
  const key = featuredImageKey(post);
  return key ? optimizedImages.get(key)?.src : undefined;
}

export function getPostSocialImage(post: CollectionEntry<'blog'>): SocialImage | undefined {
  const key = featuredImageKey(post);
  const image = key ? optimizedImages.get(key) : undefined;
  if (!image) return undefined;
  const { srcSet, ...socialImage } = image;
  return { ...socialImage, alt: `Cover image for ${post.data.title}` };
}

function postImageAttributes(post: CollectionEntry<'blog'>) {
  const key = featuredImageKey(post);
  const image = key ? optimizedImages.get(key) : undefined;
  return {
    image: image?.src,
    imageSrcSet: image?.srcSet,
    imageWidth: image?.width,
    imageHeight: image?.height,
  };
}

export async function getBlogPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());
}

export function toBlogCard(post: CollectionEntry<'blog'>): BlogCard {
  return {
    title: post.data.title,
    blurb: post.data.description,
    date: formatPostDate(post.data.publishDate),
    isoDate: post.data.publishDate.toISOString(),
    tag: (post.data.tags[0] ?? 'Field notes').toUpperCase(),
    tags: post.data.tags,
    slug: post.data.slug,
    url: `/blog/${post.data.slug}/`,
    ...postImageAttributes(post),
  };
}

export function toArticleData(post: CollectionEntry<'blog'>): BlogArticleData {
  return {
    title: post.data.title,
    description: post.data.description,
    date: formatPostDate(post.data.publishDate),
    isoDate: post.data.publishDate.toISOString(),
    slug: post.data.slug,
    tags: post.data.tags,
    ...postImageAttributes(post),
    author: getAuthor(post.data.author),
  };
}
