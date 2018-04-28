[![Build Status](https://travis-ci.org/EOSIO/eosjs.svg?branch=master)](https://travis-ci.org/EOSIO/eosjs)
[![NPM](https://img.shields.io/npm/v/eosjs.svg)](https://www.npmjs.org/package/eosjs)

### The current public Testnet release of eosjs is built for Dawn 2.x
You can find the current stable branch of eos here: https://github.com/EOSIO/eos/tree/dawn-2.x

Newer releases are available by running your own EOS node:

| Version | [EOSIO/eosjs](/EOSIO/eosjs) | [Npm](https://www.npmjs.com/package/eosjs) | [EOSIO/eos](/EOSIO/eos) | [Docker](https://hub.docker.com/r/eosio/eos/) | Node |
| --- | --- | --- | --- | --- | --- |
| DAWN-2018-04-23-ALPHA | branch: DAWN-2018-04-23-ALPHA | `npm install eosjs@dawn3` (version 9) | branch: DAWN-2018-04-23-ALPHA | eosio/eos:DAWN-2018-04-23-ALPHA | [local docker](https://github.com/EOSIO/eosjs/tree/DAWN-2018-04-23-ALPHA/docker) |
| dawn3 | branch: master | `npm install eosjs@8` (version 8) | branch: master | eosio/eos:dawn3x | [local docker](https://github.com/EOSIO/eosjs/tree/master/docker) |
| dawn2 | branch: dawn2 | `npm install eosjs` | branch: dawn-2.x | eosio/eos:dawn2x | http or [https://t1readonly.eos.io](https://t1readonly.eos.io/v1/chain/get_info) |

# Eosjs

General purpose library for the EOS blockchain.

### Usage (read-only)

```javascript
Eos = require('eosjs') // Eos = require('./src')

// eos = Eos.Localnet() // 127.0.0.1:8888
eos = Eos.Testnet() // testnet at eos.io

// All API methods print help when called with no-arguments.
eos.getBlock()

// Next, your going to need nodeos running on localhost:8888

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
* [chain.json](https://github.com/EOSIO/eosjs-api/blob/master/src/api/v1/chain.json)
* [account_history.json](https://github.com/EOSIO/eosjs-api/blob/master/src/api/v1/account_history.json)

### Configuration

```js
Eos = require('eosjs') // Eos = require('./src')

// Optional configuration..
config = {
  keyProvider: ['PrivateKeys...'], // WIF string or array of keys..
  httpEndpoint: 'http://127.0.0.1:8888',
  mockTransactions: () => 'pass', // or 'fail'
  transactionHeaders: (expireInSeconds, callback) => {
    callback(null/*error*/, headers)
  },
  expireInSeconds: 60,
  broadcast: true,
  debug: false,
  sign: true
}

eos = Eos.Localnet(config)
```

* `mockTransactions` (optional)
  * `pass` - do not broadcast, always pretend that the transaction worked
  * `fail` - do not broadcast, pretend the transaction failed
  * `null|undefined` - broadcast as usual

* `transactionHeaders` (optional) - manually calculate transaction header.  This
  may be provided so eosjs does not need to make header related API calls to
  nodeos.  This callback is called for every transaction.
  Headers are documented here [eosjs-api#headers](https://github.com/EOSIO/eosjs-api/blob/HEAD/docs/index.md#headers--object).

### Options

Options may be provided immediately after parameters.

Example: `eos.transfer(params, options)`

```js
options = {
  broadcast: true,
  sign: true,
  authorization: null
}
```

* **authorization** `{array<auth>|auth}` - identifies the
  signing account and permission typically in a multi-sig
  configuration.  Authorization may be a string formatted as
  `account@permission` or an `object<{actor: account, permission}>`.
  * If missing default authorizations will be calculated.
  * If provided additional authorizations will not be added.
  * Sorting is always performed (by account name).

### Usage (read/write)

If you use the Testnet, you'll need to replace the private key in keyProvider.

```javascript
Eos = require('eosjs') // Eos = require('./src')

eos = Eos.Localnet({keyProvider: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'})

// Run with no arguments to print usage.
eos.transfer()

// Usage with options (options are always optional)
options = {broadcast: false}
eos.transfer({from: 'inita', to: 'initb', quantity: '1 EOS', memo: ''}, options)

// Object or ordered args may be used.
eos.transfer('inita', 'initb', '2 EOS', 'memo', options)

// A broadcast boolean may be provided as a shortcut for {broadcast: false}
eos.transfer('inita', 'initb', '1 EOS', '', false)
```

Read-write API methods and documentation are generated from the [eosio_system](https://github.com/EOSIO/eosjs/blob/master/src/schema/eosio_system.json) schema.

For more advanced signing, see `keyProvider` in
[eosjs-keygen](https://github.com/eosio/eosjs-keygen) or
[unit test](https://github.com/EOSIO/eosjs/blob/master/src/index.test.js).

### Shorthand

Shorthand is available for some types such as Asset and Authority.

For example:
* deposit: `'1 EOS'` is shorthand for `1.0000 EOS`
* owner: `'EOS6MRy..'` is shorthand for `{threshold: 1, keys: [key: 'EOS6MRy..', weight: 1]}`
* recovery: `inita` or `inita@active` is shorthand
  * `{{threshold: 1, accounts: [..actor: inita, permission: active, weight: 1]}}`
  * `inita@other` would replace the permission `active` with `other`


```javascript
Eos = require('eosjs') // Eos = require('./src')

initaPrivate = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
initaPublic = 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'
keyProvider = initaPrivate

eos = Eos.Localnet({keyProvider})

eos.newaccount({
  creator: 'inita',
  name: 'mynewacct',
  owner: initaPublic,
  active: initaPublic,
  recovery: 'inita'
})

```

### Contract

Deploy a smart contract.

The `setcode` command accepts WASM text and converts this to binary before
signing and broadcasting.  For this, the Binaryen library is used.  Because
this is a large library it is not included in `eosjs` by default.

Add binaryen to your project:

```bash
npm i binaryen@37.0.0
```

Although the EOS back-end does seek to be up-to-date and have
binaryen backwards compatibility, new versions of binaryen may be
[problematic](https://github.com/EOSIO/eos/issues/2187).

Import and include the library when you configure Eos:

```javascript
binaryen = require('binaryen')
eos = Eos.Testnet({..., binaryen})
```

Complete example:

```javascript
Eos = require('eosjs') // Eos = require('./src')
let {ecc} = Eos.modules

initaPrivate = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'

// New deterministic key for the currency account.  Only use a simple
// seedPrivate in production if you want to give away money.
currencyPrivate = ecc.seedPrivate('currency')
currencyPublic = ecc.privateToPublic(currencyPrivate)

keyProvider = [initaPrivate, currencyPrivate]

//  Requires a large library, separate from the eosjs bundle
// $ npm install binaryen@37.0.0
binaryen = require('binaryen')

eos = Eos.Localnet({keyProvider, binaryen})

eos.newaccount({
  creator: 'inita',
  name: 'currency',
  owner: currencyPublic,
  active: currencyPublic,
  recovery: 'inita'
})

contractDir = `${process.env.HOME}/eosio/dawn3/build/contracts/currency`
wast = fs.readFileSync(`${contractDir}/currency.wast`)
abi = fs.readFileSync(`${contractDir}/currency.abi`)

// Publish contract to the blockchain
eos.setcode('currency', 0, 0, wast)
eos.setabi('currency', JSON.parse(abi))

currency = null
// eos.contract(account<string>, [options], [callback])
eos.contract('currency').then(contract => currency = contract)

// Issue is one of the actions in currency.abi
currency.issue('inita', '1000.0000 CUR', {authorization: 'currency'})

```

### Atomic Operations

Blockchain level atomic operations.  All will pass or fail.

```javascript
Eos = require('eosjs') // Eos = require('./src')

keyProvider = [
  '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
  Eos.modules.ecc.seedPrivate('currency')
]

eos = Eos.Localnet({keyProvider})

// if either transfer fails, both will fail (1 transaction, 2 messages)
eos.transaction(eos =>
  {
    eos.transfer('inita', 'initb', '1 EOS', '')
    eos.transfer('inita', 'initc', '1 EOS', '')
    // Returning a promise is optional (but handled as expected)
  }
  // [options],
  // [callback]
)

// transaction on a single contract
eos.transaction('currency', currency => {
  currency.transfer('inita', 'initb', '1 CUR', '')
})

// mix contracts in the same transaction
eos.transaction(['currency', 'eosio'], ({currency, eosio}) => {
  currency.transfer('inita', 'initb', '1 CUR', '')
  eosio.transfer('inita', 'initb', '1 EOS', '')
})

// contract lookups then transactions
eos.contract('currency').then(currency => {
  currency.transaction(cur => {
    cur.transfer('inita', 'initb', '1 CUR', '')
    cur.transfer('initb', 'initc', '1 CUR', '')
  })
  currency.transfer('inita', 'initb', '1 CUR', '')
})

// Note, the contract method does not take an array.  Just use Await or yield
// if multiple contracts are needed outside of a transaction.

```

### Usage (manual)

A manual transaction provides for more flexibility.

```javascript
Eos = require('eosjs') // Eos = require('./src')

eos = Eos.Localnet({keyProvider: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'})

// returns Promise
eos.transaction({
  actions: [
    {
      account: 'eosio',
      name: 'transfer',
      authorization: [{
        actor: 'inita',
        permission: 'active'
      }],
      data: {
        from: 'inita',
        to: 'initb',
        quantity: '7 EOS',
        memo: ''
      }
    }
  ]
})

```

# Development

From time-to-time the eosjs and nodeos binary format will change between releases
so you may need to start `nodeos` with the `--skip-transaction-signatures` parameter
to get your transactions to pass.

Note, `package.json` has a "main" pointing to `./lib`.  The `./lib` folder is for
es2015 code built in a separate step.  If your changing and testing code,
import from `./src` instead.

```javascript
Eos = require('./src')

// Creating the instance `eos` means that common blockchain data-structures are
// available for a given network (Testnet, Mainnet, etc).
eos = Eos.Localnet()
```

* Fcbuffer

The `eos` instance can provide more convenient serialization:

```javascript
// 'nonce' is a struct but could be any type or struct like: uint8 or transaction
nonce = {value: '..'}
nonceBuffer = eos.fc.toBuffer('nonce', nonce)
assert.deepEqual(nonce, eos.fc.fromBuffer('nonce', nonceBuffer))

// Serialization for a smart-contract's Abi:
eos.contract('currency', (error, c) => currency = c)
issue = {to: 'inita', quantity: '1.0000 CUR', memo: 'memo'}
issueBuffer = currency.fc.toBuffer('issue', issue)
assert.deepEqual(issue, currency.fc.fromBuffer('issue', issueBuffer))
```

Use Node v8+ to `package-lock.json`.

# Related Libraries

These libraries are integrated into `eosjs` seamlessly so you probably do not
need to use them directly.  They are exported here giving more API access or
in some cases may be used standalone.

```javascript
var {api, ecc, json, Fcbuffer, format} = Eos.modules
```
* format [./format.md](./docs/format.md)
  * Blockchain name validation
  * Asset string formatting

* eosjs-api [[Github](https://github.com/eosio/eosjs-api), [NPM](https://www.npmjs.org/package/eosjs-api)]
  * Remote API to an EOS blockchain node (nodeos)
  * Use this library directly if you need read-only access to the blockchain
    (don't need to sign transactions).

* eosjs-ecc [[Github](https://github.com/eosio/eosjs-ecc), [NPM](https://www.npmjs.org/package/eosjs-ecc)]
  * Private Key, Public Key, Signature, AES, Encryption / Decryption
  * Validate public or private keys
  * Encrypt or decrypt with EOS compatible checksums
  * Calculate a shared secret

* json {[api](https://github.com/EOSIO/eosjs-api/blob/master/src/api), [schema](https://github.com/EOSIO/eosjs/blob/master/src/schema)},
  * Blockchain definitions (api method names, blockchain schema)

* eosjs-keygen [[Github](https://github.com/eosio/eosjs-keygen), [NPM](https://www.npmjs.org/package/eosjs-keygen)]
  * private key storage and key management

* Fcbuffer [[Github](https://github.com/eosio/eosjs-fcbuffer), [NPM](https://www.npmjs.org/package/fcbuffer)]
  * Binary serialization used by the blockchain
  * Clients sign the binary form of the transaction
  * Allows client to know what it is signing


# Browser

```bash
git clone https://github.com/EOSIO/eosjs.git
cd eosjs
npm install
npm run build_browser
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

Node and browser (es2015)
