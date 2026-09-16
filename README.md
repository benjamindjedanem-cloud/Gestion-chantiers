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

- Les données sont stockées **localement sur l'appareil** (dans le navigateur), pas sur un serveur — donc pas de synchronisation automatique entre plusieurs téléphones pour l'instant. Si plusieurs personnes doivent voir les mêmes chantiers depuis des appareils différents, il faudra ajouter une base de données partagée (ex. Supabase, Firebase) dans une prochaine étape.
- Le logo est dans `public/icons/` et `public/logo.svg` — modifiable à tout moment sans toucher au code de l'app.
