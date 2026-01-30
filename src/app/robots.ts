import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nex.is-a.dev';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Add any folders you want to hide
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}