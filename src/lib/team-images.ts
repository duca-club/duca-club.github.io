import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { people } from '../data/people';

export interface TeamImage {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  sizes: string;
}

export type TeamImages = Record<string, TeamImage>;

// Keep the editable profile paths and their original public files intact.
// Importing metadata lets Astro generate and cache derivatives at build time.
const sources = import.meta.glob<{ default: ImageMetadata }>(
  '../../public/team/*.{png,jpg,jpeg,webp,gif,avif,svg}',
  { eager: true },
);

const portraitSizes = '(max-width: 1063px) 50vw, 320px';
let teamImages: Promise<TeamImages> | undefined;

async function optimizeTeamImages(): Promise<TeamImages> {
  const paths = [...new Set(Object.values(people).map(person => person.image))];
  const images = await Promise.all(paths.map(async path => {
    const source = sources[`../../public${path}`]?.default;
    if (!source) {
      throw new Error(`Team portrait "${path}" is missing. Add the image to public/team and update src/data/people.ts.`);
    }

    if (source.format === 'svg') {
      return [path, {
        src: path,
        srcSet: '',
        width: source.width,
        height: source.height,
        sizes: portraitSizes,
      }] as const;
    }

    const width = Math.min(600, source.width);
    const widths = [...new Set([Math.min(320, width), width])];
    const image = await getImage({
      src: source,
      width,
      widths,
      format: 'webp',
      quality: 85,
    });
    return [path, {
      src: image.src,
      srcSet: image.srcSet.attribute,
      width: Number(image.attributes.width),
      height: Number(image.attributes.height),
      sizes: portraitSizes,
    }] as const;
  }));
  return Object.fromEntries(images);
}

// Call from Astro frontmatter and pass this serializable map to React. No image
// service or original portrait data needs to be imported by the browser.
export function getTeamImages(): Promise<TeamImages> {
  return teamImages ??= optimizeTeamImages();
}
