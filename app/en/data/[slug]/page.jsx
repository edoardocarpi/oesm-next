import { notFound } from 'next/navigation';
import { INDICATORS, SERIES, CATEGORIES } from '@/lib/economicData';
import { INDICATOR_SEO_EN, SLUG_TO_ID_EN } from '@/lib/seo_en';
import IndicatorPageClientEN from './IndicatorPageClientEN';

export async function generateStaticParams() {
  return Object.values(INDICATOR_SEO_EN).map(seo => ({ slug: seo.slug }));
}

export async function generateMetadata({ params }) {
  const id  = SLUG_TO_ID_EN[params.slug];
  const seo = INDICATOR_SEO_EN[id];
  if (!seo) return {};
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: `https://oesm.net/en/data/${seo.slug}`, languages: { 'en': `https://oesm.net/en/data/${seo.slug}` } },
    openGraph: { title: seo.title, description: seo.description, url: `https://oesm.net/en/data/${seo.slug}`, type: 'website' },
  };
}

export default function IndicatorPageEN({ params }) {
  const id        = SLUG_TO_ID_EN[params.slug];
  const seo       = INDICATOR_SEO_EN[id];
  const indicator = INDICATORS.find(i => i.id === id);

  if (!id || !seo || !indicator) notFound();

  const series   = SERIES[id] || [];
  const category = CATEGORIES[indicator.category];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: seo.title.replace(' | OESM', ''),
    description: seo.description,
    url: `https://oesm.net/en/data/${seo.slug}`,
    identifier: `oesm-${id}`,
    creator: { '@type': 'Organization', name: 'OESM — Economic Observatory of San Marino', url: 'https://oesm.net' },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    temporalCoverage: '2010/2023',
    spatialCoverage: { '@type': 'Place', name: 'San Marino', identifier: 'SMR' },
    variableMeasured: indicator.label,
    measurementTechnique: `${indicator.source} — ${indicator.sourceCode}`,
    keywords: seo.keywords,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <IndicatorPageClientEN indicator={indicator} series={series} seo={seo} category={category} />
    </>
  );
}
