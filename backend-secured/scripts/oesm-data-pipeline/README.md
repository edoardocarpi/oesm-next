# OESM — Data Pipeline

Pipeline per il download, pulizia e conversione dei dati economici di San Marino.

## Struttura

```
oesm-data-pipeline/
  scripts/
    01_fetch_ecb_rates.py   ← scarica tassi BCE USD/EUR (media annua)
    02_fetch_worldbank.py   ← scarica dati WB, salva raw e clean
    03_convert_eur.py       ← converte USD → EUR con tassi BCE
  raw/                      ← file originali intoccati (mai modificare)
  clean/                    ← dati puliti in USD/unità originali
  output/                   ← tassi BCE e dataset finale EUR
```

## Dipendenze

```bash
pip install requests pandas openpyxl
```

## Uso — sequenza completa

```bash
# Step 1: scarica tassi BCE (media annua 1999–oggi)
python scripts/01_fetch_ecb_rates.py

# Step 2: scarica dati World Bank (tutti gli anni disponibili dal 1990)
python scripts/02_fetch_worldbank.py

# Step 3: converti USD → EUR
python scripts/03_convert_eur.py
```

Il file finale è `/output/oesm_worldbank_YYYYMMDD.csv`.

## File prodotti

| File | Cartella | Descrizione |
|------|----------|-------------|
| `oesm_bce_usd_eur_rates_DATA.csv` | `/output` | Tassi BCE annui medi |
| `oesm_raw_worldbank_[CODE]_DATA.csv` | `/raw` | Copia fedele dati WB per indicatore |
| `oesm_clean_worldbank_DATA.csv` | `/clean` | Tutti gli indicatori, unità originali |
| `oesm_worldbank_DATA.csv` | `/output` | Dataset finale con conversione EUR |

## Regola fondamentale

I file in `/raw/` non vanno mai modificati. Sono la prova che i dati
corrispondono esattamente a quanto scaricato dalla fonte primaria.
Qualsiasi modifica avviene solo negli script, mai sui file raw.

## Metodologia conversione EUR

Tasso usato: **media annua BCE** (serie `EXR.A.USD.EUR.SP00.A`).

È lo standard accademico per la conversione di aggregati economici annuali.
Usato da FMI, OCSE, Eurostat e World Bank nelle proprie conversioni.
Elimina la volatilità giornaliera e stagionale.

Formula: `value_eur = value_usd × tasso_bce_anno`

Gli indicatori già in % o unità non monetarie (disoccupazione, PIL crescita,
apertura commerciale, ecc.) non vengono convertiti — il valore rimane invariato.

## Aggiornamento annuale

Ripetere la sequenza degli script ogni anno dopo il rilascio World Bank
(tipicamente luglio). I file raw precedenti rimangono in `/raw/` come archivio.
