import DatiClient from './DatiClient';

export const metadata = {
  title: 'Banca Dati Economica — San Marino',
  description: 'Tutti gli indicatori economici di San Marino con serie storiche 2010–2023. PIL, inflazione, disoccupazione, commercio estero, turismo. Dataset scaricabili in CSV.',
  alternates: { canonical: 'https://oesm.net/dati' },
};

export default function DatiPage() {
  return <DatiClient />;
}
