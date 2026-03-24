/**
 * OESM — Database Client (Supabase)
 *
 * Unico punto di accesso al database.
 * Le query sono centralizzate qui — nessun SQL sparso nel codice.
 */

import { createClient } from "@supabase/supabase-js";
import { logger } from "../utils/logger.js";

// ─── Client ──────────────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: { persistSession: false },
  }
);

// ─── Query Layer ──────────────────────────────────────────────────────────────

export const db = {

  /**
   * Upsert di tutti i data points di un indicatore.
   * Usa la unique constraint (indicator_id, country_iso3, year).
   */
  async upsertDataPoints(indicatorId, countryIso3, points) {
    const rows = points.map(p => ({
      indicator_id:  indicatorId,
      country_iso3:  countryIso3,
      year:          p.year,
      value:         p.value,
      updated_at:    new Date().toISOString(),
    }));

    const { error, count } = await supabase
      .from("data_points")
      .upsert(rows, {
        onConflict:     "indicator_id,country_iso3,year",
        ignoreDuplicates: false,
        count:          "exact",
      });

    if (error) throw new Error(`DB upsert error: ${error.message}`);
    return count ?? rows.length;
  },

  /**
   * Sincronizza i metadati di un indicatore dal registry al DB.
   */
  async upsertIndicatorMeta(indicator) {
    const { error } = await supabase
      .from("indicators")
      .upsert({
        id:              indicator.id,
        label:           indicator.label,
        description:     indicator.description ?? "",
        unit:            indicator.unit,
        category_id:     indicator.category,
        source:          indicator.source,
        source_code:     indicator.sourceCode,
        country_iso3:    indicator.country,
        frequency:       indicator.frequency,
        decimals:        indicator.decimals,
        invert_trend:    indicator.invertTrend,
        active:          indicator.active,
        last_fetched_at: new Date().toISOString(),
        updated_at:      new Date().toISOString(),
      }, { onConflict: "id" });

    if (error) throw new Error(`DB upsert indicator meta: ${error.message}`);
  },

  /**
   * Registra il risultato di un run della pipeline.
   */
  async logPipelineRun(result) {
    const { error } = await supabase.from("pipeline_runs").insert({
      indicator_id:   result.indicatorId,
      from_year:      result.fromYear,
      to_year:        result.toYear,
      points_fetched: result.pointsFetched,
      points_stored:  result.pointsStored,
      duration_ms:    result.durationMs,
      success:        result.success,
      error_message:  result.error ?? null,
      triggered_by:   result.triggeredBy ?? "cron",
    });
    if (error) logger.warn(`[DB] logPipelineRun error: ${error.message}`);
  },

  // ─── Read queries ─────────────────────────────────────────────────────────

  /**
   * Tutti gli indicatori attivi con categoria.
   */
  async getIndicators(countryIso3 = "SMR") {
    const { data, error } = await supabase
      .from("indicators")
      .select("*, indicator_categories(label, sort_order)")
      .eq("active", true)
      .eq("country_iso3", countryIso3)
      .order("category_id");

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Serie storica completa per un indicatore.
   */
  async getSeries(indicatorId, countryIso3 = "SMR", fromYear, toYear) {
    let query = supabase
      .from("data_points")
      .select("year, value, is_estimate")
      .eq("indicator_id", indicatorId)
      .eq("country_iso3", countryIso3)
      .order("year");

    if (fromYear) query = query.gte("year", fromYear);
    if (toYear)   query = query.lte("year", toYear);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Ultimo valore disponibile per ogni indicatore (KPI snapshot).
   */
  async getLatestKPIs(countryIso3 = "SMR") {
    const { data, error } = await supabase
      .from("v_latest_kpi")
      .select("*")
      .eq("country_iso3", countryIso3);

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Ultimi N run della pipeline (per monitoring).
   */
  async getPipelineRuns(limit = 50) {
    const { data, error } = await supabase
      .from("pipeline_runs")
      .select("*")
      .order("ran_at", { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);
    return data;
  },
};
