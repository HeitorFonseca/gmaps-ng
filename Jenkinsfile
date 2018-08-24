
stage 'Checkout Production'
node('master') {
  deleteDir()
  checkout scm
 }


 stage 'DockerBuild'
 node('master') {
    sh 'sudo docker-compose down'
    sh 'sudo docker-compose build'
 }

 stage 'Docker Deploy'
 node('master') {
    sh 'sudo docker-compose -f docker-compose.yml up -d'
 }