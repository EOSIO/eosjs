[![Build Status](https://travis-ci.org/EOSIO/eosjs.svg?branch=master)](https://travis-ci.org/EOSIO/eosjs)
[![NPM](https://img.shields.io/npm/v/eosjs.svg)](https://www.npmjs.org/package/eosjs)

# Eosjs

General purpose library for EOSIO blockchains.

### Versions

| [EOSIO/eosjs](/EOSIO/eosjs) | [Npm](https://www.npmjs.com/package/eosjs) | [EOSIO/eos](https://github.com/EOSIO/eos) | [Docker Hub](https://hub.docker.com/r/eosio/eos/) |
| --- | --- | --- | --- |
| tag: 16.0.1 | `npm install eosjs` | tag: v1.1.4 | eosio/eos:v1.1.4 |

Prior [version](./docs/prior_versions.md) matrix.

### Usage

* Install with: `npm install eosjs`
* Html script tag, see [releases](https://github.com/EOSIO/eosjs/releases) for the correct **version** and its matching script **integrity** hash.

```html
<!--
sha512-dUt7/CwVCjHz4t894Gk9enCCTkQhaYWVmoQmXfVY6cVSjrG63I2X0yjmySlcLJ00YrHgeBBGGA5h8LOKoPIsOA== lib/eos.js
sha512-22gPq/bBKtvD6mdthugNUuGmYEdKkVnnhvSnl4k62eNPmKoFEmNbmxLIU4Hz/5EsmCX2jsYIwkaiz507wT+fBw== lib/eos.min.js
sha512-JZ6rFW/z2srIZxN+h/lSM/m1k+BEXWLS5Wt1c1RRr9CHxRXWT3ff5l0+zhedOk2kL2ZZNMFqmU4+Q1HPfZ5X3w== lib/eos.min.js.map
-->
<html>
<head>
  <meta charset="utf-8">

  <script src="https://cdn.jsdelivr.net/npm/eosjs@16.0.2/lib/eos.min.js"
    integrity="sha512-22gPq/bBKtvD6mdthugNUuGmYEdKkVnnhvSnl4k62eNPmKoFEmNbmxLIU4Hz/5EsmCX2jsYIwkaiz507wT+fBw=="
    crossorigin="anonymous"></script>

  <script>
  chain = {
    mainnet: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    testnet: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
    sysnet: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
  }
  /**
    Other httpEndpoint's: https://www.eosdocs.io/resources/apiendpoints
  */
  eos = Eos({
    httpEndpoint: 'http://127.0.0.1:8888',
    chainId: chain.sysnet,
    verbose: true
  })
  </script>
</head>
<body>
  See console object: Eos
</body>
</html>
```

### Usage

Ways to instantiate eosjs.

```js
Eos = require('eosjs')

// Private key or keys (array) provided statically or by way of a function.
// For multiple keys, the get_required_keys API is used (more on that below).
keyProvider: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'

// Localhost Testnet (run ./docker/up.sh)
eos = Eos({keyProvider})

// Connect to a testnet or mainnet
eos = Eos({httpEndpoint, chainId, keyProvider})

// Cold-storage
eos = Eos({httpEndpoint: null, chainId, keyProvider})

// Read-only instance when 'eosjs' is already a dependency
eos = Eos.modules.api({/*config*/})

// Read-only instance when an application never needs to write (smaller library)
EosApi = require('eosjs-api')
eos = EosApi({/*config*/})
```

No-arguments prints usage.

```js
eos.getBlock()
```
```json
USAGE
getBlock - Fetch a block from the blockchain.

PARAMETERS
{
  "block_num_or_id": "string"
}
```

Start a nodeosd process.  The docker in this repository provides a setup
that supports the examples in this README.

```bash
cd ./docker && ./up.sh
```

All blockchain functions (read and write) follow this pattern:

```js
// If the last argument is a function it is treated as a callback
eos.getBlock(1, (error, result) => {})

// If a callback is not provided, a Promise is returned
eos.getBlock(1) // @returns {Promise}

// Parameters can be positional or an object
eos.getBlock({block_num_or_id: 1})

// An API with no parameters is invoked with an empty object or callback (avoids logging usage)
eos.getInfo({}) // @returns {Promise}
eos.getInfo((error, result) => { console.log(error, result) })
```

### API Documentation

Chain and history API functions are available after creating the `eos` object.

* [API](https://github.com/EOSIO/eosjs-api/blob/master/docs/api.md#eos--object)

### Configuration

```js
Eos = require('eosjs')

// Default configuration
config = {
  chainId: null, // 32 byte (64 char) hex string
  keyProvider: ['PrivateKeys...'], // WIF string or array of keys..
  httpEndpoint: 'http://127.0.0.1:8888',
  expireInSeconds: 60,
  broadcast: true,
  verbose: false, // API activity
  sign: true
}

eos = Eos(config)
```

* **chainId** `hex` - Unique ID for the blockchain you're connecting to.  This
  is required for valid transaction signing.  The chainId is provided via the
  [get_info](http://ayeaye.cypherglass.com:8888/v1/chain/get_info) API call.

  Identifies a chain by its initial genesis block.  All transactions signed will
  only be valid the blockchain with this chainId.  Verify the chainId for
  security reasons.

* **keyProvider** `[array<string>|string|function]` - Provides private keys
  used to sign transaction.  If multiple private keys are found, the API
  `get_required_keys` is called to discover which signing keys to use.  If a
  function is provided, this function is called for each transaction.

* **httpEndpoint** `string` - http or https location of a nodeosd server
  providing a chain API.  When using eosjs from a browser remember to configure
  the same origin policy in nodeosd or proxy server.  For testing, nodeosd
  configuration `access-control-allow-origin = *` could be used.

  Set this value to **null** for a cold-storage (no network) configuration.

* **expireInSeconds** `number` - number of seconds before the transaction
  will expire.  The time is based on the nodeosd's clock.  An unexpired
  transaction that may have had an error is a liability until the expiration
  is reached, this time should be brief.

* **broadcast** `[boolean=true]` - post the transaction to
  the blockchain.  Use false to obtain a fully signed transaction.

* **verbose** `[boolean=false]` - verbose logging such as API activity.

* **debug** `[boolean=false]` - low level debug logging (serialization).

* **sign** `[boolean=true]` - sign the transaction with a private key.  Leaving
  a transaction unsigned avoids the need to provide a private key.

* **mockTransactions** (advanced)
  * `mockTransactions: () => null // 'pass',  or 'fail'`
  * `pass` - do not broadcast, always pretend that the transaction worked
  * `fail` - do not broadcast, pretend the transaction failed
  * `null|undefined` - broadcast as usual

* **transactionHeaders** (advanced) - manually calculate transaction header.  This
  may be provided so eosjs does not need to make header related API calls to
  nodeos.  Used in environments like cold-storage.  This callback is called for
  every transaction. Headers are documented here [eosjs-api#headers](https://github.com/EOSIO/eosjs-api/blob/HEAD/docs/index.md#headers--object).
  * `transactionHeaders: (expireInSeconds, callback) => {callback(null/*error*/, headers)}`

* **logger** - default logging configuration.
  ```js
  logger: {
    log: config.verbose ? console.log : null,  // null to disable
    error: config.verbose ? console.error : null,
  }
  ```

  Turn off just API logging: `config.logger = {log: null}`

### Options

Options may be provided after parameters.

NOTE: `authorization` is for individual actions, it does not belong in `Eos(config)`.

```js
options = {
  authorization: 'alice@active',
  broadcast: true,
  sign: true
}
```

```js
eos.transfer('alice', 'bob', '1.0000 SYS', '', options)
```

* **authorization** `[array<auth>|auth]` - identifies the
  signing account and permission typically in a multisig
  configuration.  Authorization may be a string formatted as
  `account@permission` or an `object<{actor: account, permission}>`.
  * If missing default authorizations will be calculated.
  * If provided additional authorizations will not be added.
  * Performs deterministic sorting by account name

  If a default authorization is calculated the action's 1st field must be
  an account_name.  The account_name in the 1st field gets added as the
  active key authorization for the action.

* **broadcast** `[boolean=true]` - post the transaction to
  the blockchain.  Use false to obtain a fully signed transaction.

* **sign** `[boolean=true]` - sign the transaction with a private key.  Leaving
  a transaction unsigned avoids the need to provide a private key.

### Transaction

The transaction function accepts the standard blockchain transaction.

Required transaction header fields will be added unless you are signing without a
network connection (httpEndpoint == null). In that case provide you own headers:

```js
// only needed in cold-storage or for offline transactions
const headers = {
  expiration: '2018-06-14T18:16:10'
  ref_block_num: 1,
  ref_block_prefix: 452435776
}
```

Create and send (broadcast) a transaction:

```javascript
/** @return {Promise} */
eos.transaction(
  {
    // ...headers,
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
          quantity: '7.0000 SYS',
          memo: ''
        }
      }
    ]
  }
  // config -- example: {broadcast: false, sign: true}
)
```

### Named action functions

More concise functions are provided for applications that may use actions
more frequently.  This avoids having lots of JSON in the code.

```javascript
// Run with no arguments to print usage.
eos.transfer()

// Callback is last, when omitted a promise is returned
eos.transfer('inita', 'initb', '1.0000 SYS', '', (error, result) => {})
eos.transfer('inita', 'initb', '1.1000 SYS', '') // @returns {Promise}

// positional parameters
eos.transfer('inita', 'initb', '1.2000 SYS', '')

// named parameters
eos.transfer({from: 'inita', to: 'initb', quantity: '1.3000 SYS', memo: ''})

// options appear after parameters
options = {broadcast: true, sign: true}

// `false` is a shortcut for {broadcast: false}
eos.transfer('inita', 'initb', '1.4000 SYS', '', false)
```

Read-write API methods and documentation are generated from the eosio
[token](https://github.com/EOSIO/eosjs/blob/master/src/schema/eosio_token.json) and
[system](https://github.com/EOSIO/eosjs/blob/master/src/schema/eosio_system.json).

Assets amounts require zero padding.  For a better user-experience, if you know
the correct precision you may use DecimalPad to add the padding.

```js
DecimalPad = Eos.modules.format.DecimalPad
userInput = '10.2'
precision = 4
assert.equal('10.2000', DecimalPad(userInput, precision))
```

For more advanced signing, see `keyProvider` and `signProvider` in
[index.test.js](https://github.com/EOSIO/eosjs/blob/master/src/index.test.js).

### Shorthand

Shorthand is available for some types such as Asset and Authority.  This syntax
is only for concise functions and does not work when providing entire transaction
objects to `eos.transaction`..

For example:
* permission `inita` defaults `inita@active`
* authority `'EOS6MRy..'` expands `{threshold: 1, keys: [{key: 'EOS6MRy..', weight: 1}]}`
* authority `inita` expands `{threshold: 1, accounts: [{permission: {actor: 'inita', permission: 'active'}, weight: 1}]}`

### New Account

New accounts will likely require some staked tokens for RAM and bandwidth.

```javascript
wif = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
pubkey = 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'

eos.transaction(tr => {
  tr.newaccount({
    creator: 'eosio',
    name: 'myaccount',
    owner: pubkey,
    active: pubkey
  })

  tr.buyrambytes({
    payer: 'eosio',
    receiver: 'myaccount',
    bytes: 8192
  })

  tr.delegatebw({
    from: 'eosio',
    receiver: 'myaccount',
    stake_net_quantity: '10.0000 SYS',
    stake_cpu_quantity: '10.0000 SYS',
    transfer: 0
  })
})
```

### Contract

Deploy and call smart contracts.

#### Compile

If you're loading a **wasm** file, you do not need binaryen. If you're loading
a **wast** file you can include and configure the binaryen compiler, this is
used to compile to **wasm** automatically when calling **setcode**.

Versions of binaryen may be [problematic](https://github.com/EOSIO/eos/issues/2187).

```bash
$ npm install binaryen@37.0.0
```

```js
binaryen = require('binaryen')
eos = Eos({keyProvider, binaryen})
```

#### Deploy

```javascript
wasm = fs.readFileSync(`docker/contracts/eosio.token/eosio.token.wasm`)
abi = fs.readFileSync(`docker/contracts/eosio.token/eosio.token.abi`)

// Publish contract to the blockchain
eos.setcode('myaccount', 0, 0, wasm) // @returns {Promise}
eos.setabi('myaccount', JSON.parse(abi)) // @returns {Promise}
```

#### Fetch a smart contract

```js
// @returns {Promise}
eos.contract('myaccount', [options], [callback])

// Run immediately, `myaction` returns a Promise
eos.contract('myaccount').then(myaccount => myaccount.myaction(..))

// Group actions. `transaction` returns a Promise but `myaction` does not
eos.transaction('myaccount', myaccount => { myaccount.myaction(..) })

// Transaction with multiple contracts
eos.transaction(['myaccount', 'myaccount2'], ({myaccount, myaccount2}) => {
   myaccount.myaction(..)
   myaccount2.myaction(..)
})
```

#### Offline or cold-storage contract

```js
eos = Eos({httpEndpoint: null})

abi = fs.readFileSync(`docker/contracts/eosio.token/eosio.token.abi`)
eos.fc.abiCache.abi('myaccount', JSON.parse(abi))

// Check that the ABI is available (print usage)
eos.contract('myaccount').then(myaccount => myaccount.create())
```
#### Offline or cold-storage transaction

```js
// ONLINE

// Prepare headers
expireInSeconds = 60 * 60 // 1 hour

eos = Eos(/* {httpEndpoint: 'https://..'} */)

info = await eos.getInfo({})
chainDate = new Date(info.head_block_time + 'Z')
expiration = new Date(chainDate.getTime() + expireInSeconds * 1000)
expiration = expiration.toISOString().split('.')[0]

block = await eos.getBlock(info.last_irreversible_block_num)

transactionHeaders = {
  expiration,
  ref_block_num: info.last_irreversible_block_num & 0xFFFF,
  ref_block_prefix: block.ref_block_prefix
}

// OFFLINE (bring `transactionHeaders`)

// All keys in keyProvider will sign.
eos = Eos({httpEndpoint: null, chainId, keyProvider, transactionHeaders})

transfer = await eos.transfer('inita', 'initb', '1.0000 SYS', '')
transferTransaction = transfer.transaction

// ONLINE (bring `transferTransaction`)

eos = Eos(/* {httpEndpoint: 'https://..'} */)

processedTransaction = await eos.pushTransaction(transferTransaction)
```

#### Custom Token

```js
// more on the contract / transaction syntax

await eos.transaction('myaccount', myaccount => {

  // Create the initial token with its max supply
  // const options = {authorization: 'myaccount'} // default
  myaccount.create('myaccount', '10000000.000 TOK')//, options)

  // Issue some of the max supply for circulation into an arbitrary account
  myaccount.issue('myaccount', '10000.000 TOK', 'issue')
})

const balance = await eos.getCurrencyBalance('myaccount', 'myaccount', 'TOK')
console.log('Currency Balance', balance)
```

### Calling Actions

Other ways to use contracts and transactions.

```javascript
// if either transfer fails, both will fail (1 transaction, 2 messages)
await eos.transaction(eos =>
  {
    eos.transfer('inita', 'initb', '1.0000 SYS', ''/*memo*/)
    eos.transfer('inita', 'initc', '1.0000 SYS', ''/*memo*/)
    // Returning a promise is optional (but handled as expected)
  }
  // [options],
  // [callback]
)

// transaction on a single contract
await eos.transaction('myaccount', myaccount => {
  myaccount.transfer('myaccount', 'inita', '10.000 TOK@myaccount', '')
})

// mix contracts in the same transaction
await eos.transaction(['myaccount', 'eosio.token'], ({myaccount, eosio_token}) => {
  myaccount.transfer('inita', 'initb', '1.000 TOK@myaccount', '')
  eosio_token.transfer('inita', 'initb', '1.0000 SYS', '')
})

// The contract method does not take an array so must be called once for
// each contract that is needed.
const myaccount = await eos.contract('myaccount')
await myaccount.transfer('myaccount', 'inita', '1.000 TOK', '')

// a transaction to a contract instance can specify multiple actions
await myaccount.transaction(myaccountTr => {
  myaccountTr.transfer('inita', 'initb', '1.000 TOK', '')
  myaccountTr.transfer('initb', 'inita', '1.000 TOK', '')
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

// forceActionDataHex = false helps transaction readability but may trigger back-end bugs
config = {verbose: true, debug: false, broadcast: true, forceActionDataHex: true, keyProvider}

eos = Eos(config)
```

#### Fcbuffer

The `eos` instance can provide serialization:

```javascript
// 'asset' is a type but could be any struct or type like: transaction or uint8
type = {type: 1, data: '00ff'}
buffer = eos.fc.toBuffer('extensions_type', type)
assert.deepEqual(type, eos.fc.fromBuffer('extensions_type', buffer))

// ABI Serialization
eos.contract('eosio.token', (error, eosio_token) => {
  create = {issuer: 'inita', maximum_supply: '1.0000 SYS'}
  buffer = eosio_token.fc.toBuffer('create', create)
  assert.deepEqual(create, eosio_token.fc.fromBuffer('create', buffer))
})
```

Use Node v10+ for `package-lock.json`.

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

# Environment

Node and browser (es2015)
