pipeline {
    agent any

    environment {
        POSTGRES_DB = 'opsdesk'
        POSTGRES_USER = 'opsdesk'
        POSTGRES_PASSWORD = 'opsdeskpass'

        COMPOSE_PROJECT_NAME = 'opsdesk-3tier'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate') {
            steps {
                bat 'docker --version'
                bat 'docker compose version'
                bat 'docker compose -p %COMPOSE_PROJECT_NAME% config'
            }
        }

        stage('Build Images') {
            steps {
                bat 'docker compose -p %COMPOSE_PROJECT_NAME% build'
            }
        }

        stage('Stop Existing Deployment') {
            steps {
                bat 'docker compose -p %COMPOSE_PROJECT_NAME% down --remove-orphans'
            }
        }

        stage('Start Application') {
            steps {
                bat 'docker compose -p %COMPOSE_PROJECT_NAME% up -d'
            }
        }

        stage('Verify Containers') {
            steps {
                bat 'docker compose -p %COMPOSE_PROJECT_NAME% ps'
            }
        }

        stage('Test API') {
            steps {
                bat 'curl.exe -f http://localhost:5000/api/health || exit /b 1'
            }
        }
    }

    post {
        always {
            bat 'docker compose -p %COMPOSE_PROJECT_NAME% ps'
        }

        success {
            echo 'OpsDesk deployment completed successfully.'
        }

        failure {
            echo 'OpsDesk pipeline failed. Check the stage logs.'
        }
    }
}