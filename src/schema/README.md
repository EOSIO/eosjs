# Schema Blockchain Operations

These operations update the blockchain.  Because these are signed and stored in
binary format a serialization and deserialization library is needed.

* [fcbuffer](https://github.com/EOSIO/eosjs-fcbuffer) - JavaScript

The `eosio.system.json` file is generated and may be updated as follows:

```bash
cd ~/eosjs/docker && ./up.sh
cd ~/eosjs/bin && ./eosio-system-update.sh
```
