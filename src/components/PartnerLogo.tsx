import type { Partner } from '../data/partners';
import '../styles/partners.css';

interface Props {
  partner: Partner;
  surface?: 'theme' | 'dark';
  className?: string;
  decorative?: boolean;
}

export default function PartnerLogo({ partner, surface = 'theme', className = '', decorative = false }: Props) {
  const alt = decorative ? '' : partner.name;
  return (
    <span className={`partner-logo ${className}`} data-surface={surface} data-dark-backing={partner.darkBacking}>
      <img className={partner.darkSrc ? 'partner-logo-light' : undefined} src={partner.src} alt={alt} />
      {partner.darkSrc && <img className="partner-logo-dark" src={partner.darkSrc} alt={alt} />}
    </span>
  );
}
