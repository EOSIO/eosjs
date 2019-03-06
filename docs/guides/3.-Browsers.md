# Browsers

## Usage
`npm run build-web` or `yarn build-web`

Reuse the `api` object for all transactions; it caches ABIs to reduce network usage. Only call `new eosjs_api.Api(...)` once.

```html
<pre style="width: 100%; height: 100%; margin:0px; "></pre>

<script src='dist-web/eosjs-api.js'></script>
<script src='dist-web/eosjs-jsonrpc.js'></script>
<script src='dist-web/eosjs-jssig.js'></script>
<script>
  let pre = document.getElementsByTagName('pre')[0];
  const defaultPrivateKey = "5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr"; // bob
  const rpc = new eosjs_jsonrpc.JsonRpc('http://localhost:8888');
  const signatureProvider = new eosjs_jssig.JsSignatureProvider([defaultPrivateKey]);
  const api = new eosjs_api.Api({ rpc, signatureProvider });

  (async () => {
    try {
      const result = await api.transact({
        actions: [{
            account: 'eosio.token',
            name: 'transfer',
            authorization: [{
                actor: 'bob',
                permission: 'active',
            }],
            data: {
                from: 'bob',
                to: 'alice',
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
      if (e instanceof eosjs_jsonrpc.RpcError)
        pre.textContent += '\n\n' + JSON.stringify(e.json, null, 2);
    }
  })();
</script>
```

## Debugging

If you would like readable source files for debugging, change the file reference to the `-debug.js` files inside `dist-web/debug` directory.  These files should only be used for development as they are over 10 times as large as the minified versions, and importing the debug versions will increase loading times for the end user.

## IE11 and Edge Support
If you need to support IE11 or Edge you will also need to install a text-encoding polyfill as eosjs Signing is dependent on the TextEncoder which IE11 and Edge do not provide.  Pass the TextEncoder and TextDecoder to the API constructor as demonstrated in the [ES 2015 example](#node-es-2015).  Refer to the documentation here https://github.com/inexorabletash/text-encoding to determine the best way to include it in your project.
