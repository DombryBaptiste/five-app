# React Application

Application **React** créée avec **Vite**.

Le projet est conçu pour un **développement local rapide avec hot reload**.

---

# 🚀 Prérequis

Avant de lancer le projet, assure-toi d'avoir installé :

* Node.js **v22.x (LTS)**
* npm

Vérifier la version installée :

```
node -v
```

---

# 📦 Installation

Cloner le projet :

```
git clone <url-du-repository>
cd nom-du-projet
```

Installer les dépendances :

```
npm install
```

---

# 🧑‍💻 Lancer l'application en développement

```
npm run dev
```

L'application sera accessible à l'adresse :

```
http://localhost:5173
```

Le **hot reload** est activé : toute modification dans le code recharge automatiquement la page.

---

# 🏗️ Build de production

Pour générer la version optimisée de l'application :

```
npm run build
```

Les fichiers seront générés dans le dossier :

```
dist/
```

---

# 🐳 Déploiement avec Docker

Docker permet d'exécuter la version **production** de l'application dans un conteneur.

Le conteneur utilise :

- **Node.js** pour construire l'application
- **Nginx** pour servir les fichiers statiques générés

---

# 🚀 Construire et lancer l'image Docker

Construire l'image :

```bash
docker build -t react-vite-app .
```

Lancer le conteneur :

```bash
docker run -d -p 8080:80 --name react-vite-container react-vite-app
```

L'application sera accessible à l'adresse :

```
http://localhost:8080
```

---

# 🌍 Déploiement sur un serveur

Sur un serveur disposant de Docker :

```bash
docker build -t react-vite-app .
docker run -d -p 80:80 --restart always --name react-vite-container react-vite-app
```

L'application sera alors accessible sur :

```
http://<adresse-du-serveur>
```

---

# 📁 Structure du projet

```
project/
│
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
└── vite.config.js
```

---

# ⚙️ Scripts disponibles

| Commande        | Description                       |
| --------------- | --------------------------------- |
| npm run dev     | Lance le serveur de développement |
| npm run build   | Génère la version production      |
| npm run preview | Prévisualise le build             |
| npm install     | Installe les dépendances          |

---

# 🛠️ Technologies utilisées

* React
* Vite
* Node.js **v22 LTS**
* Docker
