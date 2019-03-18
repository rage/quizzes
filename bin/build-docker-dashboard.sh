#!/bin/bash
set -euo pipefail

REV=$(git rev-parse --verify HEAD)
DATE=$(date +%s)
TAG="gcr.io/moocfi/quizzes-dashboard:build-$DATE-$REV"
echo Building "$TAG"
docker build . -f Dockerfile.dashboard -t "$TAG"

echo "export QUIZZES_DASHBOARD_IMAGE=$TAG"
export QUIZZES_DASHBOARD_IMAGE=$TAG
