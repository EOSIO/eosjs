[![Build Status](https://travis-ci.org/EOSIO/eosjs.svg?branch=master)](https://travis-ci.org/EOSIO/eosjs)
[![NPM](https://img.shields.io/npm/v/eosjs.svg)](https://www.npmjs.org/package/eosjs)

| [EOSIO/eosjs](/EOSIO/eosjs) | [Npm](https://www.npmjs.com/package/eosjs) | [EOSIO/eos](/EOSIO/eos) | [Docker Hub](https://hub.docker.com/r/eosio/eos/) |
| --- | --- | --- | --- |
| tag: 14.x.x | `npm install eosjs` (version 14) | tag: v1.0.1 | eosio/eos:v1.0.1 |
| tag: 13.x.x | `npm install eosjs` (version 13) | tag: dawn-v4.2.0 | eosio/eos:20180526 |
| tag: 12.x.x | `npm install eosjs` (version 12) | tag: dawn-v4.1.0 | eosio/eos:20180519 |
| tag: 11.x.x | `npm install eosjs@dawn4` (version 11) | tag: dawn-v4.0.0 | eosio/eos:dawn-v4.0.0 |
| tag: 9.x.x | `npm install eosjs@dawn3` (version 9) | tag: DAWN-2018-04-23-ALPHA | eosio/eos:DAWN-2018-04-23-ALPHA | [local docker](https://github.com/EOSIO/eosjs/tree/DAWN-2018-04-23-ALPHA/docker) |
| tag: 8.x.x | `npm install eosjs@8` (version 8) | tag: dawn-v3.0.0 | eosio/eos:dawn3x |
| branch: dawn2 | `npm install eosjs` | branch: dawn-2.x | eosio/eos:dawn2x |

# Eosjs

General purpose library for the EOS blockchain.

### Usage (read-only)

```javascript
Eos = require('eosjs') // Eos = require('./src')

eos = Eos() // 127.0.0.1:8888

// All API methods print help when called with no-arguments.
eos.getBlock()

// Next, you're going to need nodeosd running on localhost:8888 (see ./docker)

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
* [history.json](https://github.com/EOSIO/eosjs-api/blob/master/src/api/v1/history.json)

### Configuration

```js
Eos = require('eosjs') // Eos = require('./src')

// Optional configuration..
config = {
  chainId: null, // 32 byte (64 char) hex string
  keyProvider: ['PrivateKeys...'], // WIF string or array of keys..
  httpEndpoint: 'http://127.0.0.1:8888',
  mockTransactions: () => 'pass', // or 'fail'
  transactionHeaders: (expireInSeconds, callback) => {
    callback(null/*error*/, headers)
  },
  expireInSeconds: 60,
  broadcast: true,
  debug: false, // API and transactions
  sign: true
}

eos = Eos(config)
```

* **chainId** - Unique ID for the blockchain you're connecting too.  This is
  required for valid transaction signing.  The chainId is provided via the
  [get_info](http://ayeaye.cypherglass.com:8888/v1/chain/get_info) API call.

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

You'll need to provide the private key in keyProvider.

```javascript
Eos = require('eosjs') // Eos = require('./src')

eos = Eos({keyProvider: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'})

// Run with no arguments to print usage.
eos.transfer()

// Usage with options (options are always optional)
options = {broadcast: false}

eos.transfer({from: 'inita', to: 'initb', quantity: '1 SYS', memo: ''}, options)

// Object or ordered args may be used.
eos.transfer('inita', 'initb', '2 SYS', 'memo', options)

// A broadcast boolean may be provided as a shortcut for {broadcast: false}
eos.transfer('inita', 'initb', '1 SYS', '', false)
```

Read-write API methods and documentation are generated from the [eosio_system](https://github.com/EOSIO/eosjs/blob/master/src/schema/eosio_token.json) schema.

For more advanced signing, see `keyProvider` in
[eosjs-keygen](https://github.com/eosio/eosjs-keygen) or
[unit test](https://github.com/EOSIO/eosjs/blob/master/src/index.test.js).

### Shorthand

Shorthand is available for some types such as Asset and Authority.

For example:
* stake_net_quantity: `'1 SYS'` is shorthand for `1.0000 SYS`
* owner: `'EOS6MRy..'` is shorthand for `{threshold: 1, keys: [key: 'EOS6MRy..', weight: 1]}`
* active: `inita` or `inita@active` is shorthand for
  * `{{threshold: 1, accounts: [..actor: inita, permission: active, weight: 1]}}`
  * `inita@other` would replace the permission `active` with `other`


```javascript
Eos = require('eosjs') // Eos = require('./src')

wif = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
pubkey = 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'

eos = Eos({keyProvider: wif})

eos.transaction(tr => {
  tr.newaccount({
    creator: 'inita',
    name: 'mycontract11',
    owner: pubkey,
    active: pubkey
  })
  tr.buyrambytes({
    payer: 'inita',
    receiver: 'mycontract11',
    bytes: 8192
  })
  tr.delegatebw({
    from: 'inita',
    receiver: 'mycontract11',
    stake_net_quantity: '100.0000 SYS',
    stake_cpu_quantity: '100.0000 SYS',
    transfer: 0
  })
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
eos = Eos({..., binaryen})
```

Complete example:

```javascript
Eos = require('eosjs') // Eos = require('./src')

keyProvider = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'

// If you're loading a wasm file, you do not need binaryen. If you're loading
// a "wast" file you can include and configure the binaryen compiler:
//
// $ npm install binaryen@37.0.0
// binaryen = require('binaryen')
// eos = Eos({keyProvider, binaryen})

eos = Eos({keyProvider})

wasm = fs.readFileSync(`docker/contracts/eosio.token/eosio.token.wasm`)
abi = fs.readFileSync(`docker/contracts/eosio.token/eosio.token.abi`)

// Publish contract to the blockchain
eos.setcode('inita', 0, 0, wasm)
eos.setabi('inita', JSON.parse(abi))

// Error reading contract; https://github.com/EOSIO/eos/issues/3159
eos.contract('inita').then(c => inita = c)
inita.create('inita', '1000.0000 CUR', {authorization: 'inita'})
```

### Atomic Operations

Blockchain level atomic operations.  All will pass or fail.

```javascript
Eos = require('eosjs') // Eos = require('./src')

keyProvider = [
  '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
  Eos.modules.ecc.seedPrivate('currency')
]

eos = Eos({keyProvider})

// if either transfer fails, both will fail (1 transaction, 2 messages)
eos.transaction(eos =>
  {
    eos.transfer('inita', 'initb', '1 SYS', '')
    eos.transfer('inita', 'initc', '1 SYS', '')
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
eos.transaction(['currency', 'eosio.token'], ({currency, eosio_token}) => {
  currency.transfer('inita', 'initb', '1 CUR', '')
  eosio_token.transfer('inita', 'initb', '1 SYS', '')
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

eos = Eos({keyProvider: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'})

// returns Promise
eos.transaction({
  actions: [
    {
      account: 'eosio.token',
      name: 'transfer',
      authorization: [{
        actor: 'inita',
        permission: 'active'
      }],
      data: {
        from: 'inita',
        to: 'initb',
        quantity: '7 SYS',
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
es2015 code built in a separate step. If you're changing and testing code,
import from `./src` instead.

```javascript
Eos = require('./src')
eos = Eos()
```

* Fcbuffer

The `eos` instance can provide serialization:

```javascript
// 'asset' is a type but could be any struct or type like: transaction or uint8
type = {type: 1, data: '00ff'}
buffer = eos.fc.toBuffer('extensions_type', type)
assert.deepEqual(type, eos.fc.fromBuffer('extensions_type', buffer))

// ABI Serialization
eos.contract('eosio.token', (error, c) => eosio_token = c)
create = {issuer: 'inita', maximum_supply: '1.0000 SYS'}
buffer = eosio_token.fc.toBuffer('create', create)
assert.deepEqual(create, eosio_token.fc.fromBuffer('create', buffer))
```

Use Node v8+ to `package-lock.json`.

# Related Libraries

These libraries are integrated into `eosjs` seamlessly so you probably do not
need to use them directly.  They are exported here giving more API access or
in some cases may be used standalone.

```javascript
var {format, api, ecc, json, Fcbuffer} = Eos.modules
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
# builds: ./dist/eos.js load with ./dist/index.html

npm run build_browser_test
# builds: ./dist/test.js run with ./dist/test.html
```

```html
<script src="eos.js"></script>
<script>
var eos = Eos()
//...
</script>
```

# Environment

Node and browser (es2015)
