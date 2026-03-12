/**
 * OESM — Registro degli Indicatori
 *
 * Questo file è il punto di verità unico per tutti gli indicatori monitorati.
 * Per aggiungere un nuovo indicatore: aggiungere un oggetto a INDICATORS.
 *
 * Struttura di un indicatore:
 * {
 *   id:          stringa univoca snake_case (usata come chiave nel DB e nell'API)
 *   label:       nome leggibile in italiano
 *   description: descrizione estesa per la UI
 *   unit:        unità di misura (es. "EUR", "%", "milioni EUR")
 *   category:    categoria di raggruppamento (vedi CATEGORIES)
 *   source:      id della fonte (deve esistere in sources/)
 *   sourceCode:  codice dell'indicatore nella fonte (es. WB series code)
 *   country:     codice ISO3 del paese (default: SMR)
 *   frequency:   "annual" | "quarterly" | "monthly"
 *   decimals:    cifre decimali da mostrare
 *   invertTrend: true se un valore più basso è positivo (es. disoccupazione)
 *   active:      false per disabilitare senza rimuovere
 * }
 */

export const CATEGORIES = {
  macroeconomia:   { label: "Macroeconomia",    order: 1 },
  lavoro:          { label: "Lavoro",            order: 2 },
  prezzi:          { label: "Prezzi",            order: 3 },
  commercio:       { label: "Commercio estero",  order: 4 },
  finanza_pubblica:{ label: "Finanza pubblica",  order: 5 },
  turismo:         { label: "Turismo",           order: 6 },
  settore_bancario:{ label: "Settore bancario",  order: 7 },
};

