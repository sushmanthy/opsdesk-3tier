pipeline {
    agent any

    environment {
        POSTGRES_DB = 'opsdesk'
        POSTGRES_USER = 'opsdesk'
        POSTGRES_PASSWORD = 'opsdeskpass'

        COMPOSE_PROJECT_NAME = 'opsdesk-3tier'

        BACKEND_IMAGE = "opsdesk-3tier-backend:${BUILD_NUMBER}"
        FRONTEND_IMAGE = "opsdesk-3tier-frontend:${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate Tools') {
            steps {
                bat 'docker --version'
                bat 'docker compose version'
                bat 'trivy --version'
                bat 'git --version'
            }
        }

        stage('Validate Compose') {
            steps {
                bat 'docker compose -p %COMPOSE_PROJECT_NAME% config'
            }
        }

        stage('Build Docker Images') {
            steps {
                bat 'docker compose -p %COMPOSE_PROJECT_NAME% build'
            }
        }

        stage('Trivy Security Scan') {
            steps {
                bat 'if not exist reports mkdir reports'

                bat 'trivy image --scanners vuln --severity HIGH,CRITICAL --format table --exit-code 0 -o reports\\trivy-backend.txt %BACKEND_IMAGE%'

                bat 'trivy image --scanners vuln --severity HIGH,CRITICAL --format table --exit-code 0 -o reports\\trivy-frontend.txt %FRONTEND_IMAGE%'
            }
        }

        stage('Deploy Application') {
            steps {
                bat 'docker compose -p %COMPOSE_PROJECT_NAME% down --remove-orphans'

                bat 'docker compose -p %COMPOSE_PROJECT_NAME% up -d'
            }
        }

        stage('Wait For Services') {
            steps {
                bat 'timeout /t 20 /nobreak'
                bat 'docker compose -p %COMPOSE_PROJECT_NAME% ps'
            }
        }

        stage('Health Check') {
            steps {
                bat 'curl.exe -f http://localhost:5000/api/health'
                bat 'curl.exe -f http://localhost/'
            }
        }

        stage('CRUD Smoke Test') {
            steps {
                bat 'curl.exe -f http://localhost:5000/api/tickets'
            }
        }

        stage('Cleanup Old Images') {
            steps {
                bat 'docker image prune -f'
            }
        }
    }

    post {

        always {
            bat 'docker compose -p %COMPOSE_PROJECT_NAME% ps'
            archiveArtifacts artifacts: 'reports/*.txt', allowEmptyArchive: true
        }

        success {
            echo 'OpsDesk CI/CD pipeline completed successfully.'
        }

        failure {
            echo 'OpsDesk CI/CD pipeline failed. Check the failed stage and console output.'
        }
    }
}