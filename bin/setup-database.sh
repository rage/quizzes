#!/bin/sh
docker exec -it quizzes_postgres_1 /bin/sh -c 'psql -U postgres -c "CREATE DATABASE quizzes_dev" && psql -U postgres -c "CREATE DATABASE quizzes_test"'
docker exec -it quizzes_backend_1 /bin/sh -c "npm run migrate && npm run seed"