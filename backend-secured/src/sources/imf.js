/**
 * OESM — Source: IMF Data API
 *
 * Documentazione: https://datahelp.imf.org/knowledgebase/articles/630877
 * Endpoint base: https://www.imf.org/external/datamapper/api/v1/
 *
 * Non richiede API key per l'uso base.
 * Utile per: WEO (World Economic Outlook), IFS, GFSR.
 */

import { logger } from "../utils/logger.js";
import { withRetry } from "../utils/retry.js";

const BASE_URL = "https://www.imf.org/external/datamapper/api/v1";

/**
 * Recupera una serie storica dall'IMF DataMapper.
 *
 * @param {string} indicatorCode  - Codice IMF (es. "NGDP_RPCH" per crescita PIL reale)
 * @param {string} countryCode    - Codice ISO3 (es. "SMR")
 * @param {object} options
 * @returns {Promise<Array<{year: number, value: number|null}>>}
 */
export async function fetchIMFSeries(indicatorCode, countryCode, options = {}) {
  const url = `${BASE_URL}/${indicatorCode}/${countryCode}`;

  logger.info(`[IMF] Fetching ${indicatorCode} for ${countryCode}`);

  const raw = await withRetry(() => fetchJson(url), { retries: 3, delay: 1500 });

  if (!raw?.values?.[indicatorCode]?.[countryCode]) {
    logger.warn(`[IMF] Nessun dato per ${indicatorCode}/${countryCode}`);
    return [];
  }

  const values = raw.values[indicatorCode][countryCode];

  const normalized = Object.entries(values)
    .map(([year, value]) => ({
      year:  parseInt(year, 10),
      value: value !== null ? parseFloat(value) : null,
    }))
    .filter(e => !isNaN(e.year) && e.value !== null)
    .sort((a, b) => a.year - b.year);

  logger.info(`[IMF] Got ${normalized.length} data points for ${indicatorCode}`);

  return normalized;
}

/**
 * Lista tutti gli indicatori disponibili nell'IMF DataMapper.
 * Utile per scoprire nuovi codici.
 */
export async function listIMFIndicators() {
  const url = `${BASE_URL}/indicators`;
  const raw = await fetchJson(url);
  return raw?.indicators ?? {};
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} per ${url}`);
  return res.json();
}

// ─── Mappa indicatori IMF usati da OESM ──────────────────────────────────────
// Aggiungere qui i codici quando si aggiungono indicatori IMF nel registry

export const IMF_CODES = {
  // "gdp_growth_imf": "NGDP_RPCH",   // crescita PIL reale (% annua)
  // "inflation_imf":  "PCPIPCH",       // inflazione IPC
  // "debt_pct_gdp":   "GGX_NGDP",     // debito lordo governo / PIL
};
