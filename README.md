[![Build Status](https://travis-ci.org/EOSIO/eosjs.svg?branch=master)](https://travis-ci.org/EOSIO/eosjs)
[![NPM](https://img.shields.io/npm/v/eosjs.svg)](https://www.npmjs.org/package/eosjs)

Status: Alpha (this is for eosjs developers)

# Eosjs

General purpose library for the EOS blockchain.

### Usage (read-only)

```javascript
Eos = require('eosjs') // Or Eos = require('./src')

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

Read-only API methods and documentation are generated from  [chain.json](https://github.com/EOSIO/eosjs-json/blob/master/api/v1/chain.json).

### Transaction Options

`options = {broadcast: true, sign: true, expireInSeconds: N, debug: false}`

### Usage (read/write)

```javascript
Eos = require('eosjs') // Or Eos = require('./src')

eos = Eos.Testnet({keyProvider: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'})

// All Eos transactions as of the last update are available.  Run with no
// arguments to print usage.
eos.transfer()

// Usage with options
options = {broadcast: false}
eos.transfer({from: 'inita', to: 'initb', amount: 1, memo: ''}, options)

// Object or ordered args may be used.  Options are optional.
eos.transfer('inita', 'initb', 1, 'memo')

// A broadcast boolean may be provided as a shortcut for {broadcast: false}
eos.transfer('inita', 'initb', 1, '', false)
```

Read-write API methods and documentation are generated from this [schema](https://github.com/EOSIO/eosjs-json/blob/master/schema/generated.json).

For more advanced signing, see `keyProvider` in the [unit test](./index.test.js).

### Shorthand

Shorthand is available for some types such as Asset and Authority.

For example:
* deposit: `'10 EOS'` is shorthand for `{amount: 10, symbol: 'EOS'}`
* owner: `'EOS6MRy..'` is shorthand for `{threshold: 1, keys: [key: 'EOS6MRy..', weight: 1]}`

```javascript
Eos = require('eosjs') // Or Eos = require('./src')

initaPrivate = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
initaPublic = 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'
keyProvider = initaPrivate

eos = Eos.Testnet({keyProvider})

eos.newaccount({
  creator: 'inita',
  name: 'mynewacct',
  owner: initaPublic,
  active: initaPublic,
  recovery: 'inita',
  deposit: '1 EOS'
})

```

### Contract

```javascript
Eos = require('eosjs') // Or Eos = require('./src')
let {ecc} = Eos.modules

initaPrivate = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'

// New deterministic key for the currency account.  Only use a simple
// seedPrivate in production if you want to give away money.
currencyPrivate = ecc.seedPrivate('currency')
currencyPublic = ecc.privateToPublic(currencyPrivate)

keyProvider = [initaPrivate, currencyPrivate]

eos = Eos.Testnet({keyProvider})

eos.newaccount({
  creator: 'inita',
  name: 'currency',
  owner: currencyPublic,
  active: currencyPublic,
  recovery: 'inita',
  deposit: '1 EOS'
})

contractDir = `${process.env.HOME}/eosio/eos/build/contracts/currency`
wast = fs.readFileSync(`${contractDir}/currency.wast`)
abi = fs.readFileSync(`${contractDir}/currency.abi`)

// Publish contract to the blockchain
eos.setcode('currency', 0, 0, wast, abi)

eos.contract('currency', currency =>
  {
    // Transfer is one of any action from the currency.abi "actions" section 
    currency.transfer('currency', 'inita', 1)
  }
  // [options],
  // [callback]
)

```

### Atomic Operations

Blockchain level atomic operations.  All will pass or fail.

```javascript
Eos = require('eosjs') // Or Eos = require('./src')

keyProvider = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'

eos = Eos.Testnet({keyProvider})

eos.transaction(tr =>
  {
    tr.transfer('inita', 'initb', 1, '')
    tr.transfer('inita', 'initc', 1, '')

    // A returned promise or thrown error is handled as expected
  }
  // options,
  // callback
)

```

### Usage (manual)

A manual transaction provides for more flexibility.

* tweak the transaction in a way this API does not provide
* run multiple messages in a single transaction (all or none)

```javascript
Eos = require('eosjs') // Or Eos = require('./src')

eos = Eos.Testnet({keyProvider: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'})

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
        amount: 7,
        memo: ''
      }
    }
  ]
})

```

# Development

From time-to-time the eosjs and eosd binary format will change between releases
so you may need to start `eosd` with the `--skip-transaction-signatures` parameter
to get your transactions to pass.

Note, `package.json` has a "main" pointing to `./lib`.  The `./lib` folder is for
es2015 code built in a separate step.  If your changing and testing code,
import from `./src` instead.

```javascript
Eos = require('./src')
```

Use Node v8+ to `package-lock.json`.

# Related Libraries

These libraries are exported from `eosjs` or may be used separately.

```javascript
var {api, ecc, json, Fcbuffer} = Eos.modules
```

# About

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

# Browser

```bash
git clone https://github.com/EOSIO/eosjs.git
cd eosjs
npm install
npm run build
# builds: ./dist/eos.js
```

```html
<script src="eos.js"></script>
<script>
var eos = Eos.Testnet()
//...
</script>
```

# Environment

Node 6+ and browser (browserify, webpack, etc)

React Native should work, create an issue if you find a bug.
