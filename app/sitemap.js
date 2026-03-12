import { INDICATOR_SEO } from '@/lib/seo';

export default function sitemap() {
  const base = 'https://oesm.net';
  const staticPages = [
    { url: base,                           lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/economia-san-marino`,  lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${base}/dati`,                 lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9  },
    { url: `${base}/indici/smlli`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8  },
    { url: `${base}/about`,                lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6  },
  ];
  const indicatorPages = Object.values(INDICATOR_SEO).map(seo => ({
    url: `${base}/dati/${seo.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));
  return [...staticPages, ...indicatorPages];
}
