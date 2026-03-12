'use client';
import { useState } from "react";
import {
  BarChart, Bar, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Area,
} from "recharts";
import {
  SMLLI_META,
  SMLLI_SERIES,
  SMLLI_COMPONENTS_2024,
  FRONTALIERI_SERIES,
} from "@/lib/smlli";
import Footer from "@/components/layout/Footer";

// ─── English translations for shared data labels ──────────────────────────────
const COMPONENTS_EN = {
  'F₁': {
    label: 'ITSM cross-border workers\' income spent in Italy',
    note:  'Net wage bill × propensity to consume in Italy (α ≈ 0.78)',
  },
  'F₂': {
    label: 'SMIT cross-border workers\' income brought in',
    note:  'Estimate from ISMAR 5 / INPS module. Systematic underestimation likely.',
  },
  'A₁': {
    label: 'Withholding taxes retained at source (IGR)',
    note:  'IGR revenue on non-resident income. Source: SMR Ministry of Finance.',
  },
  'S': {
    label: 'Direct on-territory spending by ITSM workers',
    note:  'Conservative estimate. Fuel, groceries, commercial services.',
  },
};

const BENCHMARK_EN = [
  { valore: '~12%',     label: 'SMLLI vs San Marino GDP',         desc: 'Leakage equals approximately 12% of GDP' },
  { valore: '~1×',      label: 'SMLLI vs SMR health expenditure', desc: 'Comparable to the entire annual public health budget' },
  { valore: '~5×',      label: 'SMLLI vs public investment',      desc: 'Five times the public investment capacity' },
  { valore: '~25–30K €',label: 'Leakage per ITSM worker',        desc: 'Average purchasing power leaving per worker/year' },
];

const FONTI_EN_LABELS = {
  'UPECEDS': { tipo: 'Government agency (SMR)', note: 'Official cross-border worker register' },
  'INSS':    { tipo: 'Social security institution (SMR)', note: 'Employer contribution declarations' },
  'BCSM':    { tipo: 'Central bank (SMR)', note: 'Balance of payments — current account' },
  'INPS':    { tipo: 'Social security institution (IT)', note: 'ISMAR 5 module for cross-border workers' },
  'ISS':     { tipo: 'Health institute (SMR)', note: 'Population register' },
  'SEF':     { tipo: 'Government (SMR)', note: 'IGR revenue — non-resident workers' },
};



const ACCENT_RED  = "#b8272c";
const TEXT_MAIN   = "#0a0a09";
const AXIS_STYLE  = { fontFamily: "var(--mono)", fontSize: 9, fill: "var(--text-muted)" };
const fmtY = (v) => {
  if (Math.abs(v) >= 1000) return (v/1000).toFixed(0)+"k";
  return v;
};
const fmtX = (v, i, data) => (i % 2 === 0 ? v : "");
const GRID_EL     = <CartesianGrid stroke="var(--border)" strokeDasharray="0" vertical={false} />;

// ─── Tooltip condiviso ────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label, unit = "Mln EUR", extraLines }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "white", border: "1px solid var(--border)", padding: "12px 16px", fontFamily: "var(--mono)", fontSize: 12, minWidth: 160 }}>
      <div style={{ color: "var(--text-muted)", fontSize: 10, marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: TEXT_MAIN, fontWeight: 500 }}>
          {typeof p.value === "number" ? p.value.toLocaleString("en-GB") : p.value} {unit}
        </div>
      ))}
    </div>
  );
}

// ─── Sezione: Hero ────────────────────────────────────────────────────────────

