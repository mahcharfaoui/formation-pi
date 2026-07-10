# Script de seed de formations et chapitres avec vraies vidéos YouTube
$GATEWAY = "http://localhost:8090"

function Add-Formation($body) {
    $r = Invoke-RestMethod -Uri "$GATEWAY/api/catalogue/formations" -Method Post -Body ($body | ConvertTo-Json -Depth 3) -ContentType "application/json"
    $id = $r.id
    Write-Host "  Formation créée: $($body.titre) -> id=$id"
    return $id
}

function Add-Chapitre($formationId, $body) {
    $body.formation = @{id = $formationId}
    $r = Invoke-RestMethod -Uri "$GATEWAY/api/catalogue/chapitres" -Method Post -Body ($body | ConvertTo-Json -Depth 3) -ContentType "application/json"
    $id = $r.id
    Write-Host "    Chapitre créé: $($body.titre) -> id=$id"
    return $id
}

Write-Host "=== SEED DES FORMATIONS ET CHAPITRES ===" -ForegroundColor Cyan

# ============================================================
# JAVA
# ============================================================
Write-Host "`n--- JAVA ---" -ForegroundColor Yellow

# Formation 1: Java Fundamentals
$f1 = Add-Formation @{
    titre="Java Fundamentals - Les bases de Java"
    description="Apprenez les fondamentaux de Java : variables, boucles, classes, objets, heritage, interfaces et collections. Formation complete pour debutants."
    tarif=0; dureeHeures=30; niveau="DEBUTANT"; active=$true
    categorie=@{id=1}; competencesRequises="Aucun prerequis"
}

Add-Chapitre $f1 @{
    titre="Introduction a Java et JDK"
    description="Installation du JDK, premiers pas avec Java"
    ordre=1; dureeMinutes=45; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=4ZbIZt8BsgQ"
}

Add-Chapitre $f1 @{
    titre="Variables et types de donnees"
    description="Variables primitives, String, conversion de types"
    ordre=2; dureeMinutes=50; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=T1hBdV4VH5o"
}

Add-Chapitre $f1 @{
    titre="Structures de controle"
    description="Conditions if/else, switch, boucles for/while"
    ordre=3; dureeMinutes=55; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=W_iL0Gp3ldg"
}

Add-Chapitre $f1 @{
    titre="Programmation orientee objet"
    description="Classes, objets, constructeurs, encapsulation"
    ordre=4; dureeMinutes=60; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=1pM-JirZcI8"
}

Add-Chapitre $f1 @{
    titre="Heritage et Polymorphisme"
    description="extends, super, overriding, classes abstraites"
    ordre=5; dureeMinutes=55; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=0rLQ6DBkhtA"
}

Add-Chapitre $f1 @{
    titre="Interfaces et Classes abstraites"
    description="Implementations, contrat, difference interface/abstract"
    ordre=6; dureeMinutes=40; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=pdw4ARBdhYI"
}

Add-Chapitre $f1 @{
    titre="Collections Java"
    description="List, Set, Map, ArrayList, HashMap, Stream API"
    ordre=7; dureeMinutes=65; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=KtM9vj6v3Fk"
}

Add-Chapitre $f1 @{
    titre="Exercices pratiques"
    description="Exercices pour mettre en pratique les concepts appris"
    ordre=8; dureeMinutes=90; typeContenu="EXERCICE"
    contenuUrl="https://github.com/JavaCourse/exercices-bases"
}

# Formation 2: Spring Boot
$f2 = Add-Formation @{
    titre="Spring Boot - Developpement d'applications web"
    description="Maitrisez Spring Boot : REST APIs, JPA, Security, Microservices. Projets pratiques inclus."
    tarif=0; dureeHeures=40; niveau="INTERMEDIAIRE"; active=$true
    categorie=@{id=1}; competencesRequises="Bases de Java requises"
}

