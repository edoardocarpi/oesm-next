'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS_IT = [
  { href: '/',                    label: 'Home' },
  { href: '/economia-san-marino', label: 'Dashboard' },
  { href: '/dati',                label: 'Dati' },
  { href: '/indici/smlli',        label: 'SMLLI' },
  { href: '/about',               label: 'About' },
];

const NAV_LINKS_EN = [
  { href: '/en',                        label: 'Home' },
  { href: '/en/economy-san-marino',     label: 'Dashboard' },
  { href: '/en/data',                   label: 'Data' },
  { href: '/en/indices/smlli',          label: 'SMLLI' },
  { href: '/en/about',                  label: 'About' },
];

const FONTI = [
  { label: 'World Bank Open Data', href: 'https://data360.worldbank.org/en/economy/SMR' },
  { label: 'IMF DataMapper',       href: 'https://www.imf.org/external/datamapper' },
  { label: 'Central Bank SMR',     href: 'https://www.bcsm.sm' },
  { label: 'Government of SMR',    href: 'https://www.gov.sm' },
];

const lk = { display: 'block', fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-secondary)', padding: '4px 0', textDecoration: 'none' };
const hover = e => e.currentTarget.style.color = 'var(--text-primary)';
const unhov = e => e.currentTarget.style.color = 'var(--text-secondary)';

export default function Footer() {
  const pathname = usePathname();
  const isEN = pathname?.startsWith('/en');
  const navLinks = isEN ? NAV_LINKS_EN : NAV_LINKS_IT;

  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--white)', padding: '48px 40px 32px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>

          <div className="footer-brand">
            <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 600, letterSpacing: '0.04em', marginBottom: 4 }}>OESM</div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
              {isEN ? 'Economic Observatory of San Marino' : 'Osservatorio Economico di San Marino'}
            </div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 260 }}>
              {isEN
                ? 'Independent economic data platform dedicated to the Republic of San Marino.'
                : 'Banca dati economica indipendente dedicata alla Repubblica di San Marino.'}
            </p>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
              {isEN ? 'Navigation' : 'Navigazione'}
            </div>
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} style={lk} onMouseEnter={hover} onMouseLeave={unhov}>{l.label}</Link>
            ))}
          </div>

          <div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
              {isEN ? 'Data sources' : 'Fonti'}
            </div>
            {FONTI.map(f => (
              <a key={f.label} href={f.href} target="_blank" rel="noopener noreferrer" style={lk} onMouseEnter={hover} onMouseLeave={unhov}>
                {f.label}
              </a>
            ))}
          </div>

          <div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
              {isEN ? 'Contact' : 'Contatti'}
            </div>
            <a href="mailto:info@oesm.net" style={lk} onMouseEnter={hover} onMouseLeave={unhov}>info@oesm.net</a>
            <a href="https://oesm.net" style={lk} onMouseEnter={hover} onMouseLeave={unhov}>oesm.net</a>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)' }}>
            {isEN
              ? '2025 OESM — Economic Observatory of San Marino.'
              : '2025 OESM — Osservatorio Economico di San Marino.'}
          </span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            {isEN ? 'Data: World Bank · 2010–2023' : 'Dati: World Bank · 2010–2023'}
          </span>
        </div>
      </div>
    </footer>
  );
}
