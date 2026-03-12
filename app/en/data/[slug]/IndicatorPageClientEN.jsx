'use client';

import { useState } from 'react';
import Link from 'next/link';
import { INDICATOR_SEO_EN } from '@/lib/seo_en';
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
  tourism_arrivals: 'International tourist arrivals',
  tourism_receipts: 'Tourism receipts (EUR)',
};

const METHODOLOGY_EN = {
  gdp_eur:          'GDP at current prices in US dollars, converted to EUR using annual average ECB exchange rates. The series has a methodological break in 2006 when the World Bank updated its estimation methodology for San Marino. Data 2010–2023 are homogeneous and comparable.',
  gdp_per_capita:   'GDP per capita calculated as the GDP/average annual resident population ratio. Converted from USD to EUR. The World Bank methodology uses the official resident population estimate provided by the San Marino Statistical Office.',
  gdp_growth:       'Annual growth rate of real GDP (at constant prices). No currency conversion required. The 2020 figure (–10.1%) reflects the COVID-19 pandemic impact. The 2021–2022 rebound is consistent with the post-pandemic recovery cycle.',
  population:       'Resident population on 1 July of each year (mid-year estimate). Primary source: San Marino Statistical Office (Ufficio di Stato per la Statistica), transmitted to World Bank. The 2020–2022 decline correlates with migration flow changes during the pandemic.',
  unemployment:     'Percentage of the total labour force without employment and actively seeking work (ILO definition). The 2014 peak (8.7%) reflects the delayed consequences of the San Marino banking sector crisis (2008–2013). Inverted trend: lower values indicate better performance.',
  labor_force:      'Total labour force: employed + unemployed actively seeking work (ILO definition). Does not include Italian cross-border workers employed in San Marino (ITSM), who are counted in the Italian labour force. This figure therefore underestimates the total workforce operating on San Marinese territory.',
  inflation:        'Annual percentage change in the Consumer Price Index (CPI). San Marino adopted the euro under a monetary agreement with the EU (2012): price levels are strongly influenced by ECB monetary policy. The 2022 peak (8.7%) reflects the European post-pandemic inflationary cycle.',
  exports_pct:      'Exports of goods and services as a percentage of GDP. Values above 100% of GDP reflect the structure of a small open economy fully integrated in the Italian economic area.',
  imports_pct:      'Imports of goods and services as a percentage of GDP. San Marino imports almost all consumer and industrial goods from Italy, with which it shares a border and customs agreements. The structural negative trade balance is a permanent feature of the San Marinese economy.',
  trade_openness:   'Calculated as (Exports + Imports) / GDP × 100. Values around 300–350% place San Marino among the world\'s most open economies, comparable to Hong Kong and Singapore.',
  govt_expenditure: 'Total central government expenditure as a percentage of GDP, including current and capital expenditure, excluding debt repayment. The 2020 peak (35.6%) reflects extraordinary COVID-19 spending.',
  tourism_arrivals: 'Number of international visitors (overnight tourists + day-trippers). San Marino has a high proportion of day-trippers given its proximity to the Adriatic Riviera. The 2020 collapse (810,000, –65%) is entirely attributable to COVID-19 restrictions.',
  tourism_receipts: 'International tourism receipts in foreign currency (international visitors\' spending on the territory), converted to EUR. Includes accommodation, catering, shopping and services.',
};

const CONVERSION_EN = {
  gdp_eur:          'Original values in USD (NY.GDP.MKTP.CD), converted to EUR using annual average ECB exchange rates (source: ECB Statistical Data Warehouse, series EXR.A.USD.EUR.SP00.A).',
  gdp_per_capita:   'Original values in USD (NY.GDP.PCAP.CD), converted to EUR using annual average ECB exchange rates.',
  tourism_receipts: 'Original values in USD (ST.INT.RCPT.CD), converted to EUR using annual average ECB exchange rates.',
};

