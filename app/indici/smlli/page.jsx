import SMLLIClient from './SMLLIClient';

export const metadata = {
  title: 'SMLLI — San Marino Labour Income Leakage Index | OESM',
  description: "Il SMLLI misura il flusso netto annuo di redditi da lavoro tra San Marino e Italia. Stima 2024: –230 milioni di euro. Indice originale OESM.",
  keywords: ['SMLLI', 'redditi frontalieri San Marino', 'labour income leakage San Marino'],
  alternates: { canonical: 'https://oesm.net/indici/smlli' },
};

export default function SMLLIPage() {
  return <SMLLIClient />;
}
