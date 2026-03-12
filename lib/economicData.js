// OESM — Banca Dati Economica di San Marino
// Versione: 2024-v1
// Licenza: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/
// Citazione: OESM (2024). Banca Dati Economica di San Marino. https://oesm.net
// Dati storici 2010–2023. Fonti: World Bank, FMI, Banca Centrale SMR, Gov. SMR.
// Valori monetari in EUR. Conversione da USD con tassi medi annui BCE.

export const DATASET_META = {
  version:         "2024-v1",
  released:        "2024-12-01",
  lastUpdated:     "2024-12-01",
  country:         "San Marino",
  countryCode:     "SMR",
  coverageStart:   2010,
  coverageEnd:     2023,
  license:         "CC BY 4.0",
  licenseUrl:      "https://creativecommons.org/licenses/by/4.0/",
  publisher:       "OESM — Osservatorio Economico di San Marino",
  publisherUrl:    "https://oesm.net",
  doi:             null,
  citationAPA:     "OESM — Osservatorio Economico di San Marino. (2024). Banca Dati Economica di San Marino, 2010–2023 (Versione 2024-v1) [Dataset]. https://oesm.net",
  citationChicago: "OESM — Osservatorio Economico di San Marino. \"Banca Dati Economica di San Marino, 2010–2023.\" Dataset, versione 2024-v1. Accessed 2024. https://oesm.net.",
  eurConversionRates: {
    2010: 0.7550, 2011: 0.7194, 2012: 0.7783, 2013: 0.7530,
    2014: 0.7527, 2015: 0.9013, 2016: 0.9034, 2017: 0.8852,
    2018: 0.8468, 2019: 0.8933, 2020: 0.8755, 2021: 0.8455,
    2022: 0.9496, 2023: 0.9246,
  },
};

export const CATEGORIES = {
  macroeconomia:    { label: "Macroeconomia",    order: 1 },
  lavoro:           { label: "Lavoro",            order: 2 },
  prezzi:           { label: "Prezzi",            order: 3 },
  commercio:        { label: "Commercio estero",  order: 4 },
  finanza_pubblica: { label: "Finanza pubblica",  order: 5 },
  turismo:          { label: "Turismo",           order: 6 },
};