Add-Chapitre $f2 @{
    titre="Introduction a Spring Boot"
    description="Spring Initializr, structure du projet, configuration"
    ordre=1; dureeMinutes=45; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=9SGDpanrc8U"
}

Add-Chapitre $f2 @{
    titre="REST APIs avec Spring MVC"
    description="Controllers, endpoints, JSON, validation"
    ordre=2; dureeMinutes=60; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=Thxu8e7SJrk"
}

Add-Chapitre $f2 @{
    titre="Spring Data JPA"
    description="Entity, Repository, requetes derivees, @Query"
    ordre=3; dureeMinutes=65; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=8SGI_XS5OPw"
}

Add-Chapitre $f2 @{
    titre="Spring Security et JWT"
    description="Authentification, autorisation, tokens JWT"
    ordre=4; dureeMinutes=70; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=KxqlJblhzfI"
}

Add-Chapitre $f2 @{
    titre="Microservices avec Spring Cloud"
    description="Eureka, Gateway, Load Balancing, Feign"
    ordre=5; dureeMinutes=80; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=y8IQb4ofjDo"
}

Add-Chapitre $f2 @{
    titre="Projet final: API REST complete"
    description="Construction d'une API REST complete avec tests"
    ordre=6; dureeMinutes=120; typeContenu="EXERCICE"
    contenuUrl="https://github.com/SpringBootCourse/projet-final"
}

# Formation 3: Java Avance
$f3 = Add-Formation @{
    titre="Java Avance - Multithreading et Performance"
    description="Multithreading, concurrence, streams paralleles, optimisation JVM."
    tarif=0; dureeHeures=25; niveau="AVANCE"; active=$true
    categorie=@{id=1}; competencesRequises="Java intermediaire requis"
}

Add-Chapitre $f3 @{
    titre="Threads et Runnable"
    description="Creation de threads, cycle de vie, etats"
    ordre=1; dureeMinutes=50; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=eQk5AWcZS8Q"
}

Add-Chapitre $f3 @{
    titre="Synchronisation et Locks"
    description="synchronized, ReentrantLock, volatile"
    ordre=2; dureeMinutes=60; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=8c1b9jYy0bE"
}

Add-Chapitre $f3 @{
    titre="Executors et Thread Pools"
    description="ExecutorService, ForkJoinPool, CompletableFuture"
    ordre=3; dureeMinutes=55; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=GysRYKG7kds"
}

Add-Chapitre $f3 @{
    titre="Streams paralleles et Optional"
    description="parallelStream, performance, Optional API"
    ordre=4; dureeMinutes=45; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=0rLQ6DBkhtA"
}

# ============================================================
# WEB
# ============================================================
Write-Host "`n--- WEB ---" -ForegroundColor Yellow

$f4 = Add-Formation @{
    titre="Angular 17 - Developpement Frontend Moderne"
    description="Apprenez Angular 17 : components, services, routing, forms, HttpClient. Formation complete avec projet pratique."
    tarif=0; dureeHeures=35; niveau="INTERMEDIAIRE"; active=$true
    categorie=@{id=5}; competencesRequises="Bases de HTML/CSS/JavaScript"
}

Add-Chapitre $f4 @{
    titre="Introduction a Angular"
    description="Architecture, CLI, structure du projet"
    ordre=1; dureeMinutes=45; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=3qBXWUpoPHo"
}

Add-Chapitre $f4 @{
    titre="Components et Templates"
    description="Creation de components, data binding, directives"
    ordre=2; dureeMinutes=60; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=Fdf5aTYRW0E"
}

Add-Chapitre $f4 @{
    titre="Services et Dependency Injection"
    description="Services, DI, HttpClient, RxJS Observables"
    ordre=3; dureeMinutes=55; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=9RGt7mBtlG4"
}

Add-Chapitre $f4 @{
    titre="Routing et Navigation"
    description="RouterModule, routes, guards, lazy loading"
    ordre=4; dureeMinutes=50; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=NeYzY6LOMvg"
}

