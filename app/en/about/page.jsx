import Link from 'next/link';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'About OESM — Economic Observatory of San Marino',
  description: 'About the OESM project. An independent platform for macroeconomic monitoring of the Republic of San Marino.',
  alternates: { canonical: 'https://oesm.net/en/about', languages: { 'it': 'https://oesm.net/about', 'en': 'https://oesm.net/en/about' } },
};

export default function AboutPageEN() {
  return (
    <div style={{ paddingTop: 64 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 40px 120px' }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>About</p>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, lineHeight: 1.1, marginBottom: 48, maxWidth: 700 }}>
          An independent reference<br /><span style={{ fontStyle: 'italic' }}>for the San Marino economy</span>
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 80, alignItems: 'start' }} className="grid-2">
          <div style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.9 }}>
            <p style={{ marginBottom: 24 }}>
              <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>OESM — Osservatorio Economico di San Marino</strong> is an independent data platform for monitoring the macroeconomic performance of the Republic of San Marino. The project collects, processes and publishes key economic indicators using open and verifiable data from international and national institutions.
            </p>
            <p style={{ marginBottom: 24 }}>
              Data is sourced from the World Bank, the International Monetary Fund, the Central Bank of San Marino and the State Office of Statistics. Updates are automated via weekly ETL pipelines, ensuring timeliness and consistency of information without manual intervention.
            </p>
            <p style={{ marginBottom: 24 }}>
              In addition to standard macroeconomic indicators, OESM develops original research indices. The first is the <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>SMLLI — San Marino Labour Income Leakage Index</strong>, which measures the outflow of labour income from the San Marino economy to Italy by cross-border workers (frontalieri).
            </p>
            <p>
              All data is freely accessible, downloadable in CSV format and usable under open licence. The project is designed to be a transparent, scalable and methodologically rigorous reference for researchers, journalists, institutions and policy makers.
            </p>
          </div>

          <div>
            <div style={{ background: 'var(--off)', border: '1px solid var(--border)', padding: '28px 24px', marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>Data sources</div>
              {[
                { name: 'World Bank Open Data', url: 'https://data360.worldbank.org/en/economy/SMR' },
                { name: 'IMF DataMapper', url: 'https://www.imf.org/external/datamapper' },
                { name: 'Central Bank of San Marino', url: 'https://www.bcsm.sm' },
                { name: 'State Office of Statistics', url: 'https://www.statistica.sm' },
                { name: 'Government of San Marino', url: 'https://www.gov.sm' },
              ].map(s => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-secondary)', padding: '8px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none' }}>
                  {s.name}
                </a>
              ))}
            </div>

            <div style={{ background: 'var(--off)', border: '1px solid var(--border)', padding: '28px 24px' }}>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>Contacts</div>
              <a href="mailto:info@oesm.net" style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, textDecoration: 'none' }}>info@oesm.net</a>
              <a href="https://oesm.net" style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}>oesm.net</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
