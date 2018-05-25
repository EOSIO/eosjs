#!/usr/bin/env bash
set -o errexit
set -o xtrace

. ./dockrc.sh

# Reset the volumes
docker-compose down

# Update docker
#docker-compose pull

# Start the server for testing
docker-compose up -d
docker-compose logs -f | egrep -v 'Produced block 0' &
sleep 2

cleos wallet create

# Create accounts must happen before eosio.system is installed

# Test accounts (for eosjs)
cleos create account eosio inita $owner_pubkey $active_pubkey
cleos create account eosio initb $owner_pubkey $active_pubkey
cleos create account eosio initc $owner_pubkey $active_pubkey

# System accounts for Nodeosd
cleos create account eosio eosio.bpay $owner_pubkey $active_pubkey
cleos create account eosio eosio.msig $owner_pubkey $active_pubkey
cleos create account eosio eosio.names $owner_pubkey $active_pubkey
cleos create account eosio eosio.ram $owner_pubkey $active_pubkey
cleos create account eosio eosio.ramfee $owner_pubkey $active_pubkey
cleos create account eosio eosio.saving $owner_pubkey $active_pubkey
cleos create account eosio eosio.stake $owner_pubkey $active_pubkey
cleos create account eosio eosio.token $owner_pubkey $active_pubkey
cleos create account eosio eosio.vpay $owner_pubkey $active_pubkey

# Deploy, create and issue SYS token to eosio.token
# cleos create account eosio eosio.token $owner_pubkey $active_pubkey
cleos set contract eosio.token contracts/eosio.token -p eosio.token@active
cleos push action eosio.token create\
  '{"issuer":"eosio.token", "maximum_supply": "1000000000.0000 SYS"}' -p eosio.token@active
cleos push action eosio.token issue\
  '{"to":"eosio.token", "quantity": "1000000000.0000 SYS", "memo": "issue"}' -p eosio.token@active

# Deprecated: `currency` will be replaced by `currency3.14` below
cleos create account eosio currency $owner_pubkey $active_pubkey
cleos set contract currency contracts/eosio.token -p currency@active
cleos push action currency create\
  '{"issuer":"currency", "maximum_supply": "1000000000.0000 CUR"}' -p currency@active
cleos push action currency issue\
  '{"to":"currency", "quantity": "1000000000.0000 CUR", "memo": "issue"}' -p currency@active

# eosio.* accounts  allowed only before lockdown

# Lockdown (deploy eosio.system or eosio.bios to the eosio account)
cleos set contract eosio contracts/eosio.system -p eosio@active

# Non-privileged operations (after lockdown)

# SYS (main token)
cleos transfer eosio.token eosio '1000 SYS'
cleos transfer eosio.token inita '1000 SYS'
cleos transfer eosio.token initb '1000 SYS'
cleos transfer eosio.token initc '1000 SYS'

# User-issued asset(s)..

# PHI (user-issued main token)
cleos push action eosio.token create\
  '{"issuer":"eosio.token", "maximum_supply": "1000000000.000 PHI"}' -p eosio.token@active
cleos push action eosio.token issue\
  '{"to":"eosio.token", "quantity": "1000000000.000 PHI", "memo": "issue"}' -p eosio.token@active
cleos transfer eosio.token inita '100000 PHI'
cleos transfer eosio.token initb '100000 PHI'

# CUR (user issued own contract)
# newaccount eosio currency3.14 $owner_pubkey $active_pubkey
# cleos set contract currency3.14 contracts/eosio.token -p currency3.14@active
# cleos push action currency3.14 create\
#   '{"issuer":"currency3.14", "maximum_supply": "1000000000.0000 CUR"}' -p currency3.14@active
# cleos push action currency3.14 issue\
#   '{"to":"currency3.14", "quantity": "1000000000.0000 CUR", "memo": "issue"}' -p currency3.14@active
#
# # Nodeosd error: "Symbol CUR is not supported by token contract eosio.token"
# cleos transfer currency3.14 inita '100000 CUR'
# cleos transfer currency3.14 initb '100000 CUR'
