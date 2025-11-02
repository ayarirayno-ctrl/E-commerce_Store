# 🚀 Quick Start - User Blocking Feature

## ⚡ Démarrage Rapide (2 minutes)

### 1️⃣ Démarrer le Backend
```bash
cd backend
node src/server.js
```
✅ Serveur sur http://localhost:5000

### 2️⃣ Démarrer le Frontend
```bash
npm run dev
```
✅ Application sur http://localhost:3002

---

## 🧪 Test Rapide (3 minutes)

### Étape 1: Connexion Admin
🔗 http://localhost:3002/admin/login
- **Email:** ayarirayen539@gmail.com
- **Password:** admin123

### Étape 2: Bloquer un Client
1. Aller dans **Clients**
2. Cliquer **"Bloquer"** sur un client
3. ✅ Le client apparaît dans la section rouge **"Clients Bloqués"**

### Étape 3: Tester le Blocage
1. Se déconnecter
2. Essayer de se connecter avec le compte client bloqué
3. ❌ Message: **"You are blocked from admin device. Please contact support."**

### Étape 4: Débloquer
1. Se reconnecter en admin
2. Dans section **"Clients Bloqués"**, cliquer **"Débloquer"**
3. ✅ Le client peut maintenant se connecter

---

## 📚 Documentation Complète

- **USER_BLOCKING_FEATURE.md** - Toutes les spécifications
- **BLOCKING_TEST_GUIDE.md** - Guide de test détaillé
- **RECAP_BLOCAGE.md** - Récapitulatif visuel

---

## ✅ Fonctionnalités Clés

🚫 **Blocage:**
- Admin bloque un client en 1 clic
- Client ne peut plus se connecter
- Message d'erreur clair en anglais

👥 **Interface Admin:**
- Section dédiée aux clients bloqués (rouge)
- Statistiques en temps réel
- Blocage/déblocage facile

🔒 **Sécurité:**
- Vérification backend
- Statut 403 Forbidden
- Impossible de bloquer les admins

---

## 🎯 Fichiers Modifiés

**Backend:**
- `backend/src/controllers/authController.js` → Message d'erreur
- `backend/src/routes/admin.js` → Route /blocked

**Frontend:**
- `src/contexts/AuthContext.tsx` → Gestion erreur
- `src/pages/admin/AdminClientsPage.tsx` → Section bloqués

---

## 🆘 Dépannage

### Backend ne démarre pas
```bash
cd backend
npm install
node src/server.js
```

### Frontend ne démarre pas
```bash
npm install
npm run dev
```

### Port déjà utilisé
- Backend: Changer PORT dans `backend/.env`
- Frontend: Changer port dans `vite.config.ts`

---

## 📊 API Endpoints

```
POST   /api/auth/login               (vérifie isBlocked)
GET    /api/admin/clients            (tous les clients)
GET    /api/admin/clients/blocked    (clients bloqués uniquement)
PATCH  /api/admin/clients/:id/block  (bloquer/débloquer)
```

---

**Tout est prêt ! Bonne utilisation ! 🎉**
