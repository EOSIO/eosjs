Dockerized eosio instance for development and testing.  This container
is designed to reset its blockchain and wallet state upon shutdown.

# Configure

This branch is already configured for a compatible docker:

```bash
egrep image docker-compose.yml 
    image: ${EOSIO_IMAGE-eosio/eos:dawn3x}

# If you need to change the docker image
echo "EOSIO_IMAGE=eosio/eos:dawn4x" > .env 
```

See [./up.sh](./up.sh) for a private key and funded accounts. 

# Localnet

Starting and stopping an eosio instance.

```js
./up.sh
docker-compose down
```

# Unit Test

Run all unit test in a temporary instance.  Note, this script will run
`npm install` in the eosjs directory.

`./run_tests.sh`

# Files

Find and obtain files and executables for use outside of the container.

## Running container (obtaining files)

After running: ./up.sh

```bash
docker exec docker_nodeos_1 ls /opt/eosio/bin
docker exec docker_nodeos_1 ls /contracts

docker cp docker_nodeos_1:/opt/eosio/bin/nodeos .
```

## Stopped container (obtaining files)

```bash
# Note, update release (dawn3x)
docker run --rm -it eosio/eos:dawn3x ls /opt/eosio/bin
docker run -v "$(pwd):/share" --rm -it eosio/eos:dawn3x cp /opt/eosio/bin/nodeos /share
```
