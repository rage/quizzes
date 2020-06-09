#!/bin/bash
set -eo pipefail

CURRENT_DIR="$(dirname "$0")"

DATE=$(date +%s)

if [ -n "$CIRCLE_SHA1" ]; then
  echo "Running in Circle CI"
  REV="$CIRCLE_WORKFLOW_ID-$(git rev-parse --verify HEAD)"
  source "$CURRENT_DIR/ci-setup-google-cloud.sh"
else
  echo "Running outside CI"
  REV="$DATE-$(git rev-parse --verify HEAD)"
fi

export DASHBOARD_IMAGE="eu.gcr.io/moocfi/quizzes-dashboard:build-$REV"
export BACKEND_IMAGE="eu.gcr.io/moocfi/quizzes-backend:build-$REV"
export DASHBOARDV2_IMAGE="eu.gcr.io/moocfi/quizzes-dashboardv2:build-$REV"
export BACKENDV2_IMAGE="eu.gcr.io/moocfi/quizzes-backendv2:build-$REV"

echo "Building new Kubernetes configs"
mkdir -p "$CURRENT_DIR/../updated-kubernetes-configs"
envsubst < "$CURRENT_DIR/../kubernetes/backend-deployment.yaml" > "$CURRENT_DIR/../updated-kubernetes-configs/backend-deployment.yaml"
# envsubst < "$CURRENT_DIR/../kubernetes/migrate-quiznator-data-cronjob.yaml" > "$CURRENT_DIR/../updated-kubernetes-configs/migrate-quiznator-data-cronjob.yaml"
# envsubst < "$CURRENT_DIR/../kubernetes/create-user-quiz-states-cronjob.yaml" > "$CURRENT_DIR/../updated-kubernetes-configs/create-user-quiz-states-cronjob.yaml"
envsubst < "$CURRENT_DIR/../kubernetes/dashboard-deployment.yaml" > "$CURRENT_DIR/../updated-kubernetes-configs/dashboard-deployment.yaml"
envsubst < "$CURRENT_DIR/../kubernetes/kafka-batch-producer-cronjob.yaml" > "$CURRENT_DIR/../updated-kubernetes-configs/kafka-batch-producer-cronjob.yaml"
# envsubst < "$CURRENT_DIR/../kubernetes/update-quiz-item-answer-correct-cronjob.yaml" > "$CURRENT_DIR/../updated-kubernetes-configs/update-quiz-item-answer-correct-cronjob.yaml"
envsubst < "$CURRENT_DIR/../kubernetes/refresh-reaktor-view-cronjob.yaml" > "$CURRENT_DIR/../updated-kubernetes-configs/refresh-reaktor-view-cronjob.yaml"

echo "Applying changes"
kubectl replace -f "$CURRENT_DIR/../updated-kubernetes-configs"