function HeroSection() {
  const latest = SMLLI_SERIES[SMLLI_SERIES.length - 1];

  return (
    <div style={{ padding: "72px 40px 64px", borderBottom: "1px solid var(--border)", background: "var(--off)", position: "relative", overflow: "hidden" }}>
      {/* Decorative circle */}
      <div style={{ position: "absolute", right: -60, top: "50%", transform: "translateY(-50%)", width: 360, height: 360, borderRadius: "50%", border: "1px solid var(--border)", opacity: 0.6 }} />
      <div style={{ position: "absolute", right: 60, top: "50%", transform: "translateY(-50%)", width: 200, height: 200, borderRadius: "50%", border: "1px solid var(--border)", opacity: 0.6 }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)" }}>Original OESM Indices</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--border-strong)" }}>/</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: ACCENT_RED }}>SMLLI</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 60, alignItems: "start" }} className="grid-2">
          <div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4.5vw, 60px)", fontWeight: 300, lineHeight: 1.1, marginBottom: 16 }}>
              San Marino Labour<br />
              <span style={{ fontStyle: "italic" }}>Income Leakage Index</span>
            </h1>
            <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, maxWidth: 560, marginBottom: 28 }}>
              Misura il flusso netto annuale di redditi da lavoro tra la Repubblica di San Marino e l'Italia. Un valore negativo indica un'uscita netta di reddito dall'economia sammarinese. Indice proprietario originale dell'Osservatorio.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span className="tag">Original OESM Index</span>
              <span className="tag">V{SMLLI_META.versione} · {SMLLI_META.primaRelease}</span>
              <span className="tag">{SMLLI_META.stato}</span>
            </div>
          </div>

          {/* KPI box */}
          <div style={{ border: "1px solid var(--border)", background: "white", padding: "32px 36px", minWidth: 260, textAlign: "right" }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>
              Estimate {latest.year}
            </div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 52, fontWeight: 300, lineHeight: 1, color: ACCENT_RED, marginBottom: 8 }}>
              {latest.value}
            </div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
              milioni EUR
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-muted)", borderTop: "1px solid var(--border)", paddingTop: 14 }}>
              Intervallo: {latest.low} / {latest.high} Mln EUR
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sezione: Historical series ───────────────────────────────────────────────────

function SerieSection() {
  return (
    <div style={{ padding: "64px 0 48px" }}>
      <SectionLabel>Historical series</SectionLabel>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 300, marginBottom: 8 }}>Leakage trend · 2015–2024</h2>
      <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--text-muted)", marginBottom: 36 }}>
        Million EUR, current prices · negative values = net income outflow · all observations are estimates
      </p>

      <div style={{ border: "1px solid var(--border)", background: "white", padding: "28px 28px 16px" }}>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={SMLLI_SERIES} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
            {GRID_EL}
            <XAxis dataKey="year" tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={(v,i) => i%2===0?v:""} interval={0} />
            <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} domain={["auto", 0]} tickFormatter={fmtY} width={36} />
            <ReferenceLine y={0} stroke={TEXT_MAIN} strokeWidth={1} />
            <Tooltip content={<ChartTooltip />} />
            {/* Banda intervallo di confidenza */}
            <Area type="monotone" dataKey="low"   stroke="none" fill={ACCENT_RED} fillOpacity={0.06} />
            <Area type="monotone" dataKey="high"  stroke="none" fill="white"      fillOpacity={1} />
            {/* Linea centrale */}
            <Area type="monotone" dataKey="value"
              stroke={ACCENT_RED} strokeWidth={2}
              fill={ACCENT_RED}   fillOpacity={0.07}
              dot={{ r: 3, fill: "white", stroke: ACCENT_RED, strokeWidth: 2 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>

        <div style={{ display: "flex", gap: 24, marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 2, background: ACCENT_RED }} />
            <span style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--text-muted)" }}>Central estimate</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 10, background: ACCENT_RED, opacity: 0.12, borderRadius: 2 }} />
            <span style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--text-muted)" }}>Estimation range</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sezione: Decomposizione ──────────────────────────────────────────────────

