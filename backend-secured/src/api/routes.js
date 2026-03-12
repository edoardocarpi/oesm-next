/**
 * OESM — API Routes v1
 *
 * Base URL: /api/v1/
 *
 * GET  /health                   Stato servizio (non rate-limited)
 * GET  /indicators               Lista indicatori attivi
 * GET  /indicators/:id           Metadati indicatore
 * GET  /indicators/:id/series    Serie storica
 * GET  /indicators/:id/csv       Download CSV (download limiter)
 * GET  /kpi                      Ultimo valore per ogni indicatore
 * GET  /pipeline/status          Stato ultimi run (admin)
 * POST /pipeline/run             Trigger pipeline (admin)
 */

import { Router } from "express";
import { db } from "../db/client.js";
import { runIndicatorPipeline, runFullPipeline } from "../pipeline/etl.js";
import { INDICATORS_MAP, ACTIVE_INDICATORS } from "../indicators/registry.js";
import { logger } from "../utils/logger.js";

// routes accetta i limiter iniettati dal server
export default function routes(downloadLimiter, adminLimiter) {
  const router = Router();

  // ─── Middleware: autenticazione admin ──────────────────────────────────────
  function requireAuth(req, res, next) {
    const token = req.headers["x-oesm-admin-key"];
    if (!token || token !== process.env.ADMIN_SECRET) {
      logger.warn(`Auth failed from ${req.ip}`);
      return res.status(401).json({ error: "Non autorizzato" });
    }
    next();
  }

  // ─── Health ────────────────────────────────────────────────────────────────
  router.get("/health", (_req, res) => {
    res.json({
      status:     "ok",
      version:    "1.1.0",
      timestamp:  new Date().toISOString(),
      indicators: ACTIVE_INDICATORS.length,
    });
  });

  // ─── Indicatori ───────────────────────────────────────────────────────────

  // GET /indicators
  router.get("/indicators", async (req, res) => {
    try {
      const { country = "SMR", category } = req.query;
      // Validazione esplicita parametri
      if (country && !/^[A-Z]{2,3}$/.test(country)) {
        return res.status(400).json({ error: "Parametro country non valido" });
      }
      let indicators = await db.getIndicators(country);
      if (category) indicators = indicators.filter(i => i.category_id === category);
      res.json({ data: indicators, count: indicators.length });
    } catch (err) {
      logger.error(`GET /indicators: ${err.message}`);
      res.status(500).json({ error: "Errore interno" });
    }
  });

  // GET /indicators/:id
  router.get("/indicators/:id", (req, res) => {
    const { id } = req.params;
    // Validazione: solo caratteri alfanumerici e underscore
    if (!/^[a-z0-9_]{1,50}$/.test(id)) {
      return res.status(400).json({ error: "ID indicatore non valido" });
    }
    const indicator = INDICATORS_MAP[id];
    if (!indicator) return res.status(404).json({ error: "Indicatore non trovato" });
    res.json({ data: indicator });
  });

  // GET /indicators/:id/series
  router.get("/indicators/:id/series", async (req, res) => {
    try {
      const { id } = req.params;
      if (!/^[a-z0-9_]{1,50}$/.test(id)) {
        return res.status(400).json({ error: "ID non valido" });
      }
      const { country = "SMR", from, to } = req.query;
      if (country && !/^[A-Z]{2,3}$/.test(country)) {
        return res.status(400).json({ error: "Parametro country non valido" });
      }
      const fromYear = from ? parseInt(from, 10) : undefined;
      const toYear   = to   ? parseInt(to, 10)   : undefined;
      if ((fromYear && isNaN(fromYear)) || (toYear && isNaN(toYear))) {
        return res.status(400).json({ error: "Parametri anno non validi" });
      }

      const indicator = INDICATORS_MAP[id];
      if (!indicator) return res.status(404).json({ error: "Indicatore non trovato" });

      const series = await db.getSeries(id, country, fromYear, toYear);
      const enriched = series.map((point, i) => {
        const prev = series[i - 1];
        const yoy = prev && prev.value !== 0
          ? ((point.value - prev.value) / Math.abs(prev.value)) * 100
          : null;
        return { ...point, yoy: yoy !== null ? +yoy.toFixed(2) : null };
      });

      res.json({
        indicator: { id, label: indicator.label, unit: indicator.unit },
        country,
        data: enriched,
        count: enriched.length,
      });
    } catch (err) {
      logger.error(`GET /indicators/${req.params.id}/series: ${err.message}`);
      res.status(500).json({ error: "Errore interno" });
    }
  });

  // GET /indicators/:id/csv  — download limiter applicato qui
  router.get("/indicators/:id/csv", downloadLimiter, async (req, res) => {
    try {
      const { id } = req.params;
      if (!/^[a-z0-9_]{1,50}$/.test(id)) {
        return res.status(400).json({ error: "ID non valido" });
      }
      const indicator = INDICATORS_MAP[id];
      if (!indicator) return res.status(404).json({ error: "Indicatore non trovato" });

      const series = await db.getSeries(id, "SMR");
      const rows = [
        `# OESM — Osservatorio Economico di San Marino`,
        `# Indicatore: ${indicator.label}`,
        `# Unità: ${indicator.unit}`,
        `# Fonte: ${indicator.source} (${indicator.sourceCode})`,
        `# Licenza: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/`,
        `# Citazione: OESM (${new Date().getFullYear()}). ${indicator.label}. oesm.net`,
        `# Generato: ${new Date().toISOString()}`,
        ``,
        `anno,valore,unita`,
        ...series.map(d => `${d.year},${d.value},"${indicator.unit}"`),
      ];

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="oesm-${id}-SMR.csv"`);
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(rows.join("\n"));
    } catch (err) {
      logger.error(`GET /indicators/${req.params.id}/csv: ${err.message}`);
      res.status(500).json({ error: "Errore interno" });
    }
  });

  // ─── KPI ──────────────────────────────────────────────────────────────────

  router.get("/kpi", async (req, res) => {
    try {
      const { country = "SMR" } = req.query;
      if (!/^[A-Z]{2,3}$/.test(country)) {
        return res.status(400).json({ error: "Parametro country non valido" });
      }
      const kpis = await db.getLatestKPIs(country);
      res.json({ data: kpis, country, count: kpis.length });
    } catch (err) {
      logger.error(`GET /kpi: ${err.message}`);
      res.status(500).json({ error: "Errore interno" });
    }
  });

  // ─── Pipeline (admin) ─────────────────────────────────────────────────────

  router.get("/pipeline/status", adminLimiter, requireAuth, async (req, res) => {
    try {
      const runs = await db.getPipelineRuns(100);
      res.json({ data: runs });
    } catch (err) {
      res.status(500).json({ error: "Errore interno" });
    }
  });

  router.post("/pipeline/run", adminLimiter, requireAuth, async (req, res) => {
    const { indicatorId, fromYear = 2000, dryRun = false } = req.body;
    // Valida indicatorId se presente
    if (indicatorId && !/^[a-z0-9_]{1,50}$/.test(indicatorId)) {
      return res.status(400).json({ error: "ID indicatore non valido" });
    }
    res.json({ message: "Pipeline avviata", indicatorId: indicatorId ?? "all", dryRun });
    if (indicatorId) {
      const indicator = INDICATORS_MAP[indicatorId];
      if (!indicator) return;
      await runIndicatorPipeline(indicator, { fromYear, dryRun })
        .catch(e => logger.error(`Pipeline error: ${e.message}`));
    } else {
      await runFullPipeline({ fromYear, dryRun })
        .catch(e => logger.error(`Pipeline full error: ${e.message}`));
    }
  });

  return router;
}
