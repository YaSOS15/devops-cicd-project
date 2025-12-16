# DevOps CI/CD Project 🚀

![CI Pipeline](https://github.com/YaSOS15/devops-cicd-project/actions/workflows/ci.yml/badge.svg)
![Docker Publish](https://github.com/YaSOS15/devops-cicd-project/actions/workflows/docker-publish.yml/badge.svg)
![Deploy](https://github.com/YaSOS15/devops-cicd-project/actions/workflows/deploy.yml/badge.svg)
![Docker Image](https://img.shields.io/docker/v/yasos15/devops-app?label=Docker&logo=docker)
![GitHub release](https://img.shields.io/github/v/release/YaSOS15/devops-cicd-project)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

Pipeline CI/CD complet avec GitHub Actions pour déployer une application Node.js.

---

## 🌐 Liens

- **Site web déployé** : [https://yasos15.github.io/devops-cicd-project/](https://yasos15.github.io/devops-cicd-project/)
- **Image Docker** : [yasos15/devops-app](https://hub.docker.com/r/yasos15/devops-app)

---

## 🚀 Technologies utilisées

- **Node.js** + Express - Backend API
- **Jest** + Supertest - Tests unitaires
- **Docker** - Containerisation
- **GitHub Actions** - CI/CD
- **GitHub Pages** - Hébergement
- **Docker Hub** - Registry d'images

---

## 📦 Installation locale

### Prérequis
- Node.js >= 18
- Docker (optionnel)

### Installation
```bash
# Cloner le repository
git clone https://github.com/YaSOS15/devops-cicd-project.git
cd devops-cicd-project

# Installer les dépendances
npm install
```

---

## 🧪 Tests
```bash
# Lancer les tests
npm test

# Tests avec couverture
npm run test:coverage
```

---

## ▶️ Lancer l'application

### Avec Node.js
```bash
npm start
```

L'application sera disponible sur **http://localhost:3000**

### Avec Docker
```bash
# Construire l'image
docker build -t devops-app .

# Lancer le conteneur
docker run -p 3000:3000 devops-app
