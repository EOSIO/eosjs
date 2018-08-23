*Important*: eosjs2 is under active development and should be considered beta. Improvements and enhancements may break or remove existing functionality. Be sure to lock your dependencies.

## eosjs2

Library for talking to the eos api. transact() is used to sign and push transactions onto the blockchain with an optional configuration object parameter.  This parameter can override the default value of broadcast: true, and can be used to fill TAPOS fields given blocksBehind and expireSeconds.  Given no configuration options, transactions are expected to be unpacked with TAPOS fields (expiration, ref_block_num, ref_block_prefix) and will automatically be broadcast onto the chain.

## Running Tests

`npm run build-web` or `yarn build-web`
Open `test.html` in your browser of choice

*These tests assume that you have a local node for EOS set up at localhost:8000. The test.html file should run through 5 test cases with the final showing an exception on the screen for missing required TAPOS.*


## Browser Usage Example

`npm run build-web` or `yarn build-web`

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
      const resultWithConfig = await api.transact({
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
      pre.textContent += '\n\nTransaction with configured TAPOS pushed!\n\n' + JSON.stringify(resultWithConfig, null, 2);
    } catch (e) {
      pre.textContent = '\nCaught exception: ' + e;
      if (e instanceof eosjs2_jsonrpc.RpcError)
        pre.textContent += '\n\n' + JSON.stringify(e.json, null, 2);
    }
  })();
</script>
```

## Node / ES2015 Usage Example

Note: tested with Node v10.3.0. Older versions need older syntax.

`npm install eosjs2` or `yarn add eosjs2`

```javascript
const eosjs2 = require('eosjs2');
const fetch = require('node-fetch');                            // node only; not needed in browsers
const { TextDecoder, TextEncoder } = require('text-encoding');  // node only; not needed in browsers

const defaultPrivateKey = "5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr"; // useraaaaaaaa
const rpc = new eosjs2.Rpc.JsonRpc('http://127.0.0.1:8000', { fetch });
const signatureProvider = new eosjs2.SignatureProvider([defaultPrivateKey]);
const api = new eosjs2.Api({ rpc, signatureProvider, textDecoder: new TextDecoder, textEncoder: new TextEncoder });

(async () => {
  try {
    const resultWithConfig = await api.transact({
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
    console.log(JSON.stringify(resultWithConfig, null, 2));
  } catch (e) {
    console.log('Caught exception: ' + e);
    if (e instanceof eosjs2.Rpc.RpcError)
      console.log(JSON.stringify(e.json, null, 2));
  }
})();
```
