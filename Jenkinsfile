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
        sh 'docker --version'
        sh 'docker compose config'
      }
    }

    stage('Build Images') {
      steps {
        sh 'docker compose build'
      }
    }

    stage('Test API Container') {
      steps {
        sh 'docker compose up -d'
        sh 'sleep 12'
        sh 'curl -fsS http://localhost/api/health'
      }
    }

    stage('Deploy') {
      steps {
        sh 'docker compose up -d --remove-orphans'
      }
    }
  }

  post {
    always {
      sh 'docker compose ps || true'
      sh 'docker compose down || true'
    }
    success {
      echo 'OpsDesk CI/CD completed successfully.'
    }
    failure {
      echo 'Pipeline failed. Check the stage logs.'
    }
  }
}
