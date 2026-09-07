# 🎨 Direction Artistique : Système de design VERROUILLÉ

> **Contrainte pour Claude Code :** ce design est **verrouillé**. Tu dois l'implémenter **exactement** (couleurs, typo, formes, composants). N'improvise pas d'autre style, ne change pas la palette. But : que le quiz ressemble à l'univers des ebooks « Émilie & sa maison saine ».

## 1. Esprit (moodboard)
Doux, naturel, rassurant, « cocooning ». Inspiration aquarelle claire + motifs botaniques (eucalyptus, feuilles, citron). Beaucoup d'air, coins très arrondis, ombres douces. **Jamais** agressif, corporate, flashy ou sombre. Ton visuel = celui d'un carnet bienveillant.

## 2. Couleurs (tokens : à utiliser tels quels)

| Rôle | Nom | Hex |
|---|---|---|
| Fond principal | cream | `#f6f2e8` |
| Fond secondaire / sections | cream2 | `#efe9db` |
| Surface / carte | paper | `#fffdf8` |
| Titres (encre) | ink | `#1f3350` |
| Texte courant | ink2 | `#3a4a63` |
| Texte atténué | muted | `#6a7688` |
| Bleu primaire | blue | `#6aa4d8` |
| Bleu foncé (CTA, liens) | blue-dark | `#3f77b0` |
| Bleu très clair (fond accent) | blue-bg | `#e6f0fa` |
| Vert sauge | sage | `#8bb28a` |
| Vert foncé | sage-dark | `#5f8a5e` |
| Vert clair (fond) | sage-bg | `#e5efe4` |
| Doré (accent rare) | gold | `#e0b64c` |
| Bordures | line | `#e4ddcc` |
| Séparateurs | sand | `#d9cfb8` |

**Rôles :** fond = crème · **boutons d'action = bleu foncé `#3f77b0` texte blanc** (hover légèrement plus foncé) · accents secondaires = vert · surbrillance chaleureuse = doré (avec parcimonie). Vérifier le contraste **AA** partout.

## 3. Typographie
- **Titres / affichage : Fraunces** (serif), poids 400/500/600, italique pour les accents.
- **Texte & interface : Inter**, poids 400/500/600/700.
- Charger via `next/font/google`.
- Échelle mobile-first :
  - H1 / accueil : `clamp(30px, 7vw, 48px)`, Fraunces 500, interligne 1.1
  - H2 : `clamp(22px, 5vw, 30px)`, Fraunces 500
  - H3 : 20px
  - **Question du quiz** : Fraunces 500, ~24-28px, centrée
  - Corps : 16-17px, interligne 1.6, Inter
  - Kicker / label : 12-13px, majuscules, `letter-spacing: .12em`

## 4. Formes, espacement, ombres
- **Rayons généreux** : cartes 16-20px · boutons & champs 12-14px · pilules/tags 999px.
- **Ombres douces** uniquement : ex. `0 8px 30px rgba(31,51,80,.07)`. Jamais d'ombre dure.
- **Espacement aéré** : échelle 4 / 8 / 12 / 16 / 24 / 32 / 48.
- Bordures fines `#e4ddcc`.

## 5. Composants (specs)
- **Bouton primaire** : fond `#3f77b0`, texte blanc, radius 12px, padding ~14×22, poids 600, transition douce, hover assombri.
- **Bouton retour / secondaire** : transparent, texte/bordure bleu foncé ou muted.
- **Carte-réponse (option du quiz)** : surface `paper`, bordure `line`, radius 16px, padding confortable. États : *hover* (léger `translateY(-2px)` + bordure bleue), *sélectionné* (fond `blue-bg` + bordure `blue-dark` + coche). Cible tactile ≥ 44px, texte 15-16px. **Q1 en multi-choix** = cases cochables (sélection multiple visible).
- **Barre de progression** : fine, fond `sand` clair, remplissage **dégradé bleu → vert**, radius 999px, animation douce. Libellé « Question X / 6 ».
- **Champ (lead gate)** : fond `paper`, bordure `line`, radius 12px, label au-dessus, anneau de focus bleu doux.
- **Case consentement RGPD** : checkbox custom douce (non pré-cochée), texte 13px `muted`, lien souligné vers /confidentialite.
- **Carte de résultat** : surface `paper`, liseré/emoji coloré selon le profil, titre Fraunces, ebook mis en avant, **badge « bonus recettes » doré**.

## 6. Iconographie & imagerie
- Illustrations **plates douces / aquarelle**, motifs botaniques (eucalyptus, feuilles, citron, brins).
- **Emojis de profil autorisés** et cohérents : 👶 bébé · 🐾 animal · 🌬️ air sain · 💸 budget · 😮‍💨 charge mentale.
- Fonds : possibilité de motifs végétaux **en filigrane très léger**.
- **Interdits** : photos stock corporate, dégradés flashy, néon, dark mode.

## 7. Ton de voix (RÈGLE DE RÉDACTION VERROUILLÉE)
Tutoiement, chaleureux (« coucou toi »), jamais culpabilisant, phrases courtes et douces. Le design doit renforcer ce sentiment de bienveillance.

**Règles à respecter dans TOUS les textes de l'app (y compris les microcopies que tu génères : boutons, erreurs, états vides…) :**
- **Zéro tiret cadratin (—) ni demi-cadratin (–), nulle part.** Utilise virgule, point, deux-points ou parenthèses. Ça doit se lire comme écrit par une vraie personne, pas par une IA.
- **Écriture humaine et parlée.** Comme si Émilie parlait à une amie. On sent qu'elle est là pour aider, pas pour vendre.
- **On aide, on n'insiste pas.** Aucun ton commercial, aucune pression, aucune promesse exagérée. Le sentiment visé : « waouh, merci pour tout ». La gratitude vient parce qu'on donne, pas parce qu'on pousse.
- Phrases courtes, mots simples, chaleur. Un emoji de temps en temps (💙 🌿) si c'est naturel, jamais en excès.
- Ne jamais inventer de chiffre ni d'affirmation santé (cohérent avec `quiz-content.json`).

## 8. Accessibilité
Contraste **AA**, focus visibles, labels sur tous les champs, cibles tactiles ≥ 44px, respecter `prefers-reduced-motion`.

---

## 9. Config Tailwind à reprendre (theme.extend)

```ts
// tailwind.config.ts → theme.extend
colors: {
  cream: '#f6f2e8', cream2: '#efe9db', paper: '#fffdf8',
  ink: '#1f3350', ink2: '#3a4a63', muted: '#6a7688',
  blue: { DEFAULT: '#6aa4d8', dark: '#3f77b0', bg: '#e6f0fa' },
  sage: { DEFAULT: '#8bb28a', dark: '#5f8a5e', bg: '#e5efe4' },
  gold: '#e0b64c', line: '#e4ddcc', sand: '#d9cfb8',
},
fontFamily: {
  display: ['var(--font-fraunces)', 'serif'],
  sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
},
borderRadius: { card: '18px', field: '12px' },
boxShadow: { soft: '0 8px 30px rgba(31,51,80,0.07)' },
```

```ts
// app/layout.tsx → polices
import { Fraunces, Inter } from 'next/font/google'
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
// appliquer `${fraunces.variable} ${inter.variable}` sur <html>, fond bg-cream, texte text-ink2
```
