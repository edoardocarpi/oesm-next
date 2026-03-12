/**
 * OESM — Retry & Sleep utilities
 */

import { logger } from "./logger.js";

/**
 * Esegue una funzione async con retry automatico in caso di errore.
 *
 * @param {Function} fn       - Funzione da eseguire
 * @param {object}   options
 * @param {number}   options.retries  - Numero massimo di tentativi (default: 3)
 * @param {number}   options.delay    - Attesa in ms tra i tentativi (default: 1000)
 */
export async function withRetry(fn, { retries = 3, delay = 1000 } = {}) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      logger.warn(`[Retry] Tentativo ${attempt}/${retries} fallito: ${err.message}`);
      if (attempt < retries) await sleep(delay * attempt); // backoff lineare
    }
  }

  throw lastError;
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
