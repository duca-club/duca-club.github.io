pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    triggers {
        githubPush()
    }

    environment {
        PROJECT_NAME = 'hirusha-duca-site'
        BUILDER_IMAGE = 'hirusha-duca-site-builder:latest'
        DEPLOY_DIR = '/srv/hirusha-duca-site'
        COMPOSE_PROJECT_NAME = 'hirusha-duca-site'
        DOCKER_BUILDKIT = '1'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Astro Site') {
            steps {
                sh '''
                    set -eux
                    docker build --target build -t "$BUILDER_IMAGE" .
                '''
            }
        }

        stage('Extract Built Files') {
            steps {
                sh '''
                    set -eux

                    rm -rf .deploy-dist
                    mkdir -p .deploy-dist

                    CONTAINER_ID="$(docker create "$BUILDER_IMAGE")"

                    docker cp "$CONTAINER_ID:/app/dist/." .deploy-dist/

                    docker rm "$CONTAINER_ID"
                '''
            }
        }

        stage('Deploy to /srv') {
            steps {
                sh '''
                    set -eux

                    mkdir -p "$DEPLOY_DIR"

                    find "$DEPLOY_DIR" -mindepth 1 -maxdepth 1 -exec rm -rf {} +

                    cp -a .deploy-dist/. "$DEPLOY_DIR"/

                    echo "Deployed files:"
                    ls -lah "$DEPLOY_DIR"
                '''
            }
        }

        stage('Start Web Container') {
            steps {
                sh '''
                    set -eux
                    docker compose up -d --remove-orphans
                '''
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                    docker image prune -f || true
                '''
            }
        }
    }

    post {
        success {
            echo 'hirusha-duca-site deployed successfully to /srv/hirusha-duca-site'
        }

        failure {
            echo 'hirusha-duca-site deployment failed'
        }
    }
}