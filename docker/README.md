Dockerized eosio instance for development and testing.  This container
is designed to reset its blockchain and wallet state upon shutdown.

# Start nodeosd

Starting and stopping an eosio instance:

```js
./up.sh
docker-compose down
```

# Load commands like `cleos`

```bash
. ./dockrc.sh
```

# Configure

Change branch / version:

```bash
echo "VERSION=master" > .env
docker-compose build
```

# Unit Test

Run all unit test in a temporary instance.  Note, this script will run
`npm install` in the eosjs directory.

`./run_tests.sh`

# Running container

After ./up.sh

```bash
docker exec docker_nodeos_1 ls /opt/eosio/bin
docker exec docker_nodeos_1 ls /contracts

docker cp docker_nodeos_1:/opt/eosio/bin/nodeos .
```

# Stopped container

```bash
# Note, update release
docker run --rm -it eosio/eos:latest ls /opt/eosio/bin
docker run -v "$(pwd):/share" --rm -it eosio/eos:latest cp /opt/eosio/bin/nodeos /share
```

