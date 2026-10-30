import siteData from './site.json' with { type: 'json' };

// Shared identity and destinations. Edit site.json to update them site-wide.
export const siteConfig = siteData;

export const siteLinks = {
  discord: `https://discord.com/invite/${siteConfig.discord.inviteCode}`,
  ...siteConfig.links,
  email: `mailto:${siteConfig.email}`,
} as const;

export const socialLinks = [
  { label: 'Discord', url: siteLinks.discord },
  { label: 'GitHub', url: siteLinks.github },
  { label: 'CTF platform', url: siteLinks.ctf },
  { label: 'DUSA listing', url: siteLinks.membership },
];

export const heroContent = {
  firstLine: 'LEARN SECURITY',
  secondLine: 'BY ACTUALLY',
  highlight: 'DOING IT',
  subtitle: 'Deakin University Cybersecurity Club',
  accessibleTitle: 'Learn security by actually doing it. Workshops, CTFs and industry nights, run by students at Deakin.',
};
