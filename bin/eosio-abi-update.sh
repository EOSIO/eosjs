set -o errexit
set -o xtrace

function process() {
  docker cp docker_nodeosd_1:/contracts/${1}/${1}.abi .
  mv ${1}.abi ../src/schema/${1}.abi.json
}

process eosio.token
process eosio.system
