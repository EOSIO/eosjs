[![Build Status](https://travis-ci.org/eosjs/eosjs.svg?branch=master)](https://travis-ci.org/eosjs/eosjs)
[![NPM](https://img.shields.io/npm/v/eosjs.svg)](https://www.npmjs.org/package/eosjs)

Status: Alpha (this is for eosjs library developers)

# Eosjs

General purpose library for the EOS blockchain.

### Usage (read-only)

```javascript
Eos = require('eosjs') // Or Eos = require('.')

// API, note: testnet uses eosd at localhost (until there is a testnet)
eos = Eos.Testnet()

// All API methods print help when called with no-arguments.
eos.getBlock()

// Next, your going to need eosd running on localhost:8888

// If a callback is not provided, a Promise is returned
eos.getBlock(1).then(result => {console.log(result)})

// Parameters can be sequential or an object
eos.getBlock({block_num_or_id: 1}).then(result => console.log(result))

// Callbacks are similar
callback = (err, res) => {err ? console.error(err) : console.log(res)}
eos.getBlock(1, callback)
eos.getBlock({block_num_or_id: 1}, callback)

// Provide an empty object or a callback if an API call has no arguments
eos.getInfo({}).then(result => {console.log(result)})

```

### Usage (read/write)

Status: all transactions fail to verify in eosd: tx_missing_sigs..  To work-around,
run ./eosd with the `--skip-transaction-signatures` parameter.

```javascript
Eos = require('eosjs') // Or Eos = require('.')

eos = Eos.Testnet({
  signProvider: ({authorization, buf, sign}) => {
    // Example: account === 'inita' && permission === 'active'
    const {account, permission} = authorization

    // 'sign' returns a hex string. A Promise resolving to a Hex string works too.
    return sign(buf, '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3')
  }
})

// All Eos transactions as of the last update are available.  Run with no
// arguments to print usage.
eos.transfer()

// Object or ordered args may be used
eos.transfer({from: 'inita', to: 'initb', amount: 1})
eos.transfer('inita', 'initb', 1)

// A broadcast boolean may be provided allowing any transaction to be created
// but not sent.
eos.transfer({from: 'inita', to: 'initb', amount: 1, broadcast: false})
eos.transfer('inita', 'initb', 1, false)

```

### Usage (manual)

A manual transaction provides for more flexibility.

* tweak the transaction in a way this API does not provide
* run multiple messages in a single transaction (all or none)

```javascript

// eos = Eos.Testnet({signProvider: ...})

eos.transaction({
  scope: ['inita', 'initb'],
  messages: [
    {
      code: 'eos',
      type: 'transfer',
      authorization: [{
        account: 'inita',
        permission: 'active'
      }],
      data: {
        from: 'inita',
        to: 'initb',
        amount: 7
      }
    }
  ]
})

```

# Related Libraries

These libraries are exported from `eosjs` or may be used separately.

```javascript
var {api, ecc, json, Fcbuffer} = Eos.modules
```

## About

* eosjs-api [[Github](https://github.com/eosio/eosjs-api), [NPM](https://www.npmjs.org/package/eosjs-api)]
  * Remote API to an EOS blockchain node (eosd)
  * Use this library directly if you need read-only access to the blockchain
    (don't need to sign transactions).

* eosjs-ecc [[Github](https://github.com/eosio/eosjs-ecc), [NPM](https://www.npmjs.org/package/eosjs-ecc)]
  * Private Key, Public Key, Signature, AES, Encryption / Decryption
  * Validate public or private keys
  * Encrypt or decrypt with EOS compatible checksums
  * Calculate a shared secret

* eosjs-json [[Github](https://github.com/eosio/eosjs-json), [NPM](https://www.npmjs.org/package/eosjs-json)]
  * Blockchain definitions (api method names, blockchain operations, etc)
  * Maybe used by any language that can parse json
  * Kept up-to-date

* Fcbuffer [[Github](https://github.com/eosio/eosjs-fcbuffer), [NPM](https://www.npmjs.org/package/fcbuffer)]
  * Binary serialization used by the blockchain
  * Clients sign the binary form of the transaction
  * Essential so the client knows what it is signing


# Environment

Node 6+ and browser (browserify, webpack, etc)

React Native should work, create an issue if you find a bug.
