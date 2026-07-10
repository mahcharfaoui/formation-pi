$G = "http://localhost:8090"

function Add-Quiz($body) {
    Start-Sleep -Seconds 1
    $r = Invoke-RestMethod -Uri "$G/api/quiz" -Method Post -Body ($body | ConvertTo-Json -Depth 3) -ContentType "application/json"
    Write-Host "  Quiz: $($r.titre) -> id=$($r.id)"
    return $r.id
}

function Add-Question($quizId, $body) {
    $body.quizId = $quizId
    Start-Sleep -Seconds 1
    $r = Invoke-RestMethod -Uri "$G/api/quiz/questions" -Method Post -Body ($body | ConvertTo-Json -Depth 3) -ContentType "application/json"
    Write-Host "    Q: $($r.enonce)"
    return $r.id
}

Write-Host "=== SEED DES QUIZ ===" -ForegroundColor Cyan

# ============================================================
# JAVA FUNDAMENTALS (formation 3)
# ============================================================
Write-Host "`n--- Java Fundamentals ---" -ForegroundColor Yellow

$qid = Add-Quiz @{
    titre="Quiz Java - Les bases"
    description="Testez vos connaissances sur les fondamentaux de Java"
    formationId=3; chapitreId=1; dureeMinutes=15; scoreMinimum=60
}
Add-Question $qid @{enonce="Quel est le type primitif pour un nombre decimal en Java ?"; type="QCM"; points=10; reponseCorrecte="double"; choixProposes=@("double","int","String","boolean")}
Add-Question $qid @{enonce="Quel mot-cle permet de creer un objet en Java ?"; type="QCM"; points=10; reponseCorrecte="new"; choixProposes=@("new","class","this","static")}
Add-Question $qid @{enonce="Java est un langage compile et interprete"; type="VRAI_FAUX"; points=10; reponseCorrecte="Vrai"; choixProposes=@("Vrai","Faux")}
Add-Question $qid @{enonce="Quel est le point d'entree d'un programme Java ?"; type="REPONSE_COURTE"; points=10; reponseCorrecte="main"}
Add-Question $qid @{enonce="Quelle est la taille d'un int en Java ?"; type="QCM"; points=10; reponseCorrecte="32 bits"; choixProposes=@("8 bits","16 bits","32 bits","64 bits")}

$qid = Add-Quiz @{
    titre="Quiz POO Java"
    description="Testez la programmation orientee objet en Java"
    formationId=3; chapitreId=4; dureeMinutes=20; scoreMinimum=70
}
Add-Question $qid @{enonce="Quel principe cache les donnees d'un objet ?"; type="QCM"; points=10; reponseCorrecte="Encapsulation"; choixProposes=@("Heritage","Polymorphisme","Encapsulation","Abstraction")}
Add-Question $qid @{enonce="Le mot-cle 'extends' permet de creer une interface"; type="VRAI_FAUX"; points=10; reponseCorrecte="Faux"; choixProposes=@("Vrai","Faux")}
Add-Question $qid @{enonce="Quel mot-cle permet d'acceder a la classe parente ?"; type="REPONSE_COURTE"; points=10; reponseCorrecte="super"}
Add-Question $qid @{enonce="Quel type de polymorphisme est base sur l'heritage ?"; type="QCM"; points=10; reponseCorrecte="Dynamique"; choixProposes=@("Statique","Dynamique","Parametrique","Ad-hoc")}
Add-Question $qid @{enonce="Une classe abstraite ne peut pas etre instanciee"; type="VRAI_FAUX"; points=10; reponseCorrecte="Vrai"; choixProposes=@("Vrai","Faux")}

# ============================================================
# SPRING BOOT (formation 4)
# ============================================================
Write-Host "`n--- Spring Boot ---" -ForegroundColor Yellow

$qid = Add-Quiz @{
    titre="Quiz Spring Boot - Fondamentaux"
    description="Testez vos connaissances sur Spring Boot"
    formationId=4; chapitreId=9; dureeMinutes=15; scoreMinimum=60
}
Add-Question $qid @{enonce="Quelle annotation demarre une application Spring Boot ?"; type="QCM"; points=10; reponseCorrecte="@SpringBootApplication"; choixProposes=@("@SpringBootApplication","@Configuration","@EnableAutoConfiguration","@SpringApplication")}
Add-Question $qid @{enonce="Quel est le port par defaut de Spring Boot ?"; type="QCM"; points=10; reponseCorrecte="8080"; choixProposes=@("8080","8081","80","443")}
Add-Question $qid @{enonce="Spring Boot utilise le serveur integre Tomcat"; type="VRAI_FAUX"; points=10; reponseCorrecte="Vrai"; choixProposes=@("Vrai","Faux")}
Add-Question $qid @{enonce="Quel fichier contient la configuration Spring Boot ?"; type="REPONSE_COURTE"; points=10; reponseCorrecte="application.yml"}

