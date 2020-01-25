# Transactions

To send transactions and trigger actions on the blockchain, you must have an instance of `Api`.

The signature provider must contain the private keys corresponding to the actors and permission requirements of the actions being executed.


## CommonJS

```javascript
const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const { TextDecoder, TextEncoder } = require('util');               // node only
const { TextEncoder, TextDecoder } = require('text-encoding');      // React Native, IE11, and Edge Browsers only

const privateKeys = [privateKey1];

const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
```

## ES Modules

```javascript
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';  // development only

const privateKeys = [privateKey1];

const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc('http://127.0.0.1:8888');
const api = new Api({ rpc, signatureProvider })
```

## Examples

### Buy ram

```javascript
const result = await api.transact({
  actions: [{
    account: 'eosio',
    name: 'buyrambytes',
    authorization: [{
      actor: 'useraaaaaaaa',
      permission: 'active',
    }],
    data: {
      payer: 'useraaaaaaaa',
      receiver: 'useraaaaaaaa',
      bytes: 8192,
    },
  }]
}, {
  blocksBehind: 3,
  expireSeconds: 30,
});
```

### Stake

```javascript
const result = await api.transact({
  actions: [{
    account: 'eosio',
    name: 'delegatebw',
    authorization: [{
      actor: 'useraaaaaaaa',
      permission: 'active',
    }],
    data: {
      from: 'useraaaaaaaa',
      receiver: 'useraaaaaaaa',
      stake_net_quantity: '1.0000 SYS',
      stake_cpu_quantity: '1.0000 SYS',
      transfer: false,
    }
  }]
}, {
  blocksBehind: 3,
  expireSeconds: 30,
});
```

## Example: Unstake

```javascript
const result = await api.transact({
  actions: [{
    account: 'eosio',
    name: 'undelegatebw',
    authorization: [{
      actor: 'useraaaaaaaa',
      permission: 'active',
    }],
    data: {
      from: 'useraaaaaaaa',
      receiver: 'useraaaaaaaa',
      unstake_net_quantity: '1.0000 SYS',
      unstake_cpu_quantity: '1.0000 SYS',
      transfer: false,
    }
  }]
}, {
  blocksBehind: 3,
  expireSeconds: 30,
});
```

### Create New Account (multiple actions)

```javascript
const result = await api.transact({
  actions: [{
    account: 'eosio',
    name: 'newaccount',
    authorization: [{
      actor: 'useraaaaaaaa',
      permission: 'active',
    }],
    data: {
      creator: 'useraaaaaaaa',
      name: 'mynewaccount',
      owner: {
        threshold: 1,
        keys: [{
          key: 'PUB_R1_6FPFZqw5ahYrR9jD96yDbbDNTdKtNqRbze6oTDLntrsANgQKZu',
          weight: 1
        }],
        accounts: [],
        waits: []
      },
      active: {
        threshold: 1,
        keys: [{
          key: 'PUB_R1_6FPFZqw5ahYrR9jD96yDbbDNTdKtNqRbze6oTDLntrsANgQKZu',
          weight: 1
        }],
        accounts: [],
        waits: []
      },
    },
  },
  {
    account: 'eosio',
    name: 'buyrambytes',
    authorization: [{
      actor: 'useraaaaaaaa',
      permission: 'active',
    }],
    data: {
      payer: 'useraaaaaaaa',
      receiver: 'mynewaccount',
      bytes: 8192,
    },
  },
  {
    account: 'eosio',
    name: 'delegatebw',
    authorization: [{
      actor: 'useraaaaaaaa',
      permission: 'active',
    }],
    data: {
      from: 'useraaaaaaaa',
      receiver: 'mynewaccount',
      stake_net_quantity: '1.0000 SYS',
      stake_cpu_quantity: '1.0000 SYS',
      transfer: false,
    }
  }]
}, {
  blocksBehind: 3,
  expireSeconds: 30,
});
```