function ComponentiSection() {
  return (
    <div style={{ padding: "48px 0" }}>
      <SectionLabel>Decomposition 2024</SectionLabel>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 300, marginBottom: 8 }}>Index components</h2>
      <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--text-muted)", marginBottom: 36 }}>
        SMLLI = F₁ + F₂ + A₁ + S · Baseline estimate 2024 · values in million EUR
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--border)", border: "1px solid var(--border)" }} className="grid-2">
        {SMLLI_COMPONENTS_2024.map((comp) => {
          const isNeg   = comp.valore < 0;
          const barW    = Math.min(Math.abs(comp.valore) / 300 * 100, 100);
          const barColor = isNeg ? ACCENT_RED : "var(--positive)";

          return (
            <div key={comp.id} style={{ background: "white", padding: "28px 28px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 18, fontWeight: 500, color: isNeg ? ACCENT_RED : "var(--positive)" }}>
                    {comp.simbolo}
                  </span>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, color: TEXT_MAIN, marginTop: 4 }}>
                    {(COMPONENTS_EN[comp.simbolo] || {}).label || comp.label}
                  </div>
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 22, fontWeight: 500, color: isNeg ? ACCENT_RED : "var(--positive)", textAlign: "right" }}>
                  {comp.valore > 0 ? "+" : ""}{comp.valore}
                  <div style={{ fontFamily: "var(--sans)", fontSize: 10, color: "var(--text-muted)", fontWeight: 400 }}>Mln EUR</div>
                </div>
              </div>

              {/* Barra proporzionale */}
              <div style={{ height: 3, background: "var(--off)", marginBottom: 12 }}>
                <div style={{ height: "100%", width: `${barW}%`, background: barColor, transition: "width 0.6s ease" }} />
              </div>

              <p style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
                {(COMPONENTS_EN[comp.simbolo] || {}).note || comp.note}
              </p>
            </div>
          );
        })}
      </div>

      {/* Formula */}
      <div style={{ marginTop: 1, background: TEXT_MAIN, padding: "20px 28px", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em" }}>SMLLI =</span>
        {SMLLI_COMPONENTS_2024.map((c, i) => (
          <span key={c.id} style={{ fontFamily: "var(--mono)", fontSize: 13, color: c.valore < 0 ? "#f5a3a5" : "#a8d5b5" }}>
            {i > 0 && <span style={{ color: "rgba(255,255,255,0.3)", margin: "0 8px" }}>+</span>}
            {c.simbolo}
          </span>
        ))}
        <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 15, fontWeight: 500, color: "#f5a3a5" }}>
          = {SMLLI_SERIES[SMLLI_SERIES.length - 1].value} Mln EUR
        </span>
      </div>
    </div>
  );
}

// ─── Sezione: Frontalieri ─────────────────────────────────────────────────────

function FrontalieriSection() {
  return (
    <div style={{ padding: "48px 0" }}>
      <SectionLabel>Labour stock data</SectionLabel>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 300, marginBottom: 8 }}>Asymmetry of cross-border worker flows</h2>
      <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--text-muted)", marginBottom: 36 }}>
        Cross-border workers · ITSM vs SMIT · 2015–2024 · Source: UPECEDS, INSS
      </p>

      <div style={{ border: "1px solid var(--border)", background: "white", padding: "28px 28px 16px" }}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={FRONTALIERI_SERIES} barCategoryGap="25%" margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
            {GRID_EL}
            <XAxis dataKey="year" tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={(v,i) => i%2===0?v:""} interval={0} />
            <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={fmtY} width={36} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div style={{ background: "white", border: "1px solid var(--border)", padding: "12px 16px", fontFamily: "var(--mono)", fontSize: 12 }}>
                    <div style={{ color: "var(--text-muted)", fontSize: 10, marginBottom: 8 }}>{label}</div>
                    <div style={{ color: TEXT_MAIN }}>ITSM: <strong>{payload[0]?.value?.toLocaleString("en-GB")}</strong></div>
                    <div style={{ color: "var(--text-muted)" }}>SMIT: <strong>{payload[1]?.value?.toLocaleString("en-GB")}</strong></div>
                  </div>
                );
              }}
            />
            <Bar dataKey="itSm" name="ITSM" fill={TEXT_MAIN}   opacity={0.85} radius={[1, 1, 0, 0]} />
            <Bar dataKey="smIt" name="SMIT" fill={ACCENT_RED}  opacity={0.7}  radius={[1, 1, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div style={{ display: "flex", gap: 24, marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, background: TEXT_MAIN, borderRadius: 1 }} />
              <span style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--text-muted)" }}>ITSM workers</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, background: ACCENT_RED, opacity: 0.7, borderRadius: 1 }} />
              <span style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--text-muted)" }}>SMIT workers</span>
            </div>
          </div>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-muted)" }}>
            Ratio 2024: 4.2 : 1
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Sezione: Contesto ────────────────────────────────────────────────────────

