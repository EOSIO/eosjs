[![Build Status](https://travis-ci.org/EOSIO/eosjs.svg?branch=master)](https://travis-ci.org/EOSIO/eosjs)
[![NPM](https://img.shields.io/npm/v/eosjs.svg)](https://www.npmjs.org/package/eosjs)

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

API methods and documentation are generated from:
* [chain.json](https://github.com/EOSIO/eosjs-json/blob/master/api/v1/chain.json)
* [account_history.json](https://github.com/EOSIO/eosjs-json/blob/master/api/v1/account_history.json)

### Configuration

```js
Eos = require('eosjs') // Or Eos = require('./src')

config = {
  httpEndpoint: 'http://127.0.0.1:8888',
  expireInSeconds: 60,
  broadcast: true,
  debug: false,
  sign: true
}

eos = Eos.Testnet(config)
```

### Options

Options may be provided immediately after parameters.

Example: `eos.transfer(params, options)`

```js
options = {
  broadcast: true,
  sign: true,
  scope: null,
  authorization: null
}
```

* **scope** `{array<string>|string}` - account name or names that may
  undergo a change in state.
  * If missing default scopes will be calculated.
  * If provided additional scopes will not be added.
  * Sorting is always performed.

* **authorization** `{array<auth>|auth}` - identifies the
  signing account and permission typically in a multi-sig
  configuration.  Authorization may be a string formatted as
  `account@permission` or an `object<{account, permission}>`.
  * If missing default authorizations will be calculated.
  * If provided additional authorizations will not be added.
  * Sorting is always performed (by account name).

### Usage (read/write)

```javascript
Eos = require('eosjs') // Or Eos = require('./src')

eos = Eos.Testnet({keyProvider: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'})

// Run with no arguments to print usage.
eos.transfer()

// Usage with options (options are always optional)
options = {broadcast: false}
eos.transfer({from: 'inita', to: 'initb', amount: 1, memo: ''}, options)

// Object or ordered args may be used.
eos.transfer('inita', 'initb', 1, 'memo', options)

// A broadcast boolean may be provided as a shortcut for {broadcast: false}
eos.transfer('inita', 'initb', 1, '', false)
```

Read-write API methods and documentation are generated from this [schema](https://github.com/EOSIO/eosjs-json/blob/master/schema/generated.json).

For more advanced signing, see `keyProvider` in the [unit test](./index.test.js).

### Shorthand

Shorthand is available for some types such as Asset and Authority.

For example:
* deposit: `'1 EOS'` is shorthand for `1.0000 EOS`
* owner: `'EOS6MRy..'` is shorthand for `{threshold: 1, keys: [key: 'EOS6MRy..', weight: 1]}`
* recovery: `inita` or `inita@active` is shorthand
  * `{{threshold: 1, accounts: [..account: inita, permission: active, weight: 1]}}`
  * `inita@other` would replace the permission `active` with `other`


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

// eos.contract(code<string>, [options], [callback])
eos.contract('currency').then(currency => {
  // Transfer is one of the actions in currency.abi 
  currency.transfer('currency', 'inita', 10)
})

```

### Atomic Operations

Blockchain level atomic operations.  All will pass or fail.

```javascript
Eos = require('eosjs') // Or Eos = require('./src')

keyProvider = [
  '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
  Eos.modules.ecc.seedPrivate('currency')
]

testnet = Eos.Testnet({keyProvider})

// if either transfer fails, both will fail (1 transaction, 2 messages)
testnet.transaction(eos =>
  {
    eos.transfer('inita', 'initb', 1, '')
    eos.transfer('inita', 'initc', 1, '')
    // Returning a promise is optional (but handled as expected)
  }
  // [options],
  // [callback]
)

// transaction on a single contract
testnet.transaction('currency', currency => {
  currency.transfer('inita', 'initd', 1)
})

// mix contracts in the same transaction
testnet.transaction(['currency', 'eos'], ({currency, eos}) => {
  currency.transfer('inita', 'initd', 1)
  eos.transfer('inita', 'initd', 1, '')
})

// contract lookups then transactions
testnet.contract('currency').then(currency => {
  currency.transaction(tr => {
    tr.transfer('inita', 'initd', 1)
    tr.transfer('initd', 'inita', 1)
  })
  currency.transfer('inita', 'inite', 1)
})

// Note, the contract method does not take an array.  Just use Await or yield
// if multiple contracts are needed outside of a transaction.

```

### Usage (manual)

A manual transaction provides for more flexibility.

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
