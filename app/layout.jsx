import Navbar from '@/components/layout/Navbar';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://oesm.net'),
  title: {
    default: 'OESM — Osservatorio Economico di San Marino',
    template: '%s | OESM',
  },
  description: 'Banca dati economica indipendente dedicata alla Repubblica di San Marino. Dati aggiornati, analisi rigorose, accesso libero.',
  keywords: ['economia San Marino', 'dati economici San Marino', 'PIL San Marino', 'GDP San Marino', 'San Marino economic data'],
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://oesm.net',
    siteName: 'OESM — Osservatorio Economico di San Marino',
    title: 'OESM — Osservatorio Economico di San Marino',
    description: 'Banca dati economica indipendente dedicata alla Repubblica di San Marino.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: 'https://oesm.net',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>
        <Navbar />
  
        {children}
      </body>
    </html>
  );
}
