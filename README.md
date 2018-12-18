⚠️ ***Important! We recently released a major breaking rewrite for eosjs. Be sure to lock your dependencies.*** ⚠️

If you are looking for the the previous version of `eosjs` you can [find it here](https://github.com/EOSIO/eosjs/tree/v16.0.9).

# eosjs

Javascript API for integration with EOSIO-based blockchains using [EOSIO RPC API](https://developers.eos.io/eosio-nodeos/reference).

Documentation can be found [here](https://eosio.github.io/eosjs)

## Installation

### NodeJS Dependency

`npm install eosjs@beta` or `yarn add eosjs@beta`

### Browser Distribution

Clone this repository locally then run `npm run build-web` or `yarn build-web`.  The browser distribution will be located in `dist-web` and can be directly copied into your project repository. The `dist-web` folder contains minified bundles ready for production, along with source mapped versions of the library for debugging.  For full browser usage examples, [see the documentation](https://eosio.github.io/eosjs/guides/1.-Browsers.html).

## Import

### ES Modules

Importing using ES6 module syntax in the browser is supported if you have a transpiler, such as Babel.
```js
import { Api, JsonRpc, RpcError } from 'eosjs';

import JsSignatureProvider from 'eosjs/dist/eosjs-jssig'; // development only
```

### CommonJS 

Importing using commonJS syntax is supported by NodeJS out of the box.
```js
const { Api, JsonRpc, RpcError } = require('eosjs');
const JsSignatureProvider = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                            // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');           // node only; native TextEncoder/Decoder 
const { TextEncoder, TextDecoder } = require('text-encoding');  // React Native, IE11, and Edge Browsers only
```

## Basic Usage

### Signature Provider

The Signature Provider holds private keys and is responsible for signing transactions.

***Using the JsSignatureProvider in the browser is not secure and should only be used for development purposes. Use a secure vault outside of the context of the webpage to ensure security when signing transactions in production***

```js
const defaultPrivateKey = "5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr"; // useraaaaaaaa
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
```

### JSON-RPC

Open a connection to JSON-RPC, include `fetch` when on NodeJS.
```js
const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });
```

### API

Include textDecoder and textEncoder when using in browser.
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

### Automated Unit Test Suite
`npm run test` or `yarn test`

### Web Integration Test Suite
Run `npm run build-web` to build the browser distrubution then open `src/tests/web.html` in the browser of your choice.  The file should run through 6 tests, relaying the results onto the webpage with a 2 second delay after each test.  The final 2 tests should relay the exceptions being thrown onto the webpage for an invalid transaction and invalid rpc call.
