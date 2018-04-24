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

# Contracts for unit testing
mkdir -p contracts
docker cp docker_nodeos_1:/contracts/currency contracts
docker cp docker_nodeos_1:/contracts/exchange contracts
docker cp docker_nodeos_1:/contracts/proxy contracts

cd ..
npm install
NODE_ENV=development npm run test
