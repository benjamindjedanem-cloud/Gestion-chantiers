# Gestion Chantiers

Application de suivi de trésorerie de chantiers BTP (entrées, sorties, dettes par bénéficiaire) — Progressive Web App (PWA), installable sur téléphone, fonctionne hors-ligne.

## Démarrer en local

```bash
npm install
npm run dev
```

Ouvre l'adresse affichée dans le terminal (en général `http://localhost:5173`).

## Mettre en ligne sur GitHub

### 1. Créer le dépôt

```bash
git init
git add .
git commit -m "Version initiale"
```

Crée un dépôt vide sur GitHub (sans README ni licence), puis :

```bash
git remote add origin https://github.com/<ton-compte>/<nom-du-depot>.git
git branch -M main
git push -u origin main
```

### 2. Déployer — deux options simples

**Option A — Vercel (le plus simple, gratuit)**
1. Va sur [vercel.com](https://vercel.com), connecte-toi avec ton compte GitHub
2. "Add New Project" → sélectionne ce dépôt
3. Vercel détecte Vite automatiquement (build command : `npm run build`, dossier de sortie : `dist`) → clique sur "Deploy"
4. Ton app est en ligne à une adresse du type `gestion-chantiers.vercel.app`

**Option B — GitHub Pages (gratuit, tout reste chez GitHub)**
1. Dans les paramètres du dépôt GitHub → "Pages" → source : "GitHub Actions"
2. Ajoute un fichier `.github/workflows/deploy.yml` avec ce contenu :

```yaml
name: Déploiement
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

3. Pousse ce fichier sur `main` — le déploiement se lance automatiquement à chaque `git push`
4. Ton app sera en ligne à `https://<ton-compte>.github.io/<nom-du-depot>/`

## Installer l'app sur un téléphone (PWA)

Une fois en ligne :
- **Android (Chrome)** : ouvrir le lien → menu ⋮ → "Ajouter à l'écran d'accueil"
- **iPhone (Safari)** : ouvrir le lien → bouton Partager → "Sur l'écran d'accueil"

L'app s'installe avec son icône, s'ouvre en plein écran sans barre de navigateur, et continue de fonctionner hors connexion (les données restent enregistrées sur l'appareil).

## À savoir

- Les icônes de l’application sont dans `public/icons/` avec plusieurs déclinaisons (PWA, Android maskable, Apple, navigateur et Windows). Le projet utilise une version dédiée de ces icônes dans le manifest, le favicon, le service worker et l’en-tête de l’application.

## Comptes utilisateurs et sauvegarde en ligne (Supabase)

Chaque personne se connecte avec son e-mail et son mot de passe. Ses chantiers sont sauvegardés en ligne dans le projet Supabase **gestion-chantiers** (région Paris) : en changeant de téléphone, il suffit de se reconnecter pour tout retrouver.

- **Confidentialité** : chaque compte ne voit que ses propres données. C'est garanti par la base elle-même (règles RLS), pas seulement par l'application.
- **Hors ligne** : l'app continue de fonctionner sans réseau. Les modifications sont gardées sur le téléphone et envoyées automatiquement au retour du réseau (badge « Hors ligne · N modif. en attente » sur l'accueil).
- **Anciennes données** : au premier login sur un téléphone qui contenait déjà des chantiers (version sans compte), ces données sont envoyées dans le compte.
- **Déconnexion** : efface la copie locale du téléphone (utile sur un téléphone partagé).

### Configuration

Les identifiants publics du projet sont dans `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`). Ils sont publics par conception ; ne jamais y mettre la clé *secret* / *service_role*.

À faire une fois dans le tableau de bord Supabase → **Authentication → URL Configuration** :
- **Site URL** : l'adresse de l'app en ligne (ex. `https://gestion-chantiers.vercel.app`)
- **Redirect URLs** : ajouter cette même adresse et `http://localhost:5173`

Sans cela, les liens reçus par e-mail (confirmation de compte, mot de passe oublié) pointent vers une mauvaise adresse.

## Correctif responsive / déploiement

Le projet inclut maintenant `src/responsive.css`, une couche CSS locale qui fournit les classes utilitaires utilisées par l'interface. Cela évite que l'application dépende d'un Tailwind CSS absent au moment du déploiement.

Avant déploiement :

```bash
npm install
npm run build
```

Le cache du service worker a également été incrémenté afin que les utilisateurs récupèrent la nouvelle version.
