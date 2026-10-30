import { readFile } from 'node:fs/promises';
import { isAbsolute, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { imageMetadata } from 'astro/assets/utils';

const blogDirectory = fileURLToPath(new URL('../content/blog/', import.meta.url));
const nonRelativeSource = /^(?:[a-z][a-z\d+.-]*:|\/|#)/i;
const rasterFormats = new Set(['png', 'jpg', 'jpeg', 'webp', 'avif']);

function isBlogPath(path) {
  const fromBlog = relative(blogDirectory, path);
  return fromBlog !== '..' && !fromBlog.startsWith(`..${sep}`) && !isAbsolute(fromBlog);
}

function localImagePath(source, filePath) {
  if (typeof source !== 'string' || !source || nonRelativeSource.test(source)) return;
  try {
    const url = new URL(source, pathToFileURL(filePath));
    if (url.search || url.hash) return;
    const path = fileURLToPath(url);
    return isBlogPath(path) ? path : undefined;
  } catch {
    return;
  }
}

function textContent(node) {
  return node.type === 'text' ? node.value : (node.children ?? []).map(textContent).join('');
}

function contextLabel(value) {
  return typeof value === 'string'
    ? value.replace(/[\p{Extended_Pictographic}\uFE0E\uFE0F\u200D]/gu, '').replace(/\s+/g, ' ').trim()
    : '';
}

// Run before Astro's image pass: these properties become native getImage()
// options, so Astro emits optimized files and supplies width/height/srcset.
// Original Markdown, image filenames, prose and heading appearance stay intact.
export default function rehypeContentSeo() {
  return async function transform(tree, file) {
    if (!file.path || !isBlogPath(file.path)) return;
    let context = contextLabel(file.data.astro?.frontmatter?.title);
    const hierarchy = [{ original: 0, depth: 1 }];
    const images = [];

    function walk(node) {
      if (node.type === 'element') {
        const match = /^h([1-6])$/.exec(node.tagName);
        if (match) {
          const original = Number(match[1]);
          while (hierarchy.length > 1 && hierarchy.at(-1).original >= original) hierarchy.pop();
          const depth = Math.min(6, hierarchy.at(-1).depth + 1);
          hierarchy.push({ original, depth });
          node.properties ??= {};
          node.properties['data-content-heading-level'] = String(original);
          node.tagName = `h${depth}`;
          context = contextLabel(textContent(node)) || context;
        }

        if (node.tagName === 'img') {
          const properties = node.properties ??= {};
          if (typeof properties.alt === 'string' && /^alt text$/i.test(properties.alt.trim()) && context) {
            // Describe the image's existing editorial context, without claiming
            // to know who or what is pictured in an imported photograph.
            properties.alt = `Image accompanying: ${context}`;
          }
          properties.loading ??= 'lazy';
          properties.decoding ??= 'async';
          const path = localImagePath(properties.src, file.path);
          if (path) images.push({ properties, path });
        }
      }
      for (const child of node.children ?? []) walk(child);
    }

    walk(tree);
    await Promise.all(images.map(async ({ properties, path }) => {
      const metadata = await imageMetadata(await readFile(path), path);
      // Keep vector and animated formats on Astro's original handling path.
      if (!rasterFormats.has(metadata.format)) return;
      const width = Math.min(metadata.width, 1600);
      properties.width = width;
      properties.height = Math.max(1, Math.round(width * metadata.height / metadata.width));
      properties.format = 'webp';
      properties.quality = 85;
      properties.widths = [...new Set([400, 800, 1200, width].filter(size => size <= width))];
      properties.sizes = '(min-width: 820px) 772px, calc(100vw - 48px)';
    }));
  };
}
