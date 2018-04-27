set -o errexit
set -o xtrace

docker cp docker_nodeos_1:/contracts/eosio.system/eosio.system.abi .
node ./eosio-system-update.js

mv eosio_system.json ../src/schema