Add-Chapitre $f4 @{
    titre="Forms : Template et Reactive"
    description="Template-driven forms, ReactiveForms, validation"
    ordre=5; dureeMinutes=60; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=8k4CTbP7m3A"
}

Add-Chapitre $f4 @{
    titre="Projet : Application de gestion de taches"
    description="Construction d'une application complete avec Angular"
    ordre=6; dureeMinutes=120; typeContenu="EXERCICE"
    contenuUrl="https://github.com/AngularCourse/angular-todo"
}

$f5 = Add-Formation @{
    titre="HTML5 & CSS3 - Les fondamentaux du Web"
    description="Maitrisez HTML5 et CSS3 : balises semantiques, flexbox, grid, animations, responsive design."
    tarif=0; dureeHeures=20; niveau="DEBUTANT"; active=$true
    categorie=@{id=5}; competencesRequises="Aucun prerequis"
}

Add-Chapitre $f5 @{
    titre="Structure HTML5 semantique"
    description="header, nav, main, section, article, footer"
    ordre=1; dureeMinutes=40; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=UB1O30fR-EE"
}

Add-Chapitre $f5 @{
    titre="Flexbox et Grid CSS"
    description="Mise en page moderne avec Flexbox et CSS Grid"
    ordre=2; dureeMinutes=55; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=3elGSZSWTbM"
}

Add-Chapitre $f5 @{
    titre="Responsive Design"
    description="Media queries, mobile-first, breakpoints"
    ordre=3; dureeMinutes=45; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=srvUrASNj0s"
}

Add-Chapitre $f5 @{
    titre="Animations CSS"
    description="Transitions, animations keyframes, transform"
    ordre=4; dureeMinutes=40; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=YszONjKpgg4"
}

$f6 = Add-Formation @{
    titre="JavaScript Moderne (ES6+)"
    description="JavaScript moderne : ES6+, async/await, modules, Promises, closures, manipulation DOM."
    tarif=0; dureeHeures=30; niveau="DEBUTANT"; active=$true
    categorie=@{id=5}; competencesRequises="Bases HTML/CSS"
}

Add-Chapitre $f6 @{
    titre="Fondamentaux JS et ES6"
    description="Variables let/const, fonctions flechees, destructuration"
    ordre=1; dureeMinutes=50; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=W6NZfCO5SIk"
}

Add-Chapitre $f6 @{
    titre="Manipulation du DOM"
    description="querySelector, evenements, creation elements"
    ordre=2; dureeMinutes=55; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=0ik6X4DJKCc"
}

Add-Chapitre $f6 @{
    titre="Promises et Async/Await"
    description="Callbacks, Promises, async/await, fetch API"
    ordre=3; dureeMinutes=60; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=DHjqpvDnNPE"
}

Add-Chapitre $f6 @{
    titre="Modules JavaScript"
    description="import, export, modules ES6, bundlers"
    ordre=4; dureeMinutes=40; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=cRHQNNcYf6s"
}

# ============================================================
# DEVOPS
# ============================================================
Write-Host "`n--- DEVOPS ---" -ForegroundColor Yellow

$f7 = Add-Formation @{
    titre="Docker - Containerisation"
    description="Maitrisez Docker : images, conteneurs, Docker Compose, Dockerfile, volumes, networking."
    tarif=0; dureeHeures=25; niveau="DEBUTANT"; active=$true
    categorie=@{id=2}; competencesRequises="Bases Linux/terminal"
}

Add-Chapitre $f7 @{
    titre="Introduction a Docker"
    description="Images, conteneurs, Docker Hub, commandes de base"
    ordre=1; dureeMinutes=45; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=3c-iBn73dDE"
}

Add-Chapitre $f7 @{
    titre="Dockerfile et creation d'images"
    description="FROM, RUN, COPY, CMD, multi-stage builds"
    ordre=2; dureeMinutes=55; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=Gjnup-PuquQ"
}