// ─── Citation block ───────────────────────────────────────────────────────────
function CitationBlock({ indicator, seo, series }) {
  const [copied, setCopied] = useState(null);
  const today   = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  const year    = new Date().getFullYear();
  const labelEN = INDICATOR_LABELS_EN[indicator.id] || indicator.label;
  const url     = `https://oesm.net/en/data/${seo.slug}`;
  const doiPart = DATASET_META.doi ? ` DOI: ${DATASET_META.doi}.` : '';

  const citations = {
    APA: `OESM — Economic Observatory of San Marino. (${year}). ${labelEN} — San Marino, ${series[0].year}–${series[series.length - 1].year} [Dataset]. Retrieved ${today} from ${url}${doiPart}`,
    Chicago: `OESM — Economic Observatory of San Marino. "${labelEN} — San Marino." Dataset. Accessed ${today}. ${url}.${doiPart}`,
    BibTeX: `@dataset{oesm${year}_${indicator.id}_en,\n  author    = {OESM -- Economic Observatory of San Marino},\n  title     = {${labelEN} -- San Marino, ${series[0].year}--${series[series.length - 1].year}},\n  year      = {${year}},\n  url       = {${url}},\n  note      = {Accessed: ${today}},\n  license   = {CC BY 4.0},\n}`,
  };

  const copy = (fmt) => {
    navigator.clipboard.writeText(citations[fmt]);
    setCopied(fmt);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ border: '1px solid var(--border)', marginBottom: 48 }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--off)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Cite this dataset
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-muted)' }}>
          Licence: CC BY 4.0 — attribution required
        </div>
      </div>

      {['APA', 'Chicago', 'BibTeX'].map(fmt => (
        <div key={fmt} style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: 16, alignItems: 'start' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', paddingTop: 3 }}>{fmt}</div>
          <pre style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
            {citations[fmt]}
          </pre>
          <button onClick={() => copy(fmt)}
            style={{ fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', background: copied === fmt ? 'var(--text-primary)' : 'none', color: copied === fmt ? 'white' : 'var(--text-muted)', border: '1px solid var(--border)', padding: '6px 12px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
            {copied === fmt ? 'Copied' : 'Copy'}
          </button>
        </div>
      ))}

      <div style={{ padding: '12px 24px', background: 'var(--off)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)' }}>Data available under</span>
        <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer"
          style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-primary)', fontWeight: 500, textDecoration: 'none' }}>
          Creative Commons Attribution 4.0 International (CC BY 4.0)
        </a>
        <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)' }}>— free to use with mandatory attribution.</span>
      </div>
    </div>
  );
}

