'use client';

import { useState } from 'react';
import Link from 'next/link';
import { KPI, SERIES, INDICATORS, CATEGORIES, SETTORI } from '@/lib/economicData';
import { formatValue, formatYoY, trendColor } from '@/lib/formatters';
import { INDICATOR_SEO } from '@/lib/seo';
import IndicatorChart from '@/components/charts/IndicatorChart';
import Footer from '@/components/layout/Footer';

const VIZ = {
  gdp_eur:          { type: 'area', color: '#0a0a09' },
  gdp_per_capita:   { type: 'area', color: '#0a0a09' },
  gdp_growth:       { type: 'bar',  color: '#0a0a09', showZeroLine: true },
  population:       { type: 'line', color: '#0a0a09' },
  unemployment:     { type: 'area', color: '#0a0a09' },
  labor_force:      { type: 'line', color: '#0a0a09' },
  inflation:        { type: 'bar',  color: '#b8272c', showZeroLine: true },
  exports_pct:      { type: 'area', color: '#0a0a09' },
  imports_pct:      { type: 'line', color: '#0a0a09' },
  trade_openness:   { type: 'area', color: '#0a0a09' },
  govt_expenditure: { type: 'area', color: '#b8272c' },
  tourism_arrivals: { type: 'bar',  color: '#0a0a09' },
  tourism_receipts: { type: 'area', color: '#0a0a09' },
};

function ChartCard({ indicator }) {
  const series = SERIES[indicator.id] ?? [];
  const viz    = VIZ[indicator.id] ?? { type: 'area', color: '#0a0a09' };
  const cat    = CATEGORIES[indicator.category];
  const seo    = INDICATOR_SEO[indicator.id];
  const href   = seo ? `/dati/${seo.slug}` : '/dati';

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="chart-card-clickable" style={{ background: 'white', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>{indicator.label}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-muted)' }}>{indicator.unit} · 2010–2023</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="tag">{cat?.label ?? indicator.category}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--border-strong)', letterSpacing: '0.06em' }}>Dati </span>
          </div>
        </div>
        <IndicatorChart data={series} unit={indicator.unit} type={viz.type} color={viz.color} showZeroLine={viz.showZeroLine} />
      </div>
    </Link>
  );
}

export default function DashboardClient() {
  const [tab, setTab] = useState('tutti');
  const categoryKeys = Object.keys(CATEGORIES);
  const tabs = ['tutti', ...categoryKeys];
  const filtered = tab === 'tutti' ? INDICATORS : INDICATORS.filter(i => i.category === tab);

  return (
    <div style={{ paddingTop: 64 }}>


      {/* Sticky header */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'white', position: 'sticky', top: 64, zIndex: 100 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0 0', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>San Marino — SMR</p>
              <h1 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 400 }}>Dashboard Economica</h1>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }} className="hide-mobile">
              <div>Fonte dati</div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>World Bank API</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 0, marginTop: 20, overflowX: 'auto' }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ background: 'none', border: 'none', borderBottom: tab === t ? '2px solid var(--text-primary)' : '2px solid transparent', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 12, fontWeight: tab === t ? 500 : 400, color: tab === t ? 'var(--text-primary)' : 'var(--text-muted)', padding: '10px 16px', whiteSpace: 'nowrap', letterSpacing: '0.04em', flexShrink: 0 }}>
                {t === 'tutti' ? 'Tutti' : CATEGORIES[t].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 40px 0' }}>

        {/* KPI strip */}
        <div style={{ overflowX: 'auto', marginBottom: 40 }}>
          <div className="kpi-strip-grid grid-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
            {KPI.slice(0, 6).map(kpi => {
              const color = trendColor(kpi.yoy, kpi.invertTrend);
              const seo   = INDICATOR_SEO[kpi.id];
              const href  = seo ? `/dati/${seo.slug}` : '/dati';
              return (
                <Link key={kpi.id} href={href} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'white', padding: '20px 16px', cursor: 'pointer' }}>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: 9, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>{kpi.label}</div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 300, lineHeight: 1, color: 'var(--text-primary)', marginBottom: 6 }}>{formatValue(kpi.value, kpi.unit, kpi.decimals)}</div>
                    {kpi.yoy !== null && <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color }}>{formatYoY(kpi.yoy)}</div>}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Charts grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', marginBottom: 40 }} className="grid-2">
          {filtered.map(ind => <ChartCard key={ind.id} indicator={ind} />)}
        </div>

        {/* Settori */}
        {(tab === 'tutti' || tab === 'macroeconomia') && (
          <div style={{ background: 'white', border: '1px solid var(--border)', padding: '32px', marginBottom: 40 }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500, marginBottom: 2 }}>Composizione del PIL per settore</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-muted)' }}>% sul valore aggiunto totale · 2023</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {SETTORI.map(s => (
                <div key={s.nome}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 4 }}>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-secondary)' }}>{s.nome}</span>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: s.variazione >= 0 ? 'var(--positive)' : 'var(--negative)' }}>{s.variazione >= 0 ? '+' : ''}{s.variazione}%</span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 500, minWidth: 48, textAlign: 'right' }}>{s.quota}%</span>
                    </div>
                  </div>
                  <div style={{ height: 3, background: 'var(--off)', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${s.quota}%`, background: 'var(--text-primary)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ padding: '20px 0 60px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 700 }}>
            <strong style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Nota metodologica.</strong>{' '}
            I dati sono aggiornati tramite World Bank Open Data API. Le serie storiche coprono il periodo 2010–2023. Clicca su qualsiasi grafico per accedere alla serie storica completa.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
