/**
 * OESM — Source: World Bank Open Data API
 *
 * Documentazione: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392
 * Endpoint base: https://api.worldbank.org/v2/
 *
 * Non richiede API key. Rate limit: ~50 req/s.
 * Dati disponibili: indicatori per ~200 paesi, dal 1960 a oggi.
 */

import { logger } from "../utils/logger.js";
import { sleep, withRetry } from "../utils/retry.js";

const BASE_URL = "https://api.worldbank.org/v2";
const DEFAULT_FORMAT = "json";
const PAGE_SIZE = 100; // max per request

/**
 * Recupera una serie storica per un indicatore e un paese.
 *
 * @param {string} seriesCode  - Codice WB dell'indicatore (es. "NY.GDP.MKTP.CD")
 * @param {string} countryCode - Codice ISO2 del paese (es. "SM" per San Marino)
 * @param {object} options
 * @param {number} options.fromYear
 * @param {number} options.toYear
 * @returns {Promise<Array<{year: number, value: number|null}>>}
 */
export async function fetchWorldBankSeries(seriesCode, countryCode, options = {}) {
  const { fromYear = 2000, toYear = new Date().getFullYear() } = options;

  const url = buildUrl(seriesCode, countryCode, fromYear, toYear);

  logger.info(`[WorldBank] Fetching ${seriesCode} for ${countryCode} (${fromYear}–${toYear})`);

  const rawData = await withRetry(() => fetchAllPages(url), { retries: 3, delay: 1000 });

  const normalized = rawData
    .filter(entry => entry.value !== null && entry.date)
    .map(entry => ({
      year:  parseInt(entry.date, 10),
      value: parseFloat(entry.value),
    }))
    .filter(entry => !isNaN(entry.year) && !isNaN(entry.value))
    .sort((a, b) => a.year - b.year);

  logger.info(`[WorldBank] Got ${normalized.length} data points for ${seriesCode}`);

  return normalized;
}

/**
 * Recupera i metadati di un indicatore WB.
 */
export async function fetchWorldBankIndicatorMeta(seriesCode) {
  const url = `${BASE_URL}/indicator/${seriesCode}?format=${DEFAULT_FORMAT}`;
  const res = await fetchJson(url);
  if (!res || !res[1] || !res[1][0]) return null;
  const meta = res[1][0];
  return {
    id:         meta.id,
    name:       meta.name,
    sourceNote: meta.sourceNote,
    sourceOrg:  meta.sourceOrganization,
  };
}

// ─── Private helpers ─────────────────────────────────────────────────────────

function buildUrl(seriesCode, countryCode, fromYear, toYear, page = 1) {
  // WB usa codici ISO2 — SM per San Marino
  const iso2 = toISO2(countryCode);
  return [
    `${BASE_URL}/country/${iso2}/indicator/${seriesCode}`,
    `?format=${DEFAULT_FORMAT}`,
    `&date=${fromYear}:${toYear}`,
    `&per_page=${PAGE_SIZE}`,
    `&page=${page}`,
  ].join("");
}

async function fetchAllPages(baseUrl) {
  const firstPage = await fetchJson(baseUrl);

  if (!firstPage || !Array.isArray(firstPage) || firstPage.length < 2) {
    throw new Error(`World Bank API: risposta non valida per ${baseUrl}`);
  }

  const meta    = firstPage[0];
  const results = firstPage[1] || [];
  const totalPages = Math.ceil(meta.total / meta.per_page);

  if (totalPages <= 1) return results;

  // Fetch pagine aggiuntive in sequenza (rispetta rate limit)
  for (let page = 2; page <= totalPages; page++) {
    await sleep(200);
    const url     = `${baseUrl}&page=${page}`;
    const nextPage = await fetchJson(url);
    if (nextPage && nextPage[1]) results.push(...nextPage[1]);
  }

  return results;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} per ${url}`);
  }
  return res.json();
}

// World Bank usa ISO2, il nostro registro usa ISO3
const ISO3_TO_ISO2 = {
  SMR: "SM",
  ITA: "IT",
  DEU: "DE",
  FRA: "FR",
  USA: "US",
  // Aggiungere altri paesi qui quando si espande
};

function toISO2(iso3) {
  return ISO3_TO_ISO2[iso3] ?? iso3.slice(0, 2).toLowerCase();
}
