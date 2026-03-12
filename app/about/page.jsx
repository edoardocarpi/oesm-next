import Link from 'next/link';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'About — Il Progetto OESM',
  description: "OESM è una piattaforma indipendente di monitoraggio economico dedicata alla Repubblica di San Marino, costruita su principi di trasparenza, rigore metodologico e accessibilità.",
  alternates: { canonical: 'https://oesm.net/about' },
};

const PRINCIPI = [
  { titolo: 'Trasparenza',   desc: 'Ogni dato è tracciabile alla fonte originale. Le metodologie di calcolo e le eventuali stime sono sempre dichiarate esplicitamente.' },
  { titolo: 'Rigore',        desc: 'I dati vengono validati prima della pubblicazione. In caso di discrepanze tra fonti, viene adottato un criterio di selezione esplicito e documentato.' },
  { titolo: 'Accessibilità', desc: 'Tutti i dati sono pubblici e scaricabili liberamente in formato CSV. Nessun paywall, nessuna registrazione richiesta.' },
  { titolo: 'Continuità',    desc: 'OESM è progettato per durare nel tempo. L\'architettura garantisce aggiornamenti regolari e scalabilità verso nuovi indicatori.' },
];

const COLLABORAZIONI = [
  'Istituzione pubblica sammarinese', 'Centro di ricerca o università',
  'Media e giornalismo', 'Impresa privata',
  'Organizzazione internazionale', 'Sviluppatore / contributo tecnico',
];

export default function AboutPage() {
  return (
    <div style={{ paddingTop: 64 }}>


      <div style={{ padding: '72px 40px 64px', borderBottom: '1px solid var(--border)', background: 'var(--off)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -80, top: '50%', transform: 'translateY(-50%)', width: 400, height: 400, borderRadius: '50%', border: '1px solid var(--border)', opacity: 0.5 }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>Il progetto</p>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, lineHeight: 1.1, maxWidth: 700, marginBottom: 28 }}>
            Osservatorio Economico<br /><span style={{ fontStyle: 'italic' }}>di San Marino</span>
          </h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 16, color: 'var(--text-secondary)', maxWidth: 560, lineHeight: 1.75 }}>
            OESM è una piattaforma indipendente di monitoraggio economico dedicata alla Repubblica di San Marino, costruita su principi di trasparenza, rigore metodologico e accessibilità.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>

        <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }} className="grid-2">
          <div>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ display: 'inline-block', width: 16, height: 1, background: 'var(--accent)' }} /> Missione
            </p>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 300, lineHeight: 1.2, marginBottom: 28 }}>
              Rendere i dati<br />economici accessibili
            </h2>
            {[
              "San Marino dispone di un'economia dinamica e di una storia istituzionale unica, ma i dati economici sono spesso frammentati tra più fonti, difficili da trovare e talvolta incoerenti tra loro.",
              "OESM nasce per colmare questo vuoto: una banca dati strutturata, aggiornata e libera, che metta a disposizione di ricercatori, giornalisti, imprenditori e istituzioni un quadro economico chiaro e affidabile.",
              "Il progetto è aperto a collaborazioni, contributi e integrazioni da parte di enti pubblici e privati che condividano gli obiettivi di trasparenza e qualità dei dati.",
            ].map((p, i) => (
              <p key={i} style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>{p}</p>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 24 }}>Principi fondanti</div>
            {PRINCIPI.map((p, i) => (
              <div key={p.titolo} style={{ padding: '20px 0', borderTop: i === 0 ? '1px solid var(--text-primary)' : '1px solid var(--border)', borderBottom: i === 3 ? '1px solid var(--text-primary)' : 'none', display: 'flex', gap: 20 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-muted)', minWidth: 24, paddingTop: 2 }}>0{i + 1}</div>
                <div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{p.titolo}</div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: '80px 0 100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }} className="grid-2">
          <div>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ display: 'inline-block', width: 16, height: 1, background: 'var(--accent)' }} /> Contatti
            </p>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 300, lineHeight: 1.2, marginBottom: 20 }}>
              Collabora<br />con OESM
            </h2>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 32 }}>
              Siamo aperti a collaborazioni con enti pubblici, centri di ricerca, università e organizzazioni internazionali.
            </p>
            <a href="mailto:info@oesm.net" className="btn-primary" style={{ textDecoration: 'none' }}>info@oesm.net</a>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 20 }}>Tipologie di collaborazione</div>
            {COLLABORAZIONI.map((tipo, i) => (
              <div key={tipo} style={{ padding: '14px 0', borderTop: '1px solid var(--border)', borderBottom: i === COLLABORAZIONI.length - 1 ? '1px solid var(--border)' : 'none', fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ display: 'inline-block', width: 4, height: 4, background: 'var(--border-strong)', borderRadius: '50%', flexShrink: 0 }} />
                {tipo}
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
