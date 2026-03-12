import HomeClientEN from './HomeClientEN';

export const metadata = {
  title: 'OESM — Economic Observatory of San Marino',
  description: 'Macroeconomic data and indicators for the Republic of San Marino. Historical series 2010–2023. Open data from World Bank, IMF and San Marino institutions.',
  alternates: { canonical: 'https://oesm.net/en', languages: { 'it': 'https://oesm.net', 'en': 'https://oesm.net/en' } },
  openGraph: {
    title: 'OESM — Economic Observatory of San Marino',
    description: 'Macroeconomic data and indicators for the Republic of San Marino.',
    url: 'https://oesm.net/en',
    type: 'website',
  },
};

export default function PageEN() {
  return <HomeClientEN />;
}
