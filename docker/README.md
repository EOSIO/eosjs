Dockerized eosio instance for development and testing.  This container
is designed to reset its blockchain and wallet state upon shutdown.

# Nodeosd from Docker Hub

Configure:

```bash
docker-compose.yml:
    image: ${EOSIO_IMAGE-eosio/eos}

# If you need to change the docker image
echo "EOSIO_IMAGE=eosio/eos:latest" > .env
```

Build:

```bash
docker-compose build
```

# Nodeosd from GitHub (build from scratch)

Build:

```bash
# master branch
EOSIO_DOCKER=Dockerfile.build docker-compose build

# other branch
EOSIO_DOCKER=Dockerfile.build docker-compose build --build-arg branch=other
```

# Localnet

Starting and stopping an eosio instance:

```js
./up.sh
docker-compose down
```

See [./up.sh](./up.sh) for a private key and funded test accounts.

# Unit Test

Run all unit test in a temporary instance.  Note, this script will run
`npm install` in the eosjs directory.

`./run_tests.sh`

# Misc

## Obtain files from a running container

After ./up.sh

```bash
docker exec docker_nodeos_1 ls /opt/eosio/bin
docker exec docker_nodeos_1 ls /contracts

docker cp docker_nodeos_1:/opt/eosio/bin/nodeos .
```

## Stopped container (obtaining files)

```bash
# Note, update release
docker run --rm -it eosio/eos:latest ls /opt/eosio/bin
docker run -v "$(pwd):/share" --rm -it eosio/eos:latest cp /opt/eosio/bin/nodeos /share
```
