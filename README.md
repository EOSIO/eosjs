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

## Used from this package

```javascript
var {api, ecc, json, Fcbuffer} = Eos.modules
```

## Used Separately

```bash
npm install eosjs-api
npm install eosjs-ecc
npm install eosjs-json
npm install Fcbuffer
# etc
```

## About

* [eosjs-api](https://github.com/eosjs/api)
  * Remote API to an EOS blockchain node (eosd)
  * Use this library directly if you need read-only access to the blockchain
    (don't need to sign transactions).

* [eosjs-ecc](https://github.com/eosjs/ecc)
  * Private Key, Public Key, Signature, AES, Encryption / Decryption
  * Validate public or private keys
  * Encrypt or decrypt with EOS compatible checksums
  * Calculate a shared secret

* [eosjs-json](https://github.com/eosjs/json)
  * Blockchain definitions (api method names, blockchain operations, etc)
  * Maybe used by any language that can parse json
  * Kept up-to-date

* [fcbuffer](https://github.com/jcalfee/fcbuffer)
  * Binary serialization used by the blockchain
  * Clients sign the binary form of the transaction
  * Essential so the client knows what it is signing

# Example transactions

```javascript
var {api, ecc, json, Fcbuffer} = Eos.modules

structs = Fcbuffer(json.schema, {defaults: true}).structs
var {Message, newaccount, transfer} = structs

// Example Transactions (print the returned object)
Message.toObject()

transfer.toObject()
```

# Environment

Node 6+ and browser (browserify, webpack, etc)
