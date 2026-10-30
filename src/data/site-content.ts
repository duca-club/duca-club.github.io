import { siteLinks } from './site.ts';

// Edit these records to update repeated content without changing components.
export interface NavigationPage { id: string; label: string; url?: string; }
export interface DiscordChannel { name: string; meta?: string; metaIcon?: 'infinity'; live?: boolean; }
export type SiteStat = {
  suffix: string;
  label: string;
  note: string;
} & ({ source: 'discordMembers'; target?: never } | { target: number; source?: never });
export interface NumberedContent { num: string; title: string; body: string; }
export interface GalleryImage { src: string; alt: string; tag?: string; caption?: string; }
export interface CtfCategory { pts: string; name: string; body: string; }
export interface MembershipBenefit { text: string; open: boolean; member: boolean; }
export interface JoinStep extends NumberedContent { cta: string; url: string; }
export interface JoinFaq { q: string; a: string; }

export const navigationPages: NavigationPage[] = [
  { id: 'home', label: 'Home' },
  { id: 'events', label: 'Events' },
  { id: 'about', label: 'About' },
  { id: 'blog', label: 'Blog' },
  { id: 'team', label: 'Team' },
  { id: 'partners', label: 'Partners' },
  { id: 'ctf', label: 'CTF', url: siteLinks.ctf },
  { id: 'join', label: 'Join' },
];

export const discordChannels: DiscordChannel[] = [
  { name: 'general', meta: '12 new' },
  { name: 'ctf-and-challenges', meta: '5 solving', live: true },
  { name: 'workshop-notes', meta: '3 new' },
  { name: 'jobs-and-internships', meta: '8 new' },
  { name: 'duca-cat', metaIcon: 'infinity', live: true },
  { name: 'study-help', meta: '2 new' },
  { name: 'certifications', meta: '6 new' },
  { name: 'events', meta: 'pinned' },
  { name: 'tooling', meta: '1 new' },
  { name: 'off-topic', meta: '21 new' }
];

export const tickerMessages = ['FREE TO JOIN', 'ALL SKILL LEVELS', 'WORKSHOPS', 'CTF NIGHTS', 'INDUSTRY PANELS', 'PIZZA', 'DEAKIN BURWOOD'];

export const heroLabels = ['workshops', 'CTFs', 'industry nights', 'socials', 'study groups', 'dev projects', 'career nights'];

export const teamPageContent = {
  description: 'Elected each year by members. Tap to open their LinkedIns.',
};

export const siteStats: SiteStat[] = [
  { source: 'discordMembers', suffix: '+', label: 'Members', note: 'Discord community' },
  { target: 42, suffix: '', label: 'Events', note: 'Run this year' },
  { target: 18, suffix: '', label: 'Workshops', note: 'Hands-on sessions' },
  { target: 100, suffix: '%', label: 'Free', note: 'Always' }
];

// {memberCount} is replaced by the Discord count fetched once per build.
export const clubActivities: NumberedContent[] = [
  { num: '01', title: 'Cybersecurity Workshops', body: 'Get hands-on with ethical hacking, network defence, digital forensics, and malware analysis. Our workshops run every trimester and are built for every skill level — whether you have never touched a terminal or you are prepping for OSCP.' },
  { num: '02', title: 'CTF Competitions', body: 'Sharpen your problem-solving in Capture-the-Flag events. Our CTF team trains weekly, competes nationally and internationally, and welcomes new players who want to learn by doing. No experience required — just curiosity.' },
  { num: '03', title: 'Industry Connections', body: 'Meet cybersecurity professionals through networking nights, guest lectures, and career panels. Get resume feedback, discover internship pipelines, and build relationships that last well beyond university.' },
  { num: '04', title: 'Community Building', body: 'Join {memberCount}+ students in our Discord who share knowledge, collaborate on side-projects, and support each other through assignments, certifications, and job applications. DUCA is your cybersecurity home at Deakin.' },
  { num: '05', title: 'Development Projects', body: 'Ship real software with our development team. From internal club tools to open-source platforms, you will gain practical coding experience, learn Git workflows, and build portfolio pieces that actually matter.' },
  { num: '06', title: 'Learning Resources', body: 'Access curated study guides, certification prep materials, and hands-on labs. Whether you are chasing CompTIA Security+, diving into cloud security, or exploring red-teaming — we have resources for every stage of your journey.' }
];

export const aboutStrip: GalleryImage[] = [
  { src: '/design/about-01.jpg', alt: 'The DUCA stall at O-Week, Trimester 1 2026' },
  { src: '/design/about-02.jpg', alt: 'DUCA members at a club event' },
  { src: '/design/about-03.webp', alt: 'DUCA members at a club event' },
  { src: '/design/about-04.webp', alt: 'DUCA members at a club event' }
];

