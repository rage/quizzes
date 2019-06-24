#!/bin/bash
set -eo pipefail

DATE=$(date +%s)

if [ -n "$CIRCLE_SHA1" ]; then
  echo "Running in Circle CI"
  REV="$CIRCLE_BUILD_NUM-$(git rev-parse --verify HEAD)"
else
  echo "Running outside CI"
  REV="$DATE-$(git rev-parse --verify HEAD)"
fi

TAG="gcr.io/moocfi/quizzes-dashboard:build-$REV"
echo Building "$TAG"
docker build . -f Dockerfile.dashboard -t "$TAG"

echo "Succsefully built image: $TAG"
