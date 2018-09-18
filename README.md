*Important*: eosjs2 is under active development and should be considered beta. Improvements and enhancements may break or remove existing functionality. Be sure to lock your dependencies.

## eosjs2

Library for talking to the eos api. transact() is used to sign and push transactions onto the blockchain with an optional configuration object parameter.  This parameter can override the default value of broadcast: true, and can be used to fill TAPOS fields given blocksBehind and expireSeconds.  Given no configuration options, transactions are expected to be unpacked with TAPOS fields (expiration, ref_block_num, ref_block_prefix) and will automatically be broadcast onto the chain.

## Running Tests

`npm run build-web` or `yarn build-web`
Open `test.html` in your browser of choice

*These tests assume that you have a local node for EOS set up at localhost:8000. The test.html file should run through 5 test cases with the final showing an exception on the screen for missing required TAPOS.*

## Browser Usage Example

`npm run build-web` or `yarn build-web`

#### IE11 and Edge Support
If you need to support IE11 or Edge you will also need to install a text-encoding polyfill as eosjs2 Signing is dependent on the TextEncoder which IE11 and Edge do not provide.  Pass the TextEncoder and TextDecoder to the API constructor as demonstrated in the [ES 2015 example](#node-es-2015).  Refer to the documentation here https://github.com/inexorabletash/text-encoding to determine the best way to include it in your project.

Reuse the `api` object for all transactions; it caches ABIs to reduce network usage. Only call `new eosjs2.Api(...)` once.

```html
<pre style="width: 100%; height: 100%; margin:0px; "></pre>

<script src='dist-web/eosjs2-debug.js'></script>
<script src='dist-web/eosjs2-jsonrpc-debug.js'></script>
<script src='dist-web/eosjs2-jssig-debug.js'></script>
<script>
  let pre = document.getElementsByTagName('pre')[0];
  const defaultPrivateKey = "5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr"; // useraaaaaaaa
  const rpc = new eosjs2_jsonrpc.JsonRpc('http://127.0.0.1:8000');
  const signatureProvider = new eosjs2_jssig.default([defaultPrivateKey]);
  const api = new eosjs2.Api({ rpc, signatureProvider });

  (async () => {
    try {
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
      pre.textContent += '\n\nTransaction pushed!\n\n' + JSON.stringify(result, null, 2);
    } catch (e) {
      pre.textContent = '\nCaught exception: ' + e;
      if (e instanceof eosjs2_jsonrpc.RpcError)
        pre.textContent += '\n\n' + JSON.stringify(e.json, null, 2);
    }
  })();
</script>
```

## <a name="node-es-2015">Node / ES2015 Usage Example</a>

Note: tested with Node v10.3.0. Older versions need older syntax.

Reuse the `api` object for all transactions; it caches ABIs to reduce network usage. Only call `new eosjs2.Api(...)` once.

`npm install eosjs2` or `yarn add eosjs2`

```javascript
const eosjs2 = require('eosjs2');
const fetch = require('node-fetch');                            // node only; not needed in browsers
const { TextDecoder, TextEncoder } = require('text-encoding');  // node, IE11 and IE Edge Browsers

const defaultPrivateKey = "5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr"; // useraaaaaaaa
const rpc = new eosjs2.Rpc.JsonRpc('http://127.0.0.1:8000', { fetch });
const signatureProvider = new eosjs2.SignatureProvider([defaultPrivateKey]);
const api = new eosjs2.Api({ rpc, signatureProvider, textDecoder: new TextDecoder, textEncoder: new TextEncoder });

(async () => {
  try {
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
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.log('Caught exception: ' + e);
    if (e instanceof eosjs2.Rpc.RpcError)
      console.log(JSON.stringify(e.json, null, 2));
  }
})();
```

## Example: Buy ram

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

## Example: Stake

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

## Example: Create New Account (multiple actions)

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
