import { MetadataRoute } from 'next';
import { ACADEMY } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = ACADEMY.siteUrl;

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/programs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/schedule`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/coaches`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];
}
