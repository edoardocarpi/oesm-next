"""
OESM — Script 02: Download dati World Bank per San Marino
=========================================================

Scarica il file Excel ufficiale World Bank con tutti i dati di San Marino,
lo salva intatto in /raw/, poi estrae e riordina solo gli indicatori OESM
in formato long (anno, indicatore, valore) senza conversione valutaria.

Indicatori estratti (codici WDI ufficiali):
  NY.GDP.MKTP.CD    PIL correnti USD
  NY.GDP.PCAP.CD    PIL pro capite USD
  NY.GDP.MKTP.KD.ZG Crescita PIL reale %
  SP.POP.TOTL       Popolazione residente
  SL.UEM.TOTL.ZS    Disoccupazione %
  SL.TLF.TOTL.IN    Forza lavoro totale
  FP.CPI.TOTL.ZG    Inflazione IPC %
  NE.EXP.GNFS.ZS    Esportazioni % PIL
  NE.IMP.GNFS.ZS    Importazioni % PIL
  NE.TRD.GNFS.ZS    Apertura commerciale % PIL
  GC.XPN.TOTL.GD.ZS Spesa pubblica % PIL
  ST.INT.ARVL       Arrivi turistici
  ST.INT.RCPT.CD    Entrate turismo USD

Output:
  /raw/oesm_raw_worldbank_[nomeoriginale]_YYYYMMDD.xlsx  ← copia intatta
  /clean/oesm_clean_worldbank_YYYYMMDD.csv               ← dati puliti USD

Uso:
  python scripts/02_fetch_worldbank.py
  python scripts/02_fetch_worldbank.py --start 1990

Dipendenze: requests, pandas, openpyxl
  pip install requests pandas openpyxl
"""

import requests
import pandas as pd
import argparse
import sys
import re
from datetime import date
from pathlib import Path
from io import BytesIO

# ─── Configurazione ───────────────────────────────────────────────────────────

# API World Bank — scarica bulk Excel per paese SMR
# formato: https://api.worldbank.org/v2/en/country/SM/indicator/[CODE]?downloadformat=excel
# Per tutti gli indicatori insieme usiamo l'endpoint bulk country

WORLDBANK_BULK_URL = (
    "https://api.worldbank.org/v2/en/country/SM"
    "?downloadformat=excel"
)

# Fallback: download per singolo indicatore
WORLDBANK_SINGLE_URL = (
    "https://api.worldbank.org/v2/en/country/SM/indicator/{code}"
    "?downloadformat=excel&per_page=1000"
)

