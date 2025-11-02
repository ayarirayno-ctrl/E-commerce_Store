# 🔧 GUIDE DE DÉPANNAGE RAPIDE

## Problème : Le site ne fonctionne pas

### Solution 1 : Vider le cache du navigateur

**Méthode rapide :**
1. Appuyez sur **Ctrl + Shift + Delete**
2. Sélectionnez "Images et fichiers en cache"
3. Cliquez sur "Effacer les données"
4. Rafraîchissez avec **Ctrl + F5**

**OU en mode navigation privée :**
- Ouvrez une fenêtre de navigation privée (Ctrl + Shift + N)
- Allez sur http://localhost:3002

---

### Solution 2 : Vérifier que les serveurs tournent

**Backend (doit tourner sur port 5000) :**
```bash
cd backend
npm run dev
```

**Frontend (doit tourner sur port 3002) :**
```bash
npm run dev
```

**Vérification rapide :**
- Backend : http://localhost:5000/api/health
- Frontend : http://localhost:3002

---

### Solution 3 : Redémarrer les serveurs

**Dans le terminal backend :**
1. Appuyez sur `Ctrl + C` pour arrêter
2. Relancez : `npm run dev`

**Dans le terminal frontend :**
1. Appuyez sur `Ctrl + C` pour arrêter
2. Relancez : `npm run dev`

---

### Solution 4 : Vérifier MongoDB

**Démarrer MongoDB (si arrêté) :**
```powershell
net start MongoDB
```

**Vérifier le statut :**
```powershell
mongosh
```

---

### Solution 5 : Problèmes communs et solutions

#### Erreur : "Cannot read properties of null (reading 'useState')"
**Cause :** React mal installé ou dupliqué

**Solution :**
```bash
rm -r -force node_modules
npm install
npm run dev
```

#### Erreur : "Network Error" ou "Failed to fetch"
**Cause :** Backend non démarré ou mauvaise URL

**Solution :**
1. Vérifiez que le backend tourne sur http://localhost:5000/api/health
2. Vérifiez le fichier `.env.local` :
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
3. Redémarrez le frontend

#### Erreur : "CORS Policy"
**Cause :** Frontend URL mal configurée dans le backend

**Solution :**
1. Ouvrez `backend/.env`
2. Vérifiez : `FRONTEND_URL=http://localhost:3002`
3. Redémarrez le backend

#### Page blanche
**Cause :** Erreur JavaScript non capturée

**Solution :**
1. Ouvrez la console du navigateur (F12)
2. Regardez l'onglet "Console" pour voir l'erreur
3. Copiez le message d'erreur et cherchez la solution

---

### Solution 6 : Réinstallation complète (dernier recours)

**Frontend :**
```bash
rm -r -force node_modules
rm -force package-lock.json
npm install
npm run dev
```

**Backend :**
```bash
cd backend
rm -r -force node_modules
rm -force package-lock.json
npm install
npm run dev
```

---

## 🧪 Checklist de Vérification

Avant de tester, assurez-vous que :

- [ ] MongoDB est démarré
- [ ] Backend tourne sur port 5000
- [ ] Frontend tourne sur port 3002
- [ ] `.env.local` existe avec `VITE_API_URL=http://localhost:5000/api`
- [ ] `backend/.env` a le Gmail App Password configuré
- [ ] Le cache du navigateur est vidé

---

## 📞 Aide Supplémentaire

**Si le problème persiste, donnez-moi :**
1. Le message d'erreur exact dans le navigateur (copier-coller)
2. Les erreurs dans la console du navigateur (F12 → Console)
3. Les logs du terminal backend
4. Les logs du terminal frontend

**Je pourrai ainsi diagnostiquer précisément le problème ! 🔍**
