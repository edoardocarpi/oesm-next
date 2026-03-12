'use client';

import { useState } from 'react';
import Link from 'next/link';
import { INDICATOR_SEO } from '@/lib/seo';
import { DATASET_META } from '@/lib/economicData';
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

// ─── Blocco citazione OWID-style ──────────────────────────────────────────────
function CitationBlock({ indicator, seo, series }) {
  const [copied, setCopied] = useState(null);
  const today    = new Date().toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });
  const year     = new Date().getFullYear();
  const url      = `https://oesm.net/dati/${seo.slug}`;
  const doiPart  = DATASET_META.doi ? ` DOI: ${DATASET_META.doi}.` : '';

  const citations = {
    APA: `OESM — Osservatorio Economico di San Marino. (${year}). ${indicator.label} — San Marino, ${series[0].year}–${series[series.length - 1].year} [Dataset]. Recuperato il ${today} da ${url}${doiPart}`,
    Chicago: `OESM — Osservatorio Economico di San Marino. "${indicator.label} — San Marino." Dataset. Accesso ${today}. ${url}.${doiPart}`,
    BibTeX: `@dataset{oesm${year}_${indicator.id},\n  author    = {OESM -- Osservatorio Economico di San Marino},\n  title     = {${indicator.label} -- San Marino, ${series[0].year}--${series[series.length - 1].year}},\n  year      = {${year}},\n  url       = {${url}},\n  note      = {Accesso: ${today}},\n  license   = {CC BY 4.0},\n}`,
  };

  const copy = (fmt) => {
    navigator.clipboard.writeText(citations[fmt]);
    setCopied(fmt);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ border: '1px solid var(--border)', marginBottom: 48 }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--off)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Cita questo dataset
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-muted)' }}>
          Licenza: CC BY 4.0 — citazione obbligatoria
        </div>
      </div>

      {/* Format tabs */}
      {['APA', 'Chicago', 'BibTeX'].map(fmt => (
        <div key={fmt} style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: 16, alignItems: 'start' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', paddingTop: 3 }}>{fmt}</div>
          <pre style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
            {citations[fmt]}
          </pre>
          <button
            onClick={() => copy(fmt)}
            style={{ fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', background: copied === fmt ? 'var(--text-primary)' : 'none', color: copied === fmt ? 'white' : 'var(--text-muted)', border: '1px solid var(--border)', padding: '6px 12px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
            {copied === fmt ? 'Copiato' : 'Copia'}
          </button>
        </div>
      ))}

      {/* Licenza */}
      <div style={{ padding: '12px 24px', background: 'var(--off)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)' }}>
          Dati disponibili sotto licenza
        </span>
        <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer"
          style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-primary)', fontWeight: 500, textDecoration: 'none' }}>
          Creative Commons Attribution 4.0 International (CC BY 4.0)
        </a>
        <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)' }}>
          — libero utilizzo con attribuzione obbligatoria.
        </span>
      </div>
    </div>
  );
}

// ─── Blocco metodologia ───────────────────────────────────────────────────────
function MethodologyBlock({ indicator }) {
  return (
    <div style={{ border: '1px solid var(--border)', background: 'var(--off)', padding: '24px 28px', marginBottom: 48 }}>
      <div style={{ fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>
        Fonte e metodologia
      </div>

      {/* Fonte primaria */}
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)', paddingTop: 2 }}>Fonte primaria</div>
        <div>
          <a href={indicator.sourceUrl} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            {indicator.source} ↗
          </a>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-muted)', marginLeft: 12 }}>
            Serie: {indicator.sourceCode}
          </span>
        </div>
      </div>

      {/* Aggiornamento */}
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)', paddingTop: 2 }}>Ultimo agg.</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-secondary)' }}>{indicator.lastUpdated}</div>
      </div>

      {/* Nota metodologica */}
      {indicator.methodologyNote && (
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, marginBottom: indicator.conversionNote ? 16 : 0, paddingBottom: indicator.conversionNote ? 16 : 0, borderBottom: indicator.conversionNote ? '1px solid var(--border)' : 'none' }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)', paddingTop: 2 }}>Metodologia</div>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>
            {indicator.methodologyNote}
          </p>
        </div>
      )}

      {/* Nota conversione EUR */}
      {indicator.conversionNote && (
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12 }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)', paddingTop: 2 }}>Conversione EUR</div>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>
            {indicator.conversionNote}
          </p>
        </div>
      )}

      {/* Segnalazioni */}
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)', fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-muted)' }}>
        Per segnalazioni o correzioni:{' '}
        <a href="mailto:info@oesm.net" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>info@oesm.net</a>
      </div>
    </div>
  );
}

