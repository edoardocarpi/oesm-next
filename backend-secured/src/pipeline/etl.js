/**
 * OESM — Pipeline ETL
 *
 * Flusso:
 * 1. Prende un indicatore dal registry
 * 2. Recupera i dati grezzi dalla fonte (via source router)
 * 3. Valida e normalizza
 * 4. Salva nel database (upsert)
 * 5. Registra il run nel log
 */

import { fetchFromSource } from "../sources/router.js";
import { db } from "../db/client.js";
import { logger } from "../utils/logger.js";
import { ACTIVE_INDICATORS } from "../indicators/registry.js";

/**
 * Esegue la pipeline per un singolo indicatore.
 *
 * @param {object} indicator  - Oggetto dal registry
 * @param {object} options    - { fromYear, toYear, dryRun }
 * @returns {Promise<PipelineResult>}
 */
export async function runIndicatorPipeline(indicator, options = {}) {
  const {
    fromYear = 2000,
    toYear   = new Date().getFullYear(),
    dryRun   = false,
  } = options;

  const startedAt = Date.now();

  logger.info(`[Pipeline] START — ${indicator.id} (${fromYear}–${toYear})${dryRun ? " [DRY RUN]" : ""}`);

  let pointsFetched = 0;
  let pointsStored  = 0;
  let error         = null;

  try {
    // 1. Fetch
    const rawData = await fetchFromSource(indicator, { fromYear, toYear });
    pointsFetched = rawData.length;

    if (pointsFetched === 0) {
      logger.warn(`[Pipeline] Nessun dato ricevuto per ${indicator.id}`);
    }

    // 2. Validate & normalize
    const validated = validateAndNormalize(rawData, indicator);

    // 3. Store (upsert)
    if (!dryRun && validated.length > 0) {
      pointsStored = await db.upsertDataPoints(indicator.id, indicator.country, validated);
    } else if (dryRun) {
      pointsStored = validated.length;
      logger.info(`[Pipeline] DRY RUN — avrei salvato ${pointsStored} punti`);
    }

    // 4. Update last_run metadata
    if (!dryRun) {
      await db.upsertIndicatorMeta(indicator);
    }

  } catch (err) {
    error = err.message;
    logger.error(`[Pipeline] ERROR — ${indicator.id}: ${err.message}`);
  }

  const duration = Date.now() - startedAt;

  const result = {
    indicatorId:  indicator.id,
    fromYear,
    toYear,
    pointsFetched,
    pointsStored,
    durationMs:   duration,
    success:      error === null,
    error,
    timestamp:    new Date().toISOString(),
  };

  if (!dryRun) {
    await db.logPipelineRun(result).catch(e =>
      logger.warn(`[Pipeline] Impossibile loggare run: ${e.message}`)
    );
  }

  logger.info(
    `[Pipeline] END — ${indicator.id} | fetched=${pointsFetched} stored=${pointsStored} duration=${duration}ms${error ? ` ERROR=${error}` : ""}`
  );

  return result;
}

/**
 * Esegue la pipeline per tutti gli indicatori attivi.
 */
export async function runFullPipeline(options = {}) {
  logger.info(`[Pipeline] === FULL RUN START (${ACTIVE_INDICATORS.length} indicatori) ===`);

  const results = [];
  for (const indicator of ACTIVE_INDICATORS) {
    const result = await runIndicatorPipeline(indicator, options);
    results.push(result);
    // Pausa tra indicatori per rispettare rate limit
    await sleep(500);
  }

  const summary = {
    total:     results.length,
    success:   results.filter(r => r.success).length,
    failed:    results.filter(r => !r.success).length,
    totalPoints: results.reduce((s, r) => s + r.pointsStored, 0),
  };

  logger.info(`[Pipeline] === FULL RUN END | ${JSON.stringify(summary)} ===`);
  return { results, summary };
}

// ─── Validazione & Normalizzazione ───────────────────────────────────────────

function validateAndNormalize(rawData, indicator) {
  const currentYear = new Date().getFullYear();

  return rawData
    .filter(point => {
      if (!Number.isFinite(point.year) || !Number.isFinite(point.value)) return false;
      if (point.year < 1990 || point.year > currentYear) return false;
      return true;
    })
    .map(point => ({
      year:  point.year,
      value: roundTo(point.value, indicator.decimals + 2), // +2 per preservare precisione nel DB
    }));
}

function roundTo(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
