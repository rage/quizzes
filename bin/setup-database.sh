#!/bin/bash
set -euo pipefail
docker exec -it quizzes-postgres-1 /bin/sh -c 'psql -U postgres -c "CREATE DATABASE quizzes_dev" && psql -U postgres -c "CREATE DATABASE quizzes_test"'
docker exec -it quizzes-backend-1 /bin/sh -c "npm run migrate && npm run seed"