#!/bin/env bash
CLEOS='docker-compose exec walletd /opt/eosio/bin/cleos -H nodeos'

# Reset the volumes
docker-compose down

# pull the latest image
# docker pull eosio/eos

# Start the server for testing 
docker-compose up -d

$CLEOS wallet create
$CLEOS wallet import 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3

# create accounts
$CLEOS create account eosio currency EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
$CLEOS create account eosio exchange EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
$CLEOS create account eosio inita EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
$CLEOS create account eosio initb EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
$CLEOS create account eosio initc EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV

# publish smart contracts
$CLEOS set contract currency contracts/currency/currency.wast contracts/currency/currency.abi
$CLEOS set contract exchange contracts/exchange/exchange.wast contracts/exchange/exchange.abi
$CLEOS set contract eosio contracts/eosio.system/eosio.system.wast contracts/eosio.system/eosio.system.abi

# issue new tokens
$CLEOS push action eosio issue '{"to":"eosio", "quantity": "1000000000.0000 EOS", "memo": ""}' -p eosio@active
$CLEOS push action currency create '{"issuer":"currency", "maximum_supply": "1000000000.0000 CUR", "can_freeze": 1, "can_recall": 1, "can_whitelist": 1}' -p currency@active

$CLEOS push action eosio issue '{"to":"inita", "quantity": "1000000000.0000 EOS", "memo": ""}' -p eosio@active
$CLEOS push action eosio issue '{"to":"initb", "quantity": "1000000000.0000 EOS", "memo": ""}' -p eosio@active
$CLEOS push action eosio issue '{"to":"initc", "quantity": "1000000000.0000 EOS", "memo": ""}' -p eosio@active

cd ..
npm install
NODE_ENV=development CURRENCY_ABI= npm run test 
