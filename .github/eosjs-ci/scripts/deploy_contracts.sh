#!/usr/bin/env bash
NODEOS_RUNNING=$1

set -m

# CAUTION: Never use these development keys for a production account!
# Doing so will most certainly result in the loss of access to your account, these private keys are publicly known.
SYSTEM_ACCOUNT_PRIVATE_KEY="5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"
SYSTEM_ACCOUNT_PUBLIC_KEY="EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV"

EXAMPLE_ACCOUNT_PRIVATE_KEY="5JuH9fCXmU3xbj8nRmhPZaVrxxXrdPaRmZLW1cznNTmTQR2Kg5Z"
EXAMPLE_ACCOUNT_PUBLIC_KEY="EOS7bxrQUTbQ4mqcoefhWPz1aFieN4fA9RQAiozRz7FrUChHZ7Rb8"

ROOT_DIR="/opt"
CONTRACTS_DIR="$ROOT_DIR/eosio/bin/contracts"
BLOCKCHAIN_DATA_DIR=/root/.local/share
BLOCKCHAIN_CONFIG_DIR=/opt/eosio/bin/config-dir
WALLET_DIR="/root/eosio-wallet/"

mkdir -p $ROOT_DIR/bin

# Set PATH
PATH="$PATH:$ROOT_DIR/bin:$ROOT_DIR/bin/scripts"
CONFIG_DIR="$ROOT_DIR/bin/config-dir"

function start_wallet {
  echo "Starting the wallet"
  rm -rf $WALLET_DIR
  mkdir -p $WALLET_DIR
  nohup keosd --unlock-timeout 999999999 --wallet-dir $WALLET_DIR --http-server-address 127.0.0.1:8900 2>&1 &
  sleep 1s
  wallet_password=$(cleos wallet create --to-console | awk 'FNR > 3 { print $1 }' | tr -d '"')
  echo $wallet_password > "$CONFIG_DIR"/keys/default_wallet_password.txt

  cleos wallet import --private-key $SYSTEM_ACCOUNT_PRIVATE_KEY
}

function post_preactivate {
  curl -X POST http://127.0.0.1:8888/v1/producer/schedule_protocol_feature_activations -d '{"protocol_features_to_activate": ["0ec7e080177b2c02b278d5088611686b49d739925a92d9bfcacd7fc6b74053bd"]}'
}

# $1 feature disgest to activate
function activate_feature {
  cleos push action eosio activate '["'"$1"'"]' -p eosio
  if [ $? -ne 0 ]; then
    exit 1
  fi
}

# $1 account name
# $2 contract directory
# $3 wasm file name
# $4 abi file name
function setcode {
  retry_count="4"

  while [ $retry_count -gt 0 ]; do
    cleos set contract $1 $2 $3 $4 -p $1@active
    if [ $? -eq 0 ]; then
      break
    fi

    echo "setcode failed retrying..."
    sleep 1s
    retry_count=$[$retry_count-1]
  done

  if [ $retry_count -eq 0 ]; then
    echo "setcode failed too many times, bailing."
    exit 1
  fi
}

# $1 - parent folder where smart contract directory is located
# $2 - smart contract name
# $3 - account name
function deploy_system_contract {
  # Unlock the wallet, ignore error if already unlocked
  cleos wallet unlock --password $(cat "$CONFIG_DIR"/keys/default_wallet_password.txt) || true

  echo "Deploying the $2 contract in path: $CONTRACTS_DIR/$1/$2/src"

  # Move into contracts /src directory
  cd "$CONTRACTS_DIR/$1/$2/src"

  # Compile the smart contract to wasm and abi files using the EOSIO.CDT (Contract Development Toolkit)
  # https://github.com/EOSIO/eosio.cdt
  sudo eosio-cpp -abigen "$2.cpp" -o "$2.wasm" -I ../include

  # Move back into the executable directory
  cd $CONTRACTS_DIR

  # Set (deploy) the compiled contract to the blockchain
  setcode $3 "$CONTRACTS_DIR/$1/$2/src" "$2.wasm" "$2.abi"
}

