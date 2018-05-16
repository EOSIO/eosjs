#!/usr/bin/env bash
set -o errexit
set -o xtrace

function cleos() {
  docker exec docker_keosd_1 cleos -u http://nodeosd:8888 "$@"
}

# Reset the volumes
docker-compose down

# Update image
#docker-compose pull

# Start the server for testing
docker-compose up -d
docker-compose logs -f | egrep -v 'Produced block 0' &

sleep 2

cleos wallet create

# Root key need not be imported
# cleos wallet import 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3

# create accounts
cleos create account eosio inita EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
cleos create account eosio initb EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
cleos create account eosio initc EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV

# setup contracts
function deploy_contract() {
  name=$1
  contract=${2-$name}

  cleos create account eosio $name EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV

  # publish smart contract
  cleos set contract $name contracts/$contract -p $name@active
}

deploy_contract eosio.bios
deploy_contract eosio.msig
deploy_contract eosio.system
deploy_contract eosio.token
deploy_contract currency eosio.token

# issue new tokens
cleos push action eosio.token create '{"issuer":"eosio.token", "maximum_supply": "1000000.0000 EOS", "can_freeze": 0, "can_recall": 0, "can_whitelist": 0}' -p eosio.token@active
cleos push action eosio.token issue '{"to":"eosio.token", "quantity": "1000.0000 EOS", "memo": ""}' -p eosio.token@active
cleos push action eosio.token issue '{"to":"inita", "quantity": "1000.0000 EOS", "memo": ""}' -p eosio.token@active
cleos push action eosio.token issue '{"to":"initb", "quantity": "1000.0000 EOS", "memo": ""}' -p eosio.token@active
cleos push action eosio.token issue '{"to":"initc", "quantity": "1000.0000 EOS", "memo": ""}' -p eosio.token@active
cleos push action eosio.token issue '{"to":"eosio", "quantity": "1000.0000 EOS", "memo": ""}' -p eosio.token@active

cleos push action eosio.token create '{"issuer":"eosio.token", "maximum_supply": "1000000.0000 CUR", "can_freeze": 1, "can_recall": 1, "can_whitelist": 1}' -p eosio.token@active
cleos push action eosio.token issue '{"to":"inita", "quantity": "100000.0000 CUR", "memo": ""}' -p eosio.token@active
cleos push action eosio.token issue '{"to":"initb", "quantity": "100000.0000 CUR", "memo": ""}' -p eosio.token@active

cleos push action currency create '{"issuer":"currency", "maximum_supply": "1000000.0000 CUR", "can_freeze": 0, "can_recall": 0, "can_whitelist": 0}' -p currency@active
cleos push action currency issue '{"to":"inita", "quantity": "100000.0000 CUR", "memo": ""}' -p currency@active
cleos push action currency issue '{"to":"initb", "quantity": "100000.0000 CUR", "memo": ""}' -p currency@active
