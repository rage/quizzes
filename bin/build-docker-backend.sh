#!/bin/bash
set -euo pipefail

REV=$(git rev-parse --verify HEAD)
DATE=$(date +%s)
TAG="gcr.io/moocfi/quizzes-backend:build-$DATE-$REV"
echo Building "$TAG"
docker build . -f Dockerfile.backend -t "$TAG"
