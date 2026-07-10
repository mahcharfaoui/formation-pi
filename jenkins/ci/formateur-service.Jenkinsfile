pipeline {
    agent any

    environment {
        APP_NAME = 'formateur-service'
        SERVICE_PORT = '8083'
        DOCKERFILE = 'backend/Dockerfile.formateur-service'
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Build') {
            steps {
                sh "mvn clean package -DskipTests -pl backend/${APP_NAME} -am"
            }
        }

        stage('Unit Tests') {
            steps {
                sh "mvn test -pl backend/${APP_NAME}"
            }
            post { always { junit '**/target/surefire-reports/*.xml' } }
        }

        stage('Code Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh "mvn sonar:sonar -pl backend/${APP_NAME}"
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_REGISTRY}/${APP_NAME}:\${BUILD_NUMBER} -f ${DOCKERFILE} ."
                sh "docker tag ${DOCKER_REGISTRY}/${APP_NAME}:\${BUILD_NUMBER} ${DOCKER_REGISTRY}/${APP_NAME}:latest"
            }
        }
    }

    post {
        success { echo "CI ${APP_NAME} terminé avec succès!" }
        failure { echo "CI ${APP_NAME} a échoué!" }
        always { cleanWs() }
    }
}