export const aboutTalks: GalleryImage[] = [
  { src: '/design/about-05.jpg', alt: 'A DUCA member speaking at AISA CyberCon', tag: 'AISA CyberCon' },
  { src: '/design/about-06.jpg', alt: 'A DUCA member speaking at BSides Adelaide', tag: 'BSides Adelaide' },
  { src: '/design/about-07.jpg', alt: 'A DUCA member speaking at BSides Melbourne', tag: 'BSides Melbourne' },
  { src: '/design/about-08.jpg', alt: 'A DUCA member speaking at BSides Adelaide', tag: 'BSides Adelaide' },
  { src: '/design/about-09.webp', alt: 'A DUCA member speaking at a conference', tag: 'BSides Canberra' }
];

export const aboutEvents: GalleryImage[] = [
  {
    src: '/design/about-10.jpg',
    alt: 'DUCA running the HomeLabs Village at BSides Melbourne',
    tag: 'BSides Melbourne',
    caption: 'Running the HomeLabs Village — our members built and staffed the whole thing.'
  },
  {
    src: '/design/about-11.jpg',
    alt: 'DUCA members at BSides Ballarat',
    tag: 'BSides Ballarat',
    caption: 'A DUCA contingent at BSides Ballarat, one of several conferences we send members to each year.'
  },
  {
    src: '/design/about-12.jpg',
    alt: 'DUCA members at AISA CyberCon 2025',
    tag: 'AISA CyberCon',
    caption: 'Members at CyberCon, the largest security conference in the country.'
  }
];

export const clubValues: NumberedContent[] = [
  { num: '01', title: 'Inspiration', body: 'Empowering members to explore and grow together.' },
  { num: '02', title: 'Innovation', body: "Driving creative solutions for cybersecurity's future." },
  { num: '03', title: 'Inclusivity', body: 'Building a welcoming and diverse community.' },
  { num: '04', title: 'Collaboration', body: 'Strengthening teamwork to achieve shared goals.' },
  { num: '05', title: 'Leadership', body: "Inspiring tomorrow's cybersecurity leaders." }
];

export const ctfCategories: CtfCategory[] = [
  { pts: '50–400 PTS', name: 'Web', body: 'Injection, auth bypass, and the classic broken access control.' },
  { pts: '100–500 PTS', name: 'Crypto', body: 'Weak keys, bad padding, and homemade ciphers that should not exist.' },
  { pts: '50–350 PTS', name: 'Forensics', body: 'Disk images, packet captures, and recovering what someone deleted.' },
  { pts: '150–500 PTS', name: 'Reversing', body: 'Binaries that do not want to be read. Bring a disassembler.' },
  { pts: '50–250 PTS', name: 'OSINT', body: 'Metadata, reverse image search, and being far too good at geography.' }
];

export const membershipComparison: MembershipBenefit[] = [
  { text: 'Attend any event, free', open: true, member: true },
  { text: 'Take part in workshops and CTFs', open: true, member: true },
  { text: 'Full access to the Discord', open: true, member: true },
  { text: 'Eligible for event prizes', open: false, member: true },
  { text: 'Counted in club numbers at DUSA', open: false, member: true },
  { text: 'Eligible to run for committee', open: false, member: true },
];

export const joinSteps: JoinStep[] = [
  { num: '1', title: 'Register via DUSA', body: 'Official membership goes through the student association. This is the step that makes you a registered member and prize-eligible.', cta: 'Register', url: siteLinks.membership },
  { num: '2', title: 'Join the Discord', body: 'Where events get announced and questions get answered. Open to anyone, member or not.', cta: 'Get the invite', url: siteLinks.discord },
  { num: '3', title: 'Turn up to anything', body: 'Check the events page for what is next and come as you are. No RSVP needed, nothing to pay.', cta: 'ctf.duca.au', url: siteLinks.ctf }
];

export const joinFaqs: JoinFaq[] = [
  { q: 'Do I have to be a member to attend?', a: 'No. Every event is free and open \u2014 registration only affects prize eligibility.' },
  { q: 'What does registering cost?', a: 'Less than a coffee. It is a quick DUSA signup that takes a few minutes.' },
  { q: 'Where do I find upcoming events?', a: 'The events page here, or the Discord, where everything gets announced first.' },
  { q: 'I have no experience at all.', a: 'Most people start there. Workshops assume nothing and there is always someone at your table who started last trimester.' },
  { q: 'I am not studying cyber.', a: 'Fine. We have members from computer science, engineering, law and commerce.' },
  { q: 'Why does registration matter?', a: 'It keeps the club recognised by DUSA and funds the events, prizes and catering.' },
  { q: 'Who can win prizes?', a: 'Registered members only. Prizes are funded through membership and partner support, so they go to people on the roll — but anyone can still compete and appear on the scoreboard.' }
];
