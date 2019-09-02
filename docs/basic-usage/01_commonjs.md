To import `eosjs` using commonjs follow the code below.
```javascript
const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch'); //node only
const { TextDecoder, TextEncoder } = require('util'); //node only

const privateKeys = [privateKey1];

const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch }); //required to read blockchain state
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() }); //required to submit transactions
```

### Reading Blockchain State
Note that reading blockchain state requires only an instance of `JsonRpc` connected to a node and not the `Api` object.  

### Sending Transactions and Triggering Actions
To send transactions and trigger actions on the blockchain, you must have an instance of `Api`.  This `Api` instance is required to receive a `SignatureProvider` object in it's constructor.  The `SignatureProvider` object must contain the private keys corresponding to the actors and permission requirements of the actions being executed.