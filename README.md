# eosjs

Javascript API for integration with EOSIO-based blockchains using [EOSIO RPC API](https://developers.eos.io/eosio-nodeos/reference).

Documentation can be found [here](https://eosio.github.io/eosjs)

## Installation

### NodeJS Dependency

`yarn add eosjs`

### Browser Distribution

Clone this repository locally then run `yarn build-web`.  The browser distribution will be located in `dist-web` and can be directly copied into your project repository. The `dist-web` folder contains minified bundles ready for production, along with source mapped versions of the library for debugging.  For full browser usage examples, [see the documentation](https://eosio.github.io/eosjs/guides/1.-Browsers.html).

## Import

### ES Modules

Importing using ES6 module syntax in the browser is supported if you have a transpiler, such as Babel.
```js
import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';           // development only
```

### CommonJS

Importing using commonJS syntax is supported by NodeJS out of the box.
```js
const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                   // node only; native TextEncoder/Decoder
const { TextEncoder, TextDecoder } = require('text-encoding');          // React Native, IE11, and Edge Browsers only
```

## Basic Usage

### Signature Provider

The Signature Provider holds private keys and is responsible for signing transactions.

***Using the JsSignatureProvider in the browser is not secure and should only be used for development purposes. Use a secure vault outside of the context of the webpage to ensure security when signing transactions in production***

```js
const defaultPrivateKey = "5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr"; // bob
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
```

### JSON-RPC

Open a connection to JSON-RPC, include `fetch` when on NodeJS.
```js
const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });
```

### API

Include textDecoder and textEncoder when using in Node, React Native, IE11 or Edge Browsers.
```js
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
```

### Sending a transaction

`transact()` is used to sign and push transactions onto the blockchain with an optional configuration object parameter.  This parameter can override the default value of `broadcast: true`, and can be used to fill TAPOS fields given `blocksBehind` and `expireSeconds`.  Given no configuration options, transactions are expected to be unpacked with TAPOS fields (`expiration`, `ref_block_num`, `ref_block_prefix`) and will automatically be broadcast onto the chain.

```js
(async () => {
  const result = await api.transact({
    actions: [{
      account: 'eosio.token',
      name: 'transfer',
      authorization: [{
        actor: 'useraaaaaaaa',
        permission: 'active',
      }],
      data: {
        from: 'useraaaaaaaa',
        to: 'useraaaaaaab',
        quantity: '0.0001 SYS',
        memo: '',
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  console.dir(result);
})();
```

### Error handling

use `RpcError` for handling RPC Errors
```js
...
try {
  const result = await api.transact({
  ...
} catch (e) {
  console.log('\nCaught exception: ' + e);
  if (e instanceof RpcError)
    console.log(JSON.stringify(e.json, null, 2));
}
...
```

## Running Tests

All tests should be run prior to a pull request being opened to ensure the changes will not break any environment.  This can be accomplished by running `yarn build-production`, which will build all production bundles then run the `yarn test-all` command. 

### Automated Unit Test Suite

`yarn test` will run through the core functionality of each EOSJS module with Jest.

### Integration Test Suite

Integration tests will only work with a local node running on port 8888 and with test accounts "bob" and "alice".  This can be accomplished by following the [EOSIO Developer Getting Started Guide](https://developers.eos.io/eosio-home/docs/getting-the-software#section-step-1-1-start-keosd)

#### Web Environment

Run `yarn build-web` to create the `dist-web` folder and web distrubution modules then `yarn test-web`.  This will run through the `tests/web.html` file using Cypress to inform you on the command line of any test failures.

#### NodeJS Environment

Run `yarn build` to build the NPM distribution bundle then run `yarn test-node`.  This will create an out of box node environment with `tests/node.js` then test that environment with Jest and relay the results to the command line.
