#!/bin/sh
concurrently -k -p "[{name}]" -n "backend,common", -c "cyan.bold,green.bold" \
"tsc-watch --onSuccess \"tscpaths -p tsconfig.json -s ./src -o ../../dist/backend/src && yarn run serve\"" \
"cd ../common && tsc-watch --onSuccess \"tscpaths -p ../backend/tsconfig.json -s ../backend/src -o ../../dist/backend/src && yarn run serve\""
