pipeline {
    agent {
        docker {
            image 'node:18'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        GIT_URL = 'https://github.com/kaxadlec/Robotic-Transport-Hub.git'
        GIT_BRANCH = 'master'
        GIT_ID = 'skala-github-id'
        IMAGE_REGISTRY = 'amdp-registry.skala-ai.com/skala25a'
        IMAGE_NAME = 'sk017-my-app'
        IMAGE_TAG = '1.0.0'
        DOCKER_CREDENTIAL_ID = 'skala-image-registry-id'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: "${GIT_BRANCH}",
                    url: "${GIT_URL}",
                    credentialsId: "${GIT_ID}"
            }
        }

        stage('Build React App') {
            steps {
                sh '''
                    npm install --save-dev @babel/plugin-proposal-private-property-in-object
                    npx update-browserslist-db@latest
                    CI=false npm run build
                '''
            }
        }

        stage('Docker Build & Push') {
            agent {
                any
            }
            steps {
                script {
                    docker.withRegistry("https://${IMAGE_REGISTRY}", "${DOCKER_CREDENTIAL_ID}") {
                        def appImage = docker.build("${IMAGE_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}", "--platform=linux/amd64 .")
                        appImage.push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl apply -f ./k8s
                    kubectl rollout status deployment/sk017-my-app
                '''
            }
        }
    }
}