Add-Chapitre $f7 @{
    titre="Docker Compose"
    description="Services, volumes, networks, depends_on"
    ordre=3; dureeMinutes=60; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=HG6yIy6pNtA"
}

Add-Chapitre $f7 @{
    titre="Volumes et Stockage"
    description="Volumes, bind mounts, tmpfs, gestion des donnees"
    ordre=4; dureeMinutes=40; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=5cMvvhY_9xY"
}

Add-Chapitre $f7 @{
    titre="Networking Docker"
    description="Reseaux bridge, host, overlay, communication entre conteneurs"
    ordre=5; dureeMinutes=50; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=oN2PqYME9EM"
}

$f8 = Add-Formation @{
    titre="CI/CD avec GitLab CI et GitHub Actions"
    description="Automatisation du build, test et deploiement avec GitLab CI et GitHub Actions."
    tarif=0; dureeHeures=20; niveau="INTERMEDIAIRE"; active=$true
    categorie=@{id=2}; competencesRequises="Bases Git et Docker"
}

Add-Chapitre $f8 @{
    titre="Introduction au CI/CD"
    description="Pipeline, stages, jobs, integration continue"
    ordre=1; dureeMinutes=40; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=CPbvxsl5VQo"
}

Add-Chapitre $f8 @{
    titre="GitLab CI - Configuration"
    description=".gitlab-ci.yml, runners, artifacts, cache"
    ordre=2; dureeMinutes=55; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=7p1Q9J7a2TY"
}

Add-Chapitre $f8 @{
    titre="GitHub Actions"
    description="Workflows, events, matrix builds, deployment"
    ordre=3; dureeMinutes=50; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=R8_veQiYBjI"
}

Add-Chapitre $f8 @{
    titre="Deploiement automatise"
    description="Deploiement vers Docker Hub, serveur, cloud"
    ordre=4; dureeMinutes=45; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=1Z6TqyJ-cpw"
}

$f9 = Add-Formation @{
    titre="Kubernetes - Orchestration de Conteneurs"
    description="Kubernetes : Pods, Deployments, Services, Ingress, Helm. Formation pratique avec minikube."
    tarif=0; dureeHeures=35; niveau="AVANCE"; active=$true
    categorie=@{id=2}; competencesRequises="Docker maitrise"
}

Add-Chapitre $f9 @{
    titre="Architecture Kubernetes"
    description="Master, nodes, etcd, kubelet, API server"
    ordre=1; dureeMinutes=50; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=7bA0Kc5H4qM"
}

Add-Chapitre $f9 @{
    titre="Pods et Deployments"
    description="Creation pods, replicasets, scaling, rolling update"
    ordre=2; dureeMinutes=60; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=1Lp8mD8R8Is"
}

Add-Chapitre $f9 @{
    titre="Services et Networking"
    description="ClusterIP, NodePort, LoadBalancer, Ingress"
    ordre=3; dureeMinutes=55; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=T4fg-eTKK5U"
}

Add-Chapitre $f9 @{
    titre="ConfigMaps et Secrets"
    description="Configuration decentralisee, variables d'environnement"
    ordre=4; dureeMinutes=40; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=0SYj7vP3TqY"
}

Add-Chapitre $f9 @{
    titre="Helm - Le package manager K8s"
    description="Charts, templates, values, deploiement avec Helm"
    ordre=5; dureeMinutes=50; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=fy8SHvNZThE"
}

# ============================================================
# CLOUD
# ============================================================
Write-Host "`n--- CLOUD ---" -ForegroundColor Yellow

$f10 = Add-Formation @{
    titre="AWS Cloud Practitioner"
    description="Fondamentaux AWS : EC2, S3, RDS, Lambda, IAM. Preparation certification Cloud Practitioner."
    tarif=0; dureeHeures=30; niveau="DEBUTANT"; active=$true
    categorie=@{id=3}; competencesRequises="Aucun prerequis"
}

