#!/usr/bin/env bash
set -o errexit
set -o xtrace

eosioc='docker-compose exec walletd /opt/eosio/bin/eosioc -H nodeos'

# Reset the volumes
docker-compose down

# Start the server for testing
docker-compose up -d
docker-compose logs -f | egrep -v 'eosio generated block' &

$eosioc wallet create
$eosioc wallet import 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3

# create accounts
$eosioc create account eosio currency EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
$eosioc create account eosio inita EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
$eosioc create account eosio initb EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
$eosioc create account eosio initc EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
# $eosioc create account eosio exchange EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV

# publish smart contracts
$eosioc set contract currency contracts/currency/currency.wast contracts/currency/currency.abi
$eosioc set contract eosio contracts/eosio.system/eosio.system.wast contracts/eosio.system/eosio.system.abi
# $eosioc set contract exchange contracts/exchange/exchange.wast contracts/exchange/exchange.abi

# issue new tokens
$eosioc push action eosio issue '{"to":"eosio", "quantity": "1000000000.0000 EOS", "memo": ""}' -p eosio@active
$eosioc push action currency create '{"issuer":"currency", "maximum_supply": "1000000000.0000 CUR", "can_freeze": 1, "can_recall": 1, "can_whitelist": 1}' -p currency@active

$eosioc push action eosio issue '{"to":"inita", "quantity": "1000000000.0000 EOS", "memo": ""}' -p eosio@active
$eosioc push action eosio issue '{"to":"initb", "quantity": "1000000000.0000 EOS", "memo": ""}' -p eosio@active
$eosioc push action eosio issue '{"to":"initc", "quantity": "1000000000.0000 EOS", "memo": ""}' -p eosio@active
