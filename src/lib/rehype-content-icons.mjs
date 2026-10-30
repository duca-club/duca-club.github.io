import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  Cat,
  Eye,
  Gift,
  Heart,
  LockKeyhole,
  PartyPopper,
  Rocket,
  Smile,
  Sparkles,
  Star,
} from 'lucide-react';

// Replace the original posts' decorative glyphs at build time, leaving their
// Markdown source and wording intact. No client-side icon code is needed.
const icons = new Map([
  ['\u{1f512}', [LockKeyhole]],
  ['\u{1f90d}', [Heart, 'Love']],
  ['\u{1f92f}', [Sparkles, 'Mind blown']],
  ['\u{1f389}', [PartyPopper, 'Celebration']],
  ['\u{1f680}', [Rocket, 'Rocket']],
  ['\u{1f60e}', [Smile, 'Cool']],
  ['\u{1f381}', [Gift, 'Gift']],
  ['\u{1f31f}', [Star, 'Shining star']],
  ['\u{1f440}', [Eye, 'Eyes']],
  ['\u{1f408}', [Cat, 'Cat']],
  ['\u{1f609}', [Smile, 'Wink']],
]);

const markup = new Map([...icons].map(([glyph, [Icon, label]]) => [
  glyph,
  renderToStaticMarkup(createElement(Icon, {
    className: 'ui-icon content-icon',
    focusable: false,
    ...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true }),
  })),
]));

// Recognize URLs first so a literal URL containing a glyph is never rewritten.
const tokens = new RegExp(
  String.raw`(?:\b[a-z][a-z\d+.-]*:\/\/|mailto:|www\.)[^\s<>]+|([${[...icons.keys()].join('')}])[\uFE0E\uFE0F]?`,
  'giu',
);
const literalElements = new Set(['pre', 'code', 'script', 'style', 'textarea']);

function replaceText(node) {
  const children = [];
  let cursor = 0;

  for (const match of node.value.matchAll(tokens)) {
    if (!match[1]) continue;
    if (match.index > cursor) {
      children.push({ type: 'text', value: node.value.slice(cursor, match.index) });
    }
    children.push({ type: 'raw', value: markup.get(match[1]) });
    cursor = match.index + match[0].length;
  }

  if (!children.length) return [node];
  if (cursor < node.value.length) {
    children.push({ type: 'text', value: node.value.slice(cursor) });
  }
  return children;
}

export default function rehypeContentIcons() {
  return function transform(tree) {
    function walk(node) {
      if (node.type === 'element' && literalElements.has(node.tagName)) return;
      if (!Array.isArray(node.children)) return;

      node.children = node.children.flatMap(child => {
        if (child.type === 'text') return replaceText(child);
        walk(child);
        return [child];
      });
    }

    walk(tree);
  };
}
