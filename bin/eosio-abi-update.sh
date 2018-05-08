set -o errexit
set -o xtrace

docker cp docker_nodeos_1:/contracts/eosio.token/eosio.token.abi .
node ./eosio-abi-update.js

mv eosio_token.json ../src/schema