function deploy_1.8.x_bios {
  # Unlock the wallet, ignore error if already unlocked
  cleos wallet unlock --password $(cat "$CONFIG_DIR"/keys/default_wallet_password.txt) || true

  echo "Deploying the v1.8.3 eosio.bios contract in path: $CONTRACTS_DIR/$1"

  # Move back into the executable directory
  cd $CONTRACTS_DIR

  # Set (deploy) the compiled contract to the blockchain
  setcode $3 "$CONTRACTS_DIR/$1" "$2.wasm" "$2.abi"
}

# $1 - account name
# $2 - public key
# $3 - private key
function create_account {
  cleos wallet import --private-key $3
  cleos create account eosio $1 $2
}

function issue_sys_tokens {
  echo "Issuing SYS tokens"
  cleos push action eosio.token create '["eosio", "10000000000.0000 SYS"]' -p eosio.token
  cleos push action eosio.token issue '["eosio", "5000000000.0000 SYS", "Half of available supply"]' -p eosio
}

# $1 - account name
function transfer_sys_tokens {
  cleos transfer eosio $1 "1000000.0000 SYS"
}

# Move into the executable directory
cd $ROOT_DIR/bin/
mkdir -p $CONFIG_DIR
mkdir -p $BLOCKCHAIN_DATA_DIR
mkdir -p $BLOCKCHAIN_CONFIG_DIR

if [ -z "$NODEOS_RUNNING" ]; then
  echo "Starting the chain for setup"
  nodeos -e -p eosio \
  --data-dir $BLOCKCHAIN_DATA_DIR \
  --config-dir $BLOCKCHAIN_CONFIG_DIR \
  --http-validate-host=false \
  --plugin eosio::producer_api_plugin \
  --plugin eosio::chain_api_plugin \
  --plugin eosio::http_plugin \
  --http-server-address=0.0.0.0:8888 \
  --access-control-allow-origin=* \
  --contracts-console \
  --max-transaction-time=100000 \
  --verbose-http-errors &
fi

mkdir -p "$CONFIG_DIR"/keys

sleep 1s

echo "Waiting for the chain to finish startup"
until curl localhost:8888/v1/chain/get_info
do
  echo "Still waiting"
  sleep 1s
done

# Sleep for 2s to allow time for 4 blocks to be created so we have blocks to reference when sending transactions
sleep 2s
echo "Creating accounts and deploying contracts"

start_wallet

# preactivate concensus upgrades
post_preactivate

# eosio.bios

deploy_1.8.x_bios eosio.bios-v1.8.3 eosio.bios eosio

activate_feature "299dcb6af692324b899b39f16d5a530a33062804e41f09dc97e9f156b4476707"

deploy_system_contract eosio.contracts/contracts eosio.bios eosio

# eosio.token
create_account eosio.token $SYSTEM_ACCOUNT_PUBLIC_KEY $SYSTEM_ACCOUNT_PRIVATE_KEY
deploy_system_contract eosio.contracts/contracts eosio.token eosio.token
issue_sys_tokens

# example
create_account bob $EXAMPLE_ACCOUNT_PUBLIC_KEY $EXAMPLE_ACCOUNT_PRIVATE_KEY
transfer_sys_tokens bob

create_account alice $EXAMPLE_ACCOUNT_PUBLIC_KEY $EXAMPLE_ACCOUNT_PRIVATE_KEY
transfer_sys_tokens alice

echo "All done initializing the blockchain"

if [[ -z $NODEOS_RUNNING ]]; then
  echo "Shut down Nodeos, sleeping for 2 seconds to allow time for at least 4 blocks to be created after deploying contracts"
  sleep 2s
  kill %1
  fg %1
fi