# Indicatori OESM con metadati completi
OESM_INDICATORS = {
    "NY.GDP.MKTP.CD":    {"label_it": "PIL (USD correnti)",               "label_en": "GDP (current USD)",              "unit": "USD",    "category": "macroeconomia",    "eur_convert": True},
    "NY.GDP.PCAP.CD":    {"label_it": "PIL pro capite (USD)",             "label_en": "GDP per capita (current USD)",   "unit": "USD",    "category": "macroeconomia",    "eur_convert": True},
    "NY.GDP.MKTP.KD.ZG": {"label_it": "Crescita del PIL (%)",            "label_en": "GDP growth (annual %)",          "unit": "%",      "category": "macroeconomia",    "eur_convert": False},
    "SP.POP.TOTL":       {"label_it": "Popolazione residente",           "label_en": "Resident population",            "unit": "persone","category": "macroeconomia",    "eur_convert": False},
    "SL.UEM.TOTL.ZS":   {"label_it": "Tasso di disoccupazione (%)",     "label_en": "Unemployment rate (%)",          "unit": "%",      "category": "lavoro",           "eur_convert": False},
    "SL.TLF.TOTL.IN":   {"label_it": "Forza lavoro totale",             "label_en": "Total labour force",             "unit": "persone","category": "lavoro",           "eur_convert": False},
    "FP.CPI.TOTL.ZG":   {"label_it": "Inflazione IPC (%)",              "label_en": "Inflation, CPI (%)",             "unit": "%",      "category": "prezzi",           "eur_convert": False},
    "NE.EXP.GNFS.ZS":   {"label_it": "Esportazioni (% PIL)",            "label_en": "Exports of goods & services (% GDP)", "unit": "% PIL","category": "commercio",  "eur_convert": False},
    "NE.IMP.GNFS.ZS":   {"label_it": "Importazioni (% PIL)",            "label_en": "Imports of goods & services (% GDP)", "unit": "% PIL","category": "commercio",  "eur_convert": False},
    "NE.TRD.GNFS.ZS":   {"label_it": "Apertura commerciale (% PIL)",    "label_en": "Trade openness (% GDP)",         "unit": "% PIL",  "category": "commercio",       "eur_convert": False},
    "GC.XPN.TOTL.GD.ZS":{"label_it": "Spesa pubblica (% PIL)",         "label_en": "Government expenditure (% GDP)", "unit": "% PIL",  "category": "finanza_pubblica", "eur_convert": False},
    "ST.INT.ARVL":       {"label_it": "Arrivi turistici internazionali", "label_en": "International tourist arrivals", "unit": "arrivi", "category": "turismo",          "eur_convert": False},
    "ST.INT.RCPT.CD":    {"label_it": "Entrate dal turismo (USD)",       "label_en": "Tourism receipts (USD)",         "unit": "USD",    "category": "turismo",          "eur_convert": True},
}

RAW_DIR   = Path(__file__).parent.parent / "raw"
CLEAN_DIR = Path(__file__).parent.parent / "clean"

# ─── Argomenti CLI ────────────────────────────────────────────────────────────

def parse_args():
    parser = argparse.ArgumentParser(
        description="Download dati World Bank per San Marino"
    )
    parser.add_argument(
        "--start", type=int, default=1990,
        help="Anno di inizio per il file clean (default: 1990)"
    )
    return parser.parse_args()

# ─── Download singolo indicatore ─────────────────────────────────────────────

def fetch_single_indicator(code: str) -> pd.DataFrame:
    """
    Scarica un singolo indicatore via API WB e restituisce DataFrame
    con colonne: year, value
    """
    url = f"https://api.worldbank.org/v2/country/SM/indicator/{code}?format=json&per_page=1000&mrv=60"
    print(f"  GET {url}")

    try:
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        print(f"  ERRORE {code}: {e}", file=sys.stderr)
        return pd.DataFrame()

    if len(data) < 2 or not data[1]:
        print(f"  AVVISO {code}: nessun dato restituito")
        return pd.DataFrame()

    rows = []
    for obs in data[1]:
        if obs.get("value") is not None:
            rows.append({
                "year":  int(obs["date"]),
                "value": float(obs["value"]),
            })

    return pd.DataFrame(rows).sort_values("year").reset_index(drop=True)

# ─── Salva raw (Excel) ────────────────────────────────────────────────────────

def save_raw_excel(code: str, df: pd.DataFrame, today_str: str) -> Path:
    """
    Salva una copia raw per ogni indicatore in /raw/
    Il nome include il codice WB originale e la data di download
    """
    RAW_DIR.mkdir(parents=True, exist_ok=True)

    # Normalizza il codice per il filename (punti → underscore)
    code_safe = code.replace(".", "_")
    filename = f"oesm_raw_worldbank_{code_safe}_{today_str}.csv"
    path = RAW_DIR / filename

    header_lines = [
        f"# OESM — Dati raw World Bank — NON modificare",
        f"# Indicatore: {code}",
        f"# Paese: San Marino (SM / SMR)",
        f"# Unità: valori originali dalla fonte, NON convertiti",
        f"# Fonte: World Bank Development Indicators API",
        f"# URL API: https://api.worldbank.org/v2/country/SM/indicator/{code}",
        f"# Data download: {date.today().isoformat()}",
        f"# Questo file è una copia fedele dei dati grezzi — non modificare",
        "#",
    ]

    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(header_lines) + "\n")
        df.to_csv(f, index=False)

    return path