Add-Chapitre $f10 @{
    titre="Introduction au Cloud AWS"
    description="Regions, zones de disponibilite, services AWS"
    ordre=1; dureeMinutes=45; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=3XFODdaT9YI"
}

Add-Chapitre $f10 @{
    titre="EC2 - Compute"
    description="Instances, AMI, security groups, load balancers"
    ordre=2; dureeMinutes=60; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=g3SliC_JZn8"
}

Add-Chapitre $f10 @{
    titre="S3 - Stockage"
    description="Buckets, objets, policies, versioning, lifecycle"
    ordre=3; dureeMinutes=55; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=e6w9LwZJFIA"
}

Add-Chapitre $f10 @{
    titre="RDS - Bases de donnees"
    description="RDS MySQL/PostgreSQL, backups, multi-AZ, read replicas"
    ordre=4; dureeMinutes=50; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=JDk5qI1b3Qs"
}

Add-Chapitre $f10 @{
    titre="IAM - Securite"
    description="Utilisateurs, groupes, roles, policies, best practices"
    ordre=5; dureeMinutes=55; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=1MfubM1qN5A"
}

Add-Chapitre $f10 @{
    titre="Lambda - Serverless"
    description="Fonctions serverless, triggers, integration services"
    ordre=6; dureeMinutes=45; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=eOBq__h4OJ4"
}

$f11 = Add-Formation @{
    titre="Google Cloud Platform - Debutant a Avance"
    description="GCP : Compute Engine, GKE, Cloud Storage, BigQuery, Cloud Functions."
    tarif=0; dureeHeures=28; niveau="INTERMEDIAIRE"; active=$true
    categorie=@{id=3}; competencesRequises="Bases cloud computing"
}

Add-Chapitre $f11 @{
    titre="Introduction a GCP"
    description="Projets, billing, console, Cloud Shell"
    ordre=1; dureeMinutes=40; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=jpno8FSqpc8"
}

Add-Chapitre $f11 @{
    titre="Compute Engine"
    description="VM instances, templates, managed groups, snapshots"
    ordre=2; dureeMinutes=55; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=3bHISFUKgLY"
}

Add-Chapitre $f11 @{
    titre="GKE - Kubernetes Engine"
    description="Clusters Kubernetes, node pools, deploiement"
    ordre=3; dureeMinutes=60; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=3TBx7qIYhRk"
}

Add-Chapitre $f11 @{
    titre="Cloud Storage et BigQuery"
    description="Buckets, transfert, BigQuery pour l'analytics"
    ordre=4; dureeMinutes=50; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=8n5v_2TfObw"
}

# ============================================================
# DATA SCIENCE
# ============================================================
Write-Host "`n--- DATA SCIENCE ---" -ForegroundColor Yellow

$f12 = Add-Formation @{
    titre="Python pour la Data Science"
    description="Python applique a la data science : pandas, numpy, matplotlib, seaborn. Analyse et visualisation de donnees."
    tarif=0; dureeHeures=35; niveau="DEBUTANT"; active=$true
    categorie=@{id=4}; competencesRequises="Aucun prerequis"
}

Add-Chapitre $f12 @{
    titre="Fondamentaux Python"
    description="Variables, listes, dictionnaires, fonctions, comprehension"
    ordre=1; dureeMinutes=60; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=rfscVS0vtbw"
}

Add-Chapitre $f12 @{
    titre="NumPy - Calcul numerique"
    description="Arrays, operations matricielles, broadcasting"
    ordre=2; dureeMinutes=55; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=QUT1V3GSc8o"
}

Add-Chapitre $f12 @{
    titre="Pandas - Manipulation de donnees"
    description="DataFrames, Series, import/export, nettoyage"
    ordre=3; dureeMinutes=65; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=vmEHCJofslg"
}

