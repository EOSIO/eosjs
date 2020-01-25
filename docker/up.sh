#!/usr/bin/env bash
set -o errexit
. ./dockrc.sh

set -o xtrace

# Reset the volumes
docker-compose down

# Update docker
#docker-compose pull

# Start the server for testing
docker-compose up -d
docker-compose logs -f | egrep -v 'Produced block 0' &
sleep 2


cleos wallet create --to-console
cleos wallet import --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3

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

cleos set contract eosio.msig contracts/eosio.msig -p eosio.msig@active

# Deploy, create and issue SYS token to eosio.token
# cleos create account eosio eosio.token $owner_pubkey $active_pubkey
cleos set contract eosio.token contracts/eosio.token -p eosio.token@active
cleos push action eosio.token create\
  '{"issuer":"eosio.token", "maximum_supply": "1000000000.0000 SYS"}' -p eosio.token@active
cleos push action eosio.token issue\
  '{"to":"eosio.token", "quantity": "10000.0000 SYS", "memo": "issue"}' -p eosio.token@active

# Either the eosio.bios or eosio.system contract may be deployed to the eosio
# account.  System contain everything bios has but adds additional constraints
# such as ram and cpu limits.
# eosio.* accounts  allowed only until eosio.system is deployed
cleos set contract eosio contracts/eosio.bios -p eosio@active

# SYS (main token)
cleos transfer eosio.token eosio '1000 SYS'
cleos transfer eosio.token inita '1000 SYS'
cleos transfer eosio.token initb '1000 SYS'
cleos transfer eosio.token initc '1000 SYS'

# User-issued asset
cleos push action eosio.token create\
  '{"issuer":"eosio.token", "maximum_supply": "1000000000.000 PHI"}' -p eosio.token@active
cleos push action eosio.token issue\
  '{"to":"eosio.token", "quantity": "10000.000 PHI", "memo": "issue"}' -p eosio.token@active
cleos transfer eosio.token inita '100 PHI'
cleos transfer eosio.token initb '100 PHI'

# Custom asset
cleos create account eosio currency $owner_pubkey $active_pubkey
cleos set contract currency contracts/eosio.token -p currency@active
cleos push action currency create\
  '{"issuer":"currency", "maximum_supply": "1000000000.0000 CUR"}' -p currency@active
cleos push action currency issue '{"to":"currency", "quantity": "10000.0000 CUR", "memo": "issue"}' -p currency@active

cleos push action currency transfer\
  '{"from":"currency", "to": "inita", "quantity": "100.0000 CUR", "memo": "issue"}' -p currency
