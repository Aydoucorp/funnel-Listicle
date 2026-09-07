# Quiz « Qu'est-ce qui pollue vraiment ta maison ? »

Le quiz-diagnostic d'Émilie & sa maison saine : 6 questions, 5 profils, capture d'email en double
opt-in vers MailerLite, et un back-office privé pour voir où les gens décrochent.

Construit avec Next.js (App Router), TypeScript, Tailwind, Prisma et Postgres. Hébergé sur Vercel.

---

## Mettre le site en ligne, sans jamais ouvrir de terminal

Les tables de la base de données se créent **toutes seules** au moment du déploiement (la commande
de build lance `prisma migrate deploy`). Tu n'as donc rien à installer sur ton ordinateur.

### 1. Envoyer le code sur GitHub

Crée un dépôt vide sur github.com, puis envoie ce dossier dedans (le bouton « uploading an existing
file » de GitHub fonctionne très bien si tu ne veux pas de terminal).

### 2. Créer la base de données

Dans Vercel : **Storage → Create Database → Postgres** (ou Neon, au choix). Vercel la relie au
projet et ajoute la variable `DATABASE_URL` automatiquement.

> Si tu ne vois qu'une variable nommée `POSTGRES_URL` et pas `DATABASE_URL`, crée une variable
> `DATABASE_URL` avec la même valeur. C'est le nom que Prisma attend.

### 3. Importer le projet dans Vercel

**Add New → Project → Import** ton dépôt GitHub. Ne touche à rien dans les réglages de build :
la commande est déjà dans le projet.

### 4. Coller les variables d'environnement

Dans **Settings → Environment Variables**, ajoute ces variables (coche les trois environnements :
Production, Preview, Development) :

| Variable | Valeur |
|---|---|
| `MAILERLITE_API_TOKEN` | ton token MailerLite (Integrations → API) |
| `MAILERLITE_GROUP_BEBE` | ID du groupe « Bébé » |
| `MAILERLITE_GROUP_ANIMAL` | ID du groupe « Animal » |
| `MAILERLITE_GROUP_AIR` | ID du groupe « Air sain » |
| `MAILERLITE_GROUP_BUDGET` | ID du groupe « Budget » |
| `MAILERLITE_GROUP_CHARGE` | ID du groupe « Charge mentale » |
| `MAILERLITE_GROUP_ALL` | ID du groupe « Quiz - toutes » |
| `DATABASE_URL` | ajoutée automatiquement par Vercel Postgres |
| `ADMIN_INITIAL_PASSWORD` | un mot de passe fort (12 caractères minimum) |
| `ADMIN_SESSION_SECRET` | une longue chaîne aléatoire (32 caractères minimum) |
| `NEXT_PUBLIC_SITE_URL` | l'adresse de ton site, par exemple `https://ton-quiz.vercel.app` |

> Les six identifiants de groupe sont dans `mailerlite-groups-ids.md`, gardé hors du dépôt.
> Tu les colles directement dans Vercel.

### 5. Déployer

Clique sur **Deploy**. Pendant le build, Vercel exécute :

```
prisma generate && prisma migrate deploy && next build
```

`prisma migrate deploy` crée les tables si elles n'existent pas. Rien d'autre à faire.

### 6. Créer ton compte admin

Va sur `https://ton-site.vercel.app/admin`, entre le mot de passe que tu as mis dans
`ADMIN_INITIAL_PASSWORD` : le compte se crée à ce moment-là. Ensuite, va dans **Mon compte** pour
choisir un nouveau mot de passe. Tu peux alors supprimer la variable `ADMIN_INITIAL_PASSWORD` de
Vercel, elle ne sert plus.

### 7. Régler MailerLite

Dans MailerLite : **Settings → Subscribe settings → double opt-in activé**. Puis, pour chaque
groupe, crée une automation « quand quelqu'un rejoint ce groupe » qui envoie l'ebook du profil
**et** les recettes bonus.

---

## Tester en local (facultatif)

```bash
npm install
cp .env.example .env.local
npm run dev
```

Le quiz tourne sur http://localhost:3000 même sans base de données ni token MailerLite : le
parcours et le résultat fonctionnent, seules les statistiques et l'envoi vers MailerLite sont mis
en pause. Pour tout tester, mets un `DATABASE_URL` (une base Neon gratuite suffit) puis lance
`npm run db:push` une seule fois.

---

## Les commandes

| Commande | Ce qu'elle fait |
|---|---|
| `npm run dev` | lance le site en local |
| `npm run build` | build de production, avec migration de la base (ce que Vercel utilise) |
| `npm run build:local` | build sans toucher à la base, pratique pour vérifier que tout compile |
| `npm run db:push` | crée les tables dans la base de développement |
| `npm run db:studio` | ouvre une visionneuse de la base |

---

## Comment c'est rangé

```
app/
  page.tsx                 accueil du quiz
  quiz/                    les 6 questions et le formulaire
  resultat/                la page de résultat personnalisée
  admin/                   le back-office (connexion, tableau de bord, compte)
  api/event/               enregistrement des événements du funnel
  api/subscribe/           scoring serveur + envoi vers MailerLite
  confidentialite/         politique de confidentialité
  mentions-legales/        mentions légales
components/                l'interface (quiz, admin, marque)
lib/
  quiz.ts                  lecture de quiz-content.json
  scoring.ts               calcul du profil, côté serveur uniquement
  mailerlite.ts            appels à l'API MailerLite
  analytics.ts             les requêtes du tableau de bord
  admin-auth.ts            mots de passe hachés et sessions admin
  rate-limit.ts            limitation du nombre de requêtes
  validation.ts            tous les schémas Zod
prisma/schema.prisma       le modèle de données
middleware.ts              première barrière devant /admin
```

Le contenu du quiz (questions, réponses, points, textes de résultat) vit dans
**`quiz-content.json`**. Pour changer un texte, modifie ce fichier : le site suit.

La direction artistique est dans **`DA-DESIGN-SYSTEM.md`**, et sa traduction en code dans
**`tailwind.config.ts`**.

Deux documents complètent celui-ci, gardés hors du dépôt : `DECISIONS.md` (les choix techniques
et leurs raisons) et `SECURITY-CHECKLIST.md` (le détail de ce qui a été fait côté sécurité).
