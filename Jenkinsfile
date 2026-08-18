pipeline {
  agent any

  environment {
    IMAGE_TAG = "${BUILD_NUMBER}"
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

    stage('Test API Container') {
      steps {
        bat 'docker compose up -d'
        bat 'timeout /t 12 /nobreak'
        bat 'curl.exe -fsS http://localhost/api/health'
      }
    }

    stage('Deploy') {
      steps {
        bat 'docker compose up -d --remove-orphans'
      }
    }
  }

  post {
    always {
      bat 'docker compose ps'
      bat 'docker compose down'
    }

    success {
      echo 'OpsDesk CI/CD completed successfully.'
    }

    failure {
      echo 'Pipeline failed. Check the stage logs.'
    }
  }
}