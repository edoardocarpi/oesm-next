import HomeClient from './HomeClient';

export const metadata = {
  title: 'OESM — Osservatorio Economico di San Marino',
  description: "Banca dati economica indipendente dedicata alla Repubblica di San Marino. PIL, inflazione, occupazione, commercio estero e molto altro. Dati aggiornati e accesso libero.",
  alternates: { canonical: 'https://oesm.net' },
  openGraph: {
    title: 'OESM — Osservatorio Economico di San Marino',
    description: "Dati economici di San Marino: PIL, inflazione, occupazione, commercio estero. Accesso libero.",
    url: 'https://oesm.net',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