$qid = Add-Quiz @{
    titre="Quiz Spring Data JPA"
    description="Testez la couche persistance avec JPA"
    formationId=4; chapitreId=11; dureeMinutes=15; scoreMinimum=60
}
Add-Question $qid @{enonce="Quelle annotation definit une entite JPA ?"; type="QCM"; points=10; reponseCorrecte="@Entity"; choixProposes=@("@Entity","@Table","@Column","@Id")}
Add-Question $qid @{enonce="Quelle annotation marque la cle primaire ?"; type="QCM"; points=10; reponseCorrecte="@Id"; choixProposes=@("@Id","@PrimaryKey","@Pk","@GeneratedValue")}
Add-Question $qid @{enonce="@GeneratedValue permet de generer automatiquement la valeur d'une colonne"; type="VRAI_FAUX"; points=10; reponseCorrecte="Vrai"; choixProposes=@("Vrai","Faux")}
Add-Question $qid @{enonce="Quelle interface etend JpaRepository ?"; type="REPONSE_COURTE"; points=10; reponseCorrecte="CrudRepository"}

# ============================================================
# ANGULAR (formation 6)
# ============================================================
Write-Host "`n--- Angular 17 ---" -ForegroundColor Yellow

$qid = Add-Quiz @{
    titre="Quiz Angular - Components"
    description="Testez Angular Components et Templates"
    formationId=6; chapitreId=20; dureeMinutes=15; scoreMinimum=60
}
Add-Question $qid @{enonce="Quelle annotation definit un component Angular ?"; type="QCM"; points=10; reponseCorrecte="@Component"; choixProposes=@("@Component","@Directive","@NgModule","@Injectable")}
Add-Question $qid @{enonce="Quelle syntaxe permet le data binding unidirectionnel ?"; type="QCM"; points=10; reponseCorrecte="{{ }}"; choixProposes=@("{{ }}","[ ]","( )","*")}
Add-Question $qid @{enonce="NgFor est une directive structurelle"; type="VRAI_FAUX"; points=10; reponseCorrecte="Vrai"; choixProposes=@("Vrai","Faux")}
Add-Question $qid @{enonce="Quel decorateur permet de passer des donnees d'un parent a un enfant ?"; type="REPONSE_COURTE"; points=10; reponseCorrecte="@Input"}

$qid = Add-Quiz @{
    titre="Quiz Angular - Services et DI"
    description="Testez les services et l injection de dependances"
    formationId=6; chapitreId=21; dureeMinutes=15; scoreMinimum=60
}
Add-Question $qid @{enonce="Quelle annotation rend une classe injectable ?"; type="QCM"; points=10; reponseCorrecte="@Injectable"; choixProposes=@("@Injectable","@Service","@Component","@Inject")}
Add-Question $qid @{enonce="RxJS utilise des Observables pour la programmation asynchrone"; type="VRAI_FAUX"; points=10; reponseCorrecte="Vrai"; choixProposes=@("Vrai","Faux")}
Add-Question $qid @{enonce="Quelle methode d'Observable ecoute les emissions ?"; type="QCM"; points=10; reponseCorrecte="subscribe"; choixProposes=@("subscribe","listen","on","emit")}
Add-Question $qid @{enonce="Quel module permet les requetes HTTP dans Angular ?"; type="REPONSE_COURTE"; points=10; reponseCorrecte="HttpClientModule"}

# ============================================================
# DOCKER (formation 14)
# ============================================================
Write-Host "`n--- Docker ---" -ForegroundColor Yellow

