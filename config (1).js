window.FUNNEL_CONFIG = {
  // Aucun secret ici. Ce fichier est public. Supabase, MailerLite et le mot de passe admin vivent cote serveur (variables Vercel).
  funnelId: 'quiz',

  metaPixelId: '',
  gaId: '',

  ctaUrl: 'https://example.com',

  // Base de l'API serveur (vide = meme domaine, fonctions Vercel dans /api). Le token MailerLite n'est JAMAIS ici.
  apiBase: '',

  colors: {
  "--bg": "#FFFFFF",
  "--bg-soft": "#eaf8fb",
  "--surface": "#FFFFFF",
  "--text": "#051c21",
  "--muted": "#4e7984",
  "--border": "#ddebee",
  "--primary": "#0F766E",
  "--primary-dark": "#00645d",
  "--primary-light": "#d6eeea",
  "--primary-50": "#e3fbf8",
  "--secondary": "#2C5761",
  "--secondary-dark": "#1b4750",
  "--accent": "#6E3F4C",
  "--accent-light": "#f5e3e7",
  "--cta": "#0F766E",
  "--cta-hover": "#00645d",
  "--cta-text": "#FFFFFF",
  "--option-border": "#b8d3da",
  "--option-hover": "#e3fbf8",
  "--option-selected": "#0F766E",
  "--progress": "#0F766E",
  "--progress-track": "#ddebee",
  "--error": "#754552"
},

  fonts: {
  "headline": "Space Grotesk",
  "body": "Source Sans 3"
},

  images: {
  "introHero": "",
  "guideCoverA": "",
  "guideCoverB": "",
  "guideCoverC": "",
  "guideCoverD": "",
  "guideCoverE": ""
},

  // Une seule question d'entree (q0) puis 5 chemins (a..e) de 6 questions.
  // questionsEnabled : q0 ne peut pas etre desactivee. Les autres se coupent depuis l'admin.
  questionsEnabled: {
  "q0": true,
  "a1": true,
  "a2": true,
  "a3": true,
  "a4": true,
  "a5": true,
  "a6": true,
  "b1": true,
  "b2": true,
  "b3": true,
  "b4": true,
  "b5": true,
  "b6": true,
  "c1": true,
  "c2": true,
  "c3": true,
  "c4": true,
  "c5": true,
  "c6": true,
  "d1": true,
  "d2": true,
  "d3": true,
  "d4": true,
  "d5": true,
  "d6": true,
  "e1": true,
  "e2": true,
  "e3": true,
  "e4": true,
  "e5": true,
  "e6": true
},

  // Structure du quiz : routage, tags de donnees et points de douleur par reponse.
  // Les textes des questions et reponses sont dans "texts" (cles a1Question, a1Opt1, ...).
  quiz: {
  "scoreThreshold": 8,
  "q0": {
    "opts": [
      {
        "path": "a"
      },
      {
        "path": "b"
      },
      {
        "path": "c"
      },
      {
        "path": "d"
      },
      {
        "path": "e"
      }
    ]
  },
  "paths": {
    "a": {
      "name": "Le parent protecteur",
      "segment": "parent",
      "questions": [
        {
          "key": "a1",
          "opts": [
            {
              "tag": "stage=grossesse",
              "pts": 2
            },
            {
              "tag": "stage=rampe",
              "pts": 3
            },
            {
              "tag": "stage=1-3",
              "pts": 3
            },
            {
              "tag": "stage=sensible",
              "pts": 2
            }
          ]
        },
        {
          "key": "a2",
          "opts": [
            {
              "tag": "obs=peau",
              "pts": 3
            },
            {
              "tag": "obs=respi",
              "pts": 3
            },
            {
              "tag": "obs=peur",
              "pts": 2
            },
            {
              "tag": "obs=culpa",
              "pts": 3
            }
          ]
        },
        {
          "key": "a3",
          "opts": [
            {
              "tag": "meth=classique",
              "pts": 2
            },
            {
              "tag": "meth=vert",
              "pts": 1
            },
            {
              "tag": "meth=eau",
              "pts": 0
            },
            {
              "tag": "meth=maison",
              "pts": 0
            }
          ]
        },
        {
          "key": "a4",
          "opts": [
            {
              "tag": "expo=piece",
              "pts": 3
            },
            {
              "tag": "expo=humide",
              "pts": 2
            },
            {
              "tag": "expo=aere",
              "pts": 1
            },
            {
              "tag": "expo=absent",
              "pts": 0
            }
          ]
        },
        {
          "key": "a5",
          "opts": [
            {
              "tag": "dil=doute",
              "pts": 2
            },
            {
              "tag": "dil=produit",
              "pts": 1
            },
            {
              "tag": "dil=routine",
              "pts": 1
            },
            {
              "tag": "dil=deja",
              "pts": 3
            }
          ]
        },
        {
          "key": "a6",
          "opts": [
            {
              "tag": "want=liste",
              "pts": 0
            },
            {
              "tag": "want=routine",
              "pts": 0
            },
            {
              "tag": "want=deja",
              "pts": 0
            },
            {
              "tag": "want=alternatives",
              "pts": 0
            }
          ]
        }
      ]
    },
    "b": {
      "name": "Le maître d'animal",
      "segment": "animaux",
      "questions": [
        {
          "key": "b1",
          "opts": [
            {
              "tag": "pet=chat",
              "pts": 1
            },
            {
              "tag": "pet=chien",
              "pts": 1
            },
            {
              "tag": "pet=mixte",
              "pts": 1
            },
            {
              "tag": "pet=petit",
              "pts": 1
            }
          ]
        },
        {
          "key": "b2",
          "opts": [
            {
              "tag": "obs=leche",
              "pts": 2
            },
            {
              "tag": "obs=vomit",
              "pts": 3
            },
            {
              "tag": "obs=veto",
              "pts": 3
            },
            {
              "tag": "obs=prev",
              "pts": 0
            }
          ]
        },
        {
          "key": "b3",
          "opts": [
            {
              "tag": "meth=spray",
              "pts": 3
            },
            {
              "tag": "meth=parfume",
              "pts": 2
            },
            {
              "tag": "meth=javel",
              "pts": 3
            },
            {
              "tag": "meth=naturel",
              "pts": 0
            }
          ]
        },
        {
          "key": "b4",
          "opts": [
            {
              "tag": "expo=piece",
              "pts": 3
            },
            {
              "tag": "expo=humide",
              "pts": 2
            },
            {
              "tag": "expo=sec",
              "pts": 1
            },
            {
              "tag": "expo=jamais",
              "pts": 2
            }
          ]
        },
        {
          "key": "b5",
          "opts": [
            {
              "tag": "frein=efficace",
              "pts": 1
            },
            {
              "tag": "frein=ingredients",
              "pts": 1
            },
            {
              "tag": "frein=entourage",
              "pts": 2
            },
            {
              "tag": "frein=deja",
              "pts": 3
            }
          ]
        },
        {
          "key": "b6",
          "opts": [
            {
              "tag": "want=liste",
              "pts": 0
            },
            {
              "tag": "want=routine",
              "pts": 0
            },
            {
              "tag": "want=signes",
              "pts": 0
            },
            {
              "tag": "want=alternatives",
              "pts": 0
            }
          ]
        }
      ]
    },
    "c": {
      "name": "Le corps qui réagit",
      "segment": "sante",
      "questions": [
        {
          "key": "c1",
          "opts": [
            {
              "tag": "sym=tete",
              "pts": 3
            },
            {
              "tag": "sym=nausee",
              "pts": 2
            },
            {
              "tag": "sym=respi",
              "pts": 3
            },
            {
              "tag": "sym=peau",
              "pts": 3
            }
          ]
        },
        {
          "key": "c2",
          "opts": [
            {
              "tag": "quand=pendant",
              "pts": 3
            },
            {
              "tag": "quand=apres",
              "pts": 2
            },
            {
              "tag": "quand=diffus",
              "pts": 2
            },
            {
              "tag": "quand=linge",
              "pts": 2
            }
          ]
        },
        {
          "key": "c3",
          "opts": [
            {
              "tag": "susp=javel",
              "pts": 3
            },
            {
              "tag": "susp=spray",
              "pts": 2
            },
            {
              "tag": "susp=lessive",
              "pts": 2
            },
            {
              "tag": "susp=air",
              "pts": 2
            }
          ]
        },
        {
          "key": "c4",
          "opts": [
            {
              "tag": "essai=rien",
              "pts": 2
            },
            {
              "tag": "essai=precautions",
              "pts": 2
            },
            {
              "tag": "essai=vert",
              "pts": 3
            },
            {
              "tag": "essai=medecin",
              "pts": 3
            }
          ]
        },
        {
          "key": "c5",
          "opts": [
            {
              "tag": "emo=doute",
              "pts": 2
            },
            {
              "tag": "emo=honte",
              "pts": 3
            },
            {
              "tag": "emo=colere",
              "pts": 2
            },
            {
              "tag": "emo=peur",
              "pts": 3
            }
          ]
        },
        {
          "key": "c6",
          "opts": [
            {
              "tag": "want=mecanique",
              "pts": 0
            },
            {
              "tag": "want=liste",
              "pts": 0
            },
            {
              "tag": "want=routine",
              "pts": 0
            },
            {
              "tag": "want=medecin",
              "pts": 0
            }
          ]
        }
      ]
    },
    "d": {
      "name": "Le trahi lucide",
      "segment": "ecolo",
      "questions": [
        {
          "key": "d1",
          "opts": [
            {
              "tag": "colere=vert",
              "pts": 2
            },
            {
              "tag": "colere=pe",
              "pts": 3
            },
            {
              "tag": "colere=pollution",
              "pts": 1
            },
            {
              "tag": "colere=prix",
              "pts": 1
            }
          ]
        },
        {
          "key": "d2",
          "opts": [
            {
              "tag": "placard=commerce",
              "pts": 3
            },
            {
              "tag": "placard=vert",
              "pts": 2
            },
            {
              "tag": "placard=mixte",
              "pts": 1
            },
            {
              "tag": "placard=maison",
              "pts": 0
            }
          ]
        },
        {
          "key": "d3",
          "opts": [
            {
              "tag": "etiq=perdu",
              "pts": 3
            },
            {
              "tag": "etiq=illisible",
              "pts": 2
            },
            {
              "tag": "etiq=labels",
              "pts": 1
            },
            {
              "tag": "etiq=jamais",
              "pts": 2
            }
          ]
        },
        {
          "key": "d4",
          "opts": [
            {
              "tag": "frein=efficace",
              "pts": 2
            },
            {
              "tag": "frein=temps",
              "pts": 1
            },
            {
              "tag": "frein=entourage",
              "pts": 2
            },
            {
              "tag": "frein=debut",
              "pts": 2
            }
          ]
        },
        {
          "key": "d5",
          "opts": [
            {
              "tag": "motiv=planete",
              "pts": 1
            },
            {
              "tag": "motiv=sante",
              "pts": 3
            },
            {
              "tag": "motiv=budget",
              "pts": 1
            },
            {
              "tag": "motiv=controle",
              "pts": 2
            }
          ]
        },
        {
          "key": "d6",
          "opts": [
            {
              "tag": "want=decoder",
              "pts": 0
            },
            {
              "tag": "want=liste",
              "pts": 0
            },
            {
              "tag": "want=placard",
              "pts": 0
            },
            {
              "tag": "want=cout",
              "pts": 0
            }
          ]
        }
      ]
    },
    "e": {
      "name": "La tête pleine",
      "segment": "charge",
      "questions": [
        {
          "key": "e1",
          "opts": [
            {
              "tag": "situ=seule",
              "pts": 3
            },
            {
              "tag": "situ=porte",
              "pts": 3
            },
            {
              "tag": "situ=home",
              "pts": 2
            },
            {
              "tag": "situ=debordee",
              "pts": 2
            }
          ]
        },
        {
          "key": "e2",
          "opts": [
            {
              "tag": "rythme=weekend",
              "pts": 2
            },
            {
              "tag": "rythme=jamais_fini",
              "pts": 2
            },
            {
              "tag": "rythme=vagues",
              "pts": 3
            },
            {
              "tag": "rythme=culpa",
              "pts": 3
            }
          ]
        },
        {
          "key": "e3",
          "opts": [
            {
              "tag": "placard=un_par_piece",
              "pts": 3
            },
            {
              "tag": "placard=miracle",
              "pts": 2
            },
            {
              "tag": "placard=basiques",
              "pts": 0
            },
            {
              "tag": "placard=inconnu",
              "pts": 2
            }
          ]
        },
        {
          "key": "e4",
          "opts": [
            {
              "tag": "poids=liste",
              "pts": 3
            },
            {
              "tag": "poids=regard",
              "pts": 2
            },
            {
              "tag": "poids=temps",
              "pts": 2
            },
            {
              "tag": "poids=sante_apres",
              "pts": 3
            }
          ]
        },
        {
          "key": "e5",
          "opts": [
            {
              "tag": "aveu=systeme",
              "pts": 1
            },
            {
              "tag": "aveu=pas_bande_passante",
              "pts": 2
            },
            {
              "tag": "aveu=nulle",
              "pts": 3
            },
            {
              "tag": "aveu=enfants",
              "pts": 3
            }
          ]
        },
        {
          "key": "e6",
          "opts": [
            {
              "tag": "want=routine15",
              "pts": 0
            },
            {
              "tag": "want=placard",
              "pts": 0
            },
            {
              "tag": "want=attendre",
              "pts": 0
            },
            {
              "tag": "want=famille",
              "pts": 0
            }
          ]
        }
      ]
    }
  }
},

  texts: {
  "introKicker": "Diagnostic maison saine",
  "introTitle": "Ce qui se cache dans ton placard à produits, en 60 secondes",
  "introSubtitle": "7 questions, un résultat qui correspond à ta situation, et un guide gratuit envoyé par email. Aucun chiffre inventé, aucune leçon.",
  "introBullet1": "Une question par écran, 60 secondes en tout",
  "introBullet2": "Un diagnostic différent selon ta situation, pas un test générique",
  "introBullet3": "Ton guide personnalisé arrive par email dans la minute",
  "introCta": "Commencer mon diagnostic",
  "introMeta": "Gratuit. Aucune inscription pour commencer.",
  "progressLabel": "Question {n} sur {total}",
  "backLabel": "Retour",
  "q0Question": "Quand tu penses aux produits ménagers chez toi, qu'est-ce qui te préoccupe le plus ?",
  "q0Opt1": "Mon bébé ou mes enfants : le sol, les mains à la bouche, leur peau",
  "q0Opt2": "Mon chat ou mon chien : il lèche le sol, ses pattes, et il n'a rien demandé",
  "q0Opt3": "Moi : maux de tête, nausée, toux ou eczéma quand je fais le ménage",
  "q0Opt4": "Ce qu'on ne me dit pas : la compo, le « vert » bidon, la planète, le prix",
  "q0Opt5": "Tout, en fait : travail, enfants, maison, j'ai la tête pleine et le ménage passe en dernier",
  "a1Question": "Où en es-tu aujourd'hui ?",
  "a1Opt1": "Je suis enceinte",
  "a1Opt2": "Mon bébé rampe ou commence à marcher",
  "a1Opt3": "Mon enfant a entre 1 et 3 ans, tout va à la bouche",
  "a1Opt4": "Mon enfant est plus grand, mais sa peau ou sa respiration réagit",
  "a2Question": "Qu'est-ce que tu observes chez ton enfant ?",
  "a2Opt1": "Sa peau réagit : eczéma, rougeurs, plaques",
  "a2Opt2": "Toux, nez qui coule, respiration sifflante",
  "a2Opt3": "Rien de visible, mais j'ai peur de ce qu'il avale",
  "a2Opt4": "Je repense au passé (grossesse, bougies, javel) et je culpabilise",
  "a3Question": "Comment tu laves le sol aujourd'hui ?",
  "a3Opt1": "Un produit classique de supermarché",
  "a3Opt2": "Un produit vendu comme « vert » ou « naturel »",
  "a3Opt3": "Eau seule ou vapeur, par précaution",
  "a3Opt4": "Vinaigre, savon noir, recette maison",
  "a4Question": "Quand tu nettoies, ton enfant est…",
  "a4Opt1": "Dans la pièce, souvent au sol",
  "a4Opt2": "À côté, il revient sur le sol encore humide",
  "a4Opt3": "Dans une autre pièce, fenêtres ouvertes",
  "a4Opt4": "Absent, je nettoie quand il n'est pas là",
  "a5Question": "La question qui tourne dans ta tête, c'est plutôt…",
  "a5Opt1": "Désinfecter ou protéger ? Je ne sais plus qui croire",
  "a5Opt2": "Quel produit est vraiment sûr pour lui ?",
  "a5Opt3": "Comment nettoyer souvent sans l'exposer ?",
  "a5Opt4": "Est-ce que je lui ai déjà fait du mal sans le savoir ?",
  "a6Question": "Dans ton guide, tu veux en premier…",
  "a6Opt1": "La liste des ingrédients à fuir quand on a un enfant",
  "a6Opt2": "Une routine sols et surfaces sûre, étape par étape",
  "a6Opt3": "Quoi faire maintenant s'il a déjà été exposé",
  "a6Opt4": "Les alternatives qui nettoient vraiment, testées",
  "b1Question": "Qui vit avec toi ?",
  "b1Opt1": "Un ou plusieurs chats",
  "b1Opt2": "Un ou plusieurs chiens",
  "b1Opt3": "Chats et chiens",
  "b1Opt4": "Un petit animal : lapin, rongeur, oiseau",
  "b2Question": "Qu'est-ce que tu as remarqué chez lui ?",
  "b2Opt1": "Il se lèche beaucoup les pattes après le ménage",
  "b2Opt2": "Vomissements ou diarrhée sans explication claire",
  "b2Opt3": "Le véto ne trouve rien, mais je sens que quelque chose cloche",
  "b2Opt4": "Rien pour l'instant, je veux éviter le problème",
  "b3Question": "Pour le sol, tu utilises…",
  "b3Opt1": "Un balai avec lingettes ou spray intégré",
  "b3Opt2": "Un nettoyant sol parfumé du commerce",
  "b3Opt3": "De la javel",
  "b3Opt4": "Eau, vapeur ou recette naturelle",
  "b4Question": "Pendant et juste après le ménage, il est…",
  "b4Opt1": "Dans la pièce, il marche sur le sol mouillé",
  "b4Opt2": "Enfermé, puis il revient avant que ce soit sec",
  "b4Opt3": "Dehors ou dans une autre pièce jusqu'au séchage",
  "b4Opt4": "Je n'y ai jamais fait attention",
  "b5Question": "Ce qui te bloque aujourd'hui, c'est…",
  "b5Opt1": "Je ne trouve rien qui soit sûr et qui nettoie vraiment",
  "b5Opt2": "Je ne sais pas quels ingrédients sont toxiques pour lui",
  "b5Opt3": "Mon entourage dit que j'exagère",
  "b5Opt4": "J'ai peur de lui avoir déjà fait du mal",
  "b6Question": "Dans ton guide, tu veux en premier…",
  "b6Opt1": "La liste rouge des ingrédients toxiques pour chats et chiens",
  "b6Opt2": "Une routine sol sûre pour lui, en 3 étapes",
  "b6Opt3": "Les signes à surveiller et quand consulter",
  "b6Opt4": "Les alternatives qui nettoient vraiment",
  "c1Question": "Ce que tu ressens le plus souvent, c'est…",
  "c1Opt1": "Maux de tête, migraine, vertiges",
  "c1Opt2": "Nausée, écœurement dès que ça sent « le propre »",
  "c1Opt3": "Toux, gorge qui gratte, sinus, respiration",
  "c1Opt4": "Peau : eczéma, mains irritées, plaques",
  "c2Question": "Ça arrive surtout…",
  "c2Opt1": "Pendant le ménage, je dois m'arrêter",
  "c2Opt2": "Juste après, dans l'heure",
  "c2Opt3": "De façon diffuse, je n'avais jamais fait le lien",
  "c2Opt4": "Avec le linge : lessive, assouplissant, draps",
  "c3Question": "Le produit que tu soupçonnes le plus…",
  "c3Opt1": "La javel",
  "c3Opt2": "Les sprays et nettoyants parfumés",
  "c3Opt3": "La lessive ou l'assouplissant",
  "c3Opt4": "Bougies, désodorisants, parfums d'intérieur",
  "c4Question": "Jusqu'ici, tu as…",
  "c4Opt1": "Rien fait, je pensais que c'était la fatigue",
  "c4Opt2": "Ouvert les fenêtres, mis un masque, fait vite",
  "c4Opt3": "Testé un produit « vert », sans changement",
  "c4Opt4": "Consulté, et on n'a rien trouvé",
  "c5Question": "Face à ça, ce que tu ressens surtout…",
  "c5Opt1": "Je me demande si c'est dans ma tête",
  "c5Opt2": "On me prend pour une paresseuse ou une exagérée",
  "c5Opt3": "Je suis en colère de ne pas l'avoir su avant",
  "c5Opt4": "J'ai peur pour le long terme",
  "c6Question": "Dans ton guide, tu veux en premier…",
  "c6Opt1": "Comprendre ce qui se passe dans mon corps quand je nettoie",
  "c6Opt2": "Les 5 ingrédients à sortir de chez moi en premier",
  "c6Opt3": "Une routine ménage qui ne me rend pas malade",
  "c6Opt4": "Quoi dire et quoi demander à mon médecin",
  "d1Question": "Ce qui t'énerve le plus…",
  "d1Opt1": "On me vend « vert » et c'est du marketing",
  "d1Opt2": "Les perturbateurs endocriniens, il y en a partout",
  "d1Opt3": "Ce qui part dans les rivières : javel, mousse, résidus",
  "d1Opt4": "Le prix : un produit par pièce, un produit miracle par semaine",
  "d2Question": "Ton placard aujourd'hui, c'est…",
  "d2Opt1": "Cinq produits du commerce ou plus, un par usage",
  "d2Opt2": "Quelques produits « verts » achetés en confiance",
  "d2Opt3": "Un mélange maison et commerce",
  "d2Opt4": "Presque tout maison : vinaigre, savon noir, bicarbonate",
  "d3Question": "Devant une étiquette, tu…",
  "d3Opt1": "Ne sais plus qui croire",
  "d3Opt2": "Regardes la compo mais ne la comprends pas",
  "d3Opt3": "Fais confiance aux labels bio et écolabels",
  "d3Opt4": "Ne regardes jamais, tu prends le moins cher",
  "d4Question": "Ce qui t'empêche de changer pour de bon…",
  "d4Opt1": "Les alternatives ne marchent pas, le vinaigre ne désinfecte pas",
  "d4Opt2": "Pas le temps de faire maison",
  "d4Opt3": "Mon entourage se moque ou ne suit pas",
  "d4Opt4": "Je ne sais pas par où commencer",
  "d5Question": "Au fond, ce qui te fait bouger…",
  "d5Opt1": "La planète, ce qu'on laisse derrière",
  "d5Opt2": "Ma santé, mes hormones, celles de mes proches",
  "d5Opt3": "Mon budget, arrêter de payer du marketing",
  "d5Opt4": "Reprendre le contrôle, ne plus me faire avoir",
  "d6Question": "Dans ton guide, tu veux en premier…",
  "d6Opt1": "Décoder n'importe quelle étiquette en 30 secondes",
  "d6Opt2": "La liste des ingrédients à fuir",
  "d6Opt3": "Le placard minimal : 3 produits pour toute la maison",
  "d6Opt4": "Le vrai coût de mes produits, calculé",
  "e1Question": "Ta journée, c'est plutôt…",
  "e1Opt1": "Travail, enfants, maison, et je gère seule",
  "e1Opt2": "À deux, mais c'est moi qui pense à tout",
  "e1Opt3": "Je travaille à la maison, je ne décroche jamais",
  "e1Opt4": "Pas d'enfants, mais tellement de choses que le ménage passe en dernier",
  "e2Question": "Le ménage chez toi, ça ressemble à…",
  "e2Opt1": "Une course contre la montre le week-end",
  "e2Opt2": "Un peu chaque jour, mais ce n'est jamais fini",
  "e2Opt3": "Par vagues, quand je n'en peux plus de voir ça",
  "e2Opt4": "Je culpabilise plus que je ne nettoie",
  "e3Question": "Ton placard à produits, c'est…",
  "e3Opt1": "Un produit par pièce et par surface, je ne m'y retrouve plus",
  "e3Opt2": "Le dernier produit miracle vu en pub, à chaque fois",
  "e3Opt3": "Quelques basiques qui font le job",
  "e3Opt4": "Je ne sais même plus ce qu'il y a dedans",
  "e4Question": "Ce qui pèse le plus, c'est…",
  "e4Opt1": "La liste dans ma tête, qui ne se vide jamais",
  "e4Opt2": "Le regard des autres quand la maison n'est pas nickel",
  "e4Opt3": "Le temps que ça prend pour un résultat qui tient deux jours",
  "e4Opt4": "Je fais tout, et ma santé ou celle des enfants passe après",
  "e5Question": "Ce que tu t'es déjà dit…",
  "e5Opt1": "Il me faudrait un système simple que je n'ai pas à réinventer",
  "e5Opt2": "J'aimerais que ce soit sain, mais je n'ai pas la bande passante",
  "e5Opt3": "Je me sens nulle de ne pas y arriver",
  "e5Opt4": "J'ai peur que ce bazar finisse par jouer sur les enfants",
  "e6Question": "Dans ton guide, tu veux en premier…",
  "e6Opt1": "Une routine maison saine en 15 minutes par jour",
  "e6Opt2": "Le placard minimal : 3 produits pour toute la maison",
  "e6Opt3": "La liste de ce qui peut attendre, sans danger",
  "e6Opt4": "Comment faire participer le conjoint et les enfants",
  "gateTitle": "Ton diagnostic est prêt.",
  "gateSubtitle": "Je te l'envoie avec ton guide personnalisé, adapté à ce que tu viens de me dire. Où je l'envoie ?",
  "gateFirstName": "Ton prénom",
  "gateEmail": "Ton email",
  "gateButton": "Voir mon diagnostic",
  "gateDisclaimer": "Aucun spam, tu te désinscris en un clic.",
  "gateErrorEmail": "Entre une adresse email valide pour recevoir ton guide.",
  "gateErrorName": "Dis-moi au moins ton prénom.",
  "gateErrorServer": "Petit souci de connexion, réessaie dans quelques secondes.",
  "gateSending": "Envoi en cours…",
  "resultKicker": "Ton profil",
  "resultGuideLabel": "Ton guide, en route vers ta boîte mail",
  "resultEmailNote": "Regarde tes emails dans les minutes qui viennent (et les spams, au cas où). Le résumé est ici, le détail est dans le guide.",
  "resultCta": "Suivre Émilie et sa maison saine",
  "resultRestart": "Refaire le diagnostic",
  "resultDisclaimer": "Ce diagnostic décrit ce que tu vis, il ne pose aucun diagnostic médical. Toute information santé du guide est sourcée.",
  "resultAVigilantName": "Le parent qui anticipe",
  "resultAVigilantText": "Tu nettoies en pensant à lui, et tu veux savoir ce qui est vraiment sûr avant que ça devienne un problème. Ton guide te donne la routine sols et surfaces en trois étapes, et la liste des mots à repérer sur une étiquette quand un enfant vit à la maison.",
  "resultAVigilantGuide": "Sols et surfaces quand bébé rampe : la routine sûre en 3 étapes",
  "resultAAlerteName": "Le parent qui a vu quelque chose",
  "resultAAlerteText": "Sa peau, sa respiration, ou ce doute sur le passé. Tu n'exagères pas : tu observes. Ton guide commence par ce que ton enfant touche vraiment, puis par ce que tu peux changer dès ce soir, sans culpabilité.",
  "resultAAlerteGuide": "Ce que ton enfant touche vraiment, et quoi changer dès ce soir",
  "resultBVigilantName": "Le maître prévoyant",
  "resultBVigilantText": "Il n'a rien montré, et tu veux que ça reste comme ça. Ton guide te donne la liste rouge des ingrédients à éviter avec un chat ou un chien, et une routine sol qui ne lui fait pas payer l'addition.",
  "resultBVigilantGuide": "Nettoyer avec un chat ou un chien : la liste rouge et la routine sûre",
  "resultBAlerteName": "Le maître qui a fait le lien",
  "resultBAlerteText": "Les pattes, les vomissements, le véto qui ne trouve rien. Ton intuition mérite d'être prise au sérieux. Ton guide détaille les voies d'exposition, les signes à surveiller, et quand appeler le véto.",
  "resultBAlerteGuide": "Les signes à surveiller, les ingrédients à sortir, et quand appeler le véto",
  "resultCVigilantName": "Celle qui a commencé à se méfier",
  "resultCVigilantText": "Une nausée par-ci, une odeur qui écœure par-là. Tu as raison de te poser la question avant que ça s'installe. Ton guide explique ce que tu respires quand tu nettoies et les cinq ingrédients à sortir en premier.",
  "resultCVigilantGuide": "Ce que tu respires quand tu nettoies, et les 5 ingrédients à sortir en premier",
  "resultCAlerteName": "Celle que son corps prévient",
  "resultCAlerteText": "Tu dois t'arrêter, on te dit que c'est dans ta tête, et tu as déjà cherché. Ce n'est pas de la paresse. Ton guide te donne une routine ménage sans symptôme et les questions précises à poser à ton médecin.",
  "resultCAlerteGuide": "Ménage sans maux de tête : la routine et quoi demander à ton médecin",
  "resultDVigilantName": "L'ambassadeur qui veut convaincre",
  "resultDVigilantText": "Tu as déjà changé une partie de ton placard. Il te manque les arguments et les preuves pour finir, et pour répondre à ceux qui se moquent. Ton guide : le placard à trois produits, avec le vrai coût calculé.",
  "resultDVigilantGuide": "Le placard à 3 produits, avec le vrai coût calculé",
  "resultDAlerteName": "Le lucide qui ne sait plus qui croire",
  "resultDAlerteText": "Vert, naturel, bio : tu as compris que les mots ne protègent de rien. Il te faut une méthode pour lire, pas une marque à croire. Ton guide t'apprend à décoder une étiquette en trente secondes.",
  "resultDAlerteGuide": "Décoder une étiquette ménager en 30 secondes",
  "resultEVigilantName": "Celle qui veut un système",
  "resultEVigilantText": "Tu gères, mais ça tient sur toi. Il te manque une routine courte et un placard qui ne demande aucune décision. Ton guide : la maison saine en quinze minutes par jour, le système minimal.",
  "resultEVigilantGuide": "La maison saine en 15 minutes par jour : le système minimal",
  "resultEAlerteName": "Celle qui porte tout",
  "resultEAlerteText": "Travail, enfants, maison, et la liste qui ne se vide jamais. Tu n'es pas nulle, tu es à saturation. Ton guide commence par ce qui peut attendre, sans danger, et par les trois produits qui remplacent tout le reste.",
  "resultEAlerteGuide": "Faire moins, mieux, sans culpabilité : ce qui peut attendre et les 3 produits qui remplacent tout",
  "footerText": "Émilie et sa maison saine. Aucune affirmation santé sans source vérifiable."
}
};
