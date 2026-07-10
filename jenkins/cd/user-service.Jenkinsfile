pipeline {
    agent any

    environment {
        APP_NAME = 'user-service'
        DOCKER_REGISTRY = 'registry.example.com'
        KUBERNETES_NAMESPACE = 'plateforme'
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Push Docker Image') {
            steps {
                sh "docker tag ${DOCKER_REGISTRY}/${APP_NAME}:latest ${DOCKER_REGISTRY}/${APP_NAME}:\${BUILD_NUMBER}"
                sh "docker push ${DOCKER_REGISTRY}/${APP_NAME}:\${BUILD_NUMBER}"
                sh "docker push ${DOCKER_REGISTRY}/${APP_NAME}:latest"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh "kubectl apply -f kubernetes/${APP_NAME}/ -n ${KUBERNETES_NAMESPACE}"
            }
        }

        stage('Verify Deployment') {
            steps {
                sh "kubectl rollout status deployment/${APP_NAME} -n ${KUBERNETES_NAMESPACE} --timeout=300s"
            }
        }
    }

    post {
        success { echo "CD ${APP_NAME} déployé avec succès!" }
        failure { echo "CD ${APP_NAME} a échoué!" }
        always { cleanWs() }
    }
}
