# SwapSpot

SwapSpot est une application web full-stack originale pour des etudiants qui veulent echanger des objets scolaires utiles entre eux. Un etudiant peut creer un compte, publier une annonce, envoyer une demande d’echange et voir les mises a jour en temps reel.

Ce projet a ete concu pour respecter les exigences du cours :

- Backend avec `Node.js`, `Express`, `MongoDB`, `JWT`, `Bcrypt`
- Frontend avec `React`
- Au moins 3 modeles : `User`, `Listing`, `SwapRequest`
- CRUD complet sur `Listing` et `SwapRequest`
- Evenements en temps reel avec WebSockets via `Socket.IO`
- Configuration de deploiement pour Render
- Pipeline CI optionnel avec GitHub Actions

## Idee du projet

Au lieu de refaire un gestionnaire de taches, cette application se concentre sur l’echange d’objets entre etudiants.

Exemples :

- Un etudiant publie une calculatrice a echanger
- Un autre etudiant propose des ecouteurs ou un cahier
- Le proprietaire accepte ou refuse la demande
- L’interface se met a jour en temps reel chez les utilisateurs connectes

## Fonctionnalites principales

### Authentification

- Inscription
- Connexion
- Recuperation de l’utilisateur courant avec `/api/auth/me`
- Hachage du mot de passe avec `bcryptjs`
- Protection des routes avec middleware JWT

### Modele 1 : User

Operations exigees par le projet :

- Inscription
- Connexion
- Recuperation des informations de l’utilisateur courant

### Modele 2 : Listing

CRUD complet :

- Creer une annonce
- Lire toutes les annonces et une seule annonce
- Modifier une annonce
- Supprimer une annonce

### Modele 3 : SwapRequest

CRUD complet :

- Creer une demande
- Lire mes demandes, les demandes recues et une demande precise
- Modifier le contenu ou le statut d’une demande
- Supprimer une demande

## Evenements en temps reel

L’application inclut plus de 2 evenements WebSocket :

- `listing:created`
- `listing:updated`
- `listing:deleted`
- `request:created`
- `request:updated`
- `request:deleted`
- `notification:new`

## Technologies utilisees

### Backend

- Express
- Mongoose
- JWT
- BcryptJS
- Socket.IO

### Frontend

- React
- React Router
- Socket.IO Client
- Vite

## Structure du projet

```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
frontend/
  src/
    api/
    components/
    context/
    pages/
    styles/
```

## Installation locale

### 1. Installer les dependances

```bash
npm install
npm run install:all
```

### 2. Configurer les variables d’environnement

Backend : creer `backend/.env`

```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/swapspot
JWT_SECRET=votre_secret_ici
CLIENT_URL=http://localhost:5173
```

Frontend : creer `frontend/.env`

```env
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
```

### 3. Lancer l’application

```bash
npm run dev
```

Frontend :

- [http://localhost:5173](http://localhost:5173)

Backend :

- [http://localhost:5001/api/health](http://localhost:5001/api/health)

## Routes API importantes

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Listings

- `GET /api/listings`
- `GET /api/listings/:id`
- `POST /api/listings`
- `PUT /api/listings/:id`
- `DELETE /api/listings/:id`

### Swap Requests

- `GET /api/requests`
- `GET /api/requests/incoming`
- `GET /api/requests/:id`
- `POST /api/requests`
- `PUT /api/requests/:id`
- `DELETE /api/requests/:id`

## Deploiement Render

### Service Web Backend

- Dossier racine : `backend`
- Commande de build : `npm install`
- Commande de demarrage : `npm start`

Variables d’environnement :

- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URL`

### Site statique Frontend

- Dossier racine : `frontend`
- Commande de build : `npm install && npm run build`
- Dossier de publication : `dist`

Variables d’environnement :

- `VITE_API_URL`
- `VITE_SOCKET_URL`

Vous pouvez aussi utiliser le fichier [render.yaml](/Users/barathiam/Documents/New%20project/render.yaml).

## Checklist pour la video

Dans votre video de remise, montrez :

- L’inscription et la connexion
- La creation d’une annonce
- La modification et la suppression d’une annonce
- La creation, la modification, l’acceptation, le refus et la suppression d’une demande d’echange
- Les mises a jour en temps reel dans deux fenetres du navigateur
- L’application deployee sur Render

## Notes pour la remise

- Ne jamais envoyer de vrais secrets
- Inclure vos liens de deploiement dans la remise finale
- Garder MongoDB Atlas ou votre connexion Render active
