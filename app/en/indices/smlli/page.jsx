import SMLLIClientEN from './SMLLIClientEN';

export const metadata = {
  title: 'SMLLI — San Marino Labour Income Leakage Index | OESM',
  description: 'The SMLLI measures the annual outflow of labour income from San Marino to Italy by cross-border workers. Original OESM index, 2015–2024.',
  alternates: { canonical: 'https://oesm.net/en/indices/smlli', languages: { 'it': 'https://oesm.net/indici/smlli', 'en': 'https://oesm.net/en/indices/smlli' } },
};

export default function SMLLIPageEN() {
  return <SMLLIClientEN />;
}
