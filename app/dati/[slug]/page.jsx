import { notFound } from 'next/navigation';
import { INDICATORS, SERIES, CATEGORIES } from '@/lib/economicData';
import { INDICATOR_SEO, SLUG_TO_ID } from '@/lib/seo';
import IndicatorPageClient from './IndicatorPageClient';

// Genera tutte le pagine statiche al build time
export async function generateStaticParams() {
  return Object.values(INDICATOR_SEO).map(seo => ({ slug: seo.slug }));
}

// Meta tag SEO dinamici per ogni indicatore
export async function generateMetadata({ params }) {
  const id  = SLUG_TO_ID[params.slug];
  const seo = INDICATOR_SEO[id];
  if (!seo) return {};

  const indicator = INDICATORS.find(i => i.id === id);
  const series    = SERIES[id] ?? [];
  const lastValue = series[series.length - 1];

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: `https://oesm.net/dati/${seo.slug}` },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `https://oesm.net/dati/${seo.slug}`,
      type: 'website',
    },
  };
}

export default function IndicatorPage({ params }) {
  const id        = SLUG_TO_ID[params.slug];
  const seo       = INDICATOR_SEO[id];
  const indicator = INDICATORS.find(i => i.id === id);

  if (!id || !seo || !indicator) notFound();

  const series   = SERIES[id] ?? [];
  const category = CATEGORIES[indicator.category];

  // JSON-LD Dataset schema markup — letto da Google per Dataset Search
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: seo.title.replace(' | OESM', ''),
    description: seo.description,
    url: `https://oesm.net/dati/${seo.slug}`,
    identifier: `oesm-${id}`,
    creator: {
      '@type': 'Organization',
      name: 'OESM — Osservatorio Economico di San Marino',
      url: 'https://oesm.net',
    },
    publisher: {
      '@type': 'Organization',
      name: 'OESM',
      url: 'https://oesm.net',
    },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    temporalCoverage: '2010/2023',
    spatialCoverage: {
      '@type': 'Place',
      name: 'San Marino',
      identifier: 'SMR',
    },
    variableMeasured: indicator.label,
    measurementTechnique: `${indicator.source} — ${indicator.sourceCode}`,
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'text/csv',
      contentUrl: `https://oesm.net/api/dataset/${id}.csv`,
      name: `oesm-${seo.slug}.csv`,
    },
    keywords: seo.keywords,
  };

  // BreadcrumbList schema
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',         item: 'https://oesm.net' },
      { '@type': 'ListItem', position: 2, name: 'Dati',         item: 'https://oesm.net/dati' },
      { '@type': 'ListItem', position: 3, name: indicator.label, item: `https://oesm.net/dati/${seo.slug}` },
    ],
  };

  return (
    <>
      {/* Structured data injected server-side — visibile a Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <IndicatorPageClient
        indicator={indicator}
        series={series}
        seo={seo}
        category={category}
      />
    </>
  );
}
