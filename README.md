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
  const rpc = new eosjs2_jsonrpc.JsonRpc('http://localhost:8000');
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

`npm install eosjs2` or `yarn add eosjs2`

```javascript
import eosjs2 from 'eosjs2';

// or use named imports
// import { Api, Rpc, SignatureProvider } from 'eosjs2';

const defaultPrivateKey = "5JmqocoeJ1ury2SdjVNVgNL1n4qR2sse5cxN4upvspU2R5PEnxP"; // thegazelle
const rpc = new eosjs2_jsonrpc.JsonRpc('http://dev.cryptolions.io:18888');
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
    console.log(resultWithConfig);
  } catch (e) {
    // handle error
  }
})();
```
