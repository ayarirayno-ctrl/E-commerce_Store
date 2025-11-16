# 🚀 Guide de Déploiement Vercel

## 📋 Prérequis

- [ ] Compte GitHub avec votre code pushé
- [ ] Compte Vercel (gratuit) → [vercel.com](https://vercel.com)
- [ ] Variables d'environnement préparées

## 🔧 Configuration Projet

### 1. Préparer le Build

Vérifier que votre `package.json` contient:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### 2. Variables d'Environnement

Créer `.env.production`:

```bash
VITE_API_URL=https://votre-backend.com/api
VITE_SITE_URL=https://votre-site.vercel.app
```

**⚠️ IMPORTANT**: Ne jamais commiter `.env.production` dans Git!

## 🌐 Déploiement sur Vercel

### Option 1: Via Interface Web (Recommandé)

1. **Se connecter à Vercel**
   - Aller sur [vercel.com](https://vercel.com)
   - Cliquer "Sign Up" ou "Log In"
   - Authentifier avec GitHub

2. **Importer le Projet**
   - Cliquer "Add New..." → "Project"
   - Sélectionner votre repository GitHub
   - Cliquer "Import"

3. **Configurer le Build**
   
   Vercel détecte automatiquement Vite, mais vérifier:
   
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Ajouter Variables d'Environnement**
   
   Dans "Environment Variables":
   ```
   VITE_API_URL = https://votre-backend.com/api
   VITE_SITE_URL = https://votre-projet.vercel.app
   ```

5. **Déployer**
   - Cliquer "Deploy"
   - Attendre 1-2 minutes
   - ✅ Votre site est en ligne!

### Option 2: Via CLI Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

## 🔗 Configuration Avancée

### Custom Domain

1. Aller dans **Settings** → **Domains**
2. Ajouter votre domaine (ex: `mon-ecommerce.com`)
3. Configurer DNS chez votre registrar:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Attendre propagation DNS (5-60 min)

### Redirections

Créer `vercel.json` à la racine:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Optimisations Performance

Dans `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

## 🔄 CI/CD Automatique

Vercel déploie automatiquement:
- ✅ **Production**: Push sur `main` → `votre-projet.vercel.app`
- ✅ **Preview**: Pull Request → `pr-123.votre-projet.vercel.app`

### Configuration GitHub

1. Aller dans **Settings** → **Git Integration**
2. Activer:
   - [x] Automatic Deployments on Git Push
   - [x] Preview Deployments on Pull Requests
   - [x] Comments on GitHub PRs

## 📊 Monitoring & Analytics

### Vercel Analytics

1. Aller dans **Analytics** (onglet projet)
2. Activer "Web Analytics"
3. Ajouter le code dans `index.html`:

```html
<script defer src="/_vercel/insights/script.js"></script>
```

### Logs & Debugging

- **Logs**: Settings → Logs
- **Builds**: Deployments → Build Logs
- **Runtime Logs**: Functions → Logs (si backend sur Vercel)

## 🛠️ Troubleshooting

### Problème: Build Failed

**Solution**:
```bash
# Tester le build localement
npm run build

# Vérifier les erreurs TypeScript
npm run build 2>&1 | grep error
```

### Problème: Variables d'environnement non reconnues

**Solution**:
- Vérifier le préfixe `VITE_` dans les variables
- Redéployer après ajout de variables
- Rebuild: Settings → Redeploy → Redeploy with existing Build Cache

### Problème: Routes 404

**Solution**: Ajouter `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Problème: Bundle trop gros

**Solution**:
```bash
# Analyser le bundle
npm run build
npx vite-bundle-visualizer

# Lazy load des pages
const HomePage = lazy(() => import('./pages/HomePage'));
```

## ✅ Checklist Pré-Déploiement

- [ ] Tests passent: `npm test`
- [ ] Build local réussi: `npm run build`
- [ ] Aucune erreur TypeScript: `tsc --noEmit`
- [ ] Variables `.env.production` configurées
- [ ] `.gitignore` contient `.env*`
- [ ] Meta tags SEO ajoutés
- [ ] Favicon présent
- [ ] Analytics configuré (optionnel)

## 📈 Post-Déploiement

1. **Tester le site en production**
   ```bash
   # Lighthouse
   npx lighthouse https://votre-projet.vercel.app --view
   ```

2. **Configurer Uptime Monitoring**
   - [UptimeRobot](https://uptimerobot.com) (gratuit)
   - Vérifier disponibilité 24/7

3. **SEO**
   - Soumettre sitemap à Google Search Console
   - Vérifier indexation

## 🎯 Commandes Utiles

```bash
# Voir les déploiements
vercel ls

# Voir les logs
vercel logs <deployment-url>

# Supprimer un déploiement
vercel rm <deployment-url>

# Voir les domaines
vercel domains ls

# Environnement variables
vercel env ls
vercel env add VITE_API_URL production
```

## 🔐 Sécurité

1. **HTTPS**: Activé par défaut sur Vercel ✅
2. **Headers**: Ajouter dans `vercel.json`:
   ```json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           { "key": "X-Content-Type-Options", "value": "nosniff" },
           { "key": "X-Frame-Options", "value": "DENY" },
           { "key": "X-XSS-Protection", "value": "1; mode=block" }
         ]
       }
     ]
   }
   ```

## 📚 Ressources

- [Vercel Docs](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [React Router + Vercel](https://vercel.com/guides/deploying-react-with-vercel)

---

**✅ Votre site est maintenant en production!**

URL: `https://<votre-projet>.vercel.app`