function ContestoSection() {
  return (
    <div style={{ padding: "48px 0" }}>
      <SectionLabel>Contextualisation</SectionLabel>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 300, marginBottom: 36 }}>What –230 million means</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "var(--border)", border: "1px solid var(--border)" }} className="grid-4 smlli-benchmark">
        {BENCHMARK_EN.map((b, i) => (
          <div key={i} style={{ background: "white", padding: "28px 24px" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 26, fontWeight: 500, color: ACCENT_RED, lineHeight: 1, marginBottom: 10 }}>
              {b.valore}
            </div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 500, color: TEXT_MAIN, marginBottom: 6 }}>
              {b.label}
            </div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
              {b.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sezione: Methodology ─────────────────────────────────────────────────────

function MethodologySection() {
  return (
    <div style={{ padding: "48px 0", borderTop: "1px solid var(--border)" }}>
      <SectionLabel>Methodology</SectionLabel>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 300, marginBottom: 36 }}>How the index is constructed</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 40 }} className="grid-2">
        <div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16 }}>Formal definition</div>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 16 }}>
            The SMLLI is defined as the annual net flow of labour income between San Marino and Italy, expressed in current million euros. The formula aggregates four components: income earned by Italian cross-border workers and spent in Italy (F₁, main negative flow), income brought in by San Marinese cross-border workers (F₂), withholding taxes at source (A₁), and direct on-territory spending (S).
          </p>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            Unlike traditional stock indicators — which measure the number of workers — the SMLLI measures the <em>economic value</em> flowing across the border. The relevant variable is not how many people cross the border, but how much income follows that direction.
          </p>
        </div>

        <div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16 }}>Critical parameter: α</div>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 16 }}>
            The most sensitive estimate is the propensity to consume in Italy of ITSM cross-border workers (parameter α). Not being directly observable, it is estimated through three convergent approaches: residential (cross-border worker literature), fixed costs (mortgage, utilities, food expenditure), and UPECEDS surveys on worker profiles.
          </p>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            The current estimate adopts α ≈ 0.78, consistent with the literature and available survey data. The published uncertainty range reflects the sensitivity of the index to parameter α in the interval 0.72–0.84.
          </p>
        </div>
      </div>

      {/* Avvertenze */}
      <div style={{ background: "var(--off)", border: "1px solid var(--border)", padding: "24px 28px" }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16 }}>
          Main methodological limitations
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="grid-2">
          {[
            { n: "01", testo: "Parameter α is estimated, not directly observed. Uncertainty is quantified and published with the estimation range." },
            { n: "02", testo: "SMIT cross-border workers (F₂) are likely underestimated in available sources: ISMAR 5 does not cover all cases." },
            { n: "03", testo: "The boundary between 'leakage' and 'integration' is partly normative: not all income spent in Italy is a loss for SM." },
            { n: "04", testo: "The index does not capture long-term remittances: mortgages, bank deposits, and real estate investments in Italy are not included." },
          ].map(a => (
            <div key={a.n} style={{ display: "flex", gap: 12 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-muted)", minWidth: 20 }}>{a.n}</span>
              <span style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.65 }}>{a.testo}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Download metodologia completa */}
      <div style={{ marginTop: 24, padding: "20px 24px", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, color: TEXT_MAIN, marginBottom: 2 }}>
            Full methodology document
          </div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--text-muted)" }}>
            SMLLI — Methodology v1.0 · PDF · Coming soon
          </div>
        </div>
        <button
          disabled
          style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", background: "none", border: "1px solid var(--border)", padding: "10px 20px", cursor: "not-allowed", color: "var(--text-muted)" }}
          title="Documento in preparazione"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}

