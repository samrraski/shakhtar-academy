import { MetadataRoute } from 'next';
import { ACADEMY } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/admin/'] },
    sitemap: `${ACADEMY.siteUrl}/sitemap.xml`,
  };
}