export const INDICATORS = [
  {
    id: "gdp_eur", label: "PIL (EUR correnti)", unit: "EUR",
    category: "macroeconomia", decimals: 0, invertTrend: false,
    source: "World Bank", sourceCode: "NY.GDP.MKTP.CD",
    sourceUrl: "https://data360.worldbank.org/en/indicator/NY.GDP.MKTP.CD?entity=SMR",
    lastUpdated: "2024-07-01",
    methodologyNote: "PIL a prezzi correnti in dollari USA, convertito in EUR con tassi medi annui BCE. La serie presenta un break metodologico nel 2006 quando la World Bank ha aggiornato la metodologia di stima per San Marino. I dati 2010–2023 sono omogenei e comparabili tra loro.",
    conversionNote: "Valori originali in USD (NY.GDP.MKTP.CD), convertiti in EUR con tassi di cambio medi annui BCE (fonte: ECB Statistical Data Warehouse, serie EXR.A.USD.EUR.SP00.A).",
  },
  {
    id: "gdp_per_capita", label: "PIL pro capite (EUR)", unit: "EUR",
    category: "macroeconomia", decimals: 0, invertTrend: false,
    source: "World Bank", sourceCode: "NY.GDP.PCAP.CD",
    sourceUrl: "https://data360.worldbank.org/en/indicator/NY.GDP.PCAP.CD?entity=SMR",
    lastUpdated: "2024-07-01",
    methodologyNote: "PIL pro capite calcolato come rapporto PIL/popolazione residente media annua. Convertito da USD a EUR. La metodologia World Bank utilizza la stima della popolazione residente ufficiale fornita dall'Ufficio di Stato per la Statistica di San Marino.",
    conversionNote: "Valori originali in USD (NY.GDP.PCAP.CD), convertiti in EUR con tassi di cambio medi annui BCE.",
  },
  {
    id: "gdp_growth", label: "Crescita del PIL", unit: "%",
    category: "macroeconomia", decimals: 2, invertTrend: false,
    source: "World Bank", sourceCode: "NY.GDP.MKTP.KD.ZG",
    sourceUrl: "https://data360.worldbank.org/en/indicator/NY.GDP.MKTP.KD.ZG?entity=SMR",
    lastUpdated: "2024-07-01",
    methodologyNote: "Tasso di crescita annuale del PIL reale (a prezzi costanti). Non richiede conversione valutaria. Il dato 2020 (–10,1%) riflette l'impatto della pandemia COVID-19. Il rimbalzo 2021–2022 è consistente con il ciclo di ripresa post-pandemia.",
    conversionNote: null,
  },
  {
    id: "population", label: "Popolazione residente", unit: "persone",
    category: "macroeconomia", decimals: 0, invertTrend: false,
    source: "World Bank", sourceCode: "SP.POP.TOTL",
    sourceUrl: "https://data360.worldbank.org/en/indicator/SP.POP.TOTL?entity=SMR",
    lastUpdated: "2024-07-01",
    methodologyNote: "Popolazione residente al 1° luglio di ogni anno (stima di metà anno). Fonte primaria: Ufficio di Stato per la Statistica di San Marino, trasmessa a World Bank. Il calo 2020–2022 è correlato alle variazioni nei flussi migratori durante la pandemia.",
    conversionNote: null,
  },
  {
    id: "unemployment", label: "Tasso di disoccupazione", unit: "%",
    category: "lavoro", decimals: 1, invertTrend: true,
    source: "World Bank", sourceCode: "SL.UEM.TOTL.ZS",
    sourceUrl: "https://data360.worldbank.org/en/indicator/SL.UEM.TOTL.ZS?entity=SMR",
    lastUpdated: "2024-07-01",
    methodologyNote: "Percentuale della forza lavoro totale priva di occupazione e attivamente in cerca di lavoro (definizione ILO). Il picco 2014 (8,7%) riflette le conseguenze tardive della crisi del settore bancario sammarinese (2008–2013). Trend invertito: valori più bassi indicano performance migliore.",
    conversionNote: null,
  },
  {
    id: "labor_force", label: "Forza lavoro totale", unit: "persone",
    category: "lavoro", decimals: 0, invertTrend: false,
    source: "World Bank", sourceCode: "SL.TLF.TOTL.IN",
    sourceUrl: "https://data360.worldbank.org/en/indicator/SL.TLF.TOTL.IN?entity=SMR",
    lastUpdated: "2024-07-01",
    methodologyNote: "Totale della forza lavoro: occupati + disoccupati in cerca di impiego (definizione ILO). Non include i lavoratori frontalieri italiani che lavorano in San Marino (ITSM), che sono conteggiati nella forza lavoro italiana. Questo dato sottostima il totale degli addetti che operano sul territorio sammarinese.",
    conversionNote: null,
  },
  {
    id: "inflation", label: "Inflazione (IPC)", unit: "%",
    category: "prezzi", decimals: 2, invertTrend: true,
    source: "World Bank", sourceCode: "FP.CPI.TOTL.ZG",
    sourceUrl: "https://data360.worldbank.org/en/indicator/FP.CPI.TOTL.ZG?entity=SMR",
    lastUpdated: "2024-07-01",
    methodologyNote: "Variazione percentuale annua dell'Indice dei Prezzi al Consumo (IPC). San Marino adotta l'euro per accordo monetario con l'UE (2012): il livello dei prezzi è fortemente influenzato dalla politica monetaria BCE. Il picco 2022 (8,7%) riflette il ciclo inflazionistico post-pandemia europeo.",
    conversionNote: null,
  },
  {
    id: "exports_pct", label: "Esportazioni (% PIL)", unit: "% PIL",
    category: "commercio", decimals: 1, invertTrend: false,
    source: "World Bank", sourceCode: "NE.EXP.GNFS.ZS",
    sourceUrl: "https://data360.worldbank.org/en/indicator/NE.EXP.GNFS.ZS?entity=SMR",
    lastUpdated: "2024-07-01",
    methodologyNote: "Esportazioni di beni e servizi come percentuale del PIL. I valori superiori al 100% del PIL riflettono la struttura di piccola economia aperta completamente integrata nell'area economica italiana.",
    conversionNote: null,
  },
  {
    id: "imports_pct", label: "Importazioni (% PIL)", unit: "% PIL",
    category: "commercio", decimals: 1, invertTrend: true,
    source: "World Bank", sourceCode: "NE.IMP.GNFS.ZS",
    sourceUrl: "https://data360.worldbank.org/en/indicator/NE.IMP.GNFS.ZS?entity=SMR",
    lastUpdated: "2024-07-01",
    methodologyNote: "Importazioni di beni e servizi come percentuale del PIL. San Marino importa quasi la totalità dei beni di consumo e industriali dall'Italia, con cui condivide confine e accordi doganali. Il saldo commerciale negativo strutturale è una caratteristica permanente dell'economia sammarinese.",
    conversionNote: null,
  },
  {
    id: "trade_openness", label: "Apertura commerciale (% PIL)", unit: "% PIL",
    category: "commercio", decimals: 1, invertTrend: false,
    source: "World Bank", sourceCode: "NE.TRD.GNFS.ZS",
    sourceUrl: "https://data360.worldbank.org/en/indicator/NE.TRD.GNFS.ZS?entity=SMR",
    lastUpdated: "2024-07-01",
    methodologyNote: "Calcolato come (Esportazioni + Importazioni) / PIL × 100. I valori intorno al 300–350% collocano San Marino tra le economie più aperte al mondo, comparabile a Hong Kong e Singapore.",
    conversionNote: null,
  },
  {
    id: "govt_expenditure", label: "Spesa pubblica (% PIL)", unit: "% PIL",
    category: "finanza_pubblica", decimals: 1, invertTrend: false,
    source: "World Bank", sourceCode: "GC.XPN.TOTL.GD.ZS",
    sourceUrl: "https://data360.worldbank.org/en/indicator/GC.XPN.TOTL.GD.ZS?entity=SMR",
    lastUpdated: "2024-07-01",
    methodologyNote: "Spesa totale dell'amministrazione centrale come percentuale del PIL, incluse spese correnti e in conto capitale, escluso il rimborso del debito. Il picco 2020 (35,6%) riflette la spesa straordinaria per COVID-19.",
    conversionNote: null,
  },
  {
    id: "tourism_arrivals", label: "Arrivi turistici internazionali", unit: "arrivi",
    category: "turismo", decimals: 0, invertTrend: false,
    source: "World Bank", sourceCode: "ST.INT.ARVL",
    sourceUrl: "https://data360.worldbank.org/en/indicator/ST.INT.ARVL?entity=SMR",
    lastUpdated: "2024-07-01",
    methodologyNote: "Numero di visitatori internazionali (turisti con pernottamento + escursionisti giornalieri). San Marino ha un'alta quota di escursionisti giornalieri data la vicinanza alla Riviera Adriatica. Il crollo 2020 (810.000, –65%) è interamente attribuibile alle restrizioni COVID-19.",
    conversionNote: null,
  },
  {
    id: "tourism_receipts", label: "Entrate dal turismo (EUR)", unit: "EUR",
    category: "turismo", decimals: 0, invertTrend: false,
    source: "World Bank", sourceCode: "ST.INT.RCPT.CD",
    sourceUrl: "https://data360.worldbank.org/en/indicator/ST.INT.RCPT.CD?entity=SMR",
    lastUpdated: "2024-07-01",
    methodologyNote: "Entrate da turismo internazionale in valuta estera (spesa dei visitatori internazionali sul territorio), convertite in EUR. Include pernottamento, ristorazione, acquisti e servizi.",
    conversionNote: "Valori originali in USD (ST.INT.RCPT.CD), convertiti in EUR con tassi di cambio medi annui BCE.",
  },
];

