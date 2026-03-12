/**
 * OESM — SMLLI: San Marino Labour Income Leakage Index
 *
 * Indicatore proprietario dell'Osservatorio Economico di San Marino.
 * Versione metodologica: 1.0 (2025)
 *
 * Lo SMLLI misura il flusso netto annuale di redditi da lavoro
 * tra la Repubblica di San Marino e l'Italia, espresso in milioni
 * di euro correnti. Un valore negativo indica un'uscita netta di
 * reddito dal sistema economico sammarinese (leakage).
 */

// ─── Metadati dell'indice ─────────────────────────────────────────────────────

export const SMLLI_META = {
  id:           "smlli",
  label:        "SMLLI",
  labelEsteso:  "San Marino Labour Income Leakage Index",
  unita:        "milioni EUR",
  categoria:    "lavoro",
  frequenza:    "Annuale",
  primaRelease: 2025,
  versione:     "1.0",
  stato:        "Stima preliminare",  // diventerà "Ufficiale" dalla release 2026
  fonte:        "OESM — Elaborazione originale",
  citazione:    "Osservatorio Economico di San Marino (2025). SMLLI — San Marino Labour Income Leakage Index. Versione 1.0. oesm.net",
};

// ─── Serie storica ────────────────────────────────────────────────────────────
// Valori espressi in milioni di EUR correnti (negativi = leakage netto)
// Dati 2015–2023: stime retrospettive su dati INSS/UPECEDS pubblici
// Dato 2024: stima baseline (intervallo –220/–240 Mln EUR)

export const SMLLI_SERIES = [
  { year: 2015, value: -178, low: -192, high: -164, isEstimate: true },
  { year: 2016, value: -184, low: -198, high: -170, isEstimate: true },
  { year: 2017, value: -191, low: -206, high: -177, isEstimate: true },
  { year: 2018, value: -198, low: -213, high: -183, isEstimate: true },
  { year: 2019, value: -204, low: -220, high: -189, isEstimate: true },
  { year: 2020, value: -168, low: -182, high: -155, isEstimate: true },  // contrazione Covid
  { year: 2021, value: -187, low: -202, high: -173, isEstimate: true },
  { year: 2022, value: -209, low: -225, high: -193, isEstimate: true },
  { year: 2023, value: -218, low: -235, high: -202, isEstimate: true },
  { year: 2024, value: -230, low: -240, high: -220, isEstimate: true },  // stima baseline ufficiale
];

// ─── Decomposizione per componente (anno 2024) ───────────────────────────────
// Fonte: Metodologia SMLLI v1.0 — Tabella 3.1

export const SMLLI_COMPONENTS_2024 = [
  {
    id:        "F1",
    simbolo:   "F₁",
    label:     "Redditi frontalieri ITSM spesi in Italia",
    valore:    -298,
    note:      "Massa salariale netta × propensione al consumo in Italia (α ≈ 0.78)",
    segno:     "negativo",
  },
  {
    id:        "F2",
    simbolo:   "F₂",
    label:     "Redditi frontalieri SMIT portati in entrata",
    valore:    +42,
    note:      "Stima da modulo ISMAR 5 / INPS. Sottostima sistematica probabile.",
    segno:     "positivo",
  },
  {
    id:        "A1",
    simbolo:   "A₁",
    label:     "Ritenute fiscali trattenute alla fonte (IGR)",
    valore:    +18,
    note:      "Gettito IGR su redditi non-residenti. Fonte: Segreteria Finanze SMR.",
    segno:     "positivo",
  },
  {
    id:        "S",
    simbolo:   "S",
    label:     "Spesa diretta dei frontalieri ITSM sul territorio",
    valore:    +8,
    note:      "Stima conservativa. Carburante, alimentari, servizi commerciali.",
    segno:     "positivo",
  },
];

// ─── Confronti contestuali (anno 2024) ───────────────────────────────────────

export const SMLLI_BENCHMARK_2024 = [
  { label: "SMLLI vs PIL sammarinese",       valore: "~12%",   desc: "Il leakage equivale a circa il 12% del PIL" },
  { label: "SMLLI vs spesa sanitaria SMR",   valore: "~1×",    desc: "Paragonabile all'intera spesa sanitaria pubblica annua" },
  { label: "SMLLI vs investimenti pubblici", valore: "~5×",    desc: "Cinque volte la capacità di investimento pubblico" },
  { label: "Leakage per frontaliere ITSM",  valore: "~25–30K €", desc: "Potere d'acquisto medio che esce per lavoratore/anno" },
];

// ─── Dati sui frontalieri (stock) ─────────────────────────────────────────────

export const FRONTALIERI_SERIES = [
  { year: 2015, itSm: 7980, smIt: 1820 },
  { year: 2016, itSm: 8120, smIt: 1870 },
  { year: 2017, itSm: 8340, smIt: 1910 },
  { year: 2018, itSm: 8510, smIt: 1960 },
  { year: 2019, itSm: 8690, smIt: 2010 },
  { year: 2020, itSm: 7840, smIt: 1780 },  // effetto Covid
  { year: 2021, itSm: 8210, smIt: 1890 },
  { year: 2022, itSm: 8560, smIt: 1980 },
  { year: 2023, itSm: 8730, smIt: 2050 },
  { year: 2024, itSm: 8820, smIt: 2100 },
];

// ─── Fonti dati ───────────────────────────────────────────────────────────────

export const SMLLI_FONTI = [
  { codice: "INSS",    nome: "Istituto Nazionale della Sicurezza Sociale di SM", ruolo: "Contributi versati dai frontalieri ITSM. Fonte primaria per massa salariale F₁." },
  { codice: "ISS",     nome: "Istituto per la Sicurezza Sociale — Modulo ISMAR 5", ruolo: "Sammarinesi con spese sanitarie sostenute in Italia per ragioni lavorative. Proxy primario per F₂." },
  { codice: "UPECEDS", nome: "Ufficio Programmazione Economica, Commercio Estero e Artigianato", ruolo: "Dati sull'occupazione per qualifica e posizione anagrafica dei frontalieri." },
  { codice: "FINANZE", nome: "Segreteria di Stato per le Finanze e il Bilancio", ruolo: "Gettito IGR trattenuto alla fonte su redditi di non residenti. Fonte per A₁." },
  { codice: "CONV",    nome: "Convenzione fiscale SM-IT (2002, protocollo 2012)", ruolo: "Quadro giuridico che determina i meccanismi di tassazione transfrontaliera." },
];
