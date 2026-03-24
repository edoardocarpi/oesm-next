"""
OESM — Script 03: Conversione USD → EUR
========================================

Legge i file più recenti di:
  /clean/oesm_clean_worldbank_*.csv    ← dati USD World Bank
  /output/oesm_bce_usd_eur_rates_*.csv ← tassi BCE annui

Per ogni riga con eur_convert=True:
  value_eur = value_original (USD) × tasso_bce_anno

Per le righe con eur_convert=False:
  value_eur = value_original (invariato, già in %)

Logica di fallback per anni senza tasso BCE:
  - Se l'anno è prima del 1999 (introduzione EUR): nessuna conversione,
    il dato viene escluso dal file EUR con nota esplicita
  - Se l'anno non ha tasso ma è >= 1999: usa il tasso dell'anno
    più vicino disponibile con avviso nel log

Output:
  /output/oesm_worldbank_YYYYMMDD.csv  ← dati finali con EUR

Uso:
  python scripts/03_convert_eur.py
  python scripts/03_convert_eur.py --clean path/to/file.csv --rates path/to/rates.csv

Dipendenze: pandas
  pip install pandas
"""

import pandas as pd
import argparse
import sys
from datetime import date
from pathlib import Path

# ─── Configurazione ───────────────────────────────────────────────────────────

CLEAN_DIR  = Path(__file__).parent.parent / "clean"
OUTPUT_DIR = Path(__file__).parent.parent / "output"

# ─── Argomenti CLI ────────────────────────────────────────────────────────────

def parse_args():
    parser = argparse.ArgumentParser(
        description="Converti dati World Bank USD → EUR con tassi BCE"
    )
    parser.add_argument(
        "--clean", type=Path, default=None,
        help="Percorso file clean (default: file più recente in /clean/)"
    )
    parser.add_argument(
        "--rates", type=Path, default=None,
        help="Percorso file tassi BCE (default: file più recente in /output/)"
    )
    return parser.parse_args()

# ─── Trova file più recente ───────────────────────────────────────────────────

def find_latest(directory: Path, pattern: str) -> Path:
    files = sorted(directory.glob(pattern))
    if not files:
        print(f"ERRORE: nessun file '{pattern}' trovato in {directory}", file=sys.stderr)
        sys.exit(1)
    latest = files[-1]
    print(f"  Usando: {latest.name}")
    return latest

# ─── Carica tassi BCE ─────────────────────────────────────────────────────────

def load_rates(path: Path) -> dict:
    """
    Legge il CSV dei tassi BCE (saltando le righe di commento con #)
    Restituisce dict: {anno_int: tasso_float}
    """
    df = pd.read_csv(path, comment="#")
    df["anno"] = df["anno"].astype(int)
    df["tasso_usd_eur"] = df["tasso_usd_eur"].astype(float)
    rates = dict(zip(df["anno"], df["tasso_usd_eur"]))
    print(f"  Tassi BCE caricati: {min(rates.keys())}–{max(rates.keys())} ({len(rates)} anni)")
    return rates

# ─── Carica dati clean ────────────────────────────────────────────────────────

def load_clean(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path, comment="#")
    print(f"  Dati clean caricati: {len(df)} righe, anni {df['year'].min()}–{df['year'].max()}")
    return df

# ─── Conversione ─────────────────────────────────────────────────────────────

def convert_to_eur(df: pd.DataFrame, rates: dict) -> pd.DataFrame:
    """
    Applica la conversione USD→EUR riga per riga.
    Aggiunge colonne: value_eur, eur_rate_used, conversion_note
    """
    results = []
    warnings = []

    for _, row in df.iterrows():
        year   = int(row["year"])
        value  = float(row["value_original"])
        do_eur = str(row["eur_convert"]).lower() in ("true", "1", "yes")

        if not do_eur:
            # Nessuna conversione necessaria (%, persone, arrivi)
            results.append({
                **row.to_dict(),
                "value_eur":        value,
                "eur_rate_used":    None,
                "conversion_note":  "no_conversion_needed",
            })
            continue

        # Anno prima del 1999: EUR non esisteva
        if year < 1999:
            results.append({
                **row.to_dict(),
                "value_eur":        None,
                "eur_rate_used":    None,
                "conversion_note":  "pre_eur_era_excluded",
            })
            warnings.append(f"  AVVISO: {row['indicator_id']} {year} — pre-EUR, escluso")
            continue

        # Anno con tasso disponibile
        # NOTA: tasso_usd_eur = quanti EUR per 1 USD
        # Es. 2023: 0.9246 → 1 USD = 0.9246 EUR
        # Formula: value_eur = value_usd × tasso
        if year in rates:
            rate = rates[year]
            value_eur = round(value / rate, 2)
            results.append({
                **row.to_dict(),
                "value_eur":        value_eur,
                "eur_rate_used":    rate,
                "conversion_note":  f"ecb_annual_avg_{year}",
            })
            continue

        # Anno senza tasso: usa il più vicino disponibile
        available = sorted(rates.keys())
        nearest   = min(available, key=lambda y: abs(y - year))
        rate      = rates[nearest]
        value_eur = round(value * rate, 2)
        results.append({
            **row.to_dict(),
            "value_eur":        value_eur,
            "eur_rate_used":    rate,
            "conversion_note":  f"ecb_nearest_year_{nearest}",
        })
        warnings.append(
            f"  AVVISO: {row['indicator_id']} {year} — "
            f"tasso BCE non disponibile, usato anno {nearest} ({rate})"
        )

    if warnings:
        print("\nAvvisi conversione:")
        for w in warnings:
            print(w)

    return pd.DataFrame(results)

