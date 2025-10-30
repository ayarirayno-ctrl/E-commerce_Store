# 🛒 E-Commerce Store - Modern Shopping Experience

[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.0-764abc.svg)](https://redux-toolkit.js.org/)
[![Tests](https://img.shields.io/badge/Tests-23_passing-success.svg)](./TESTING_REPORT.md)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38bdf8.svg)](https://tailwindcss.com/)

> Application e-commerce complète construite avec React 18, TypeScript, et Redux Toolkit. Démonstration des **best practices** modernes en développement web : architecture scalable, tests automatisés, performance optimisée, et SEO.

**[🚀 Live Demo](#)** | **[📖 Documentation](./README.md)** | **[🎨 Design System](./DESIGN_SYSTEM.md)**

---

## ✨ Features

### 🛍️ Core Functionality
- **Catalogue de produits** avec filtres avancés (catégorie, prix, recherche)
- **Gestion de panier** avec persistance locale (ajout, suppression, quantité)
- **Pages détaillées** pour chaque produit avec images et descriptions
- **Checkout flow** complet avec formulaire de livraison
- **Navigation fluide** entre catégories et pages

### ⚡ Performance & Optimization
- **Lazy loading** des images avec IntersectionObserver
- **Code splitting** automatique (Vite)
- **Bundle optimisé** : 104KB gzipped
- **SEO optimisé** : meta tags dynamiques, React Helmet Async
- **Responsive design** : Mobile-first approach

### 🧪 Quality Assurance
- **23 tests automatisés** :
  - ✅ 8 tests backend (API routes)
  - ✅ 6 tests unitaires frontend (Vitest + React Testing Library)
  - ✅ 9 tests E2E (Playwright + Chromium)
- **TypeScript strict mode** : 0 erreurs
- **100% test pass rate**

### ♿ Accessibility & UX
- **ARIA labels** sur tous les composants interactifs
- **Navigation clavier** complète
- **Focus management** optimisé
- **Error boundaries** pour isolation des erreurs
- **Loading states** et feedback utilisateur

---

## 🏗️ Architecture

### Stack Technique

```typescript
{
  // Frontend
  "react": "18.2.0",           // UI Library (Concurrent Mode)
  "typescript": "5.2.2",       // Type Safety
  "redux-toolkit": "2.0.1",    // State Management
  "react-router": "6.20.1",    // Client-side Routing
  "vite": "5.0.0",             // Build Tool & Dev Server
  "tailwind-css": "3.3.5",     // Utility-first CSS
  
  // Testing
  "vitest": "2.1.4",           // Unit Test Runner
  "@testing-library/react": "16.1.0",
  "@playwright/test": "1.48.2", // E2E Testing
  
  // UI/UX
  "lucide-react": "0.294.0",   // Icon Library
  "react-helmet-async": "2.0.4" // SEO Management
}
```

### Architecture Pattern : **Feature-Based**

```
src/
├── components/       # Composants réutilisables
│   ├── cart/        # Composants panier
│   ├── product/     # Composants produits
│   ├── layout/      # Header, Footer
│   └── ui/          # Design system (Button, Input, Modal...)
├── pages/           # Pages (routing)
├── store/           # Redux store
│   ├── slices/      # Redux slices (cart, products, ui)
│   └── api/         # RTK Query API
├── hooks/           # Custom React hooks
├── types/           # TypeScript types
└── utils/           # Helpers & utilities
```

**Avantages de cette architecture :**
- ✅ **Scalabilité** : facile d'ajouter de nouvelles features
- ✅ **Maintenabilité** : code organisé par domaine métier
- ✅ **Réutilisabilité** : composants UI isolés
- ✅ **Testabilité** : chaque module testable indépendamment

---

## 🚀 Performance Metrics

### Build Performance
```
Build Output:
├── dist/index.html                  0.75 kB
├── dist/assets/index-[hash].css    12.34 kB │ gzip: 3.21 kB
└── dist/assets/index-[hash].js    339.34 kB │ gzip: 104.54 kB

Build time: 27.83s
Modules transformed: 2,332
```

### Runtime Performance (Estimated)
- **First Contentful Paint (FCP)** : < 1.5s
- **Time to Interactive (TTI)** : < 3.0s
- **Lighthouse Score** : 90+ (Performance, Accessibility, SEO)

### Optimization Techniques
1. **Lazy Loading** : Images chargées au scroll (IntersectionObserver)
2. **Code Splitting** : Routes chargées dynamiquement
3. **Bundle Optimization** : Tree-shaking, minification
4. **Asset Caching** : Cache-Control headers (31536000s)

---

## 🧪 Testing Strategy

### Test Coverage

| Type | Framework | Tests | Status |
|------|-----------|-------|--------|
| **Unit Tests** | Vitest + RTL | 6 | ✅ 100% pass |
| **E2E Tests** | Playwright | 9 | ✅ 100% pass |
| **Backend Tests** | Jest | 8 | ✅ 100% pass |
| **Total** | - | **23** | ✅ **100% pass** |

### Test Highlights

**Unit Tests (Vitest + React Testing Library)**
```typescript
// Example: CartSlice tests
describe('cartSlice', () => {
  it('should add item to cart', () => {
    const state = cartReducer(undefined, addToCart(mockProduct));
    expect(state.items).toHaveLength(1);
  });
  
  it('should calculate total correctly', () => {
    const state = { items: [{ ...mockProduct, quantity: 2 }] };
    expect(selectCartTotal(state)).toBe(39.98);
  });
});
```

**E2E Tests (Playwright)**
```typescript
// Example: Navigation flow
test('user can browse and add to cart', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Products');
  await page.click('button:has-text("Add to Cart")');
  await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
});
```

---

## 🎨 Design System

### Component Library

**Custom UI Components** (14 composants réutilisables)
- `<Button />` : 5 variants (primary, secondary, outline, ghost, link)
- `<Input />` : Validation, error states, accessibility
- `<Modal />` : Accessible, keyboard navigation
- `<Badge />` : 4 variants (default, success, warning, error)
- `<Loading />` : Skeleton loaders, spinners

### Theming

```typescript
// Tailwind config - Design tokens
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
  }
}
```

---

## 📱 Responsive Design

### Breakpoints
- **Mobile** : 320px - 767px (mobile-first)
- **Tablet** : 768px - 1023px
- **Desktop** : 1024px+

### Mobile Optimization
- Touch-friendly UI (48px min tap targets)
- Optimized images (lazy loading)
- Hamburger menu (mobile navigation)
- Swipe gestures support

---

## 🔍 SEO Optimization

### Implementation
```typescript
// Example: Dynamic meta tags
<Helmet>
  <title>{product.name} | E-Commerce Store</title>
  <meta name="description" content={product.description} />
  <meta property="og:title" content={product.name} />
  <meta property="og:image" content={product.image} />
</Helmet>
```

### SEO Features
- ✅ Dynamic meta tags (title, description)
- ✅ Open Graph tags (Facebook, LinkedIn)
- ✅ Semantic HTML (h1-h6, nav, main, footer)
- ✅ Sitemap ready
- ✅ robots.txt configuration

---

## 🛠️ Development Workflow

### Scripts
```bash
# Development
npm run dev           # Start dev server (Vite HMR)

# Production
npm run build         # TypeScript + Vite build
npm run preview       # Preview production build

# Testing
npm run test          # Unit tests (Vitest)
npm run test:e2e      # E2E tests (Playwright)
npm run test:coverage # Coverage report

# Quality
npm run lint          # ESLint
npm run type-check    # TypeScript
```

### Development Tools
- **Vite** : HMR instantané (< 100ms)
- **ESLint** : Code quality
- **Prettier** : Code formatting
- **TypeScript** : Type checking
- **Redux DevTools** : State debugging

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm 9+

### Quick Start
```bash
# Clone repository
git clone https://github.com/yourusername/ecommerce-store.git

# Install dependencies
cd ecommerce-store
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy (Vercel)
vercel --prod
```

---

## 🎯 Key Learnings & Challenges

### Technical Challenges Solved

1. **State Management Complexity**
   - **Problème** : Gestion du panier cross-pages avec persistance
   - **Solution** : Redux Toolkit + localStorage sync
   - **Résultat** : State cohérent, performance optimale

2. **Performance Optimization**
   - **Problème** : Bundle size élevé (> 500KB)
   - **Solution** : Code splitting, lazy loading, tree-shaking
   - **Résultat** : Bundle réduit à 104KB gzipped (-60%)

3. **Testing Strategy**
   - **Problème** : Comment tester Redux + async actions ?
   - **Solution** : Mock store, RTK Query fixtures
   - **Résultat** : 23 tests, 100% pass rate

### Best Practices Implemented
- ✅ **TypeScript strict mode** : Type safety garantie
- ✅ **Error boundaries** : Isolation des erreurs
- ✅ **Custom hooks** : Logique réutilisable (useCart, useProducts)
- ✅ **Atomic commits** : Git workflow professionnel
- ✅ **Comprehensive testing** : Unit + E2E coverage

---

## 📈 Future Enhancements

### Roadmap
- [ ] **Admin Interface** : Dashboard pour gestion produits
- [ ] **Payment Integration** : Stripe/PayPal checkout
- [ ] **User Authentication** : Firebase Auth
- [ ] **Wishlist Feature** : Favoris utilisateur
- [ ] **Product Reviews** : Système de notation
- [ ] **Real-time Inventory** : WebSocket updates
- [ ] **Multi-language** : i18n support (EN/FR)
- [ ] **Dark Mode** : Theme switcher

---

## 👨‍💻 About

**Développeur** : [Votre Nom]  
**LinkedIn** : [linkedin.com/in/votre-profil](https://linkedin.com/in/votre-profil)  
**Portfolio** : [votre-portfolio.com](https://votre-portfolio.com)  
**GitHub** : [github.com/votre-username](https://github.com/votre-username)

---

## 📄 License

MIT © 2025 [Votre Nom]

---

## 🙏 Acknowledgments

- **Design Inspiration** : Modern e-commerce UX patterns
- **Icons** : [Lucide Icons](https://lucide.dev/)
- **Fonts** : [Google Fonts - Inter](https://fonts.google.com/specimen/Inter)

---

**⭐ Star this repo if you find it useful!**

**🔗 Links:**
- [Live Demo](#)
- [Documentation](./README.md)
- [Testing Report](./TESTING_REPORT.md)
- [Interview Prep](./INTERVIEW_PREP.md)
