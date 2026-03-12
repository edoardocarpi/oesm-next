'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { KPI, SERIES } from '@/lib/economicData';
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

function KPICard({ kpi }) {
  const yoyStr = formatYoY(kpi.yoy);
  const color  = trendColor(kpi.yoy, kpi.invertTrend);
  const series = SERIES[kpi.id] ?? [];
  const viz    = VIZ[kpi.id] ?? { type: 'area', color: '#0a0a09' };
  const seo    = INDICATOR_SEO[kpi.id];
  const href   = seo ? `/dati/${seo.slug}` : '/dati';

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="kpi-card" style={{ background: 'white', padding: '28px 24px', border: '1px solid transparent', position: 'relative', height: '100%' }}>
        <div style={{ position: 'absolute', top: 12, right: 12, fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--border-strong)', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.7 }}>
          Dati 
        </div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>
          {kpi.label}
        </div>
        <div style={{ marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 300, lineHeight: 1, color: 'var(--text-primary)' }}>
            {formatValue(kpi.value, kpi.unit, kpi.decimals)}
          </span>
          <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>{kpi.unit}</span>
        </div>
        <div style={{ margin: '16px -4px 12px' }}>
          <IndicatorChart data={series} unit={kpi.unit} type={viz.type} color={viz.color} showZeroLine={viz.showZeroLine} height={140} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {yoyStr && <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color, fontWeight: 500 }}>{yoyStr}</span>}
          {kpi.year && <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)' }}>vs {kpi.year - 1}</span>}
        </div>
      </div>
    </Link>
  );
}

const HERO_STATS = [
  { label: 'Anni di dati',          valore: '14' },
  { label: 'Indicatori monitorati', valore: '13' },
  { label: 'Fonti istituzionali',   valore: '5'  },
];

const FEATURES = [
  { num: '01', titolo: 'Dati verificati',       desc: 'Raccolti da World Bank, FMI e istituzioni sammarinesi tramite API ufficiali.' },
  { num: '02', titolo: 'Pipeline automatica',   desc: 'Aggiornamento settimanale via GitHub Actions. Nessun intervento manuale.' },
  { num: '03', titolo: 'Accesso libero',        desc: 'Tutti i dati sono pubblici, scaricabili in CSV. Nessun paywall.' },
  { num: '04', titolo: 'Architettura scalabile', desc: 'Aggiungere un indicatore richiede una sola riga nel registry.' },
];

export default function HomeClient() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

  const displayKPIs = KPI.slice(0, 6);

  return (
    <div>


      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingTop: 64, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '80px 80px', opacity: 0.4 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 3, background: 'var(--accent)' }} />

        <div className="page-section" style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '0 40px 80px', width: '100%' }}>
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(10px)', transition: 'opacity 0.6s ease, transform 0.6s ease', marginBottom: 32, marginTop: 48 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--accent)' }} />
              Osservatorio Economico — San Marino
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(44px, 7vw, 96px)', fontWeight: 300, lineHeight: 1.05, letterSpacing: '-0.02em', maxWidth: 900, marginBottom: 40, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s' }}>
            Dati economici.<br />
            <span style={{ fontStyle: 'italic' }}>Analisi rigorose.</span><br />
            Accesso libero.
          </h1>

          <p style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 300, color: 'var(--text-secondary)', maxWidth: 520, lineHeight: 1.75, marginBottom: 48, opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease 0.2s' }}>
            L'Osservatorio Economico di San Marino raccoglie, elabora e pubblica i principali indicatori macroeconomici della Repubblica. Una banca dati strutturata, aggiornata e aperta a ricercatori, giornalisti e istituzioni.
          </p>

          <div className="hero-actions" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease 0.3s' }}>
            <Link href="/economia-san-marino" className="btn-primary">Esplora la Dashboard</Link>
            <Link href="/dati" className="btn-outline">Accedi ai Dati</Link>
          </div>

          <div className="hero-stats" style={{ display: 'flex', flexDirection: 'row', gap: 48, marginTop: 80, paddingTop: 40, borderTop: '1px solid var(--border)', opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.4s' }}>
            {HERO_STATS.map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 300, lineHeight: 1 }}>{s.valore}</div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KPI Grid ──────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--off)', padding: '80px 40px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Indicatori principali — 2023</p>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 300 }}>Quadro macroeconomico</h2>
            </div>
            <Link href="/economia-san-marino" className="btn-outline hide-mobile">Dashboard completa</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)' }} className="grid-3">
            {displayKPIs.map(kpi => <KPICard key={kpi.id} kpi={kpi} />)}
          </div>
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)' }}>
              Clicca su un indicatore per vedere la serie storica completa
            </span>
          </div>
        </div>
      </section>

      {/* ── SMLLI Teaser ──────────────────────────────────────────────── */}
      <section style={{ padding: '80px 40px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ background: 'white', border: '1px solid var(--border)', borderLeft: '3px solid #b8272c', padding: '36px 40px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }} className="grid-2">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', background: '#b8272c', color: 'white', padding: '2px 8px' }}>
                  Indice originale OESM
                </span>
              </div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 300, lineHeight: 1.2, marginBottom: 10 }}>
                SMLLI — San Marino Labour Income Leakage Index
              </h3>
              <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 560 }}>
                Ogni anno escono dall'economia sammarinese circa <strong style={{ color: '#b8272c', fontWeight: 600 }}>230 milioni di euro</strong> in redditi da lavoro, spesi in Italia dai frontalieri. Pari al 12% del PIL.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 48, fontWeight: 300, color: '#b8272c', lineHeight: 1, marginBottom: 4 }}>–230</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>milioni EUR · 2024</div>
              <Link href="/indici/smlli" className="btn-outline" style={{ borderColor: '#b8272c', color: '#b8272c' }}>Esplora l'indice</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── About strip ───────────────────────────────────────────────── */}
      <section style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="grid-2">
            <div>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ display: 'inline-block', width: 16, height: 1, background: 'var(--accent)' }} /> Il Progetto
              </p>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 300, lineHeight: 1.2, marginBottom: 28 }}>
                Un riferimento indipendente<br /><span style={{ fontStyle: 'italic' }}>per l'economia sammarinese</span>
              </h2>
              <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 40 }}>
                OESM nasce dalla necessità di disporre di una piattaforma strutturata, trasparente e aggiornata per il monitoraggio dell'economia di San Marino. I dati vengono raccolti da fonti istituzionali verificate e aggiornati automaticamente tramite pipeline ETL.
              </p>
              <Link href="/about" className="btn-outline">Scopri il progetto</Link>
            </div>
            <div>
              {FEATURES.map((item, i) => (
                <div key={item.num} style={{ padding: '28px 0', borderTop: i === 0 ? '1px solid var(--text-primary)' : '1px solid var(--border)', borderBottom: i === 3 ? '1px solid var(--text-primary)' : 'none', display: 'flex', gap: 24 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-muted)', minWidth: 28, paddingTop: 2 }}>{item.num}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{item.titolo}</div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--text-primary)', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 32 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 300, color: 'white', marginBottom: 12 }}>Collabora con OESM</h2>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'rgba(255,255,255,0.6)', maxWidth: 480 }}>
              Sei un ricercatore, un'istituzione o un giornalista? Contattaci per collaborazioni, richieste di dati o contributi al progetto.
            </p>
          </div>
          <a href="mailto:info@oesm.net" className="btn-outline" style={{ color: 'white', borderColor: 'white' }}>
            info@oesm.net
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
