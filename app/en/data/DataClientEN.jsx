'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { INDICATORS, CATEGORIES, SERIES } from '@/lib/economicData';
import { INDICATOR_SEO_EN } from '@/lib/seo_en';
import Footer from '@/components/layout/Footer';

const INDICATOR_LABELS_EN = {
  gdp_eur:          'GDP (EUR, current)',
  gdp_per_capita:   'GDP per capita (EUR)',
  gdp_growth:       'GDP growth rate',
  population:       'Resident population',
  unemployment:     'Unemployment rate',
  labor_force:      'Total labour force',
  inflation:        'Inflation (CPI)',
  exports_pct:      'Exports (% of GDP)',
  imports_pct:      'Imports (% of GDP)',
  trade_openness:   'Trade openness (% of GDP)',
  govt_expenditure: 'Government expenditure (% of GDP)',
  tourism_arrivals: 'Tourist arrivals',
  tourism_receipts: 'Tourism receipts (EUR)',
};

const formatCompact = (v) => {
  if (v === null || v === undefined) return '—';
  if (Math.abs(v) >= 1_000_000_000) return (v / 1_000_000_000).toFixed(1) + 'B';
  if (Math.abs(v) >= 1_000_000)     return (v / 1_000_000).toFixed(1) + 'M';
  if (Math.abs(v) >= 1_000)         return (v / 1_000).toFixed(0) + 'k';
  return v % 1 === 0 ? String(v) : v.toFixed(1);
};

function IndicatorRow({ ind }) {
  const seo    = INDICATOR_SEO_EN[ind.id];
  const series = SERIES[ind.id] || [];
  const sorted = [...series].sort((a, b) => b.year - a.year);
  const last   = sorted[0];
  const prev   = sorted[1];
  const yoy    = last && prev && prev.value !== 0
    ? (((last.value - prev.value) / Math.abs(prev.value)) * 100)
    : null;
  const minV   = series.length ? Math.min(...series.map(d => d.value)) : null;
  const maxV   = series.length ? Math.max(...series.map(d => d.value)) : null;
  const href   = seo ? `/en/data/${seo.slug}` : '/en/data';

  const yoyColor = yoy === null ? 'var(--text-muted)'
    : ind.invertTrend ? (yoy < 0 ? 'var(--positive)' : 'var(--negative)')
    : (yoy > 0 ? 'var(--positive)' : 'var(--negative)');

  return (
    <tr onClick={() => window.location.href = href} style={{ cursor: 'pointer', borderBottom: '1px solid var(--border)' }}>
      <td>
        <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500 }}>{INDICATOR_LABELS_EN[ind.id] || ind.label}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-muted)', marginTop: 2, letterSpacing: '0.06em' }}>
            {ind.source} · {ind.sourceCode}
          </div>
        </Link>
      </td>
      <td style={{ textAlign: 'right' }}>
        {last ? (
          <>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 600 }}>
              {formatCompact(last.value)}
            </span>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>{ind.unit}</span>
          </>
        ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
      </td>
      <td style={{ textAlign: 'right', fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)' }}>
        {last?.year}
      </td>
      <td style={{ textAlign: 'right' }}>
        {yoy !== null
          ? <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: yoyColor, fontWeight: 500 }}>{yoy >= 0 ? '+' : ''}{yoy.toFixed(1)}%</span>
          : <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: 11 }}>—</span>}
      </td>
      <td style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
        {minV !== null ? formatCompact(minV) : '—'}
      </td>
      <td style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
        {maxV !== null ? formatCompact(maxV) : '—'}
      </td>
    </tr>
  );
}

const CATS_EN = {
  macroeconomia:    'Macroeconomics',
  lavoro:           'Labour',
  prezzi:           'Prices',
  commercio:        'External Trade',
  finanza_pubblica: 'Public Finance',
  turismo:          'Tourism',
};

export default function DataClientEN() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categoryCounts = useMemo(() => {
    const counts = {};
    INDICATORS.forEach(ind => {
      counts[ind.category] = (counts[ind.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filtered = useMemo(() => {
    return INDICATORS.filter(ind => {
      const matchSearch = !search || (INDICATOR_LABELS_EN[ind.id] || ind.label).toLowerCase().includes(search.toLowerCase());
      const matchCat    = activeCategory === 'all' || ind.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [search, activeCategory]);

  const categories = useMemo(() => Object.entries(CATEGORIES).sort((a, b) => a[1].order - b[1].order), []);

  return (
    <div style={{ paddingTop: 64 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 40px 100px' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
            OESM · San Marino · 2010–2023
          </p>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 300, lineHeight: 1.1, marginBottom: 16 }}>
            Statistical Database
          </h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 600 }}>
            {INDICATORS.length} indicators for the Republic of San Marino. Historical series 2010–2023 from World Bank, IMF and San Marino institutions.
          </p>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 24, position: 'relative' }}>
          <input
            type="text"
            placeholder="Search indicator..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', maxWidth: 480, padding: '10px 16px', fontFamily: 'var(--sans)', fontSize: 13, border: '1px solid var(--border)', background: 'white', outline: 'none', boxSizing: 'border-box', color: 'var(--text-primary)' }}
          />
        </div>

        {/* Sidebar + Table layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 40, alignItems: 'start' }}>

          {/* Vertical category sidebar */}
          <div style={{ position: 'sticky', top: 88 }}>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Category</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <button onClick={() => setActiveCategory('all')}
                style={{ background: 'none', border: 'none', borderLeft: activeCategory === 'all' ? '2px solid var(--text-primary)' : '2px solid transparent', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: activeCategory === 'all' ? 500 : 400, color: activeCategory === 'all' ? 'var(--text-primary)' : 'var(--text-muted)', padding: '8px 12px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>All</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-muted)' }}>{INDICATORS.length}</span>
              </button>
              {categories.map(([key, cat]) => (
                <button key={key} onClick={() => setActiveCategory(key)}
                  style={{ background: 'none', border: 'none', borderLeft: activeCategory === key ? '2px solid var(--text-primary)' : '2px solid transparent', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: activeCategory === key ? 500 : 400, color: activeCategory === key ? 'var(--text-primary)' : 'var(--text-muted)', padding: '8px 12px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{CATS_EN[key] || cat.label}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-muted)' }}>{categoryCounts[key] || 0}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--sans)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--text-primary)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px 12px 0', fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Indicator</th>
                  <th style={{ textAlign: 'right', padding: '12px 0', fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Current value</th>
                  <th style={{ textAlign: 'right', padding: '12px 0', fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Year</th>
                  <th style={{ textAlign: 'right', padding: '12px 0', fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>YoY</th>
                  <th style={{ textAlign: 'right', padding: '12px 0', fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Min</th>
                  <th style={{ textAlign: 'right', padding: '12px 0 12px 16px', fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Max</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(ind => <IndicatorRow ind={ind} key={ind.id} />)}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--text-muted)' }}>
                No indicators found for "{search}"
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
