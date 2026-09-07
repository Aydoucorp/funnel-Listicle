import type { Metadata } from 'next'
import Link from 'next/link'
import { BrandHeader } from '@/components/BrandHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { quiz } from '@/lib/quiz'

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description:
    'Ce que je fais de tes données quand tu passes le quiz, expliqué simplement et sans jargon.',
}

export default function ConfidentialitePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <BrandHeader compact />

      <main className="flex-1 px-5 pb-10">
        <article className="prose-soft mx-auto w-full max-w-[680px]">
          <div className="card px-6 py-8 sm:px-9">
            <p className="kicker">Politique de confidentialité</p>
            <h1 className="mt-3 font-display text-[clamp(26px,5vw,34px)] font-medium text-ink">
              Ce que je fais de tes données
            </h1>
            <p className="mt-2 text-[13px] text-muted">
              Dernière mise à jour : [À COMPLÉTER : date de mise en ligne]
            </p>

            <p className="mt-6">
              Coucou toi. Tu viens de passer un petit quiz sur ta maison, alors voici, en français
              tout simple, ce que je collecte, pourquoi, et comment tu peux tout effacer quand tu
              veux.
            </p>

            <h2>Qui s’occupe de tes données</h2>
            <p>
              Le responsable du traitement est [À COMPLÉTER : prénom, nom ou raison sociale],
              [À COMPLÉTER : adresse], joignable à [À COMPLÉTER : adresse email de contact].
              Le site s’appelle « {quiz.meta.brand} » et se trouve sur Instagram sous{' '}
              {quiz.meta.instagram}.
            </p>

            <h2>Ce que je collecte</h2>
            <ul>
              <li>
                <strong>Pendant le quiz</strong> : tes réponses, la question affichée, tes retours
                en arrière, le type d’appareil et la provenance du lien. Tout ça est anonyme, rien
                ne permet de te reconnaître.
              </li>
              <li>
                <strong>À la fin, si tu le souhaites</strong> : ton prénom et ton adresse email,
                uniquement quand tu coches la case de consentement.
              </li>
              <li>
                <strong>Mesure d’audience</strong> : des statistiques de fréquentation sans cookie
                et sans profilage (Vercel Analytics).
              </li>
            </ul>

            <h2>Pourquoi je les collecte</h2>
            <ul>
              <li>Pour t’envoyer le guide qui correspond à ton résultat et mes recettes maison.</li>
              <li>Pour t’envoyer ensuite mes conseils par email, si tu as accepté de les recevoir.</li>
              <li>
                Pour comprendre où les gens décrochent dans le quiz et l’améliorer (statistiques
                anonymes).
              </li>
            </ul>

            <h2>Sur quelle base légale</h2>
            <p>
              Sur ton <strong>consentement</strong>, donné en cochant la case avant de recevoir ton
              résultat, puis confirmé en cliquant sur le lien de l’email de confirmation (double
              opt-in). Les statistiques du quiz reposent sur mon intérêt légitime à améliorer le
              site, et elles ne contiennent aucune donnée personnelle.
            </p>

            <h2>Qui d’autre y a accès</h2>
            <ul>
              <li>
                <strong>MailerLite</strong> (envoi des emails), qui héberge ton prénom, ton email et
                tes réponses. Voir leur politique de confidentialité sur mailerlite.com.
              </li>
              <li>
                <strong>Vercel</strong> (hébergement du site et de la base de données) et{' '}
                [À COMPLÉTER : autre hébergeur de base de données si différent].
              </li>
            </ul>
            <p>Je ne vends ni ne loue jamais tes données. À personne, jamais.</p>

            <h2>Combien de temps je les garde</h2>
            <ul>
              <li>
                Ton prénom et ton email : tant que tu restes inscrite, et jusqu’à 3 ans après ton
                dernier signe de vie si tu ne te désinscris pas.
              </li>
              <li>Les statistiques anonymes du quiz : 25 mois maximum.</li>
            </ul>

            <h2>Tes droits</h2>
            <p>
              Tu peux à tout moment demander l’accès à tes données, leur correction, leur
              effacement, la limitation de leur traitement, leur portabilité, ou t’opposer à leur
              utilisation. Le plus simple : écris-moi à [À COMPLÉTER : adresse email de contact], et
              je m’en occupe. Chaque email que tu reçois contient aussi un lien de désinscription en
              un clic.
            </p>
            <p>
              Si quelque chose ne va pas et que ma réponse ne te convient pas, tu peux saisir la
              CNIL (cnil.fr).
            </p>

            <h2>Cookies</h2>
            <p>
              Le quiz garde juste une petite information technique dans ton navigateur, le temps de
              ta visite, pour relier tes réponses entre elles et t’afficher ton résultat. La mesure
              d’audience ne pose pas de cookie et ne te suit pas d’un site à l’autre. Donc pas de
              bandeau à cliquer, c’est plus agréable pour tout le monde.
            </p>

            <p className="mt-8">
              <Link href="/mentions-legales">Voir aussi les mentions légales</Link>
            </p>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