Add-Chapitre $f12 @{
    titre="Matplotlib et Seaborn"
    description="Graphiques, histogrammes, boxplots, heatmaps"
    ordre=4; dureeMinutes=50; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=OZOOLe2X0Uw"
}

Add-Chapitre $f12 @{
    titre="Projet : Analyse d'un dataset"
    description="Analyse exploratoire complete d'un jeu de donnees reel"
    ordre=5; dureeMinutes=90; typeContenu="EXERCICE"
    contenuUrl="https://github.com/DataScienceCourse/projet-analyse"
}

$f13 = Add-Formation @{
    titre="Machine Learning avec Scikit-Learn"
    description="Algorithmes de ML : regression, classification, clustering, SVM, arbres de decision."
    tarif=0; dureeHeures=40; niveau="INTERMEDIAIRE"; active=$true
    categorie=@{id=4}; competencesRequises="Python et statistiques de base"
}

Add-Chapitre $f13 @{
    titre="Introduction au Machine Learning"
    description="Types d'apprentissage, pipeline ML, train/test split"
    ordre=1; dureeMinutes=50; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=7gAZh2Q7Gxg"
}

Add-Chapitre $f13 @{
    titre="Regression lineaire et polynomiale"
    description="Regression, evaluation, overfitting, regularisation"
    ordre=2; dureeMinutes=60; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=4qVRByAd2lo"
}

Add-Chapitre $f13 @{
    titre="Classification : KNN, SVM, Arbres"
    description="Algorithmes de classification, matrice de confusion"
    ordre=3; dureeMinutes=65; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=JcI5E2Ng6r4"
}

Add-Chapitre $f13 @{
    titre="Clustering avec K-Means"
    description="Apprentissage non supervise, elbow method, silouhette"
    ordre=4; dureeMinutes=50; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=4b5d3MU3h10"
}

Add-Chapitre $f13 @{
    titre="Projet : Prediction de prix"
    description="Projet complet de prediction avec un dataset reel"
    ordre=5; dureeMinutes=120; typeContenu="EXERCICE"
    contenuUrl="https://github.com/MachineLearningCourse/projet-prediction"
}

$f14 = Add-Formation @{
    titre="Deep Learning avec TensorFlow"
    description="Reseaux de neurones, CNN, RNN, TensorFlow, Keras. Formation avancee en deep learning."
    tarif=0; dureeHeures=45; niveau="AVANCE"; active=$true
    categorie=@{id=4}; competencesRequises="Machine Learning intermediaire"
}

Add-Chapitre $f14 @{
    titre="Introduction au Deep Learning"
    description="Perceptron, activation functions, backpropagation"
    ordre=1; dureeMinutes=55; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=VyWAvY2CF9c"
}

Add-Chapitre $f14 @{
    titre="TensorFlow et Keras"
    description="Modele Sequential, API fonctionnelle, callbacks"
    ordre=2; dureeMinutes=60; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=6_2hzRopPbQ"
}

Add-Chapitre $f14 @{
    titre="CNN - Reseaux de neurones convolutionnels"
    description="Convolution, pooling, architectures classiques"
    ordre=3; dureeMinutes=65; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=YRhxdVk_sIs"
}

Add-Chapitre $f14 @{
    titre="RNN et LSTM"
    description="Reseaux recurrents, LSTM, GRU, traitement de sequences"
    ordre=4; dureeMinutes=60; typeContenu="VIDEO"
    videoUrl="https://www.youtube.com/watch?v=WCUNPb-5EYI"
}

Add-Chapitre $f14 @{
    titre="Projet : Classification d'images"
    description="Construction d'un CNN pour la classification d'images"
    ordre=5; dureeMinutes=120; typeContenu="EXERCICE"
    contenuUrl="https://github.com/DeepLearningCourse/cnn-image-classification"
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  SEED COMPLET" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
