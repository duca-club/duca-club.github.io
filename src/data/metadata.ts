import { siteConfig } from './site.ts';
import ducaLogo from '../../public/duca.png';

export interface SocialImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  type?: string;
}

export const siteMetadata = {
  author: 'DUCA Team',
  locale: 'en_AU',
  image: {
    src: ducaLogo.src,
    alt: 'Deakin University Cybersecurity Association (DUCA) logo',
    width: ducaLogo.width,
    height: ducaLogo.height,
    type: 'image/png',
  } satisfies SocialImage,
};

// Search and share copy is independent of the navigation labels and page design.
export const pageMetadata: Record<string, { title: string; description: string }> = {
  home: {
    title: `${siteConfig.name} — ${siteConfig.fullName}`,
    description: siteConfig.description,
  },
  about: {
    title: `About Us — ${siteConfig.name}`,
    description: 'Get to know the Deakin University Cybersecurity Association: a student-led community for hands-on learning, cybersecurity workshops, CTFs, and industry connections.',
  },
  events: {
    title: `Events — ${siteConfig.name}`,
    description: 'Find upcoming DUCA workshops, Capture the Flag competitions, industry nights, and social events. Free and open to all Deakin students, at every skill level.',
  },
  blog: {
    title: `Blog — ${siteConfig.name}`,
    description: 'Blog posts from DUCA about cybersecurity, development, and our events. Read workshop recaps, CTF writeups, career insights, and community news.',
  },
  team: {
    title: `Meet the Team — ${siteConfig.name}`,
    description: 'Meet the student executives and committee behind DUCA. Explore our elected teams, cybersecurity divisions, and the people who run the club at Deakin.',
  },
  partners: {
    title: `Partners & Sponsors — ${siteConfig.name}`,
    description: 'Meet the partners and sponsors supporting DUCA workshops, CTFs, industry events, and student opportunities. Learn how your organisation can get involved.',
  },
  ctf: {
    title: `Capture the Flag — ${siteConfig.name}`,
    description: 'Learn about DUCA Capture the Flag challenges in web security, cryptography, forensics, reversing, and OSINT. All skill levels are welcome.',
  },
  join: {
    title: `Join Us — ${siteConfig.name}`,
    description: 'Join DUCA through DUSA, meet our Discord community, and take part in cybersecurity workshops, CTFs, and industry nights. No experience needed.',
  },
};

export function getPageMetadata(page: string) {
  if (!Object.hasOwn(pageMetadata, page)) {
    throw new Error(`Add search and share metadata for "${page}" in src/data/metadata.ts.`);
  }
  return pageMetadata[page];
}