export const INDICATORS = [

  // ─── MACROECONOMIA ───────────────────────────────────────────────────────────

  {
    id:          "gdp_current_usd",
    label:       "PIL (USD correnti)",
    description: "Prodotto Interno Lordo ai prezzi di mercato, in dollari USA correnti.",
    unit:        "USD",
    category:    "macroeconomia",
    source:      "world_bank",
    sourceCode:  "NY.GDP.MKTP.CD",
    country:     "SMR",
    frequency:   "annual",
    decimals:    0,
    invertTrend: false,
    active:      true,
  },

  {
    id:          "gdp_per_capita_usd",
    label:       "PIL pro capite (USD)",
    description: "PIL diviso per la popolazione residente, in dollari USA correnti.",
    unit:        "USD",
    category:    "macroeconomia",
    source:      "world_bank",
    sourceCode:  "NY.GDP.PCAP.CD",
    country:     "SMR",
    frequency:   "annual",
    decimals:    0,
    invertTrend: false,
    active:      true,
  },

  {
    id:          "gdp_growth",
    label:       "Crescita del PIL",
    description: "Tasso di variazione annua del PIL reale.",
    unit:        "%",
    category:    "macroeconomia",
    source:      "world_bank",
    sourceCode:  "NY.GDP.MKTP.KD.ZG",
    country:     "SMR",
    frequency:   "annual",
    decimals:    2,
    invertTrend: false,
    active:      true,
  },

  {
    id:          "population",
    label:       "Popolazione residente",
    description: "Numero totale di residenti nella Repubblica di San Marino.",
    unit:        "persone",
    category:    "macroeconomia",
    source:      "world_bank",
    sourceCode:  "SP.POP.TOTL",
    country:     "SMR",
    frequency:   "annual",
    decimals:    0,
    invertTrend: false,
    active:      true,
  },

  // ─── LAVORO ──────────────────────────────────────────────────────────────────

  {
    id:          "unemployment_rate",
    label:       "Tasso di disoccupazione",
    description: "Percentuale della forza lavoro in cerca di occupazione.",
    unit:        "%",
    category:    "lavoro",
    source:      "world_bank",
    sourceCode:  "SL.UEM.TOTL.ZS",
    country:     "SMR",
    frequency:   "annual",
    decimals:    1,
    invertTrend: true,
    active:      true,
  },

  {
    id:          "labor_force",
    label:       "Forza lavoro",
    description: "Totale della forza lavoro (occupati + disoccupati).",
    unit:        "persone",
    category:    "lavoro",
    source:      "world_bank",
    sourceCode:  "SL.TLF.TOTL.IN",
    country:     "SMR",
    frequency:   "annual",
    decimals:    0,
    invertTrend: false,
    active:      true,
  },

  // ─── PREZZI ──────────────────────────────────────────────────────────────────

  {
    id:          "inflation_cpi",
    label:       "Inflazione (IPC)",
    description: "Variazione percentuale dell'Indice dei Prezzi al Consumo.",
    unit:        "%",
    category:    "prezzi",
    source:      "world_bank",
    sourceCode:  "FP.CPI.TOTL.ZG",
    country:     "SMR",
    frequency:   "annual",
    decimals:    2,
    invertTrend: true,
    active:      true,
  },

  // ─── COMMERCIO ESTERO ────────────────────────────────────────────────────────

  {
    id:          "exports_goods_services",
    label:       "Esportazioni (% PIL)",
    description: "Esportazioni di beni e servizi in percentuale del PIL.",
    unit:        "% PIL",
    category:    "commercio",
    source:      "world_bank",
    sourceCode:  "NE.EXP.GNFS.ZS",
    country:     "SMR",
    frequency:   "annual",
    decimals:    1,
    invertTrend: false,
    active:      true,
  },

  {
    id:          "imports_goods_services",
    label:       "Importazioni (% PIL)",
    description: "Importazioni di beni e servizi in percentuale del PIL.",
    unit:        "% PIL",
    category:    "commercio",
    source:      "world_bank",
    sourceCode:  "NE.IMP.GNFS.ZS",
    country:     "SMR",
    frequency:   "annual",
    decimals:    1,
    invertTrend: true,
    active:      true,
  },

  {
    id:          "trade_openness",
    label:       "Apertura commerciale",
    description: "Somma di esportazioni e importazioni in % del PIL. Misura l'integrazione nel commercio mondiale.",
    unit:        "% PIL",
    category:    "commercio",
    source:      "world_bank",
    sourceCode:  "NE.TRD.GNFS.ZS",
    country:     "SMR",
    frequency:   "annual",
    decimals:    1,
    invertTrend: false,
    active:      true,
  },

  // ─── FINANZA PUBBLICA ────────────────────────────────────────────────────────

  {
    id:          "govt_expenditure_pct_gdp",
    label:       "Spesa pubblica (% PIL)",
    description: "Spesa del governo generale in percentuale del PIL.",
    unit:        "% PIL",
    category:    "finanza_pubblica",
    source:      "world_bank",
    sourceCode:  "GC.XPN.TOTL.GD.ZS",
    country:     "SMR",
    frequency:   "annual",
    decimals:    1,
    invertTrend: false,
    active:      true,
  },

  // ─── TURISMO ────────────────────────────────────────────────────────────────

  {
    id:          "tourism_arrivals",
    label:       "Arrivi turistici internazionali",
    description: "Numero di arrivi di turisti internazionali nel territorio sammarinese.",
    unit:        "arrivi",
    category:    "turismo",
    source:      "world_bank",
    sourceCode:  "ST.INT.ARVL",
    country:     "SMR",
    frequency:   "annual",
    decimals:    0,
    invertTrend: false,
    active:      true,
  },

  {
    id:          "tourism_receipts_usd",
    label:       "Entrate dal turismo (USD)",
    description: "Entrate internazionali da turismo in dollari USA correnti.",
    unit:        "USD",
    category:    "turismo",
    source:      "world_bank",
    sourceCode:  "ST.INT.RCPT.CD",
    country:     "SMR",
    frequency:   "annual",
    decimals:    0,
    invertTrend: false,
    active:      true,
  },

];

// Mappa rapida per lookup per id
export const INDICATORS_MAP = Object.fromEntries(
  INDICATORS.map(ind => [ind.id, ind])
);

// Solo indicatori attivi
export const ACTIVE_INDICATORS = INDICATORS.filter(ind => ind.active);

// Indicatori per categoria
export const INDICATORS_BY_CATEGORY = ACTIVE_INDICATORS.reduce((acc, ind) => {
  if (!acc[ind.category]) acc[ind.category] = [];
  acc[ind.category].push(ind);
  return acc;
}, {});
