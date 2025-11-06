# Configuration des Variables d'Environnement
 
 IMPOORTANT : Exceptionnellement les cles API seront données dans le .env pour le rendu
## Sécurité des Clés API

Dans ce projet on utilise des variables d'environnement pour protéger les clés API sensibles.

##  Installation Initiale

### 1. Copier le fichier template

```bash
cp .env.example .env
```

### 2. Remplir vos clés Firebase

Ouvrez le fichier `.env` et remplacez les valeurs par vos vraies clés Firebase :

```env
EXPO_PUBLIC_FIREBASE_API_KEY=votre_vraie_clé_api
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=votre-projet-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=votre-projet.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=votre_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=votre_measurement_id
```

### 3. Obtenir vos clés Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com)
2. Sélectionnez votre projet
3. Cliquez sur **Paramètres du projet**
4. Dans l'onglet **Général**, descendez à **Vos applications**
5. Cliquez sur **Configuration SDK** pour voir vos clés

### 4. Redémarrer Expo

Après avoir créé/modifié le fichier `.env`, redémarrez le serveur Expo :

```bash
# Arrêtez le serveur actuel (Ctrl+C)
# Puis relancez
npm start
```

## Comment ça fonctionne ?

### Variables d'environnement avec Expo

Expo utilise le préfixe `EXPO_PUBLIC_` pour exposer les variables d'environnement :

-  `EXPO_PUBLIC_FIREBASE_API_KEY` → accessible via `process.env.EXPO_PUBLIC_FIREBASE_API_KEY`
-  `FIREBASE_API_KEY` → **NON accessible** (pas de préfixe EXPO_PUBLIC_)

### Utilisation dans le code

Dans `src/services/firebase.ts` :

```typescript
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // ... autres variables
};
```

## Important
 Exceptionnellement les cles API seront données dans le .env pour le rendu

##  Configuration pour la production

Pour un build de production avec EAS :

```bash
# Configurez les variables d'environnement dans EAS
eas secret:create --name EXPO_PUBLIC_FIREBASE_API_KEY --value "votre_clé"
eas secret:create --name EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN --value "votre_domaine"
# ... etc pour toutes les variables
```

##  Dépannage

### Les variables ne sont pas chargées ?

1. Vérifiez que le fichier `.env` est à la racine du projet
2. Vérifiez que les variables commencent par `EXPO_PUBLIC_`
3. Redémarrez le serveur Expo (`npm start`)
4. Effacez le cache : `npx expo start --clear`

### Erreur "Firebase API key is invalid" ?

1. Vérifiez que vous avez bien copié les clés depuis Firebase Console
2. Assurez-vous qu'il n'y a pas d'espaces avant/après les valeurs
3. Vérifiez que les guillemets ne sont pas inclus dans les valeurs

##  Références

- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [Firebase Setup Guide](https://firebase.google.com/docs/web/setup)
