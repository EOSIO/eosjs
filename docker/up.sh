#!/usr/bin/env bash
set -o errexit
set -o xtrace

function cleos() {
  docker-compose exec nodeos /opt/eosio/bin/cleos "$@"
}

# Reset the volumes
docker-compose down

# Update image
#docker-compose pull


# Start the server for testing
docker-compose up -d
docker-compose logs -f | egrep -v 'eosio generated block' &

sleep 2

cleos wallet create -n test

# Root key need not be imported
# cleos wallet import 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3

# Hack: publish main eosio smart contract
cleos set contract eosio contracts/eosio.system -p eosio@active

# create accounts
cleos create account eosio inita EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
cleos create account eosio initb EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
cleos create account eosio initc EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV

# setup contracts
function create_contract() {
  name=$1
  contract=${2-$name}

  cleos create account eosio $name EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV

  # publish smart contract
  cleos set contract $name contracts/$contract -p $name@active
}
create_contract exchange
create_contract eosio.token
create_contract currency eosio.token

# issue new tokens
cleos push action eosio issue '{"to":"eosio", "quantity": "1000.0000 EOS", "memo": ""}' -p eosio@active
cleos push action eosio issue '{"to":"eosio.token", "quantity": "1000.0000 EOS", "memo": ""}' -p eosio@active
cleos push action eosio issue '{"to":"inita", "quantity": "1000.0000 EOS", "memo": ""}' -p eosio@active
cleos push action eosio issue '{"to":"initb", "quantity": "1000.0000 EOS", "memo": ""}' -p eosio@active
cleos push action eosio issue '{"to":"initc", "quantity": "1000.0000 EOS", "memo": ""}' -p eosio@active

cleos push action eosio.token create '{"issuer":"eosio.token", "maximum_supply": "1000000.0000 CUR", "can_freeze": 1, "can_recall": 1, "can_whitelist": 1}' -p eosio.token@active
cleos push action eosio.token issue '{"to":"inita", "quantity": "1000.0000 CUR", "memo": ""}' -p eosio.token@active
cleos push action eosio.token issue '{"to":"initb", "quantity": "1000.0000 CUR", "memo": ""}' -p eosio.token@active
