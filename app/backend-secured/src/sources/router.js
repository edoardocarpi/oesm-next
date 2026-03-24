/**
 * OESM — Source Router
 *
 * Riceve un indicatore dal registry e lo instrada alla fonte corretta.
 * Per aggiungere una nuova fonte: importarla qui e aggiungere il case.
 */

import { fetchWorldBankSeries } from "./worldBank.js";
import { fetchIMFSeries } from "./imf.js";
import { logger } from "../utils/logger.js";

/**
 * Recupera i dati grezzi per un indicatore dalla sua fonte.
 *
 * @param {object} indicator - Oggetto indicatore dal registry
 * @param {object} options   - { fromYear, toYear }
 * @returns {Promise<Array<{year: number, value: number}>>}
 */
export async function fetchFromSource(indicator, options = {}) {
  const { source, sourceCode, country } = indicator;

  switch (source) {
    case "world_bank":
      return fetchWorldBankSeries(sourceCode, country, options);

    case "imf":
      return fetchIMFSeries(sourceCode, country, options);

    // ─── Aggiungere nuove fonti qui ──────────────────────────────────
    // case "bcsm":
    //   return fetchBCSMSeries(sourceCode, country, options);
    // case "statistica_sm":
    //   return fetchStatisticaSMSeries(sourceCode, country, options);
    // ─────────────────────────────────────────────────────────────────

    default:
      logger.error(`[SourceRouter] Fonte sconosciuta: "${source}" per indicatore "${indicator.id}"`);
      throw new Error(`Fonte non supportata: ${source}`);
  }
}
