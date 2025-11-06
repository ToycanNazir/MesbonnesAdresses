# Mes Bonnes Adresses

IMPORTANT : Exceptionnellement les cles API seront données dans le .env pour le rendu

Application mobile pour sauvegarder, gérer et partager vos adresses favorites.

## Fonctionnalités

### Gestion d'utilisateurs (25 pts)
-  Projet Firebase sécurisé avec gestion des droits
-  Inscription avec email/mot de passe
-  Connexion
-  Déconnexion
-  Gestion de photo de profil

### Carte (15 pts)
-  MapView centrée automatiquement sur la localisation de l'utilisateur
-  Affichage des marqueurs pour les adresses

### Création d'adresse (25 pts)
-  Option Privé / Publique
-  Nom, Photo, Description

### Suppression d'adresse (5 pts)
-  Suppression des adresses de l'utilisateur

### Visualisation des adresses (20 pts)
-  Mes adresses publiques et privées
-  Adresses publiques des autres utilisateurs

### Données des avis (10 pts)
-  Commentaires avec texte
-  Notation (étoiles)
-  Photos dans les commentaires

## Configuration

### Prérequis

- Node.js LTS (20.18.0 recommandé)
- npm ou yarn
- Expo CLI
- Compte Firebase
- Clés API Google Maps

### Installation

1. Cloner le projet
```bash
cd mes-bonnes-adresses
npm install
```

2. Configuration des variables d'environnement

**IMPORTANT** : Créez un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

Remplissez ensuite le fichier `.env` avec vos vraies clés Firebase (voir étape 3).

Pour plus de détails, consultez [ENV_SETUP.md](./ENV_SETUP.md)

3. Configuration Firebase

Créez un projet Firebase sur https://console.firebase.google.com

Activez :
- Authentication (Email/Password)
- Firestore Database
- Storage

Créez les règles de sécurité Firestore suivantes :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Addresses collection
    match /addresses/{addressId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Comments collection
    match /comments/{commentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

Règles de sécurité Storage :

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /addresses/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /comments/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

4. Configuration des clés API

Récupérez vos clés Firebase depuis la console Firebase et ajoutez-les dans le fichier `.env` :

```env
EXPO_PUBLIC_FIREBASE_API_KEY=votre_clé_api
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=votre_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=votre_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=votre_measurement_id
```


5. Configuration Google Maps

Obtenez des clés API Google Maps :
- iOS : https://developers.google.com/maps/documentation/ios-sdk/get-api-key
- Android : https://developers.google.com/maps/documentation/android-sdk/get-api-key

Ajoutez les clés dans `app.json` :
- iOS : `ios.config.googleMapsApiKey`
- Android : `android.config.googleMaps.apiKey`

### Lancer l'application

```bash
# Démarrer le serveur de développement
npm start

# Ou directement sur Android
npm run android

# Ou directement sur iOS (macOS requis)
npm run ios

# Ou sur le web
npm run web
```

## Tests

Pour + de details sur les tests voir 'TEST_DOCUMENTATION.md'

### Tests unitaires et fonctionnels
```bash
npm test
```

### Tests E2E
```bash
npm run test:e2e
```

### Storybook
```bash
npm run storybook
```

## Structure du projet

```
mes-bonnes-adresses/
├── src/
│   ├── components/        # Composants réutilisables
│   ├── contexts/          # Contexts React (Auth, etc.)
│   ├── navigation/        # Configuration de navigation
│   ├── screens/           # Écrans de l'application
│   ├── services/          # Services (Firebase, API)
│   ├── types/             # Types TypeScript
│   └── utils/             # Fonctions utilitaires
├── __tests__/             # Tests
├── assets/                # Images, fonts
├── App.tsx                # Point d'entrée
└── app.json               # Configuration Expo
```

## Technologies utilisées

- React Native avec Expo
- TypeScript
- Firebase (Auth, Firestore, Storage)
- React Navigation
- React Native Maps
- Expo Location
- Expo Image Picker
- Expo Camera