// ─── Sezione: Fonti ───────────────────────────────────────────────────────────

const SMLLI_FONTI_EN = [
  { codice: 'INSS',    nome: 'National Social Security Institute of SM',               ruolo: 'Contributions paid by ITSM cross-border workers. Primary source for wage bill F₁.' },
  { codice: 'ISS',     nome: 'Social Security Institute — ISMAR 5 Module',             ruolo: 'San Marinese residents with healthcare costs incurred in Italy for work reasons. Primary proxy for F₂.' },
  { codice: 'UPECEDS', nome: 'Office for Economic Planning, Foreign Trade and Crafts', ruolo: 'Employment data by qualification and domicile of cross-border workers.' },
  { codice: 'FINANZE', nome: 'Secretariat of State for Finance and Budget',            ruolo: 'IGR revenue withheld at source on non-resident income. Source for A₁.' },
  { codice: 'CONV',    nome: 'SMR–IT Tax Convention (2002, protocol 2012)',            ruolo: 'Legal framework governing cross-border taxation mechanisms.' },
];

function FontiSection() {
  return (
    <div style={{ padding: "48px 0 80px", borderTop: "1px solid var(--border)" }}>
      <SectionLabel>Data sources</SectionLabel>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 300, marginBottom: 8 }}>Data and institutions</h2>
      <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--text-muted)", marginBottom: 32 }}>
        The SMLLI requires a more articulated data collection system compared to standard indicators, because two main components (F₁ and F₂) are not directly available in public form.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--border)", border: "1px solid var(--border)", marginBottom: 24 }}>
        {SMLLI_FONTI_EN.map((f) => (
          <div key={f.codice} style={{ background: "white", padding: "20px 24px", display: "grid", gridTemplateColumns: "80px 1fr", gap: 20, alignItems: "start" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 500, color: TEXT_MAIN, paddingTop: 2 }}>{f.codice}</div>
            <div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, color: TEXT_MAIN, marginBottom: 4 }}>{f.nome}</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{f.ruolo}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

// ─── Helper: etichetta di sezione ─────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: ACCENT_RED, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ display: "inline-block", width: 16, height: 1, background: ACCENT_RED }} />
      {children}
    </p>
  );
}

// ─── Tabs di navigazione interna ──────────────────────────────────────────────

const TABS = [
  { id: "indice",      label: "Index & historical series" },
  { id: "componenti",  label: "Components" },
  { id: "metodologia", label: "Methodology" },
  { id: "fonti",       label: "Sources" },
];

// ─── Pagina principale ────────────────────────────────────────────────────────

export default function SMLLIClientEN() {
  const [tab, setTab] = useState("indice");

  return (
    <div style={{ paddingTop: 64 }}>


      <HeroSection />

      {/* Tab bar interna */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "white", position: "sticky", top: 64, zIndex: 100 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background: "none", border: "none",
                borderBottom: tab === t.id ? `2px solid ${TEXT_MAIN}` : "2px solid transparent",
                cursor: "pointer", fontFamily: "var(--sans)", fontSize: 12,
                fontWeight: tab === t.id ? 500 : 400,
                color: tab === t.id ? TEXT_MAIN : "var(--text-muted)",
                padding: "14px 24px", whiteSpace: "nowrap", letterSpacing: "0.04em",
                transition: "color 0.2s",
              }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenuto tab */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
        {tab === "indice"      && <><SerieSection /><ContestoSection /></>}
        {tab === "componenti"  && <><ComponentiSection /><FrontalieriSection /></>}
        {tab === "metodologia" && <MethodologySection />}
        {tab === "fonti"       && <FontiSection />}
      </div>

      {/* Note citazione */}
      <div style={{ borderTop: "1px solid var(--border)", background: "var(--off)", padding: "24px 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Come citare:</strong>{" "}
            {SMLLI_META.citazione}
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
