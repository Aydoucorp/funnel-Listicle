import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site-url'

// Rendu a la demande : l'adresse du site est relue a chaque requete.
export const dynamic = 'force-dynamic'



export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()
  const now = new Date()

  return [
    { url: siteUrl, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/quiz`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    {
      url: `${siteUrl}/confidentialite`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${siteUrl}/mentions-legales`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]
}
