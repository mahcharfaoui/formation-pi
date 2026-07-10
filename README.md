# Plateforme Intelligente de Gestion des Formations & Certifications Professionnelles

## Architecture Microservices

Ce projet est une plateforme de gestion des formations et certifications basée sur une architecture microservices avec Spring Boot et Angular.

## Structure du Projet

```
plateforme-formations/
├── backend/                    # Backend Spring Boot
│   ├── eureka-server/         # Service Discovery (Port: 8761)
│   ├── api-gateway/           # API Gateway (Port: 8080)
│   ├── catalogue-service/     # Catalogue des formations (Port: 8081)
│   ├── user-service/          # Gestion des utilisateurs (Port: 8082)
│   ├── formateur-service/     # Gestion des formateurs (Port: 8083)
│   ├── session-service/       # Sessions et inscriptions (Port: 8084)
│   ├── quiz-service/          # Quiz et évaluations (Port: 8085)
│   ├── suivi-service/         # Suivi pédagogique (Port: 8086)
│   ├── certification-service/ # Certifications (Port: 8087)
│   └── ml-service/           # Recommandations IA (Port: 8088)
├── frontend/                   # Frontend Angular
├── kubernetes/                 # Configurations Kubernetes
├── jenkins/                    # Pipeline CI/CD
├── monitoring/                 # Prometheus & Grafana
└── docker-compose.yml         # Orchestration Docker
```

## Technologies Utilisées

### Backend
- Java 17
- Spring Boot 3.2.5
- Spring Cloud 2023.0.1
- PostgreSQL 15
- Redis (pour le rate limiting)
- Maven

### Frontend
- Angular 17
- Angular Material
- TypeScript

### DevOps
- Docker & Docker Compose
- Kubernetes
- Jenkins (CI/CD)
- Prometheus (Monitoring)
- Grafana (Dashboards)

## Modules Fonctionnels

### 1. Catalogue des Formations
- Gestion des formations (CRUD)
- Catégories et chapitres
- Recherche et filtrage

### 2. Gestion des Utilisateurs
- Profils apprenants
- Suivi des compétences
- Gestion administrative

### 3. Gestion des Formateurs
- CV et expertises
- Disponibilités
- Évaluations reçues

### 4. Inscriptions & Sessions
- Planification des sessions
- Gestion des inscriptions
- Suivi des places disponibles

### 5. Évaluations & Quiz
- Banque de questions
- Passation d'examens
- Calcul des scores

### 6. Suivi Pédagogique
- Progression en %
- Logs de lecture
- Avis et feedbacks

### 7. Certifications & Diplômes
- Génération de certificats
- Vérification de validité
- Archivage numérique

### 8. Recommandations IA
- Analyse des profils
- Suggestions de formations
- Prédiction de réussite

## Installation et Démarrage

### Prérequis
- Java 17+
- Node.js 18+
- Docker & Docker Compose
- kubectl (pour Kubernetes)
- Maven 3.8+

### Démarrage avec Docker Compose

```bash
# Cloner le dépôt
git clone https://github.com/votre-repo/plateforme-formations.git
cd plateforme-formations

# Démarrer tous les services
docker-compose up -d

# Vérifier les services
docker-compose ps
```

### Démarrage en Développement

```bash
# Backend - Démarrer chaque service séparément
cd backend/eureka-server
mvn spring-boot:run

# Dans un autre terminal
cd backend/api-gateway
mvn spring-boot:run

# Continuer pour chaque microservice...

# Frontend
cd frontend
npm install
npm start
```

## Accès aux Services

| Service | URL |
|---------|-----|
| API Gateway | http://localhost:8080 |
| Eureka Dashboard | http://localhost:8761 |
| Swagger UI | http://localhost:8081/swagger-ui.html |
| Frontend Angular | http://localhost:4200 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3000 |

## API Endpoints

### Catalogue
- GET /api/catalogue/formations
- POST /api/catalogue/formations
- GET /api/catalogue/formations/{id}
- PUT /api/catalogue/formations/{id}
- DELETE /api/catalogue/formations/{id}

### Utilisateurs
- GET /api/users/apprenants
- POST /api/users/apprenants
- GET /api/users/apprenants/{id}

### Formateurs
- GET /api/formateurs
- POST /api/formateurs
- GET /api/formateurs/{id}

### Sessions
- GET /api/sessions
- POST /api/sessions
- POST /api/sessions/{id}/inscriptions/apprenant/{apprenantId}

### Quiz
- GET /api/quiz
- POST /api/quiz
- GET /api/quiz/{id}/questions

### Suivi
- GET /api/suivi/apprenant/{id}/progressions
- POST /api/suivi/progressions

### Certifications
- GET /api/certifications
- POST /api/certifications
- GET /api/certifications/verifier/{numero}

### ML
- POST /api/ml/recommandations
- GET /api/ml/analyse/{apprenantId}

## Tests

```bash
# Tests unitaires
mvn test

# Tests d'intégration
mvn verify
```

## Pipeline CI/CD

Le pipeline Jenkins est configuré pour :
1. Compiler le code
2. Exécuter les tests unitaires
3. Analyser le code (SonarQube)
4. Construire les images Docker
5. Déployer sur Kubernetes

## Monitoring

### Prometheus
- Métriques Spring Boot Actuator
- métriques personnalisées

### Grafana
- Dashboards préconfigurés
- Alertes automatiques

## Auteurs

- Équipe de développement

## Licence

MIT
