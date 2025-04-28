pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:18
    command:
    - cat
    tty: true
  - name: docker
    image: docker:20.10.16-dind
    privileged: true
    tty: true
  - name: kubectl
    image: bitnami/kubectl:latest
    command:
    - cat
    tty: true
"""
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
                container('node') {
                    sh '''
                        npm install --save-dev @babel/plugin-proposal-private-property-in-object
                        npx update-browserslist-db@latest
                        CI=false npm run build
                    '''
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                container('docker') {
                    withCredentials([string(credentialsId: "${DOCKER_CREDENTIAL_ID}", variable: 'DOCKER_AUTH')]) {
                        sh '''
                            echo $DOCKER_AUTH | docker login -u _json_key --password-stdin https://${IMAGE_REGISTRY}
                            docker build -t ${IMAGE_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} --platform=linux/amd64 .
                            docker push ${IMAGE_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
                        '''
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    withKubeConfig([credentialsId: 'kubeconfig-credential-id']) {
                        sh '''
                            kubectl apply -f ./k8s
                            kubectl rollout status deployment/sk017-my-app
                        '''
                    }
                }
            }
        }
    }
}