export const SERIES = {
  gdp_eur: [
    { year: 2010, value: 1177045000 }, { year: 2011, value: 1235242000 },
    { year: 2012, value: 1264250000 }, { year: 2013, value: 1219860000 },
    { year: 2014, value: 1215448000 }, { year: 2015, value: 1371942000 },
    { year: 2016, value: 1414760000 }, { year: 2017, value: 1507013000 },
    { year: 2018, value: 1476321000 }, { year: 2019, value: 1502026000 },
    { year: 2020, value: 1326901000 }, { year: 2021, value: 1484665000 },
    { year: 2022, value: 1780164000 }, { year: 2023, value: 1776925000 },
  ],
  gdp_per_capita: [
    { year: 2010, value: 35493 }, { year: 2011, value: 37259 },
    { year: 2012, value: 38130 }, { year: 2013, value: 36746 },
    { year: 2014, value: 36592 }, { year: 2015, value: 41239 },
    { year: 2016, value: 42488 }, { year: 2017, value: 45308 },
    { year: 2018, value: 44408 }, { year: 2019, value: 45195 },
    { year: 2020, value: 39904 }, { year: 2021, value: 44667 },
    { year: 2022, value: 52450 }, { year: 2023, value: 52189 },
  ],
  gdp_growth: [
    { year: 2010, value: 3.1  }, { year: 2011, value: 1.2  },
    { year: 2012, value: -5.4 }, { year: 2013, value: -1.9 },
    { year: 2014, value: 0.5  }, { year: 2015, value: 2.4  },
    { year: 2016, value: 2.9  }, { year: 2017, value: 2.7  },
    { year: 2018, value: 1.6  }, { year: 2019, value: 1.4  },
    { year: 2020, value: -10.1}, { year: 2021, value: 8.1  },
    { year: 2022, value: 7.1  }, { year: 2023, value: 2.4  },
  ],
  population: [
    { year: 2010, value: 31788 }, { year: 2011, value: 31958 },
    { year: 2012, value: 32208 }, { year: 2013, value: 32404 },
    { year: 2014, value: 32648 }, { year: 2015, value: 33006 },
    { year: 2016, value: 33562 }, { year: 2017, value: 33671 },
    { year: 2018, value: 33860 }, { year: 2019, value: 34013 },
    { year: 2020, value: 33938 }, { year: 2021, value: 33745 },
    { year: 2022, value: 33660 }, { year: 2023, value: 33745 },
  ],
  unemployment: [
    { year: 2010, value: 5.2 }, { year: 2011, value: 5.8 },
    { year: 2012, value: 7.0 }, { year: 2013, value: 8.0 },
    { year: 2014, value: 8.7 }, { year: 2015, value: 8.6 },
    { year: 2016, value: 8.1 }, { year: 2017, value: 7.4 },
    { year: 2018, value: 6.9 }, { year: 2019, value: 6.4 },
    { year: 2020, value: 8.2 }, { year: 2021, value: 7.8 },
    { year: 2022, value: 6.1 }, { year: 2023, value: 5.4 },
  ],
  labor_force: [
    { year: 2010, value: 22100 }, { year: 2011, value: 22400 },
    { year: 2012, value: 22600 }, { year: 2013, value: 22900 },
    { year: 2014, value: 23100 }, { year: 2015, value: 23400 },
    { year: 2016, value: 23700 }, { year: 2017, value: 24000 },
    { year: 2018, value: 24200 }, { year: 2019, value: 24400 },
    { year: 2020, value: 23900 }, { year: 2021, value: 24100 },
    { year: 2022, value: 24500 }, { year: 2023, value: 24800 },
  ],
  inflation: [
    { year: 2010, value: 2.1  }, { year: 2011, value: 2.8  },
    { year: 2012, value: 2.9  }, { year: 2013, value: 1.3  },
    { year: 2014, value: 0.6  }, { year: 2015, value: 0.1  },
    { year: 2016, value: -0.2 }, { year: 2017, value: 0.9  },
    { year: 2018, value: 1.3  }, { year: 2019, value: 0.6  },
    { year: 2020, value: -0.1 }, { year: 2021, value: 2.4  },
    { year: 2022, value: 8.7  }, { year: 2023, value: 5.2  },
  ],
  exports_pct: [
    { year: 2010, value: 148.2 }, { year: 2011, value: 152.4 },
    { year: 2012, value: 145.1 }, { year: 2013, value: 143.8 },
    { year: 2014, value: 147.6 }, { year: 2015, value: 155.3 },
    { year: 2016, value: 153.8 }, { year: 2017, value: 158.2 },
    { year: 2018, value: 161.4 }, { year: 2019, value: 159.7 },
    { year: 2020, value: 138.9 }, { year: 2021, value: 162.3 },
    { year: 2022, value: 169.8 }, { year: 2023, value: 166.4 },
  ],
  imports_pct: [
    { year: 2010, value: 162.4 }, { year: 2011, value: 165.8 },
    { year: 2012, value: 158.3 }, { year: 2013, value: 156.9 },
    { year: 2014, value: 160.2 }, { year: 2015, value: 167.4 },
    { year: 2016, value: 166.1 }, { year: 2017, value: 170.5 },
    { year: 2018, value: 173.2 }, { year: 2019, value: 171.8 },
    { year: 2020, value: 149.6 }, { year: 2021, value: 174.1 },
    { year: 2022, value: 181.2 }, { year: 2023, value: 178.3 },
  ],
  trade_openness: [
    { year: 2010, value: 310.6 }, { year: 2011, value: 318.2 },
    { year: 2012, value: 303.4 }, { year: 2013, value: 300.7 },
    { year: 2014, value: 307.8 }, { year: 2015, value: 322.7 },
    { year: 2016, value: 319.9 }, { year: 2017, value: 328.7 },
    { year: 2018, value: 334.6 }, { year: 2019, value: 331.5 },
    { year: 2020, value: 288.5 }, { year: 2021, value: 336.4 },
    { year: 2022, value: 351.0 }, { year: 2023, value: 344.7 },
  ],
  govt_expenditure: [
    { year: 2010, value: 28.4 }, { year: 2011, value: 29.1 },
    { year: 2012, value: 31.2 }, { year: 2013, value: 32.8 },
    { year: 2014, value: 33.4 }, { year: 2015, value: 33.1 },
    { year: 2016, value: 32.7 }, { year: 2017, value: 31.9 },
    { year: 2018, value: 31.4 }, { year: 2019, value: 30.8 },
    { year: 2020, value: 35.6 }, { year: 2021, value: 32.4 },
    { year: 2022, value: 30.1 }, { year: 2023, value: 29.6 },
  ],
  tourism_arrivals: [
    { year: 2010, value: 1820000 }, { year: 2011, value: 1910000 },
    { year: 2012, value: 1940000 }, { year: 2013, value: 1980000 },
    { year: 2014, value: 2020000 }, { year: 2015, value: 2010000 },
    { year: 2016, value: 2080000 }, { year: 2017, value: 2190000 },
    { year: 2018, value: 2240000 }, { year: 2019, value: 2310000 },
    { year: 2020, value:  810000 }, { year: 2021, value: 1290000 },
    { year: 2022, value: 2050000 }, { year: 2023, value: 2280000 },
  ],
  tourism_receipts: [
    { year: 2010, value: 235560000 }, { year: 2011, value: 235832000 },
    { year: 2012, value: 259852000 }, { year: 2013, value: 256773000 },
    { year: 2014, value: 262392000 }, { year: 2015, value: 308484000 },
    { year: 2016, value: 321824000 }, { year: 2017, value: 335286000 },
    { year: 2018, value: 331177000 }, { year: 2019, value: 359879000 },
    { year: 2020, value: 123657000 }, { year: 2021, value: 189280000 },
    { year: 2022, value: 351072000 }, { year: 2023, value: 381100000 },
  ],
};

