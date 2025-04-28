pipeline {
    agent {
        docker {
            image 'node:18'  // Node.js 18 버전 이미지
            args '-v /var/run/docker.sock:/var/run/docker.sock'  // Docker-in-Docker를 위해 필요
        }
    }


    environment {
        // GIT_URL = 'https://github.com/himang10/tekton-source.git'
        GIT_URL = 'https://github.com/kaxadlec/Robotic-Transport-Hub.git'
        GIT_BRANCH = 'master' // 또는 master
        GIT_ID = 'skala-github-id' // GitHub PAT credential ID
        IMAGE_REGISTRY = 'amdp-registry.skala-ai.com/skala25a'
        // IMAGE_NAME = 'sk000-my-app'
        IMAGE_NAME = 'sk017-my-app'
        IMAGE_TAG = '1.0.0'
        DOCKER_CREDENTIAL_ID = 'skala-image-registry-id'  // Harbor 인증 정보 ID
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: "${GIT_BRANCH}",
                    url: "${GIT_URL}",
                    credentialsId: "${GIT_ID}"   // GitHub PAT credential ID
            }
        }

        // stage('Build with Maven') {
        //     steps {
        //         sh 'mvn clean package -DskipTests'
        //     }
        // }
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