# ─── Salva output ─────────────────────────────────────────────────────────────

def save_output(df: pd.DataFrame, today_str: str) -> Path:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"oesm_worldbank_{today_str}.csv"
    path = OUTPUT_DIR / filename

    # Riordina colonne per chiarezza
    cols_order = [
        "country_code", "country", "year",
        "indicator_id", "label_it", "label_en",
        "value_original", "unit_original",
        "value_eur", "eur_rate_used",
        "category", "eur_convert", "conversion_note",
        "source", "source_code", "source_url", "retrieved_date",
    ]
    # Mantieni solo le colonne che esistono
    cols = [c for c in cols_order if c in df.columns]
    df = df[cols].sort_values(["indicator_id", "year"]).reset_index(drop=True)

    # Statistiche riepilogative
    converted = df[df["eur_convert"] == True]
    excluded  = df[df["conversion_note"] == "pre_eur_era_excluded"]

    header_lines = [
        "# OESM — Dataset finale con conversione EUR",
        "# Paese: San Marino (SMR)",
        f"# Generato: {date.today().isoformat()}",
        f"# Indicatori: {df['indicator_id'].nunique()}",
        f"# Anni coperti: {int(df['year'].min())}–{int(df['year'].max())}",
        f"# Osservazioni totali: {len(df)}",
        f"# Righe convertite USD→EUR: {len(converted) - len(excluded)}",
        f"# Righe escluse (pre-1999, no EUR): {len(excluded)}",
        "# Tasso di conversione: media annua BCE (EXR.A.USD.EUR.SP00.A)",
        "# Licenza: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/",
        "# Citazione: OESM (2025). San Marino Economic Indicators. https://oesm.net",
        "#",
        "# COLONNE:",
        "#   value_original  = valore originale dalla fonte (USD o % o unità native)",
        "#   value_eur       = valore convertito in EUR (None se no_conversion_needed o pre-1999)",
        "#   eur_rate_used   = tasso BCE usato per la conversione",
        "#   conversion_note = ecb_annual_avg_YYYY | no_conversion_needed | pre_eur_era_excluded",
        "#",
    ]

    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(header_lines) + "\n")
        df.to_csv(f, index=False)

    return path, df

# ─── Riepilogo finale ─────────────────────────────────────────────────────────

def print_summary(df: pd.DataFrame):
    print("\n" + "="*60)
    print("RIEPILOGO DATASET FINALE")
    print("="*60)

    summary = df.groupby("indicator_id").agg(
        anni    = ("year", "count"),
        primo   = ("year", "min"),
        ultimo  = ("year", "max"),
        ha_eur  = ("value_eur", lambda x: x.notna().sum()),
    ).reset_index()

    print(summary.to_string(index=False))

    print("\nValori di esempio (ultimo anno disponibile per indicatore):")
    latest = df.sort_values("year").groupby("indicator_id").last().reset_index()
    for _, row in latest.iterrows():
        eur_str = f"{row['value_eur']:,.2f} EUR" if pd.notna(row["value_eur"]) and row["eur_convert"] else f"{row['value_original']:,.4f} {row['unit_original']}"
        print(f"  {row['indicator_id']:30s} {row['year']}  {eur_str}")

# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    args = parse_args()
    today_str = date.today().strftime("%d_%m_%Y")

    print("Script 03 — Conversione USD → EUR\n")

    print("Caricamento file clean:")
    clean_path = args.clean or find_latest(CLEAN_DIR, "oesm_clean_worldbank_*.csv")
    df = load_clean(clean_path)

    print("\nCaricamento tassi BCE:")
    rates_path = args.rates or find_latest(OUTPUT_DIR, "oesm_bce_usd_eur_rates_*.csv")
    rates = load_rates(rates_path)

    print("\nConversione in corso...")
    df_converted = convert_to_eur(df, rates)

    print("\nSalvataggio output...")
    output_path, df_final = save_output(df_converted, today_str)
    print(f"✓ Salvato: {output_path}")

    print_summary(df_final)

if __name__ == "__main__":
    main()

