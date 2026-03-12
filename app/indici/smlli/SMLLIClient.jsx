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
  SMLLI_BENCHMARK_2024,
  FRONTALIERI_SERIES,
  SMLLI_FONTI,
} from "@/lib/smlli";
import Footer from "@/components/layout/Footer";

// ─── Costanti di stile ────────────────────────────────────────────────────────

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
          {typeof p.value === "number" ? p.value.toLocaleString("it-IT") : p.value} {unit}
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
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)" }}>Indici originali OESM</span>
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
              <span className="tag">Indice originale OESM</span>
              <span className="tag">V{SMLLI_META.versione} · {SMLLI_META.primaRelease}</span>
              <span className="tag">{SMLLI_META.stato}</span>
            </div>
          </div>

          {/* KPI box */}
          <div style={{ border: "1px solid var(--border)", background: "white", padding: "32px 36px", minWidth: 260, textAlign: "right" }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>
              Stima {latest.year}
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

// ─── Sezione: Serie storica ───────────────────────────────────────────────────

function SerieSection() {
  return (
    <div style={{ padding: "64px 0 48px" }}>
      <SectionLabel>Serie storica</SectionLabel>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 300, marginBottom: 8 }}>Evoluzione del leakage · 2015–2024</h2>
      <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--text-muted)", marginBottom: 36 }}>
        Milioni di EUR correnti · valori negativi = uscita netta di reddito · tutte le osservazioni sono stime
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
            <span style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--text-muted)" }}>Stima centrale</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 10, background: ACCENT_RED, opacity: 0.12, borderRadius: 2 }} />
            <span style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--text-muted)" }}>Intervallo di stima</span>
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
      <SectionLabel>Decomposizione 2024</SectionLabel>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 300, marginBottom: 8 }}>Le componenti dell'indice</h2>
      <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--text-muted)", marginBottom: 36 }}>
        SMLLI = F₁ + F₂ + A₁ + S · Stima baseline anno 2024 · valori in milioni EUR
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
                    {comp.label}
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
                {comp.note}
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
      <SectionLabel>Dato di stock</SectionLabel>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 300, marginBottom: 8 }}>Asimmetria dei flussi di frontalieri</h2>
      <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--text-muted)", marginBottom: 36 }}>
        Lavoratori frontalieri · ITSM vs SMIT · 2015–2024 · Fonte: UPECEDS, INSS
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
                    <div style={{ color: TEXT_MAIN }}>ITSM: <strong>{payload[0]?.value?.toLocaleString("it-IT")}</strong></div>
                    <div style={{ color: "var(--text-muted)" }}>SMIT: <strong>{payload[1]?.value?.toLocaleString("it-IT")}</strong></div>
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
              <span style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--text-muted)" }}>Frontalieri ITSM</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, background: ACCENT_RED, opacity: 0.7, borderRadius: 1 }} />
              <span style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--text-muted)" }}>Frontalieri SMIT</span>
            </div>
          </div>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-muted)" }}>
            Rapporto 2024: 4,2 : 1
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
      <SectionLabel>Contestualizzazione</SectionLabel>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 300, marginBottom: 36 }}>Cosa significa –230 milioni</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "var(--border)", border: "1px solid var(--border)" }} className="grid-4 smlli-benchmark">
        {SMLLI_BENCHMARK_2024.map((b, i) => (
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

// ─── Sezione: Metodologia ─────────────────────────────────────────────────────

function MetodologiaSection() {
  return (
    <div style={{ padding: "48px 0", borderTop: "1px solid var(--border)" }}>
      <SectionLabel>Metodologia</SectionLabel>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 300, marginBottom: 36 }}>Come è costruito l'indice</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 40 }} className="grid-2">
        <div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16 }}>Definizione formale</div>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 16 }}>
            Lo SMLLI è definito come il flusso netto annuale di redditi da lavoro tra San Marino e l'Italia, espresso in milioni di euro correnti. La formula addiziona quattro componenti: il reddito dei frontalieri italiani speso in Italia (F₁, flusso principale negativo), il reddito portato in entrata dai frontalieri sammarinesi (F₂), le ritenute fiscali alla fonte (A₁) e la spesa diretta sul territorio (S).
          </p>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            A differenza degli indicatori di stock tradizionali — che misurano il numero di lavoratori — lo SMLLI misura il <em>valore economico</em> che fluisce attraverso il confine. La variabile rilevante non è quante persone attraversano il confine, ma quanto reddito segue quella direzione.
          </p>
        </div>

        <div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16 }}>Parametro critico: α</div>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 16 }}>
            La stima più delicata è la propensione al consumo in Italia dei frontalieri ITSM (parametro α). Non essendo direttamente osservabile, viene stimata attraverso tre approcci convergenti: residenziale (letteratura sui lavoratori transfrontalieri), costi fissi (mutuo, utenze, spesa alimentare) e survey UPECEDS sui profili dei frontalieri.
          </p>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            La stima corrente adotta α ≈ 0.78, coerente con la letteratura e con i dati survey disponibili. L'intervallo di incertezza pubblicato riflette la sensitività dell'indice al parametro α nell'intervallo 0.72–0.84.
          </p>
        </div>
      </div>

      {/* Avvertenze */}
      <div style={{ background: "var(--off)", border: "1px solid var(--border)", padding: "24px 28px" }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16 }}>
          Limitazioni metodologiche principali
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="grid-2">
          {[
            { n: "01", testo: "Il parametro α è stimato, non osservato direttamente. L'incertezza è quantificata e pubblicata con l'intervallo di stima." },
            { n: "02", testo: "I frontalieri SMIT (F₂) sono probabilmente sottostimati nelle fonti disponibili: ISMAR 5 non copre tutti i casi." },
            { n: "03", testo: "Il confine tra 'leakage' e 'integrazione' è in parte normativo: non tutto il reddito speso in Italia è una perdita per SM." },
            { n: "04", testo: "L'indice non cattura le rimesse di lungo periodo: mutui, depositi bancari, investimenti immobiliari in Italia non sono inclusi." },
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
            Documento metodologico completo
          </div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--text-muted)" }}>
            SMLLI — Metodologia v1.0 · PDF · Prossimamente disponibile
          </div>
        </div>
        <button
          disabled
          style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", background: "none", border: "1px solid var(--border)", padding: "10px 20px", cursor: "not-allowed", color: "var(--text-muted)" }}
          title="Documento in preparazione"
        >
          Scarica PDF
        </button>
      </div>
    </div>
  );
}

// ─── Sezione: Fonti ───────────────────────────────────────────────────────────

function FontiSection() {
  return (
    <div style={{ padding: "48px 0 80px", borderTop: "1px solid var(--border)" }}>
      <SectionLabel>Architettura delle fonti</SectionLabel>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 300, marginBottom: 8 }}>Dati e istituzioni</h2>
      <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--text-muted)", marginBottom: 32 }}>
        Lo SMLLI richiede un sistema di raccolta dati più articolato rispetto agli indicatori standard, perché due componenti principali (F₁ e F₂) non sono direttamente disponibili in forma pubblica.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--border)", border: "1px solid var(--border)", marginBottom: 24 }}>
        {SMLLI_FONTI.map((f) => (
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
  { id: "indice",      label: "Indice e serie storica" },
  { id: "componenti",  label: "Componenti" },
  { id: "metodologia", label: "Metodologia" },
  { id: "fonti",       label: "Fonti" },
];

// ─── Pagina principale ────────────────────────────────────────────────────────

export default function SMLLIClient() {
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
        {tab === "metodologia" && <MetodologiaSection />}
        {tab === "fonti"       && <FontiSection />}
      </div>

      {/* Nota citazione */}
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
