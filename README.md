# Funnel quiz, Diagnostic maison saine

## Fichiers
- index.html, config.js, tracker.js, admin.html : le funnel (statique, aucun secret, aucune clé Supabase dans le navigateur)
- api/_lib.js : helpers serveur (rate limit, comparaison de clé à temps constant, accès Supabase avec la clé service)
- api/auth.js : connexion à l'admin (POST, vérifie ADMIN_SECRET)
- api/config.js : GET config publique, POST enregistrement (clé admin)
- api/track.js : réception des événements du tracker (types autorisés, tailles bornées, limite par IP)
- api/stats.js : événements d'une période pour le dashboard (clé admin)
- api/leads.js : lecture des leads (clé admin)
- api/subscribe.js : lead du quiz vers le groupe MailerLite du chemin, puis table funnel_leads
- vercel.json : en-têtes de sécurité (nosniff, HSTS, admin non indexable et non embarquable)
- .env.example : variables d'environnement à créer dans Vercel

## Modèle de sécurité
- Le navigateur ne connaît AUCUNE clé : ni Supabase, ni MailerLite, ni mot de passe. config.js ne contient que des textes, des couleurs et la structure du quiz.
- Toutes les tables Supabase ont le RLS activé sans aucune policy : seule la clé service (côté serveur) peut lire ou écrire. La clé anon n'est utilisée nulle part.
- ADMIN_SECRET n'est jamais dans le code. L'admin l'envoie à /api/auth, puis le garde en mémoire le temps de l'onglet. Comparaison à temps constant, 10 essais par 15 minutes par IP.
- /api/subscribe : honeypot, validation stricte, troncature de tous les champs, 20 envois par 10 minutes par IP, origine vérifiée si ALLOWED_ORIGINS est rempli.
- /api/track : liste blanche de types d'événements, 12 clés max par événement, 300 lots par 10 minutes par IP.
- /api/config POST : filtre les clés interdites et refuse les configs de plus de 400 ko.
- Les limites par IP sont en mémoire (par instance Vercel). C'est suffisant pour un funnel de contenu ; pour du trafic payant massif, on peut passer sur Upstash Redis ou Cloudflare Turnstile sur le gate.

## Déploiement
1. Repo GitHub funnel-quiz avec tous les fichiers (dossiers api/ inclus). Vercel détecte les fonctions et vercel.json automatiquement.
2. Vercel > Settings > Environment Variables : remplir selon .env.example (Production et Preview), puis redéployer.
3. Supabase : exécuter le SQL ci-dessous. Rien d'autre à configurer dans l'interface.
4. MailerLite : 5 groupes (un par chemin), leurs ID dans Vercel. Sur chaque groupe, une automation « Quand un abonné rejoint le groupe » qui envoie l'email avec le guide.
   Option : 10 groupes (chemin × niveau) via ML_GROUP_PARENT_ALERTE, etc. Champs personnalisés facultatifs : segment, niveau, score, guide_want (sinon ML_SEND_FIELDS=0).
5. Ouvrir /admin.html, entrer ADMIN_SECRET, vérifier le dashboard, ajuster les textes, enregistrer.

## SQL Supabase
```sql
create table if not exists funnel_config (
  funnel_id text primary key,
  config jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);
create table if not exists funnel_events (
  id bigserial primary key,
  funnel_id text not null,
  visitor_id text,
  event_type text not null,
  event_data jsonb default '{}'::jsonb,
  page_url text,
  user_agent text,
  referrer text,
  created_at timestamptz default now()
);
create index if not exists funnel_events_idx on funnel_events (funnel_id, created_at);
create table if not exists funnel_leads (
  id bigserial primary key,
  funnel_id text not null,
  visitor_id text,
  prenom text,
  email text not null,
  segment text,
  niveau text,
  score int,
  answers jsonb default '[]'::jsonb,
  page_url text,
  created_at timestamptz default now()
);
create index if not exists funnel_leads_idx on funnel_leads (funnel_id, created_at);

-- RLS active partout, AUCUNE policy : la cle anon ne peut rien faire. La cle service (serveur) passe outre le RLS.
alter table funnel_config enable row level security;
alter table funnel_events enable row level security;
alter table funnel_leads enable row level security;
```

## Test local rapide
Le funnel fonctionne sans API (config.js seul, résultat affiché après deux échecs du gate). Pour tester l'API en local : `npm i -g vercel` puis `vercel dev` dans le dossier, avec un fichier .env local jamais commité.
