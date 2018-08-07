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

The [EOSIO developer docs](https://developers.eos.io/eosio-nodeos/docs/docker-quickstart) uses a `cleos` alias too.  If you see “No such container: eosio”, run ‘unalias cleos’ and try again.

# Unit Test

Run all unit test in a temporary instance.  Note, this script will run
`npm install` in the eosjs directory.

`./run_tests.sh`

# Running container

After ./up.sh

```bash
docker exec docker_nodeosd_1 ls /opt/eosio/bin
docker exec docker_nodeosd_1 ls /contracts
docker cp docker_nodeosd_1:/opt/eosio/bin/nodeos .

# Or setup an environment:
. ./dockerc.sh
keosd ls /opt/eosio/bin
cleos --help
```

# Stopped container

```bash
# Note, update release
docker run --rm -it eosio/eos:latest ls /opt/eosio/bin
docker run -v "$(pwd):/share" --rm -it eosio/eos:latest cp /opt/eosio/bin/nodeos /share
```

