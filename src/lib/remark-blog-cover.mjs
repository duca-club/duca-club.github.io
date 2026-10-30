import { existsSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const blogDirectory = fileURLToPath(new URL('../content/blog/', import.meta.url));
const nonRelativeSource = /^(?:[a-z][a-z\d+.-]*:|\/|#)/i;

function isBlogPath(path) {
  const fromBlog = relative(blogDirectory, path);
  return fromBlog !== '..' && !fromBlog.startsWith(`..${sep}`) && !isAbsolute(fromBlog);
}

function localImagePath(source, filePath) {
  if (typeof source !== 'string' || !source || nonRelativeSource.test(source)) return;
  try {
    const url = new URL(source, pathToFileURL(filePath));
    if (url.search || url.hash) return;
    return fileURLToPath(url);
  } catch {
    return;
  }
}

function firstImage(node, parents = []) {
  if (node.type === 'image' || node.type === 'imageReference') return { node, parents };
  // A raw HTML image may be the first visible image. Leave that content alone
  // rather than accidentally removing a later Markdown image.
  if (node.type === 'html' && /<(?:img|picture)\b/i.test(node.value)) return { node, parents };
  for (const child of node.children ?? []) {
    const found = firstImage(child, [...parents, node]);
    if (found) return found;
  }
}

// The article template already renders featuredImage above the Markdown body.
// Remove only a matching first body image, before Astro optimizes image URLs.
export default function remarkBlogCover() {
  return function transform(tree, file) {
    if (!file.path || !isBlogPath(file.path)) return;
    const source = file.data.astro?.frontmatter?.featuredImage;
    if (typeof source !== 'string' || !source || nonRelativeSource.test(source) || /[?#]/.test(source)) return;
    // Frontmatter is a filename (as used by getPostImage); Markdown image URLs
    // are decoded separately when comparing them to that file.
    const cover = resolve(dirname(file.path), source);
    if (!isBlogPath(cover) || !/\.(png|jpg|jpeg|webp|gif|avif|svg)$/.test(cover) || !existsSync(cover)) return;

    const first = firstImage(tree);
    if (!first || first.node.type === 'html') return;
    const image = first.node.type === 'imageReference'
      ? tree.children.find(node => node.type === 'definition' && node.identifier.toUpperCase() === first.node.identifier.toUpperCase())
      : first.node;
    if (localImagePath(image?.url, file.path) !== cover) return;

    let removed = first.node;
    for (const parent of first.parents.reverse()) {
      parent.children.splice(parent.children.indexOf(removed), 1);
      if (parent.type === 'root' || parent.children.some(node => node.type !== 'text' || node.value.trim())) break;
      removed = parent;
    }
  };
}