export const KPI = INDICATORS.map(ind => {
  const series = SERIES[ind.id] || [];
  const last   = series[series.length - 1];
  const prev   = series[series.length - 2];
  const yoy    = last && prev && prev.value !== 0
    ? +( ((last.value - prev.value) / Math.abs(prev.value)) * 100 ).toFixed(2)
    : null;
  return { ...ind, year: last ? last.year : null, value: last ? last.value : null, yoy };
});

export const FONTI = [
  { nome: "Banca Mondiale — World Bank Open Data", tipo: "Organizzazione internazionale", url: "https://data360.worldbank.org/en/economy/SMR", frequenza: "Annuale / Automatica", note: "13 indicatori via API pubblica" },
  { nome: "FMI — International Monetary Fund",     tipo: "Organizzazione internazionale", url: "https://www.imf.org/external/datamapper",       frequenza: "Annuale / Automatica",       note: "WEO: crescita, inflazione, debito" },
  { nome: "Banca Centrale della Rep. di San Marino", tipo: "Banca centrale", url: "https://www.bcsm.sm", frequenza: "Mensile / In integrazione", note: "Credito bancario, riserve" },
  { nome: "Segreteria di Stato per le Finanze",    tipo: "Governo SMR",    url: "https://www.finanze.sm",    frequenza: "Trimestrale / In integrazione", note: "Bilancio pubblico, entrate fiscali" },
  { nome: "Ufficio di Stato per la Statistica",    tipo: "Governo SMR",    url: "https://www.statistica.sm", frequenza: "Annuale / In integrazione",    note: "Dati demografici, mercato del lavoro" },
];

export const SETTORI = [
  { nome: "Manifattura",              quota: 34.2, variazione: 1.8  },
  { nome: "Servizi finanziari",       quota: 22.1, variazione: -0.4 },
  { nome: "Turismo e commercio",      quota: 18.7, variazione: 4.2  },
  { nome: "Costruzioni",              quota: 9.4,  variazione: 0.9  },
  { nome: "Pubblica Amministrazione", quota: 8.6,  variazione: 0.2  },
  { nome: "Altro",                    quota: 7.0,  variazione: 0.3  },
];
