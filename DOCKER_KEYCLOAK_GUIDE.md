# 🚀 Guide de Démarrage Rapide - Keycloak avec Docker

## 📋 Prérequis

- Docker Desktop installé et en cours d'exécution
- PowerShell ou terminal

## ⚡ Démarrage Rapide (3 commandes)

```powershell
# 1. Démarrer Keycloak et PostgreSQL
docker-compose up -d

# 2. Vérifier que tout fonctionne
docker-compose ps

# 3. Accéder à Keycloak
# URL: http://localhost:8080
# Username: admin
# Password: admin
```

## 🐳 Commandes Docker Compose

### Démarrer les services
```powershell
docker-compose up -d
```

### Arrêter les services
```powershell
docker-compose down
```

### Voir les logs
```powershell
# Tous les logs
docker-compose logs -f

# Logs Keycloak uniquement
docker-compose logs -f keycloak

# Logs PostgreSQL uniquement
docker-compose logs -f postgres
```

### Redémarrer les services
```powershell
docker-compose restart
```

### Arrêter et supprimer tout (incluant les volumes)
```powershell
docker-compose down -v
```

### Voir l'état des services
```powershell
docker-compose ps
```

## 🔍 Vérification de l'Installation

### 1. Vérifier que Keycloak est prêt
```powershell
# Test de santé
curl http://localhost:8080/health/ready

# Devrait retourner: {"status":"UP"}
```

### 2. Accéder à la console d'administration
- URL: http://localhost:8080
- Cliquez sur "Administration Console"
- Username: `admin`
- Password: `admin`

### 3. Vérifier PostgreSQL
```powershell
# Se connecter à PostgreSQL
docker exec -it ecommerce-postgres psql -U keycloak -d keycloak

# Dans psql, lister les tables
\dt

# Quitter
\q
```

## 📊 Monitoring

### Voir l'utilisation des ressources
```powershell
docker stats
```

### Voir les détails d'un conteneur
```powershell
docker inspect ecommerce-keycloak
```

## 🔧 Configuration Post-Installation

Une fois Keycloak démarré, suivez le guide `KEYCLOAK_SETUP_GUIDE.md` pour :

1. ✅ Créer le realm "ecommerce"
2. ✅ Créer les rôles (admin, client)
3. ✅ Créer le client "ecommerce-client"
4. ✅ Créer des utilisateurs de test
5. ✅ Récupérer le client secret et la clé publique
6. ✅ Mettre à jour le fichier `.env`

## 🐛 Dépannage

### Keycloak ne démarre pas

```powershell
# Voir les logs d'erreur
docker-compose logs keycloak

# Recréer les conteneurs
docker-compose down
docker-compose up -d --force-recreate
```

### Port 8080 déjà utilisé

```powershell
# Trouver le processus utilisant le port
netstat -ano | findstr :8080

# Tuer le processus (remplacer PID par le numéro du processus)
taskkill /PID <PID> /F

# Ou modifier le port dans docker-compose.yml
# Changer "8080:8080" en "8081:8080"
```

### PostgreSQL ne se connecte pas

```powershell
# Vérifier que le conteneur tourne
docker ps | findstr postgres

# Voir les logs
docker-compose logs postgres

# Se connecter manuellement
docker exec -it ecommerce-postgres psql -U keycloak
```

### Réinitialisation complète

```powershell
# Arrêter et supprimer tout
docker-compose down -v

# Supprimer les images
docker rmi quay.io/keycloak/keycloak:latest
docker rmi postgres:15-alpine

# Redémarrer proprement
docker-compose up -d
```

## 📦 Contenu du Docker Compose

### Services inclus :

1. **Keycloak** (port 8080)
   - Identity and Access Management
   - Base de données : PostgreSQL
   - Mode développement activé
   
2. **PostgreSQL** (port 5432)
   - Base de données pour Keycloak
   - Données persistées dans un volume Docker

### MongoDB (optionnel)
Décommentez les lignes MongoDB dans `docker-compose.yml` si vous voulez aussi Docker pour MongoDB.

## 🔐 Sécurité

### ⚠️ Pour la production :

1. **Changer les mots de passe**
   ```yaml
   KEYCLOAK_ADMIN_PASSWORD: votre_mot_de_passe_sécurisé
   POSTGRES_PASSWORD: votre_mot_de_passe_db_sécurisé
   ```

2. **Activer HTTPS**
   ```yaml
   KC_HTTPS_ENABLED: true
   KC_HTTPS_CERTIFICATE_FILE: /path/to/cert.pem
   KC_HTTPS_CERTIFICATE_KEY_FILE: /path/to/key.pem
   ```

3. **Désactiver le mode dev**
   ```yaml
   command:
     - start
     - --optimized
   ```

4. **Utiliser des secrets Docker**
   ```yaml
   secrets:
     - db_password
   ```

## 🌐 URLs importantes

- **Console Admin Keycloak** : http://localhost:8080
- **Realm Endpoint** : http://localhost:8080/realms/ecommerce
- **Token Endpoint** : http://localhost:8080/realms/ecommerce/protocol/openid-connect/token
- **Health Check** : http://localhost:8080/health/ready

## 📝 Prochaines étapes

1. ✅ Démarrer Docker Compose
2. ✅ Vérifier que Keycloak est accessible
3. ✅ Suivre `KEYCLOAK_SETUP_GUIDE.md` pour la configuration
4. ✅ Tester l'authentification avec le backend
5. ✅ Intégrer dans le frontend

## 💡 Conseils

- **Premier démarrage** : Keycloak peut prendre 1-2 minutes pour être complètement prêt
- **Logs** : Utilisez `docker-compose logs -f` pour suivre le démarrage
- **Persistence** : Les données sont sauvegardées dans des volumes Docker
- **Arrêt propre** : Toujours utiliser `docker-compose down` pour arrêter

## 🆘 Support

En cas de problème :
1. Vérifier les logs : `docker-compose logs -f`
2. Vérifier l'état : `docker-compose ps`
3. Consulter la documentation Keycloak : https://www.keycloak.org/documentation