$qid = Add-Quiz @{
    titre="Quiz Docker - Fondamentaux"
    description="Testez vos connaissances sur Docker"
    formationId=14; chapitreId=45; dureeMinutes=15; scoreMinimum=60
}
Add-Question $qid @{enonce="Quelle commande liste les conteneurs en cours d execution ?"; type="QCM"; points=10; reponseCorrecte="docker ps"; choixProposes=@("docker ps","docker list","docker run","docker status")}
Add-Question $qid @{enonce="Quel fichier definit les instructions de construction d une image ?"; type="QCM"; points=10; reponseCorrecte="Dockerfile"; choixProposes=@("Dockerfile","docker-compose.yml","Docker.conf","image.yml")}
Add-Question $qid @{enonce="Docker Compose permet de gerer plusieurs conteneurs"; type="VRAI_FAUX"; points=10; reponseCorrecte="Vrai"; choixProposes=@("Vrai","Faux")}
Add-Question $qid @{enonce="Quelle instruction Dockerfile copie des fichiers depuis l hote ?"; type="REPONSE_COURTE"; points=10; reponseCorrecte="COPY"}

# ============================================================
# AWS (formation 10)
# ============================================================
Write-Host "`n--- AWS Cloud ---" -ForegroundColor Yellow

$qid = Add-Quiz @{
    titre="Quiz AWS Cloud - Fondamentaux"
    description="Testez vos connaissances sur AWS"
    formationId=10; chapitreId=37; dureeMinutes=15; scoreMinimum=60
}
Add-Question $qid @{enonce="Quel service AWS offre du calcul virtualise ?"; type="QCM"; points=10; reponseCorrecte="EC2"; choixProposes=@("EC2","S3","RDS","Lambda")}
Add-Question $qid @{enonce="Quel service AWS est un stockage objet ?"; type="QCM"; points=10; reponseCorrecte="S3"; choixProposes=@("S3","EBS","EFS","Glacier")}
Add-Question $qid @{enonce="Lambda est un service de calcul sans serveur (serverless)"; type="VRAI_FAUX"; points=10; reponseCorrecte="Vrai"; choixProposes=@("Vrai","Faux")}
Add-Question $qid @{enonce="Quel service AWS gere les identites et acces ?"; type="REPONSE_COURTE"; points=10; reponseCorrecte="IAM"}

# ============================================================
# KUBERNETES (formation 9)
# ============================================================
Write-Host "`n--- Kubernetes ---" -ForegroundColor Yellow

$qid = Add-Quiz @{
    titre="Quiz Kubernetes - Pods et Deploiement"
    description="Testez vos connaissances sur K8s"
    formationId=9; chapitreId=33; dureeMinutes=15; scoreMinimum=60
}
Add-Question $qid @{enonce="Quelle est la plus petite unite deployable dans Kubernetes ?"; type="QCM"; points=10; reponseCorrecte="Pod"; choixProposes=@("Pod","Container","Node","Deployment")}
Add-Question $qid @{enonce="Quel objet garantit un nombre desire de pods en execution ?"; type="QCM"; points=10; reponseCorrecte="Deployment"; choixProposes=@("Deployment","Service","Ingress","ConfigMap")}
Add-Question $qid @{enonce="Un Service de type ClusterIP est accessible depuis l exterieur du cluster"; type="VRAI_FAUX"; points=10; reponseCorrecte="Faux"; choixProposes=@("Vrai","Faux")}
Add-Question $qid @{enonce="Quel outil permet de packageer des applications Kubernetes ?"; type="REPONSE_COURTE"; points=10; reponseCorrecte="Helm"}

# ============================================================
# MACHINE LEARNING (formation 11)
# ============================================================
Write-Host "`n--- Machine Learning ---" -ForegroundColor Yellow

$qid = Add-Quiz @{
    titre="Quiz ML - Fondamentaux"
    description="Testez les bases du Machine Learning"
    formationId=11; chapitreId=39; dureeMinutes=15; scoreMinimum=60
}
Add-Question $qid @{enonce="Quel type d apprentissage utilise des donnees etiquetees ?"; type="QCM"; points=10; reponseCorrecte="Supervise"; choixProposes=@("Supervise","Non supervise","Par renforcement","Non supervise")}
Add-Question $qid @{enonce="Quel algorithme est utilise pour la regression ?"; type="QCM"; points=10; reponseCorrecte="Regression lineaire"; choixProposes=@("Regression lineaire","K-Means","KNN","SVM")}
Add-Question $qid @{enonce="Le sur-apprentissage (overfitting) est un modele trop complexe qui memorise les donnees"; type="VRAI_FAUX"; points=10; reponseCorrecte="Vrai"; choixProposes=@("Vrai","Faux")}
Add-Question $qid @{enonce="Quelle bibliotheque Python est utilisee pour le ML ?"; type="REPONSE_COURTE"; points=10; reponseCorrecte="scikit-learn"}

Write-Host "`n=== SEED QUIZ TERMINE ===" -ForegroundColor Green