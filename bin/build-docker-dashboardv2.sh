#!/bin/bash
set -eo pipefail

DATE=$(date +%s)

if [ -n "$CIRCLE_SHA1" ]; then
  echo "Running in Circle CI"
  REV="$CIRCLE_WORKFLOW_ID-$(git rev-parse --verify HEAD)"
else
  echo "Running outside CI"
  REV="$DATE-$(git rev-parse --verify HEAD)"
fi

TAG="eu.gcr.io/moocfi/quizzes-dashboardv2:build-$REV"
echo Building "$TAG"
# Cache mounts need BuildKit, which the docker.io CLI that CI installs does not default to.
DOCKER_BUILDKIT=1 docker build . -f packages/quizzes-dashboard/Dockerfile -t "$TAG"

echo "Successfully built image: $TAG"
