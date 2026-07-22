export interface PartnerEntry {
  name: string;
  logo: string;
  href: string;
  description: string;
}

export interface PartnerLogo {
  name: string;
  logo: string;
  href: string;
}

export type SponsorTier = "gold" | "silver" | "bronze";

export interface TieredSponsorEntry extends PartnerEntry {
  tier: SponsorTier;
}

// Paid organisations that financially support DUCA
export const sponsors: PartnerEntry[] = [
  {
    name: "Deakin Cyber Research",
    logo: "/partners/deakin-cyber.png",
    href: "https://www.deakin.edu.au/information-technology/cyber-security-research",
    description:
      "Deakin's cybersecurity research centre sponsors DUCA through funding, guest speakers, event space and opportunities for our members.",
  },
  {
    name: "Red Bull",
    logo: "/global/redbull.png",
    href: "https://www.redbull.com/",
    description:
      "Red Bull fuels our hackathons, CTF nights, and study sessions, keeping our members energised and focused when it matters most.",
  },
];

// Organisations that provide free assistance, resources, or institutional support
export const partners: PartnerEntry[] = [
  {
    name: "ACUCyS",
    logo: "/partners/acucys.png",
    href: "https://acucys.com.au/",
    description:
      "The Australian Cyber University Society (ACUCyS) is powered by DUCA. We continue to drive this national initiative that connects cybersecurity clubs across Australian universities — coordinating a national Hackathon, Conference and CTF every year, creating shared learning resources, and a unified voice for student cyber communities nationwide.",
  },
  {
    name: "Deakin University",
    logo: "/partners/deakin.png",
    href: "https://www.deakin.edu.au/",
    description:
      "As our home institution, Deakin provides venue access, faculty mentorship, and academic backing that enables DUCA to run workshops, CTF competitions, and career-readiness programmes on campus.",
  },
  {
    name: "DUSA",
    logo: "/partners/dusa.png",
    href: "https://www.dusa.org.au/clubs/deakin-university-cybersecurity-association-burwood-duca",
    description:
      "The Deakin University Student Association supports DUCA through club affiliation grants, promotional channels, and operational resources that keep our events accessible and free for all students.",
  },
];

// Organisations we've collaborated with on events or projects
export const collaborators: PartnerEntry[] = [
  {
    name: "Mastercard",
    logo: "/global/mastercard.png",
    href: "https://www.mastercard.com.au/",
    description: "Teamed up to host cybersecurity career panels and mentoring sessions, giving members insights into security engineering at global scale.",
  },
  {
    name: "Hack4G",
    logo: "/global/hck4g.jpeg",
    href: "https://acucys.com.au/",
    description: "Partnered on community hackathons and cybersecurity challenges, helping students build hands-on skills in a collaborative environment.",
  },
  {
    name: "CommBank",
    logo: "/global/commbank.png",
    href: "https://www.commbank.com.au/",
    description: "Collaborated on secure code training seminars, incident response workshops, and exclusive graduate recruitment pathway talks.",
  },
  {
    name: "DownUnderCTF",
    logo: "/global/ductf.png",
    href: "https://downunderctf.com/",
    description: "Teamed up to host local play-alongs and training sessions for DownUnderCTF, the largest CTF competition in the Southern Hemisphere.",
  },
  {
    name: "Accenture",
    logo: "/global/Accenture.png",
    href: "https://www.accenture.com/au-en",
    description: "Collaborated on security consulting case study workshops, resume reviews, and career networking nights for aspiring analysts.",
  },
];

// Tiered sponsors for the /partners-new page with Gold/Silver/Bronze levels
export const tieredSponsors: TieredSponsorEntry[] = [
  {
    name: "Deakin Cyber Research",
    logo: "/partners/deakin-cyber.png",
    href: "https://www.deakin.edu.au/information-technology/cyber-security-research",
    description:
      "Deakin's cybersecurity research centre sponsors DUCA through funding, guest speakers, event space and opportunities for our members.",
    tier: "gold",
  },
  {
    name: "Red Bull",
    logo: "/global/redbull.png",
    href: "https://www.redbull.com/",
    description:
      "Red Bull fuels our hackathons, CTF nights, and study sessions, keeping our members energised and focused when it matters most.",
    tier: "silver",
  },
];

export const goldSponsors = tieredSponsors.filter((s) => s.tier === "gold");
export const silverSponsors = tieredSponsors.filter((s) => s.tier === "silver");
export const bronzeSponsors = tieredSponsors.filter((s) => s.tier === "bronze");

// Combined list for the scrolling logo carousel — excludes placeholder entries
// that still use the DUCA fallback logo
const PLACEHOLDER_LOGO = "/global/duca-logo.webp";

export const allPartnerLogos: PartnerLogo[] = [
  ...sponsors,
  ...partners,
  ...collaborators,
]
  .filter(({ logo }) => logo !== PLACEHOLDER_LOGO)
  .map(({ name, logo, href }) => ({ name, logo, href }));
