export interface BlogPreviewOverride {
  date?: string;
  tag?: string;
  title?: string;
  blurb?: string;
}

// Optional editorial card copy, keyed by the Markdown post slug.
// Images, article content, and URLs come from each post's frontmatter.
// Omit date to use publishDate. Explicit dates retain the supplied design's copy.
export const blogPreviewOverrides: Record<string, BlogPreviewOverride> = {
  '2026-07-18-speedrunning-cyber': { date: '18 JUL 2026', tag: 'EVENTS', title: 'Speedrunning Cyber: The Strategic Route to a Security Role', blurb: 'Navigating a cybersecurity degree does not require 100% completion. Two senior students shared what to study, what to skip, and how to land a job before graduating.' },
  '2025-09-06-duca-x-ddsc-networking-night': { date: '06 SEP 2025', tag: 'EVENTS', title: 'DUCA x DDSC Networking Night', blurb: 'A high-energy night with career insights from Commonwealth Bank, AI and research guidance, plus plenty of community building.' },
  '2025-05-12-duca-cat-attends-the-inaugural-bsides-ballarat-2025': { tag: 'FIELD NOTES', title: 'DUCA Cat Attends the Inaugural BSides Ballarat 2025', blurb: 'Talks on human-centric cybersecurity, digital footprint awareness, CTI automation, and navigating growth in cyber careers.' },
  '2025-04-25-exploring-adf-careers-and-the-role-of-cyber-warfare-on-anzac-day': { tag: 'EVENTS', title: 'Exploring ADF Careers and the Role of Cyber Warfare on ANZAC Day', blurb: 'Insights from Colonel Molnar, Captain Lever and Cyber Warfare Officer Elliot Parker on the growing role of cyber warfare.' },
  '2025-04-17-cracking-clues-and-catching-flags-with-duca': { tag: 'CTF', title: 'Cracking Clues and Catching Flags with DUCA', blurb: 'An OSINT-focused CTF where participants uncovered hidden clues using metadata, search techniques and visual analysis.' },
};
