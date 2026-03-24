"""
OESM — Script 01: Download tassi di cambio BCE USD/EUR
=======================================================

Fonte ufficiale: BCE Statistical Data Warehouse (SDW)
Serie: EXR.A.USD.EUR.SP00.A
  EXR  = Exchange Rate
  A    = Frequenza annua (media annua — standard accademico)
  USD  = Valuta di quotazione
  EUR  = Valuta di riferimento
  SP00 = Spot rate
  A    = Average (media del periodo)

Perché la media annua:
  Lo standard accademico per la conversione di aggregati economici annuali
  (PIL, entrate turismo) è il tasso di cambio medio annuo. Elimina la
  volatilità giornaliera e stagionale, ed è riproducibile da chiunque
  scaricando la stessa serie BCE. Usato da FMI, OCSE, Eurostat e World Bank.

Output:
  /output/oesm_bce_usd_eur_rates_YYYYMMDD.csv

Uso:
  python scripts/01_fetch_ecb_rates.py
  python scripts/01_fetch_ecb_rates.py --start 1990 --end 2024

Dipendenze: requests, pandas
  pip install requests pandas
"""

import requests
import pandas as pd
import argparse
import sys
from datetime import date
from pathlib import Path

# ─── Configurazione ───────────────────────────────────────────────────────────

ECB_SDW_URL = (
    "https://data-api.ecb.europa.eu/service/data/"
    "EXR/A.USD.EUR.SP00.A"
    "?format=csvdata"
    "&startPeriod={start}"
    "&endPeriod={end}"
    "&detail=dataonly"
)

OUTPUT_DIR = Path(__file__).parent.parent / "output"

# ─── Argomenti CLI ────────────────────────────────────────────────────────────

def parse_args():
    parser = argparse.ArgumentParser(
        description="Download tassi BCE USD/EUR (media annua)"
    )
    parser.add_argument(
        "--start", type=int, default=1999,
        help="Anno di inizio (default: 1999, anno introduzione EUR)"
    )
    parser.add_argument(
        "--end", type=int, default=date.today().year,
        help=f"Anno di fine (default: anno corrente {date.today().year})"
    )
    return parser.parse_args()

# ─── Download ─────────────────────────────────────────────────────────────────

def fetch_ecb_rates(start_year: int, end_year: int) -> pd.DataFrame:
    url = ECB_SDW_URL.format(start=start_year, end=end_year)
    print(f"Download BCE SDW: {url}")

    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"ERRORE download BCE: {e}", file=sys.stderr)
        sys.exit(1)

    # Il CSV BCE ha header: KEY,FREQ,CURRENCY,CURRENCY_DENOM,EXR_TYPE,EXR_SUFFIX,TIME_PERIOD,OBS_VALUE
    # Cerca la riga header che contiene TIME_PERIOD (può essere in qualsiasi posizione)
    lines = response.text.strip().splitlines()
    header_idx = next(
        (i for i, l in enumerate(lines) if "TIME_PERIOD" in l), None
    )
    if header_idx is None:
        print("ERRORE: formato risposta BCE non riconosciuto", file=sys.stderr)
        print("Primi 10 righe:", "\n".join(lines[:10]), file=sys.stderr)
        sys.exit(1)

    from io import StringIO
    df = pd.read_csv(StringIO("\n".join(lines[header_idx:])))

    # Il CSV BCE ha colonne: KEY,FREQ,CURRENCY,CURRENCY_DENOM,EXR_TYPE,EXR_SUFFIX,TIME_PERIOD,OBS_VALUE
    # Rinomina le colonne utili
    df = df.rename(columns={
        "TIME_PERIOD": "anno",
        "OBS_VALUE":   "tasso_usd_eur",
    })

    # Converti anno in intero
    df["anno"] = df["anno"].astype(int)

    # Tieni solo le colonne utili
    df = df[["anno", "tasso_usd_eur"]].copy()
    df["tasso_usd_eur"] = df["tasso_usd_eur"].astype(float).round(6)

    # NOTA SUL TASSO:
    # La serie EXR.A.USD.EUR.SP00.A esprime quanti EUR per 1 USD.
    # Es. 2023: 0.9246 → 1 USD = 0.9246 EUR
    # Formula conversione: value_eur = value_usd × tasso_usd_eur
    # Questo è il tasso corretto per convertire valori USD → EUR.

    # Ordina per anno
    df = df.sort_values("anno").reset_index(drop=True)

    return df

# ─── Salvataggio ──────────────────────────────────────────────────────────────

def save_rates(df: pd.DataFrame) -> Path:
    today = date.today().strftime("%d_%m_%Y")
    filename = f"oesm_bce_usd_eur_rates_{today}.csv"
    output_path = OUTPUT_DIR / filename

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Header con metadati
    header_lines = [
        "# OESM — Tassi di cambio BCE USD/EUR (media annua)",
        "# Fonte: BCE Statistical Data Warehouse (SDW)",
        "# Serie: EXR.A.USD.EUR.SP00.A",
        "# URL: https://data-api.ecb.europa.eu/service/data/EXR/A.USD.EUR.SP00.A",
        "# Metodologia: tasso medio annuo (standard accademico per conversioni PIL)",
        "# Lettura: 1 USD = tasso_usd_eur EUR",
        f"# Generato: {date.today().isoformat()}",
        "#",
        "# Esempio: PIL 2023 = 2.027.527.228 USD × 0.9246 = 1.874.651.675 EUR",
        "#",
    ]

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(header_lines) + "\n")
        df.to_csv(f, index=False)

    return output_path

# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    args = parse_args()

    print(f"Scaricamento tassi BCE {args.start}–{args.end}...")
    df = fetch_ecb_rates(args.start, args.end)

    print(f"\nTassi scaricati: {len(df)} anni")
    print(df.to_string(index=False))

    output_path = save_rates(df)
    print(f"\n✓ Salvato: {output_path}")

if __name__ == "__main__":
    main()
