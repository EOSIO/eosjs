[![Build Status](https://travis-ci.org/eosjs/eosjs.svg?branch=master)](https://travis-ci.org/eosjs/eosjs)
[![NPM](https://img.shields.io/npm/v/eosjs.svg)](https://www.npmjs.org/package/eosjs)

Status: Alpha (this is for eosjs library developers)

# Eos Js

General purpose library for the EOS blockchain.

## Usage

```javascript
Eos = require('eosjs') // Or Eos = require('.')

// API, note: testnet uses eosd at localhost (until there is a testnet)
testnet = Eos.Testnet()

// For promises instead of callbacks, use something like npmjs 'sb-promisify'
callback = (err, res) => {err ? console.error(err) : console.log(res)}

// All API methods print help when called with no-arguments.
// More docs at https://github.com/eosjs/api
testnet.getBlock()

// Your going to need localhost:8888
testnet.getBlock(1, callback)

// Transaction
testnet.transaction({
  messages: [
    //... TODO

  ],
  sign: ['5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'],
  permissions: [],
}, callback)

```

# Related Libraries

These lower level libraries are exported from `eosjs` or may be used separately.

## From this package

```javascript
var {api, ecc, json, Fcbuffer} = Eos.modules
```

## About

* eosjs-api [[Github](https://github.com/eosjs/api), [NPM](https://www.npmjs.org/package/eosjs-api)]
  * Remote API to an EOS blockchain node (eosd)
  * Use this library directly if you need read-only access to the blockchain
    (don't need to sign transactions).

* eosjs-ecc [[Github](https://github.com/eosjs/ecc), [NPM](https://www.npmjs.org/package/eosjs-ecc)]
  * Private Key, Public Key, Signature, AES, Encryption / Decryption
  * Validate public or private keys
  * Encrypt or decrypt with EOS compatible checksums
  * Calculate a shared secret

* eosjs-json [[Github](https://github.com/eosjs/json), [NPM](https://www.npmjs.org/package/eosjs-json)]
  * Blockchain definitions (api method names, blockchain operations, etc)
  * Maybe used by any language that can parse json
  * Kept up-to-date

* fcbuffer [[Github](https://github.com/eosjs/fcbuffer), [NPM](https://www.npmjs.org/package/fcbuffer)]
  * Binary serialization used by the blockchain
  * Clients sign the binary form of the transaction
  * Essential so the client knows what it is signing

# Example Transactions

```javascript
var {json, Fcbuffer} = Eos.modules

// Example Transactions
json.schema.Message // with docs

// More complex structures
structs = Fcbuffer(json.schema, {defaults: true}).structs
structs.newaccount.toObject()
structs.newaccount.toObject().owner
```

# Environment

Node 6+ and browser (browserify, webpack, etc)