// ─── Methodology block ────────────────────────────────────────────────────────
function MethodologyBlock({ indicator }) {
  const noteEN = METHODOLOGY_EN[indicator.id] || indicator.methodologyNote;
  const convEN = CONVERSION_EN[indicator.id] || null;

  return (
    <div style={{ border: '1px solid var(--border)', background: 'var(--off)', padding: '24px 28px', marginBottom: 48 }}>
      <div style={{ fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>
        Source & methodology
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)', paddingTop: 2 }}>Primary source</div>
        <div>
          <a href={indicator.sourceUrl} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', textDecoration: 'none' }}>
            {indicator.source} ↗
          </a>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-muted)', marginLeft: 12 }}>
            Series: {indicator.sourceCode}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)', paddingTop: 2 }}>Last updated</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-secondary)' }}>{indicator.lastUpdated}</div>
      </div>

      {noteEN && (
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, marginBottom: convEN ? 16 : 0, paddingBottom: convEN ? 16 : 0, borderBottom: convEN ? '1px solid var(--border)' : 'none' }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)', paddingTop: 2 }}>Methodology</div>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>{noteEN}</p>
        </div>
      )}

      {convEN && (
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12 }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)', paddingTop: 2 }}>EUR conversion</div>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>{convEN}</p>
        </div>
      )}

      <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)', fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-muted)' }}>
        For corrections or data issues:{' '}
        <a href="mailto:info@oesm.net" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>info@oesm.net</a>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function IndicatorPageClientEN({ indicator, series, seo, category }) {
  const viz    = VIZ[indicator.id] ?? { type: 'area', color: '#0a0a09' };
  const sorted = [...series].reverse();
  const values = series.map(d => d.value);
  const min    = Math.min(...values);
  const max    = Math.max(...values);
  const last   = sorted[0];
  const prev   = sorted[1];
  const yoy    = prev && prev.value !== 0 ? (((last.value - prev.value) / Math.abs(prev.value)) * 100) : null;
  const labelEN = INDICATOR_LABELS_EN[indicator.id] || indicator.label;

  const downloadCSV = () => {
    const rows = [
      `# OESM — Economic Observatory of San Marino`,
      `# Indicator: ${labelEN}`,
      `# Country: San Marino (SMR)`,
      `# Unit: ${indicator.unit}`,
      `# Source: ${indicator.source} — ${indicator.sourceCode}`,
      `# Source URL: ${indicator.sourceUrl}`,
      `# Licence: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/`,
      `# Citation: OESM (${new Date().getFullYear()}). ${labelEN} — San Marino. https://oesm.net/en/data/${seo.slug}`,
      `# Generated: ${new Date().toISOString()}`,
      ``,
      `year,value,unit`,
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
    const relId  = Object.entries(INDICATOR_SEO_EN).find(([_, s]) => s.slug === slug)?.[0];
    const relSeo = INDICATOR_SEO_EN[relId];
    return relSeo ? { slug, label: relSeo.h1 } : null;
  }).filter(Boolean);

  return (
    <div style={{ paddingTop: 64 }}>

      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--off)', padding: '12px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <nav style={{ display: 'flex', gap: 8, alignItems: 'center', fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-muted)' }}>
            <Link href="/en" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/en/data" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Data</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)' }}>{labelEN}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div style={{ padding: '48px 40px 40px', borderBottom: '1px solid var(--border)', background: 'var(--off)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="tag">{category?.label}</span>
            <a href={indicator.sourceUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 10px', border: '1px solid var(--accent)', color: 'var(--accent)', textDecoration: 'none' }}>
              {indicator.source} · {indicator.sourceCode}
            </a>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>CC BY 4.0</span>
          </div>

          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, lineHeight: 1.1, marginBottom: 32 }}>
            {seo.h1}
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 40, alignItems: 'start' }} className="grid-2">
            <div style={{ background: 'white', border: '1px solid var(--border)', borderLeft: '3px solid var(--text-primary)', padding: '20px 28px', minWidth: 200 }}>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                Current value · {last?.year}
              </div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, lineHeight: 1, color: 'var(--text-primary)', marginBottom: 8 }}>
                {last?.value?.toLocaleString('en-GB')}
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
                { label: 'Historical min', val: min?.toLocaleString('en-GB'), year: series.find(d => d.value === min)?.year, color: 'var(--negative)' },
                { label: 'Historical max', val: max?.toLocaleString('en-GB'), year: series.find(d => d.value === max)?.year, color: 'var(--positive)' },
                { label: 'Data period',    val: `${series[0].year}–${series[series.length - 1].year}`, year: null, color: 'var(--text-muted)' },
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

        {/* Intro */}
        <div style={{ maxWidth: 760, marginBottom: 48 }}>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.85 }}>
            {seo.intro}
          </p>
        </div>

        {/* Chart */}
        <div style={{ border: '1px solid var(--border)', background: 'white', padding: '28px 24px', marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Historical series · {indicator.unit} · {series[0].year}–{series[series.length - 1].year}
            </div>
            <a href={indicator.sourceUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none' }}>
              Source: {indicator.source} ↗
            </a>
          </div>
          <IndicatorChart data={series} unit={indicator.unit} type={viz.type} color={viz.color} showZeroLine={viz.showZeroLine} height={260} />
        </div>

        {/* Table */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 300, marginBottom: 20 }}>Full historical series</h2>
        <div className="table-wrap" style={{ border: '1px solid var(--border)', marginBottom: 16 }}>
          <table style={{ minWidth: 420 }}>
            <thead>
              <tr style={{ background: 'var(--off)' }}>
                <th>Year</th>
                <th style={{ textAlign: 'right' }}>Value ({indicator.unit})</th>
                <th style={{ textAlign: 'right' }}>YoY change</th>
                <th style={{ textAlign: 'right' }}>vs {series[0].year}</th>
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
                    <td style={{ fontFamily: 'var(--mono)', textAlign: 'right' }}>{row.value.toLocaleString('en-GB')}</td>
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
            {sorted.length} observations · updated {indicator.lastUpdated} · CC BY 4.0
          </span>
          <button onClick={downloadCSV}
            style={{ fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: '1px solid var(--border-strong)', padding: '8px 18px', cursor: 'pointer', color: 'var(--text-primary)' }}>
            Download CSV
          </button>
        </div>

        {/* Methodology */}
        <MethodologyBlock indicator={indicator} />

        {/* Citation */}
        <CitationBlock indicator={indicator} seo={seo} series={series} />

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginBottom: 60 }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 300, marginBottom: 16 }}>Related indicators</h2>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {related.map(r => (
                <Link key={r.slug} href={`/en/data/${r.slug}`}
                  style={{ fontFamily: 'var(--sans)', fontSize: 13, padding: '10px 20px', border: '1px solid var(--border)', color: 'var(--text-secondary)', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                  {r.label}
                </Link>
              ))}
              <Link href="/en/data"
                style={{ fontFamily: 'var(--sans)', fontSize: 13, padding: '10px 20px', border: '1px solid var(--border)', color: 'var(--text-muted)', textDecoration: 'none' }}>
                All indicators
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
