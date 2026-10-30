import { siteLinks } from './site.ts';

export interface Partner {
  id: string;
  group: 'featured' | 'sponsor' | 'partner';
  name: string;
  src: string;
  url: string;
}

// Groups control placement on the Partners page; every record joins the homepage ticker.
export const partners: Partner[] = [
  { id: 'deakin-cyber', group: 'featured', name: 'Deakin Cyber', src: '/partners/deakin-cyber.png', url: 'https://cybercentre.org.au/' },
  { id: 'deakin-university', group: 'sponsor', name: 'Deakin University', src: '/partners/deakin.png', url: 'https://www.deakin.edu.au/' },
  { id: 'dusa', group: 'sponsor', name: 'DUSA', src: '/partners/dusa.png', url: siteLinks.membership },
  { id: 'acucys', group: 'partner', name: 'ACUCyS', src: '/partners/acucys.png', url: 'https://acucys.com.au/' },
  { id: 'downunderctf', group: 'partner', name: 'DownUnderCTF', src: '/global/ductf.png', url: 'https://downunderctf.com/' },
  { id: 'commbank', group: 'partner', name: 'CommBank', src: '/global/commbank.png', url: 'https://www.commbank.com.au/' },
  { id: 'mastercard', group: 'partner', name: 'Mastercard', src: '/global/mastercard.png', url: 'https://www.mastercard.com.au/' },
  { id: 'accenture', group: 'partner', name: 'Accenture', src: '/global/Accenture.png', url: 'https://www.accenture.com/au-en' },
  { id: 'red-bull', group: 'sponsor', name: 'Red Bull', src: '/global/redbull.png', url: 'https://www.redbull.com/' },
  { id: 'hack4g', group: 'partner', name: 'Hack4G', src: '/global/hck4g.jpeg', url: 'https://acucys.com.au/' }
];

const featuredPartners = partners.filter(partner => partner.group === 'featured');
if (featuredPartners.length !== 1) {
  throw new Error('src/data/partners.ts must contain exactly one partner with group "featured".');
}
export const featuredPartner = featuredPartners[0];

export const partnerSpotlight = {
  label: 'PRINCIPAL PARTNER',
  title: 'They make the big events happen',
  body: 'Deakin Cyber has backed some of our largest events, put researchers in front of students, and connected members to work happening at the edge of the field.',
  linkLabel: 'cybercentre.org.au',
};
