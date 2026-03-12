-- OESM — Schema del database (Supabase / PostgreSQL)
-- Eseguire in ordine su un nuovo progetto Supabase.

-- ─── Paesi ────────────────────────────────────────────────────────────────────
-- Espandibile: per aggiungere un paese, inserire una riga qui.

CREATE TABLE IF NOT EXISTS countries (
  iso3        CHAR(3)      PRIMARY KEY,
  iso2        CHAR(2)      NOT NULL UNIQUE,
  name        TEXT         NOT NULL,
  name_en     TEXT         NOT NULL,
  region      TEXT,
  active      BOOLEAN      NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

INSERT INTO countries (iso3, iso2, name, name_en, region) VALUES
  ('SMR', 'SM', 'Repubblica di San Marino', 'Republic of San Marino', 'Europa');

-- ─── Categorie indicatori ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS indicator_categories (
  id          TEXT         PRIMARY KEY,
  label       TEXT         NOT NULL,
  sort_order  INTEGER      NOT NULL DEFAULT 99
);

INSERT INTO indicator_categories (id, label, sort_order) VALUES
  ('macroeconomia',    'Macroeconomia',     1),
  ('lavoro',           'Lavoro',            2),
  ('prezzi',           'Prezzi',            3),
  ('commercio',        'Commercio estero',  4),
  ('finanza_pubblica', 'Finanza pubblica',  5),
  ('turismo',          'Turismo',           6),
  ('settore_bancario', 'Settore bancario',  7);

-- ─── Definizione indicatori ───────────────────────────────────────────────────
-- Sincronizzata automaticamente dalla pipeline al primo avvio.

CREATE TABLE IF NOT EXISTS indicators (
  id              TEXT         PRIMARY KEY,
  label           TEXT         NOT NULL,
  description     TEXT,
  unit            TEXT         NOT NULL,
  category_id     TEXT         NOT NULL REFERENCES indicator_categories(id),
  source          TEXT         NOT NULL,   -- 'world_bank' | 'imf' | 'bcsm' | ...
  source_code     TEXT         NOT NULL,   -- codice nativo nella fonte
  country_iso3    CHAR(3)      NOT NULL REFERENCES countries(iso3),
  frequency       TEXT         NOT NULL DEFAULT 'annual',
  decimals        INTEGER      NOT NULL DEFAULT 2,
  invert_trend    BOOLEAN      NOT NULL DEFAULT false,
  active          BOOLEAN      NOT NULL DEFAULT true,
  last_fetched_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── Dati storici ─────────────────────────────────────────────────────────────
-- Tabella principale. Una riga per ogni (indicator, country, year).
-- UPSERT sicuro grazie alla unique constraint.

CREATE TABLE IF NOT EXISTS data_points (
  id              BIGSERIAL    PRIMARY KEY,
  indicator_id    TEXT         NOT NULL REFERENCES indicators(id) ON DELETE CASCADE,
  country_iso3    CHAR(3)      NOT NULL REFERENCES countries(iso3),
  year            SMALLINT     NOT NULL,
  value           NUMERIC(20, 6) NOT NULL,
  is_estimate     BOOLEAN      NOT NULL DEFAULT false,
  source_raw      JSONB,       -- payload grezzo dalla fonte, per debug
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  UNIQUE (indicator_id, country_iso3, year)
);

CREATE INDEX IF NOT EXISTS idx_dp_indicator_country ON data_points(indicator_id, country_iso3);
CREATE INDEX IF NOT EXISTS idx_dp_year              ON data_points(year);

-- ─── Log pipeline ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS pipeline_runs (
  id              BIGSERIAL    PRIMARY KEY,
  indicator_id    TEXT         REFERENCES indicators(id),
  from_year       SMALLINT,
  to_year         SMALLINT,
  points_fetched  INTEGER      NOT NULL DEFAULT 0,
  points_stored   INTEGER      NOT NULL DEFAULT 0,
  duration_ms     INTEGER,
  success         BOOLEAN      NOT NULL,
  error_message   TEXT,
  triggered_by    TEXT         NOT NULL DEFAULT 'cron',  -- 'cron' | 'manual' | 'api'
  ran_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── Row Level Security (Supabase) ───────────────────────────────────────────
-- Dati pubblici in lettura, scrittura solo via service role.

ALTER TABLE countries           ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicators          ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicator_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_points         ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_runs       ENABLE ROW LEVEL SECURITY;

-- Lettura pubblica
CREATE POLICY "public_read_countries"    ON countries            FOR SELECT USING (true);
CREATE POLICY "public_read_categories"   ON indicator_categories FOR SELECT USING (true);
CREATE POLICY "public_read_indicators"   ON indicators           FOR SELECT USING (active = true);
CREATE POLICY "public_read_data_points"  ON data_points          FOR SELECT USING (true);

-- Scrittura solo service role (backend)
CREATE POLICY "service_write_indicators" ON indicators   FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_write_data"       ON data_points  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_write_pipeline"   ON pipeline_runs FOR ALL USING (auth.role() = 'service_role');

-- ─── View utili ───────────────────────────────────────────────────────────────

-- Serie storica completa con metadati
CREATE OR REPLACE VIEW v_series AS
SELECT
  dp.indicator_id,
  i.label             AS indicator_label,
  i.unit,
  i.category_id,
  ic.label            AS category_label,
  dp.country_iso3,
  c.name              AS country_name,
  dp.year,
  dp.value,
  dp.is_estimate
FROM data_points dp
JOIN indicators          i  ON i.id  = dp.indicator_id
JOIN indicator_categories ic ON ic.id = i.category_id
JOIN countries            c  ON c.iso3 = dp.country_iso3
WHERE i.active = true
ORDER BY dp.indicator_id, dp.year;

-- KPI più recente per ogni indicatore
CREATE OR REPLACE VIEW v_latest_kpi AS
SELECT DISTINCT ON (dp.indicator_id, dp.country_iso3)
  dp.indicator_id,
  i.label,
  i.unit,
  i.category_id,
  i.decimals,
  i.invert_trend,
  dp.country_iso3,
  dp.year,
  dp.value,
  dp.is_estimate
FROM data_points dp
JOIN indicators i ON i.id = dp.indicator_id
WHERE i.active = true
ORDER BY dp.indicator_id, dp.country_iso3, dp.year DESC;
