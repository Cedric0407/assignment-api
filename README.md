# MBDSMagascar2022_2023_api

# Gestion de rendu du devoir
## Description du projet
-Le projet vise à créer une plateforme permettant aux étudiants de soumettre leurs devoirs par matière et aux professeurs de les noter directement. Il est composé de trois espaces distincts : un espace dédié à l'administration, un espace réservé aux professeurs et un espace réservé aux étudiants.

## Contribution
### 05-Cédric
- Authentification avec JWT
- Drag and drop pour rendre un devoir non rendus en rendu
- Affichage des Assignments dans deux onglets séparés
- Amélioration du design du projet
- CRUD professeur, CRUD matière , CRUD assignment
- Page des listes et d'ajout de chaque modèle
- Filtre des devoirs par matière
- api

### 09-Tsiory
- Application des filtres et gestion des vues selon le rôle de l'utilisateur connecté( Admin, professeur ou étudiant)
- api
- pages des mise à jours de chaque modèle
- Ajout des informations du détails dans l' Assignement
- Ajout preview pdf dans l' Assignement
- gestion des erreurs dans l'app
- Déploiement et hébergement sur Render
- Vidéo de démonstration

## Mise en place du projet sur votre machine
### Back
- Copier le code sur le lien sur git: https://github.com/Cedric0407/assignment-api.git
- Executer la commande "npm install"
- Démarrer le serveur "node server.js"

### Front
- Copier le code sur le  lien sur git: https://github.com/Cedric0407/assignment-app.git
- Executer la commande "npm install"
- Lancer le projet "ng serve"
    Pour tester l' application, on a mis ces login:
- Login en tant qu' admin: admin@admin.com mdp:123456
- Login en tant qu' étudiant: tsiory@tsiory.com mdp:123456
- Login en tant que prof: richard@richard.com mdp:123456

### Remarque
- Le preview pdf ne marche pas si vous avez un logiciel de téléchargement tel que IDM sur votre machine

# Lien de la vidéo démo:
https://drive.google.com/file/d/1Fg6UgodqlKKIskqJzASsgCHrV4ZfelU3/view?usp=sharing
