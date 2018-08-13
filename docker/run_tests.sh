#!/usr/bin/env bash
set -o errexit

# Start the server for testing
./up.sh

# Shutdown
function finish {
  popd
  docker-compose down
}
pushd .
trap finish EXIT
trap finish ERR

# For unit testing
docker cp docker_nodeosd_1:/contracts .

cd ..
npm install
npm run test

npm run build
npm run minimize

echo "Subresource Integrity"
npm run srisum
