/**
 * Adresse publique du site.
 * On prend NEXT_PUBLIC_SITE_URL si elle existe, sinon l'adresse que Vercel fournit
 * automatiquement, sinon le localhost de developpement. Comme ca, les liens de partage
 * et le sitemap restent corrects meme si la variable a ete oubliee.
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (configured) return configured.replace(/\/$/, '')

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (vercelUrl) return `https://${vercelUrl.replace(/\/$/, '')}`

  return 'http://localhost:3000'
}
