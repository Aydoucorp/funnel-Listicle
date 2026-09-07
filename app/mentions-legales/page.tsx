import type { Metadata } from 'next'
import Link from 'next/link'
import { BrandHeader } from '@/components/BrandHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { quiz } from '@/lib/quiz'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Les informations légales du site du quiz.',
}

export default function MentionsLegalesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <BrandHeader compact />

      <main className="flex-1 px-5 pb-10">
        <article className="prose-soft mx-auto w-full max-w-[680px]">
          <div className="card px-6 py-8 sm:px-9">
            <p className="kicker">Mentions légales</p>
            <h1 className="mt-3 font-display text-[clamp(26px,5vw,34px)] font-medium text-ink">
              Les informations légales
            </h1>

            <p className="mt-3 rounded-field bg-gold/15 px-4 py-3 text-[14px] text-ink">
              Page à compléter avant la mise en ligne : remplace chaque mention
              [À COMPLÉTER] par tes informations réelles.
            </p>

            <h2>Éditeur du site</h2>
            <ul>
              <li>Nom du site : « {quiz.meta.brand} »</li>
              <li>Éditrice : [À COMPLÉTER : prénom, nom ou raison sociale]</li>
              <li>Statut : [À COMPLÉTER : particulier, micro-entreprise, société]</li>
              <li>Adresse : [À COMPLÉTER : adresse postale]</li>
              <li>Email : [À COMPLÉTER : adresse email de contact]</li>
              <li>Numéro SIRET : [À COMPLÉTER, si tu en as un]</li>
              <li>Numéro de TVA intracommunautaire : [À COMPLÉTER, si concerné]</li>
              <li>Directrice de la publication : [À COMPLÉTER : prénom, nom]</li>
            </ul>

            <h2>Hébergement</h2>
            <ul>
              <li>Hébergeur : Vercel Inc.</li>
              <li>Adresse : 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</li>
              <li>Site : vercel.com</li>
              <li>
                Base de données : [À COMPLÉTER : Vercel Postgres, Neon, ou ton hébergeur de base]
              </li>
            </ul>

            <h2>Propriété intellectuelle</h2>
            <p>
              Les textes, les guides et les visuels de ce site sont l’œuvre de son éditrice. Merci
              de ne pas les reprendre sans son accord. Tu peux bien sûr partager le lien du quiz
              autant que tu veux, ça fait plaisir.
            </p>

            <h2>Un mot important</h2>
            <p>
              Ce quiz parle de ressenti et d’habitudes de ménage. Ce n’est ni un diagnostic médical,
              ni un avis de santé. Si quelque chose t’inquiète pour toi ou pour tes proches, parles-en
              à un professionnel de santé.
            </p>

            <h2>Données personnelles</h2>
            <p>
              Tout est expliqué sur la page{' '}
              <Link href="/confidentialite">politique de confidentialité</Link>.
            </p>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
