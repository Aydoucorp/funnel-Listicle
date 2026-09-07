# Cahier de route : Quiz Funnel « Émilie & sa maison saine »

> **À quoi sert ce fichier ?** C'est LA référence du projet. Mets-le à la racine du dépôt et renomme-le `CLAUDE.md` (Claude Code le lit automatiquement à chaque session). Il décrit quoi construire, comment, et pourquoi. Le contenu du quiz (questions, points, textes) est dans `quiz-content.json`.

---

## 1. Objectif du projet

Construire un **quiz-diagnostic** (web app) qui :
1. Fait passer un quiz de 6 questions (une par écran, barre de progression, ~2 min).
2. Calcule un **profil** parmi 5 (bébé, animal, air sain, budget, charge mentale) via un scoring.
3. Capture **prénom + email** (double opt-in RGPD) juste avant le résultat.
4. Range automatiquement la personne dans le **bon groupe MailerLite** (via l'API + ID de groupe).
5. Affiche une **page de résultat** personnalisée (profil + ebook + bonus recettes).
6. Enregistre **chaque interaction** (vues, réponses, abandons) pour un **back-office admin privé** d'analytics.

**Objectif business :** construire une liste email segmentée. Pas de vente pour l'instant.

**Canaux :** lien en bio Instagram (principal) + plus tard Reels → ManyChat → lien du quiz.

---

## 2. Stack technique

- **Framework :** Next.js (App Router, TypeScript).
- **Style :** Tailwind CSS. Respecter la charte (voir §7).
- **Base de données :** Postgres (Vercel Postgres / Neon). ORM : **Prisma** (simple à faire évoluer).
- **Hébergement :** Vercel. Dépôt : GitHub.
- **Analytics page :** `@vercel/analytics`.
- **Analytics funnel maison :** table d'événements en base + dashboard admin (voir §5).
- **Email :** MailerLite via son API HTTP (voir §4). Aucune librairie d'envoi d'email côté code, c'est MailerLite qui envoie.

---

## 3. Parcours utilisateur (le funnel)

```
Landing quiz (titre + « Commencer »)
        ↓  [event: quiz_start]
Q1 … Q6  (une question par écran, barre de progression)
        ↓  [event par question: question_view, question_answer, question_back]
Lead gate : prénom + email + case consentement RGPD
        ↓  [event: lead_gate_view, puis opt_in_submit]
POST /api/subscribe  → calcule le profil, appelle MailerLite (groupe + groupe « Quiz - toutes »)
        ↓
Page de résultat perso (profil + ebook + bonus recettes + « check ta boîte mail »)
        ↓  [event: result_view]
MailerLite : double opt-in → automation « rejoint le groupe » → envoi ebook + séquence
```

Règles UX (issues de la recherche) :
- **Une question par écran** + barre de progression.
- Q1 est **multi-choix** (bébé ET animal possibles). Les autres sont à **choix unique**.
- Le **lead gate se place juste avant le résultat** (point de conversion n°1).
- Boutons « Précédent » possibles (et loggés).
- Mobile-first (la majorité vient d'Instagram).

---

## 4. Intégration MailerLite (double opt-in)

**Endpoint à créer : `POST /api/subscribe`**
- Body reçu : `{ prenom, email, consent: true, answers: {...} }`.
- Le serveur (jamais le navigateur) :
  1. Recalcule le **profil gagnant** à partir des `answers` (ne pas faire confiance au client).
  2. Récupère l'**ID de groupe** correspondant au profil (voir mapping ci-dessous) depuis les variables d'env.
  3. Appelle l'API MailerLite pour **créer/mettre à jour l'abonné** avec : email, champ `name = prenom`, et l'ajoute au **groupe du profil** + au **groupe « Quiz - toutes »**.
  4. Stocke aussi chaque réponse dans des **champs (fields)** MailerLite pour du ciblage fin plus tard.
- **Sécurité :** le token MailerLite vit uniquement en variable d'environnement serveur. JAMAIS dans le code front / `NEXT_PUBLIC_*`.

**API MailerLite (nouvelle API) :**
- Base : `https://connect.mailerlite.com/api`
- Auth : header `Authorization: Bearer ${MAILERLITE_API_TOKEN}`
- Créer/upsert un abonné : `POST /subscribers` avec body `{ email, fields: { name }, groups: [GROUP_ID_PROFIL, GROUP_ID_ALL] }`.
- (Vérifier la doc à jour : https://developer.mailerlite.com )

**Double opt-in :** à activer dans MailerLite (Paramètres → double opt-in ON). MailerLite envoie l'email de confirmation ; à la confirmation, l'abonné devient actif dans son groupe → l'**automation** « quand rejoint le groupe X » envoie l'ebook + la séquence. (Ces automations se créent DANS MailerLite, pas dans le code.)

**Mapping profil → groupe (5 groupes) :**

| Profil | Groupe MailerLite | Variable d'env (ID) | Ebook envoyé |
|---|---|---|---|
| bebe | Bébé | `MAILERLITE_GROUP_BEBE` | Le sol où ton bébé rampe |
| animal | Animal | `MAILERLITE_GROUP_ANIMAL` | Ce que ton animal lèche |
| air | Air sain | `MAILERLITE_GROUP_AIR` | Une maison vraiment fraîche |
| budget | Budget | `MAILERLITE_GROUP_BUDGET` | Le vrai prix de ton placard |
| charge | Charge mentale | `MAILERLITE_GROUP_CHARGE` | Sans y laisser ta tête |
| (toutes) | Quiz - toutes | `MAILERLITE_GROUP_ALL` | (envois généraux) |

> Bonus recettes « Ma trousse ménage 100% maison » : offert à toutes → à ajouter dans CHAQUE automation d'accueil.

---

## 5. Back-office admin (analytics funnel) : LE point clé

Page **`/admin`**, protégée par mot de passe (formulaire de login + cookie de session httpOnly signé avec `ADMIN_SESSION_SECRET`). Non indexable (`noindex`).

**Gestion du mot de passe admin :** le mot de passe est **stocké haché en base** (table `AdminUser`, hash bcrypt/argon2) et **modifiable depuis `/admin`** (écran « Changer mon mot de passe »). Au tout premier lancement, si aucun admin n'existe, on crée le compte à partir de `ADMIN_INITIAL_PASSWORD` (env, utilisé une seule fois pour le seed). Après, la base fait foi ; `ADMIN_INITIAL_PASSWORD` peut être retiré.

### Modèle de données (Prisma / Postgres)

**Table `Session`**
- `id` (uuid), `startedAt`, `completedAt` (nullable), `resultProfile` (nullable), `optedIn` (bool, défaut false)
- `device`, `referrer`, `utmSource`, `utmMedium`, `utmCampaign` (nullable)

**Table `Event`**
- `id`, `sessionId` (FK), `type`, `questionId` (nullable), `answerValue` (nullable), `createdAt`
- `type` ∈ : `quiz_start`, `question_view`, `question_answer`, `question_back`, `lead_gate_view`, `opt_in_submit`, `result_view`, `abandon`

**Endpoint `POST /api/event`** : reçoit et enregistre un événement (léger, non bloquant côté UX).
Un **session_id** est généré au `quiz_start` et gardé côté client (cookie / localStorage) pour lier tous les événements.

### Ce que le dashboard doit montrer

1. **Vue funnel (entonnoir)** : nombre de sessions atteignant chaque étape (start → Q1 → Q2 → … → Q6 → lead gate → opt-in → résultat) avec le **taux d'abandon entre chaque étape**. C'est ici qu'on voit « où les gens décrochent ».
2. **Par question** : nombre de vues, temps moyen passé, nombre de « Précédent », et **distribution des réponses** (quelle option est choisie, en %).
3. **KPIs en haut** : taux de complétion du quiz, taux d'opt-in, nombre de leads, répartition par profil/groupe.
4. **Répartition par segment** (camembert ou barres) : combien de bébé / animal / air / budget / charge.
5. **Série temporelle** : sessions et opt-ins par jour.
6. **Filtres** : par période, par source (utm), par appareil.

> Objectif : pouvoir dire « 40% abandonnent à la Q4 » ou « le profil budget explose » et itérer.

Cibles de référence (recherche) : complétion 65%+, opt-in 35-40%+.

---

## 6. RGPD / conformité (France)

- **Case de consentement explicite** obligatoire sur le lead gate (non pré-cochée).
- Lien vers une **Politique de confidentialité** (`/confidentialite`) et **Mentions légales** (`/mentions-legales`) : pages à créer (Émilie fournit son identité/hébergeur ; placeholder au début).
- **Double opt-in** activé (déjà prévu).
- Bandeau **cookies** si analytics : Vercel Analytics est sans cookie ; nos événements sont anonymes (pas de PII avant l'opt-in). Prévoir quand même une mention.
- Ne stocker l'email QUE après consentement.

---

## 7. Charte graphique : DA VERROUILLÉE

> ⚠️ **La direction artistique est verrouillée dans `DA-DESIGN-SYSTEM.md`.** Implémente-la **exactement** (tokens de couleur, typo, rayons, ombres, composants, config Tailwind fournie). N'improvise pas d'autre style. Résumé ci-dessous, détail complet dans ce fichier.

- **Ambiance :** douce, naturelle, rassurante (univers des ebooks). Beaucoup d'air, coins très arrondis, ombres douces, motifs botaniques.
- **Couleurs :** crème `#f6f2e8` (fond) · bleu `#6aa4d8` / bleu foncé `#3f77b0` (CTA) · vert sauge `#8bb28a` / `#5f8a5e` · encre `#1f3350` · doré `#e0b64c` (accent rare). Tokens complets dans `DA-DESIGN-SYSTEM.md`.
- **Typo :** titres **Fraunces** (serif), texte **Inter** (via `next/font/google`).
- **Ton :** tutoiement, empathie (« coucou toi »), jamais culpabilisant.
- **Logo / nom :** « Émilie & sa maison saine ». Instagram : @emilie_clean.
- Voir `quiz-content.json` pour tous les textes exacts, et `DA-DESIGN-SYSTEM.md` pour le design.

---

## 8. Variables d'environnement (voir `.env.example`)

`MAILERLITE_API_TOKEN`, `MAILERLITE_GROUP_BEBE`, `MAILERLITE_GROUP_ANIMAL`, `MAILERLITE_GROUP_AIR`, `MAILERLITE_GROUP_BUDGET`, `MAILERLITE_GROUP_CHARGE`, `MAILERLITE_GROUP_ALL`, `DATABASE_URL`, `ADMIN_INITIAL_PASSWORD` (seed du 1er compte admin), `ADMIN_SESSION_SECRET` (signature du cookie de session), `NEXT_PUBLIC_SITE_URL`.

Les IDs des 6 groupes MailerLite (valeurs réelles) sont dans `mailerlite-groups-ids.md`.

---

## 9. Ordre de construction conseillé

1. Scaffold Next.js + Tailwind + Prisma + charte.
2. Quiz UI (6 écrans depuis `quiz-content.json`) + scoring + page résultat.
3. Logging des événements (`/api/event` + table `Event`/`Session`).
4. `/api/subscribe` + intégration MailerLite (double opt-in).
5. Back-office `/admin` (login + dashboard funnel).
6. RGPD (consentement, pages légales) + polish mobile + SEO/noindex admin.
7. Déploiement Vercel + variables d'env + test bout-en-bout.

> Chaque étape = un prompt dédié dans `PROMPTS-CLAUDE-CODE.md`. Commit git après chaque étape.
