# 🚀 Guide de Déploiement - E-Commerce Store# 🚀 Quick Deployment Guide - E-Commerce Store



## ✅ Préparation Terminée## Prerequisites Checklist



Votre projet est maintenant **100% prêt pour le déploiement** !- [ ] Node.js 18+ installed

- [ ] Backend API running

### **Fichiers Créés :**- [ ] MongoDB configured

- ✅ README.md professionnel- [ ] Environment variables set

- ✅ robots.txt (SEO)

- ✅ sitemap.xml (SEO)  ---

- ✅ vercel.json (configuration)

- ✅ Build production réussi## 🔧 Environment Setup



---### 1. Configure Environment Variables



## 📦 Déploiement sur Vercel```bash

# Copy example and configure

### **Méthode Simple (Recommandée) :**cp .env.example .env.development

cp .env.example .env.production

1. **Via GitHub :**

   ```bash# Edit .env.production with your production values

   git initVITE_API_URL=https://your-api-domain.com/api

   git add .VITE_APP_NAME=ModernStore

   git commit -m "E-commerce Store - Production Ready"VITE_ENABLE_ANALYTICS=true

   git branch -M main```

   git remote add origin https://github.com/votre-username/ecommerce-store.git

   git push -u origin main---

   ```

## 📦 Build for Production

2. **Sur Vercel.com :**

   - Aller sur https://vercel.com### Option 1: Vercel (Recommended)

   - Cliquer "New Project"

   - Importer votre repo GitHub```bash

   - Cliquer "Deploy" ✅# Install Vercel CLI

npm i -g vercel

---

# Login

## 🎬 Vidéo Démo (2-3 min)vercel login



1. Homepage & Navigation# Deploy

2. Product Browsing + Wishlistvercel --prod

3. Cart + Promo Codes```

4. Admin Dashboard

5. PWA Install**Vercel Configuration** (`vercel.json`):

```json

---{

  "buildCommand": "npm run build:prod",

## 🎯 Checklist Finale  "outputDirectory": "dist",

  "devCommand": "npm run dev",

### **Déploiement :**  "installCommand": "npm install",

- [x] Build production réussi  "framework": "vite",

- [x] Documentation complète  "env": {

- [x] SEO configuré    "VITE_API_URL": "@api-url",

- [ ] Déployer sur Vercel    "VITE_APP_NAME": "ModernStore"

- [ ] Capturer screenshots  }

- [ ] Vidéo démo}

```

---

### Option 2: Netlify

**Vous êtes dans le TOP 1% ! 🏆**

```bash

*30 Octobre 2025*# Install Netlify CLI

npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build:prod"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### Option 3: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build & Run:**
```bash
docker build -t ecommerce-frontend .
docker run -p 80:80 ecommerce-frontend
```

---

## ✅ Pre-Deployment Checklist

### Code Quality
- [ ] Run `npm run lint:fix`
- [ ] Run `npm run type-check`
- [ ] Fix all TypeScript errors
- [ ] Remove console.logs

### Testing
- [ ] Backend E2E tests passing (8/8)
- [ ] Manual testing on all pages
- [ ] Test auth flow
- [ ] Test cart & checkout

### Performance
- [ ] Images optimized (<100KB each)
- [ ] Bundle size checked
- [ ] Lazy loading verified

### SEO
- [ ] Meta tags on all pages
- [ ] robots.txt configured
- [ ] Sitemap generated

### Security
- [ ] Environment variables secured
- [ ] API endpoints verified
- [ ] CORS configured correctly

---

## 🔍 Production Build Test

```bash
# Build for production
npm run build:prod

# Preview production build
npm run preview

# Open http://localhost:4173
# Test all functionality
```

---

## 📊 Performance Optimization

### Before Deployment

```bash
# Install analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ]
});

# Build and analyze
npm run build:prod
# Opens stats.html automatically
```

### Bundle Size Targets
- Total: <500KB (gzipped)
- Main chunk: <300KB
- Vendor chunk: <200KB

---

## 🌐 Domain & DNS Setup

### With Vercel
1. Add domain in Vercel dashboard
2. Configure DNS (A or CNAME records)
3. SSL auto-configured

### With Netlify
1. Add domain in Netlify dashboard
2. Update nameservers
3. SSL auto-configured

### Custom Server
```nginx
# nginx.conf
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    root /var/www/ecommerce/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔐 Environment Variables (Production)

### Required Variables
```bash
VITE_API_URL=https://api.production.com/api
VITE_APP_NAME=ModernStore
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

### Optional (if using)
```bash
VITE_GA_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_STRIPE_PUBLIC_KEY=pk_live_xxx
```

---

## 📈 Post-Deployment Monitoring

### 1. Setup Google Analytics
```typescript
// Add to src/main.tsx
if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
  // GA4 initialization
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_ID}`;
  document.head.appendChild(script);
  
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', import.meta.env.VITE_GA_ID);
}
```

### 2. Error Tracking (Optional - Sentry)
```bash
npm install @sentry/react @sentry/tracing
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}
```

### 3. Uptime Monitoring
- [UptimeRobot](https://uptimerobot.com) - Free
- [Pingdom](https://www.pingdom.com)
- [StatusCake](https://www.statuscake.com)

---

## 🚨 Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf node_modules dist .vite
npm install
npm run build:prod
```

### White Screen After Deploy
- Check browser console for errors
- Verify API_URL is correct
- Check CORS configuration
- Verify all assets loaded (Network tab)

### Routing Issues (404 on refresh)
- Configure server rewrites to index.html
- Check `_redirects` (Netlify) or `vercel.json` (Vercel)

### Slow Load Times
- Check bundle size
- Verify images are optimized
- Enable gzip compression
- Use CDN for assets

---

## 📋 Deployment Checklist

### Pre-Deploy
- [ ] All tests passing
- [ ] Build succeeds locally
- [ ] Preview works correctly
- [ ] Environment variables set
- [ ] Images optimized

### Deploy
- [ ] Deploy to staging first
- [ ] Test all functionality
- [ ] Check mobile responsiveness
- [ ] Verify SEO meta tags
- [ ] Test performance (Lighthouse)

### Post-Deploy
- [ ] Monitor error logs
- [ ] Check analytics
- [ ] Verify SSL certificate
- [ ] Test from different locations
- [ ] Update documentation

---

## 🎯 Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint | <1.8s | Lighthouse |
| Largest Contentful Paint | <2.5s | Lighthouse |
| Time to Interactive | <3.8s | Lighthouse |
| Cumulative Layout Shift | <0.1 | Lighthouse |
| Total Bundle Size | <500KB | Bundlephobia |
| Lighthouse Score | >90 | Chrome DevTools |

---

## 🔗 Useful Links

- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Web.dev Performance](https://web.dev/vitals/)
- [React Production Build](https://react.dev/learn/start-a-new-react-project#deploying-to-production)

---

**Good luck with your deployment! 🚀**
