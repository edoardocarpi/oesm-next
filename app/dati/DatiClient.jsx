'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { INDICATORS, CATEGORIES, SERIES } from '@/lib/economicData';
import { INDICATOR_SEO } from '@/lib/seo';
import Footer from '@/components/layout/Footer';

const formatCompact = (v) => {
  if (v === null || v === undefined) return '—';
  if (Math.abs(v) >= 1_000_000_000) return (v / 1_000_000_000).toFixed(1) + 'B';
  if (Math.abs(v) >= 1_000_000)     return (v / 1_000_000).toFixed(1) + 'M';
  if (Math.abs(v) >= 1_000)         return (v / 1_000).toFixed(0) + 'k';
  return v % 1 === 0 ? String(v) : v.toFixed(1);
};

function IndicatorRow({ ind }) {
  const seo    = INDICATOR_SEO[ind.id];
  const series = SERIES[ind.id] ?? [];
  const sorted = [...series].sort((a, b) => b.year - a.year);
  const last   = sorted[0];
  const prev   = sorted[1];
  const values = series.map(d => d.value);
  const min    = values.length ? Math.min(...values) : null;
  const max    = values.length ? Math.max(...values) : null;
  const yoy    = last && prev && prev.value !== 0
    ? (((last.value - prev.value) / Math.abs(prev.value)) * 100)
    : null;

  return (
    <Link href={seo ? `/dati/${seo.slug}` : '#'}
      style={{ textDecoration: 'none', background: 'white', padding: '20px 24px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 16, alignItems: 'center', transition: 'background 0.1s' }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--off)'}
      onMouseLeave={e => e.currentTarget.style.background = 'white'}>

      {/* Name */}
      <div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>{ind.label}</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-muted)' }}>{ind.unit} · {ind.source}</div>
      </div>

      {/* Current value — highlighted */}
      <div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Ultimo ({last?.year})</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
          {last ? formatCompact(last.value) : '—'}
        </div>
        {yoy !== null && (
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: yoy >= 0 ? 'var(--positive)' : 'var(--negative)', marginTop: 2 }}>
            {yoy >= 0 ? '+' : ''}{yoy.toFixed(1)}%
          </div>
        )}
      </div>

      {/* Min */}
      <div className="hide-mobile">
        <div style={{ fontFamily: 'var(--sans)', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Min</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--negative)' }}>{formatCompact(min)}</div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 10, color: 'var(--text-muted)' }}>{series.find(d => d.value === min)?.year}</div>
      </div>

      {/* Max */}
      <div className="hide-mobile">
        <div style={{ fontFamily: 'var(--sans)', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Max</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--positive)' }}>{formatCompact(max)}</div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 10, color: 'var(--text-muted)' }}>{series.find(d => d.value === max)?.year}</div>
      </div>

      {/* Arrow */}
      <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-muted)' }}></div>
    </Link>
  );
}

export default function DatiClient() {
  const [search, setSearch]   = useState('');
  const [activeTag, setActiveTag] = useState('tutti');
  const categories = Object.keys(CATEGORIES);

  const filtered = useMemo(() => {
    return INDICATORS.filter(ind => {
      const matchTag  = activeTag === 'tutti' || ind.category === activeTag;
      const matchSearch = !search || ind.label.toLowerCase().includes(search.toLowerCase());
      return matchTag && matchSearch;
    });
  }, [search, activeTag]);

  return (
    <div style={{ paddingTop: 64 }}>

      {/* Header */}
      <div style={{ padding: '56px 40px 40px', borderBottom: '1px solid var(--border)', background: 'var(--off)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Archivio dati — San Marino</p>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 300, marginBottom: 16 }}>Banca Dati Economica</h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--text-secondary)', maxWidth: 520, lineHeight: 1.75, marginBottom: 32 }}>
            {INDICATORS.length} indicatori economici di San Marino. Serie storiche 2010–2023, dataset scaricabili in CSV.
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 400 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--text-muted)', pointerEvents: 'none' }}>⌕</span>
            <input
              type="text"
              placeholder="Cerca indicatore..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '11px 14px 11px 36px', fontFamily: 'var(--sans)', fontSize: 13, border: '1px solid var(--border)', background: 'white', color: 'var(--text-primary)', outline: 'none', borderRadius: 0 }}
            />
          </div>
        </div>
      </div>

      {/* Sidebar + Table layout */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 40px 80px', display: 'grid', gridTemplateColumns: '200px 1fr', gap: 40, alignItems: 'start' }}>

        {/* Vertical filter sidebar */}
        <div style={{ position: 'sticky', top: 88 }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Categoria</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {['tutti', ...categories].map(cat => (
              <button key={cat} onClick={() => setActiveTag(cat)}
                style={{ background: 'none', border: 'none', borderLeft: activeTag === cat ? '2px solid var(--text-primary)' : '2px solid transparent', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: activeTag === cat ? 500 : 400, color: activeTag === cat ? 'var(--text-primary)' : 'var(--text-muted)', padding: '8px 12px', textAlign: 'left', letterSpacing: '0.02em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{cat === 'tutti' ? 'Tutti' : CATEGORIES[cat].label}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                  {cat === 'tutti' ? INDICATORS.length : INDICATORS.filter(i => i.category === cat).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 16, padding: '12px 24px', borderBottom: '1px solid var(--border)' }}>
            {['Indicatore', 'Valore attuale', 'Min storico', 'Max storico', ''].map((h, i) => (
              <div key={i} className={i >= 2 && i <= 3 ? 'hide-mobile' : ''} style={{ fontFamily: 'var(--sans)', fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{h}</div>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)' }}>
              {filtered.map(ind => <IndicatorRow key={ind.id} ind={ind} />)}
            </div>
          ) : (
            <div style={{ padding: '80px 24px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 300, color: 'var(--text-muted)', marginBottom: 8 }}>Nessun risultato</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-muted)' }}>Prova con un termine diverso o rimuovi i filtri</div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
