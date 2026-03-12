'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS_IT = [
  { href: '/',                    label: 'Home' },
  { href: '/economia-san-marino', label: 'Dashboard' },
  { href: '/dati',                label: 'Dati' },
  { href: '/indici/smlli',        label: 'SMLLI', badge: true },
  { href: '/about',               label: 'About' },
];

const LINKS_EN = [
  { href: '/en',                        label: 'Home' },
  { href: '/en/economy-san-marino',     label: 'Dashboard' },
  { href: '/en/data',                   label: 'Data' },
  { href: '/en/indices/smlli',          label: 'SMLLI', badge: true },
  { href: '/en/about',                  label: 'About' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isEN = pathname.startsWith('/en');
  const LINKS = isEN ? LINKS_EN : LINKS_IT;

  const isActive = (href) => {
    if (href === '/' || href === '/en') return pathname === href;
    return pathname.startsWith(href);
  };

  // Build opposite-language URL
  const toggleLang = () => {
    if (isEN) {
      // Remove /en prefix
      const p = pathname.replace(/^\/en/, '') || '/';
      return p;
    } else {
      return '/en';
    }
  };

  return (
    <>
      <style>{`
        .hamburger-btn { display: none !important; }
        @media (max-width: 768px) {
          .hamburger-btn { display: flex !important; }
          .desktop-nav { display: none !important; }
        }
      `}</style>

      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--accent)' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          <Link href={isEN ? '/en' : '/'} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 600, letterSpacing: '0.04em', color: 'var(--text-primary)', lineHeight: 1 }}>OESM</span>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 9, fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              {isEN ? 'Economic Observatory' : 'Osservatorio Economico'}
            </span>
          </Link>

          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
            {LINKS.map(link => (
              <Link key={link.href} href={link.href}
                className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
                style={{ textDecoration: 'none', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: isActive(link.href) ? 500 : 400, color: isActive(link.href) ? 'var(--text-primary)' : 'var(--text-secondary)', padding: '4px 0', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: 6 }}>
                {link.label}
                {link.badge && <span style={{ fontFamily: 'var(--mono)', fontSize: 8, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#b8272c', color: 'white', padding: '1px 5px', borderRadius: 2, lineHeight: 1.6 }}>ORIG</span>}
              </Link>
            ))}
            <div style={{ width: 1, height: 18, background: 'var(--border)' }} />
            {/* Language switcher */}
            <Link href={toggleLang()} style={{ textDecoration: 'none', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.10em', color: 'var(--text-muted)', border: '1px solid var(--border)', padding: '3px 8px', display: 'flex', gap: 6 }}>
              <span style={{ color: !isEN ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: !isEN ? 600 : 400 }}>IT</span>
              <span style={{ color: 'var(--border-strong)' }}>/</span>
              <span style={{ color: isEN ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: isEN ? 600 : 400 }}>EN</span>
            </Link>
          </nav>

          <button className="hamburger-btn" onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, flexDirection: 'column', gap: 5 }} aria-label="Menu">
            <span style={{ display: 'block', width: 22, height: 1.5, background: 'var(--text-primary)', transition: 'transform 0.2s', transform: open ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
            <span style={{ display: 'block', width: 22, height: 1.5, background: 'var(--text-primary)', transition: 'opacity 0.2s', opacity: open ? 0 : 1 }} />
            <span style={{ display: 'block', width: 22, height: 1.5, background: 'var(--text-primary)', transition: 'transform 0.2s', transform: open ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
          </button>
        </div>
      </header>

      {open && (
        <div style={{ position: 'fixed', top: 64, left: 0, right: 0, bottom: 0, background: 'white', zIndex: 999, padding: '48px 40px', animation: 'fadeIn 0.2s ease' }}>
          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {LINKS.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                style={{ textDecoration: 'none', borderBottom: '1px solid var(--border)', fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 300, color: 'var(--text-secondary)', padding: '20px 0', display: 'block' }}>
                {link.label}
              </Link>
            ))}
            <Link href={toggleLang()} onClick={() => setOpen(false)}
              style={{ textDecoration: 'none', borderBottom: '1px solid var(--border)', fontFamily: 'var(--mono)', fontSize: 16, color: 'var(--text-muted)', padding: '20px 0', display: 'block' }}>
              {isEN ? 'Versione italiana' : 'English version'}
            </Link>
          </nav>
          <div style={{ marginTop: 40, fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>info@oesm.net</div>
        </div>
      )}
    </>
  );
}
