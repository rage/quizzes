echo "Configuring Google Cloud"
echo $GCLOUD_SERVICE_KEY >${HOME}/gcloud-service-key.json
gcloud auth activate-service-account --key-file=${HOME}/gcloud-service-key.json
gcloud --quiet config set project ${GOOGLE_PROJECT_ID}
gcloud --quiet config set compute/zone ${GOOGLE_COMPUTE_ZONE}
echo "Logging in to docker"
gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://eu.gcr.io
