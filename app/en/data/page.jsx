import DataClientEN from './DataClientEN';

export const metadata = {
  title: 'San Marino Economic Data — Historical Series | OESM',
  description: '13 economic indicators for the Republic of San Marino. Historical series 2010–2023. Open data from World Bank and IMF.',
  alternates: { canonical: 'https://oesm.net/en/data', languages: { 'it': 'https://oesm.net/dati', 'en': 'https://oesm.net/en/data' } },
};

export default function DataPageEN() {
  return <DataClientEN />;
}
