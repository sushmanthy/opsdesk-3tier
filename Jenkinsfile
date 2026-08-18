pipeline {
    agent any

    environment {
        POSTGRES_DB = 'opsdesk'
        POSTGRES_USER = 'opsdesk'
        POSTGRES_PASSWORD = 'opsdeskpass'
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
                bat 'docker compose config'
            }
        }

        stage('Build Images') {
            steps {
                bat 'docker compose build'
            }
        }

        stage('Stop Existing Deployment') {
            steps {
                bat 'docker compose down --remove-orphans'
            }
        }

        stage('Start Application') {
            steps {
                bat 'docker compose up -d'
            }
        }

        stage('Verify Containers') {
            steps {
                bat 'docker compose ps'
            }
        }

        stage('Test API') {
            steps {
                bat 'curl.exe -f http://localhost:5000 || exit /b 1'
            }
        }
    }

    post {
        always {
            bat 'docker compose ps'
        }

        success {
            echo 'OpsDesk deployment completed successfully.'
        }

        failure {
            echo 'OpsDesk pipeline failed. Check the stage logs.'
        }
    }
}