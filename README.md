# 🎮 Opération N.I.R.D - Le Village Résiste


> **Jeu éducatif interactif** pour sensibiliser au Numérique Inclusif, Responsable et Durable

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌟 Présentation

**Opération N.I.R.D** est une expérience narrative gamifiée où les joueurs incarnent différents acteurs du numérique éducatif. À travers des scénarios réalistes et des choix stratégiques, les joueurs découvrent les enjeux de la sobriété numérique, de l'open source et de la durabilité.

### 🎭 4 Rôles Jouables

| Rôle | Description | Thématiques |
|------|-------------|-------------|
| 🏫 **Directeur** | Chef d'établissement | Budget, stratégie, souveraineté |
| 🔧 **Technicien** | Responsable informatique | Infrastructure, maintenance, Linux |
| 🎒 **Élève** | Lycéen connecté | Vie quotidienne, gaming, vie privée |
| 👨‍👩‍👧 **Parent** | Famille numérique | Éducation, sécurité, valeurs |

### ⚡ Fonctionnalités

- **6 questions par partie** avec système d'arborescence dynamique
- **Branches narratives** : vos choix influencent les questions suivantes
- **Score en temps réel** : économies (€), CO2 évité (kg), points NIRD
- **Avatar évolutif** : 6 niveaux visuels selon vos performances
- **Sauvegarde locale** : progression séparée par rôle (localStorage)

---

## 🎨 Vision Ergonomique - Défi UX

> **Parti pris : L'interface comme compagnon narratif, pas comme outil**

### 🔥 Notre Philosophie

Nous avons **cassé le standard** de l'interface utilitaire pour créer une **expérience immersive** où l'UI devient un personnage de l'histoire.

### 🚫 Conventions Abandonnées

| Convention Standard | Notre Approche | Justification |
|---------------------|----------------|---------------|
| Menu de navigation visible | **Aucun menu** - progression linéaire | L'utilisateur est dans un récit. Un menu casserait l'immersion. |
| Boutons d'action classiques | **Choix narratifs plein écran** | Chaque option devient un engagement émotionnel, pas un simple clic. |
| Score discret en coin | **Score central et animé** | Le feedback est le cœur de l'expérience pédagogique. |
| Pagination numérotée | **Progression narrative (X/6)** | Le joueur avance dans une histoire, pas dans un formulaire. |
| Avatar statique | **Avatar évolutif à 6 états** | L'avatar reflète les conséquences. C'est un miroir moral. |

### 💡 Problèmes Utilisateur Résolus

1. **Fatigue décisionnelle** → Interface épurée avec 3 choix maximum
2. **Désengagement éducatif** → Gamification narrative plutôt que quiz scolaire
3. **Perte de contexte** → Conséquences immédiates et visuelles
4. **Abandon en cours** → Sauvegarde automatique par rôle

### 🎯 L'Innovation Clé : Arborescence Invisible

**Le joueur ne sait pas qu'il choisit sa branche narrative.**

Quand il choisit "Installer Linux" à Q1, il débloque silencieusement un chemin spécifique. Les questions 4-5 s'adapteront à son univers (Linux, Mac ou Windows).

**Pourquoi ?** Dans la vraie vie, nos choix technologiques ont des conséquences invisibles. L'interface reproduit cette réalité.

### 🎨 Choix Visuels Assumés

- **Fond noir (#0d0d0d)** : Terminal, sobriété numérique, mode sombre
- **Vert néon (#00ff88)** : Couleur "Matrix", signale le bon choix, écologie
- **Coins arrondis (3xl)** : Contraste avec l'esthétique "tech brute"
- **Animations subtiles** : Glow, pulse - jamais distrayant, toujours informatif

### ⚖️ Nos Compromis

| Ce qu'on sacrifie | Ce qu'on gagne |
|-------------------|----------------|
| Navigation libre | Immersion narrative totale |
| Accès rapide aux infos | Découverte progressive |
| Personnalisation UI | Cohérence esthétique forte |
| Tutoriel explicite | Apprentissage par l'action |

### 🌟 Inspirations

- **Telltale Games** : Choix narratifs avec conséquences
- **Reigns** : Interface binaire (adapté en 3 choix)
- **Notion** : Minimalisme fonctionnel
- **Terminal Linux** : Esthétique hacker/maker

### 📌 Conclusion

Notre interface sert un **objectif pédagogique précis** : faire comprendre que chaque choix numérique a un impact réel.

L'ergonomie traditionnelle optimise l'efficacité. **Nous optimisons la prise de conscience.**

---

## 🚀 Installation

### Prérequis

- Node.js 18+
- npm, yarn ou pnpm

### Démarrage rapide

```bash
# Cloner le projet
git clone https://github.com/votre-repo/operation-nird.git
cd operation-nird/nuit-info

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## 📦 Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | Vérification ESLint |

---

## 🏗️ Architecture

```
app/
├── components/           # Composants React
│   ├── Avatar.tsx        # Avatar évolutif (6 niveaux)
│   ├── GamePage.tsx      # Page principale du jeu
│   ├── ScenarioCard.tsx  # Affichage questions/choix
│   └── RoleSelector.tsx  # Sélection personnage
├── contexts/
│   └── GameContext.tsx   # État global (React Context)
├── data/
│   ├── questions.json    # 24+ questions avec branches
│   └── questionsHelper.ts # Logique de sélection
├── game/
│   └── [role]/page.tsx   # Routes dynamiques
└── types/
    └── game.ts           # Types TypeScript
```

---

## 🎯 Système de Jeu

### Arborescence

```
Question 1 (choix initial)
    ├── Choix A → Branche "Mac"
    ├── Choix B → Branche "Windows"
    └── Choix C → Branche "Linux"
         ↓
Questions 4-5 adaptées à la branche
```

### Score

- **💰 Money** : Économies/dépenses budgétaires
- **🌍 CO2** : Impact carbone (kg évités)
- **⚡ NIRD** : Points engagement responsable

---

## 🚢 Déploiement

### Vercel

```bash
npm run build
vercel deploy --prod
```

---

## 📄 Licence

MIT

---

## 👥 Équipe

Projet développé pour la **Nuit de l'Info 2024**.