// ─── Componente principale ────────────────────────────────────────────────────
export default function IndicatorPageClient({ indicator, series, seo, category }) {
  const viz     = VIZ[indicator.id] ?? { type: 'area', color: '#0a0a09' };
  const sorted  = [...series].reverse();
  const values  = series.map(d => d.value);
  const min     = Math.min(...values);
  const max     = Math.max(...values);
  const last    = sorted[0];
  const prev    = sorted[1];
  const yoy     = prev && prev.value !== 0 ? (((last.value - prev.value) / Math.abs(prev.value)) * 100) : null;

  const downloadCSV = () => {
    const rows = [
      `# OESM — Osservatorio Economico di San Marino`,
      `# Indicatore: ${indicator.label}`,
      `# Paese: San Marino (SMR)`,
      `# Unità: ${indicator.unit}`,
      `# Fonte: ${indicator.source} — ${indicator.sourceCode}`,
      `# Fonte URL: ${indicator.sourceUrl}`,
      `# Licenza: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/`,
      `# Citazione: OESM (${new Date().getFullYear()}). ${indicator.label} — San Marino. https://oesm.net/dati/${seo.slug}`,
      `# Generato: ${new Date().toISOString()}`,
      ``,
      `anno,valore,unita`,
      ...series.map(d => `${d.year},${d.value},"${indicator.unit}"`),
    ];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `oesm-${seo.slug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const related = (seo.relatedSlugs ?? []).map(slug => {
    const relId  = Object.entries(INDICATOR_SEO).find(([_, s]) => s.slug === slug)?.[0];
    const relSeo = INDICATOR_SEO[relId];
    return relSeo ? { slug, label: relSeo.h1 } : null;
  }).filter(Boolean);

  return (
    <div style={{ paddingTop: 64 }}>

      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--off)', padding: '12px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <nav style={{ display: 'flex', gap: 8, alignItems: 'center', fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-muted)' }}>
            <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/dati" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Dati</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)' }}>{indicator.label}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div style={{ padding: '48px 40px 40px', borderBottom: '1px solid var(--border)', background: 'var(--off)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="tag">{category?.label}</span>
            <a href={indicator.sourceUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 10px', border: '1px solid var(--accent)', color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {indicator.source} · {indicator.sourceCode}
            </a>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              CC BY 4.0
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, lineHeight: 1.1, marginBottom: 32 }}>
            {seo.h1}
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 40, alignItems: 'start' }} className="grid-2">
            <div style={{ background: 'white', border: '1px solid var(--border)', borderLeft: '3px solid var(--text-primary)', padding: '20px 28px', minWidth: 200 }}>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                Valore attuale · {last?.year}
              </div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, lineHeight: 1, color: 'var(--text-primary)', marginBottom: 8 }}>
                {last?.value?.toLocaleString('it-IT')}
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-muted)', marginBottom: yoy !== null ? 10 : 0 }}>
                {indicator.unit}
              </div>
              {yoy !== null && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 500, color: yoy >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
                    {yoy >= 0 ? '+' : ''}{yoy.toFixed(1)}%
                  </span>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)' }}>vs {prev?.year}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', paddingTop: 4 }}>
              {[
                { label: 'Minimo storico',  val: min?.toLocaleString('it-IT'), year: series.find(d => d.value === min)?.year,  color: 'var(--negative)' },
                { label: 'Massimo storico', val: max?.toLocaleString('it-IT'), year: series.find(d => d.value === max)?.year,  color: 'var(--positive)' },
                { label: 'Periodo dati',    val: `${series[0].year}–${series[series.length - 1].year}`, year: null, color: 'var(--text-muted)' },
              ].map(s => (
                <div key={s.label} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', minWidth: 120 }}>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 500, color: s.color }}>{s.val}</div>
                  {s.year && <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.year}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 40px' }}>

        {/* Intro text */}
        <div style={{ maxWidth: 760, marginBottom: 48 }}>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.85 }}>
            {seo.intro}
          </p>
        </div>

        {/* Chart */}
        <div style={{ border: '1px solid var(--border)', background: 'white', padding: '28px 24px', marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Serie storica · {indicator.unit} · {series[0].year}–{series[series.length - 1].year}
            </div>
            <a href={indicator.sourceUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Fonte: {indicator.source} ↗
            </a>
          </div>
          <IndicatorChart data={series} unit={indicator.unit} type={viz.type} color={viz.color} showZeroLine={viz.showZeroLine} height={260} />
        </div>

        {/* Data table */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 300, marginBottom: 20 }}>Serie storica completa</h2>
        <div className="table-wrap" style={{ border: '1px solid var(--border)', marginBottom: 16 }}>
          <table style={{ minWidth: 420 }}>
            <thead>
              <tr style={{ background: 'var(--off)' }}>
                <th>Anno</th>
                <th style={{ textAlign: 'right' }}>Valore ({indicator.unit})</th>
                <th style={{ textAlign: 'right' }}>Var. annua</th>
                <th style={{ textAlign: 'right' }}>Var. vs {series[0].year}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, i) => {
                const prevRow = sorted[i + 1];
                const base    = sorted[sorted.length - 1];
                const rowYoy  = prevRow && prevRow.value !== 0 ? (((row.value - prevRow.value) / Math.abs(prevRow.value)) * 100).toFixed(1) : null;
                const vsBase  = base && base.value !== 0 && i < sorted.length - 1 ? (((row.value - base.value) / Math.abs(base.value)) * 100).toFixed(1) : null;
                return (
                  <tr key={row.year}>
                    <td style={{ fontFamily: 'var(--mono)' }}>{row.year}</td>
                    <td style={{ fontFamily: 'var(--mono)', textAlign: 'right' }}>{row.value.toLocaleString('it-IT')}</td>
                    <td style={{ textAlign: 'right' }}>
                      {rowYoy !== null
                        ? <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: Number(rowYoy) >= 0 ? 'var(--positive)' : 'var(--negative)' }}>{Number(rowYoy) >= 0 ? '+' : ''}{rowYoy}%</span>
                        : <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: 11 }}>—</span>}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {vsBase !== null
                        ? <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: Number(vsBase) >= 0 ? 'var(--positive)' : 'var(--negative)' }}>{Number(vsBase) >= 0 ? '+' : ''}{vsBase}%</span>
                        : <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: 11 }}>base</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Download bar */}
        <div style={{ padding: '14px 20px', background: 'var(--off)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 48 }}>
          <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-muted)' }}>
            {sorted.length} osservazioni · aggiornato {indicator.lastUpdated} · CC BY 4.0
          </span>
          <button onClick={downloadCSV}
            style={{ fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: '1px solid var(--border-strong)', padding: '8px 18px', cursor: 'pointer', color: 'var(--text-primary)' }}>
            Scarica CSV
          </button>
        </div>

        {/* Metodologia */}
        <MethodologyBlock indicator={indicator} />

        {/* Citazione OWID-style */}
        <CitationBlock indicator={indicator} seo={seo} series={series} />

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginBottom: 60 }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 300, marginBottom: 16 }}>Indicatori correlati</h2>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {related.map(r => (
                <Link key={r.slug} href={`/dati/${r.slug}`}
                  style={{ fontFamily: 'var(--sans)', fontSize: 13, padding: '10px 20px', border: '1px solid var(--border)', color: 'var(--text-secondary)', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                  {r.label}
                </Link>
              ))}
              <Link href="/dati"
                style={{ fontFamily: 'var(--sans)', fontSize: 13, padding: '10px 20px', border: '1px solid var(--border)', color: 'var(--text-muted)', textDecoration: 'none' }}>
                Tutti gli indicatori
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
