# 🚀 Guide de Déploiement Netlify

## 📋 Prérequis

- [ ] Compte GitHub avec votre code pushé
- [ ] Compte Netlify (gratuit) → [netlify.com](https://netlify.com)
- [ ] Variables d'environnement préparées

## 🔧 Configuration Projet

### 1. Fichier de Configuration

Créer `netlify.toml` à la racine:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

### 2. Variables d'Environnement

Créer `.env.production`:

```bash
VITE_API_URL=https://votre-backend.com/api
VITE_SITE_URL=https://votre-site.netlify.app
```

## 🌐 Déploiement sur Netlify

### Option 1: Via Interface Web (Recommandé)

1. **Se connecter à Netlify**
   - Aller sur [app.netlify.com](https://app.netlify.com)
   - Cliquer "Sign up" avec GitHub
   - Autoriser Netlify à accéder à vos repos

2. **Importer le Projet**
   - Cliquer "Add new site" → "Import an existing project"
   - Choisir "Deploy with GitHub"
   - Sélectionner votre repository

3. **Configurer le Build**
   
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18 (ou auto-détecté)

4. **Ajouter Variables d'Environnement**
   
   Aller dans **Site settings** → **Environment variables**:
   
   ```
   Key: VITE_API_URL
   Value: https://votre-backend.com/api
   
   Key: VITE_SITE_URL
   Value: https://votre-site.netlify.app
   ```

5. **Déployer**
   - Cliquer "Deploy site"
   - Attendre 1-3 minutes
   - ✅ Site en ligne sur `https://random-name-123.netlify.app`

### Option 2: Via CLI Netlify

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Initialiser
netlify init

# Build et déploiement
netlify build
netlify deploy --prod
```

### Option 3: Drag & Drop (Rapide)

1. Builder localement: `npm run build`
2. Aller sur [app.netlify.com/drop](https://app.netlify.com/drop)
3. Glisser-déposer le dossier `dist`
4. ✅ Site en ligne instantanément!

## 🔗 Configuration Avancée

### Custom Domain

1. **Acheter un domaine** (ou utiliser existant)
2. Aller dans **Site settings** → **Domain management**
3. Cliquer "Add custom domain"
4. Entrer `mon-ecommerce.com`
5. **Configurer DNS**:

   **Option A: Netlify DNS** (Recommandé)
   - Netlify gère tout automatiquement
   - Changer nameservers chez votre registrar:
     ```
     dns1.p01.nsone.net
     dns2.p01.nsone.net
     dns3.p01.nsone.net
     dns4.p01.nsone.net
     ```

   **Option B: External DNS**
   - Ajouter un record A:
     ```
     Type: A
     Name: @
     Value: 75.2.60.5
     ```
   - Ajouter un record CNAME:
     ```
     Type: CNAME
     Name: www
     Value: votre-site.netlify.app
     ```

6. **Activer HTTPS**
   - Netlify génère un certificat SSL automatiquement
   - Attendre 1-2 heures pour propagation DNS

### Redirects & Rewrites

Dans `netlify.toml`:

```toml
# SPA fallback (React Router)
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Redirect www vers non-www
[[redirects]]
  from = "https://www.mon-ecommerce.com/*"
  to = "https://mon-ecommerce.com/:splat"
  status = 301
  force = true

# Proxy API (éviter CORS)
[[redirects]]
  from = "/api/*"
  to = "https://backend-api.com/:splat"
  status = 200
  force = true
  headers = {X-From = "Netlify"}
```

### Build Plugins

Installer plugins dans `netlify.toml`:

```toml
[[plugins]]
  package = "@netlify/plugin-lighthouse"

[[plugins]]
  package = "netlify-plugin-cache"
  [plugins.inputs]
    paths = ["node_modules", ".cache"]

[[plugins]]
  package = "netlify-plugin-sitemap"
  [plugins.inputs]
    buildDir = "dist"
```

Puis:
```bash
npm install -D @netlify/plugin-lighthouse netlify-plugin-cache netlify-plugin-sitemap
```

## 🔄 CI/CD Automatique

Netlify déploie automatiquement:
- ✅ **Production**: Push sur `main` → `votre-site.netlify.app`
- ✅ **Deploy Previews**: Pull Request → `deploy-preview-123--votre-site.netlify.app`
- ✅ **Branch Deploys**: Toutes les branches → `branch-name--votre-site.netlify.app`

### Configuration GitHub

Aller dans **Site settings** → **Build & deploy** → **Deploy notifications**:
- [x] GitHub commit status
- [x] GitHub PR comments
- [x] Email notifications

## 📊 Monitoring & Analytics

### Netlify Analytics (Payant)

1. Aller dans **Analytics** (onglet site)
2. Activer (9$/mois)
3. Analytics server-side (pas de cookies, RGPD-friendly)

### Alternative Gratuite: Umami

```bash
# Ajouter Umami (self-hosted ou cloud.umami.is)
# Dans index.html:
<script async defer data-website-id="xxx" src="https://umami.is/script.js"></script>
```

## 🛠️ Troubleshooting

### Problème: Build Failed

**Vérifier les logs**:
1. Aller dans **Deploys** → dernière deploy
2. Cliquer "Show deploy details"
3. Lire les logs de build

**Solutions courantes**:
```bash
# Tester build local
npm run build

# Vérifier Node version
node --version  # Doit correspondre à netlify.toml

# Clear cache et rebuild
netlify build --clear-cache
```

### Problème: Routes 404

**Solution**: Vérifier `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

OU créer `public/_redirects`:
```
/*    /index.html   200
```

### Problème: Variables d'environnement non reconnues

**Solutions**:
1. Vérifier préfixe `VITE_`
2. Trigger rebuild: **Deploys** → **Trigger deploy** → **Clear cache and deploy site**
3. Vérifier scopes (Build-time vs Runtime)

### Problème: Déploiement lent

**Solutions**:
```toml
# Activer cache
[build]
  command = "npm ci && npm run build"  # npm ci est plus rapide

[[plugins]]
  package = "netlify-plugin-cache"
```

## ✅ Checklist Pré-Déploiement

- [ ] Tests passent: `npm test`
- [ ] Build local OK: `npm run build`
- [ ] TypeScript compile: `tsc --noEmit`
- [ ] `netlify.toml` configuré
- [ ] Variables env ajoutées
- [ ] `.gitignore` contient `.env*`
- [ ] Redirects configurés (SPA)
- [ ] Meta SEO tags présents
- [ ] Favicon présent

## 📈 Post-Déploiement

### 1. Performance

```bash
# Lighthouse
npx lighthouse https://votre-site.netlify.app --view

# WebPageTest
# → https://www.webpagetest.org
```

### 2. SEO

1. **Google Search Console**
   - Ajouter votre site
   - Soumettre sitemap: `https://votre-site.netlify.app/sitemap.xml`

2. **Générer sitemap** (si pas existant):
   ```bash
   npm install -D vite-plugin-sitemap
   ```
   
   Dans `vite.config.ts`:
   ```typescript
   import Sitemap from 'vite-plugin-sitemap'
   
   export default defineConfig({
     plugins: [
       Sitemap({
         hostname: 'https://votre-site.netlify.app'
       })
     ]
   })
   ```

### 3. Monitoring

**UptimeRobot** (gratuit):
1. Créer un compte sur [uptimerobot.com](https://uptimerobot.com)
2. Ajouter monitor HTTP(S)
3. URL: `https://votre-site.netlify.app`
4. Check interval: 5 minutes

## 🎯 Commandes Utiles

```bash
# Status du site
netlify status

# Voir les logs
netlify logs

# Ouvrir le site
netlify open:site

# Ouvrir admin
netlify open:admin

# Lister les sites
netlify sites:list

# Variables env
netlify env:list
netlify env:set VITE_API_URL https://api.example.com

# Rollback
netlify rollback
```

## 🔐 Sécurité

### Headers de Sécurité

Dans `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
```

### HTTPS

- ✅ HTTPS activé automatiquement (Let's Encrypt)
- ✅ Force HTTPS: **Site settings** → **Domain management** → **HTTPS** → Cocher "Force HTTPS"

## 🆚 Netlify vs Vercel

| Feature | Netlify | Vercel |
|---------|---------|--------|
| **Build Minutes/mo** | 300 (gratuit) | 100 (gratuit) |
| **Bandwidth/mo** | 100GB | 100GB |
| **Custom Domains** | Illimité | Illimité |
| **Serverless Functions** | 125k invocations | 100k invocations |
| **Edge Functions** | ✅ | ✅ |
| **Forms** | ✅ (100/mo gratuit) | ❌ |
| **Analytics** | Payant ($9/mo) | Gratuit |
| **Split Testing** | ✅ | ❌ |
| **Redirect Rules** | Illimité | 1024 |

## 📚 Ressources

- [Netlify Docs](https://docs.netlify.com)
- [Vite on Netlify](https://docs.netlify.com/frameworks/vite/)
- [Netlify Forums](https://answers.netlify.com)
- [Deploy React to Netlify](https://www.netlify.com/blog/2016/07/22/deploy-react-apps-in-less-than-30-seconds/)

---

**✅ Votre site est maintenant en production sur Netlify!**

URL: `https://<votre-projet>.netlify.app`
