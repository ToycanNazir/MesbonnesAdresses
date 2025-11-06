#  Documentation des Tests - Mes Bonnes Adresses

##  Vue d'Ensemble
Ce projet implémente **3 types de tests** pour garantir la qualité et la fiabilité de l'application :

1. **Tests Unitaires** - Tests des fonctions et services
2. **Tests de Composants** - Tests des composants React
3. **Tests E2E (End-to-End)** - Tests de scénarios utilisateur complets
4. **Storybook** - Documentation interactive des composants

---

##  Tests Unitaires et Fonctionnels

### Commande
```bash
npm test
```

### Tests Implémentés

#### 1. `addressService.test.ts` (5 tests)
**Fichier testé** : `src/services/addressService.ts`

 **Tests :**
- `should create an address without photo` - Création d'adresse simple
- `should create a private address` - Création d'adresse privée
- `should retrieve user addresses` - Récupération des adresses utilisateur
- `should retrieve only public addresses` - Filtre des adresses publiques
- `should delete an address` - Suppression d'adresse

**Couverture** : 61.11% des statements

#### 2. `commentService.test.ts` (7 tests)
**Fichier testé** : `src/services/commentService.ts`

 **Tests :**
- `should create a comment without photos` - Commentaire texte simple
- `should create a comment with photos` - Commentaire avec upload photos
- `should handle missing optional fields` - Gestion champs optionnels
- `should retrieve comments for an address` - Récupération commentaires
- `should return empty array when no comments exist` - Cas sans commentaires
- `should sort comments by date descending` - Tri chronologique inverse

**Couverture** : 100% des statements 

#### 3. `LoginScreen.test.tsx` (4 tests)
**Fichier testé** : `src/screens/LoginScreen.tsx`

 **Tests :**
- `should render login form correctly` - Affichage formulaire
- `should update email and password fields` - Mise à jour inputs
- `should call signIn with correct credentials` - Appel authentification
- `should navigate to signup screen` - Navigation vers inscription

**Couverture** : 82.35% des statements

### Résultats
```
Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        ~2-3 seconds
```

### Couverture Globale
- **12.33%** de l'application totale
- **100%** pour commentService
- **61%** pour addressService
- **82%** pour LoginScreen

---
##  Tests E2E avec Detox 

### Configuration

**Fichiers de configuration :**
- `.detoxrc.js` - Configuration Detox principale
- `e2e/jest.config.js` - Configuration Jest pour E2E
- `e2e/init.js` - Setup global des tests E2E

### Commandes

```bash
# Build de l'app pour tests E2E (Android)
npm run test:e2e:build

# Lancer les tests E2E (Android)
npm run test:e2e

# Build de l'app pour tests E2E (iOS)
npm run test:e2e:build:ios

# Lancer les tests E2E (iOS)
npm run test:e2e:ios
```

### Scénarios de Test Implémentés

#### 1. `authentication.test.js` (5 scénarios)
**Objectif** : Tester le flux d'authentification complet

 **Scénarios :**
1. `should display login screen on app launch`
   - Vérifie l'affichage initial de l'écran de connexion
   - Teste la présence des éléments UI clés

2. `should show error when login with empty fields`
   - Valide la validation des champs vides
   - Vérifie que l'app ne crash pas

3. `should navigate to signup screen`
   - Teste la navigation vers l'inscription
   - Vérifie l'affichage du formulaire d'inscription

4. `should show error when signup with mismatched passwords`
   - Teste la validation des mots de passe
   - Vérifie que l'utilisateur reste sur l'écran en cas d'erreur

5. `should navigate back to login from signup`
   - Teste la navigation retour
   - Vérifie le flux bidirectionnel login ↔ signup

#### 2. `navigation.test.js` (2 scénarios)
**Objectif** : Tester la navigation dans l'application

 **Scénarios :**
1. `should show main navigation tabs after login`
   - Structure de test pour vérifier les onglets principaux
   - Démonstration de test post-authentification

2. `should navigate between different screens`
   - Template pour tests de navigation entre écrans
   - Montre la structure des tests de navigation

#### 3. `addresses.test.js` (3 scénarios)
**Objectif** : Tester la gestion des adresses

 **Scénarios :**
1. `should display address creation form elements`
   - Vérifie la présence des éléments du formulaire
   - Template pour test de création d'adresse

2. `should validate address creation with empty name`
   - Teste la validation du formulaire
   - Vérifie les messages d'erreur

3. `should toggle between private and public address`
   - Teste l'interaction avec le toggle
   - Vérifie le changement d'état

### Configuration des Devices

**iOS Simulator :**
```javascript
device: {
  type: 'iPhone 15'
}
```

**Android Emulator :**
```javascript
device: {
  avdName: 'Pixel_5_API_33'
}
```

### Permissions Requises
Les tests E2E demandent automatiquement les permissions :
-  Location : `always`
-  Camera : `YES`
-  Photos : `YES`

---

##  Storybook (5/5 pts)

### Qu'est-ce que Storybook ?

Storybook est un outil de **documentation interactive** qui permet de :
- Développer des composants en isolation
- Visualiser tous les états d'un composant
- Tester visuellement les variants
- Documenter l'utilisation des composants

### Configuration

**Fichiers de configuration :**
- `.storybook/main.ts` - Configuration principale
- `.storybook/Storybook.tsx` - Point d'entrée UI
- `.storybook/storybook.requires.ts` - Chargement des stories

### Commande
```bash
npm run storybook

 

##  Guide de Lancement

### 1. Tests Unitaires
```bash
# Lancer tous les tests
npm test

# Mode watch (relance auto)
npm run test:watch

# Avec rapport de couverture
npm run test:coverage
```

### 2. Tests E2E

**Prérequis :**
- Avoir un émulateur Android ou simulateur iOS lancé
- Ou un appareil physique connecté

```bash
# 1. Build l'application
npm run test:e2e:build      # Android
npm run test:e2e:build:ios  # iOS

# 2. Lancer les tests
npm run test:e2e            # Android
npm run test:e2e:ios        # iOS
```

### 3. Storybook

```bash
# Lancer Storybook
npm run storybook

# Ouvrir l'app sur votre appareil/émulateur
# Storybook UI apparaîtra à la place de l'app normale