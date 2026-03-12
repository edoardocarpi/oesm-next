#!/usr/bin/env node
/**
 * OESM — Script: Esecuzione manuale della pipeline
 *
 * Uso:
 *   node scripts/run-pipeline.js                        # tutti gli indicatori
 *   node scripts/run-pipeline.js --indicator=gdp_growth  # un indicatore
 *   node scripts/run-pipeline.js --dry-run              # simula senza scrivere
 *   node scripts/run-pipeline.js --from=2010            # backfill da anno
 */

import "dotenv/config";
import { runIndicatorPipeline, runFullPipeline } from "../src/pipeline/etl.js";
import { INDICATORS_MAP } from "../src/indicators/registry.js";
import { logger } from "../src/utils/logger.js";

// Parse args
const args = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith("--"))
    .map(a => {
      const [key, val] = a.slice(2).split("=");
      return [key.replace(/-([a-z])/g, (_, c) => c.toUpperCase()), val ?? true];
    })
);

const indicatorId = args.indicator;
const fromYear    = args.from ? parseInt(args.from) : 2000;
const dryRun      = args.dryRun === true || args.dryRun === "true";

logger.info("=== OESM Pipeline Runner ===");
logger.info(`Indicatore: ${indicatorId ?? "tutti"}`);
logger.info(`Da anno: ${fromYear}`);
logger.info(`Dry run: ${dryRun}`);

async function main() {
  if (indicatorId) {
    const indicator = INDICATORS_MAP[indicatorId];
    if (!indicator) {
      logger.error(`Indicatore "${indicatorId}" non trovato nel registry.`);
      logger.info("Indicatori disponibili: " + Object.keys(INDICATORS_MAP).join(", "));
      process.exit(1);
    }
    const result = await runIndicatorPipeline(indicator, { fromYear, dryRun });
    console.log("\nRisultato:", JSON.stringify(result, null, 2));
  } else {
    const { summary } = await runFullPipeline({ fromYear, dryRun });
    console.log("\nSommario:", JSON.stringify(summary, null, 2));
  }
}

main().catch(err => {
  logger.error(`Errore fatale: ${err.message}`);
  process.exit(1);
});
