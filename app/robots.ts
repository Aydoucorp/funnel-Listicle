import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site-url'

// Rendu a la demande : l'adresse du site est relue a chaque requete.
export const dynamic = 'force-dynamic'



export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Le back-office et les pages de resultat personnelles restent hors des moteurs.
      disallow: ['/admin', '/admin/', '/resultat', '/api/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
