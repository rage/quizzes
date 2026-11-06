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

TAG="eu.gcr.io/moocfi/quizzes-backendv2:build-$REV"
echo Building "$TAG"
# Cache mounts need BuildKit, which the docker.io CLI that CI installs does not default to.
DOCKER_BUILDKIT=1 docker build . -f packages/backendv2/Dockerfile -t "$TAG" --build-arg=GIT_COMMIT="$(git rev-parse --short HEAD)"

echo "Successfully built image: $TAG"