# ─── Costruzione clean ────────────────────────────────────────────────────────

def build_clean(all_data: dict, start_year: int) -> pd.DataFrame:
    """
    Unisce tutti gli indicatori in formato long:
    country_code, country, year, indicator_id, label_it, label_en,
    value, unit, category, eur_convert, source, source_code, retrieved_date
    """
    rows = []
    today = date.today().isoformat()

    for code, meta in OESM_INDICATORS.items():
        df = all_data.get(code, pd.DataFrame())
        if df.empty:
            print(f"  AVVISO: nessun dato per {code} — riga saltata")
            continue

        # Filtra per anno di inizio
        df = df[df["year"] >= start_year].copy()

        for _, row in df.iterrows():
            rows.append({
                "country_code":   "SMR",
                "country":        "San Marino",
                "year":           int(row["year"]),
                "indicator_id":   code,
                "label_it":       meta["label_it"],
                "label_en":       meta["label_en"],
                "value_original": row["value"],
                "unit_original":  meta["unit"],
                "category":       meta["category"],
                "eur_convert":    meta["eur_convert"],
                "source":         "World Bank",
                "source_code":    code,
                "source_url":     f"https://data.worldbank.org/indicator/{code}?locations=SM",
                "retrieved_date": today,
            })

    return pd.DataFrame(rows).sort_values(
        ["indicator_id", "year"]
    ).reset_index(drop=True)

# ─── Salva clean ──────────────────────────────────────────────────────────────

def save_clean(df: pd.DataFrame, today_str: str) -> Path:
    CLEAN_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"oesm_clean_worldbank_{today_str}.csv"
    path = CLEAN_DIR / filename

    header_lines = [
        "# OESM — Dati puliti World Bank — San Marino",
        "# Valori in unità originali (USD per indicatori monetari, % per ratios)",
        "# NON convertiti in EUR — usare script 03 per la conversione",
        f"# Generato: {date.today().isoformat()}",
        f"# Indicatori: {df['indicator_id'].nunique()}",
        f"# Anni coperti: {int(df['year'].min())}–{int(df['year'].max())}",
        f"# Osservazioni totali: {len(df)}",
        "#",
    ]

    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(header_lines) + "\n")
        df.to_csv(f, index=False)

    return path

# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    args = parse_args()
    today_str = date.today().strftime("%d_%m_%Y")

    print(f"Download {len(OESM_INDICATORS)} indicatori World Bank per San Marino (SMR)...\n")

    all_data = {}
    for code in OESM_INDICATORS:
        print(f"[{code}]")
        df = fetch_single_indicator(code)
        if not df.empty:
            raw_path = save_raw_excel(code, df, today_str)
            print(f"  ✓ {len(df)} osservazioni → raw: {raw_path.name}")
            all_data[code] = df
        else:
            print(f"  ✗ nessun dato")
        print()

    print("Costruzione file clean...")
    clean_df = build_clean(all_data, args.start)

    clean_path = save_clean(clean_df, today_str)
    print(f"\n✓ Clean salvato: {clean_path}")
    print(f"  Indicatori: {clean_df['indicator_id'].nunique()}")
    print(f"  Anni: {int(clean_df['year'].min())}–{int(clean_df['year'].max())}")
    print(f"  Osservazioni: {len(clean_df)}")

    # Riepilogo per indicatore
    print("\nRiepilogo per indicatore:")
    summary = clean_df.groupby("indicator_id").agg(
        anni=("year", "count"),
        primo=("year", "min"),
        ultimo=("year", "max"),
    ).reset_index()
    print(summary.to_string(index=False))

if __name__ == "__main__":
    main()
