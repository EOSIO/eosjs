To use `eosjs` in a browser run `npm run build-web` or `yarn build-web`.  This will create the `dist-web` folder and web distribution modules.
```html
<pre style="width: 100%; height: 100%; margin:0px; "></pre>

<script src='dist-web/eosjs-api.min.js'></script>
<script src='dist-web/eosjs-jsonrpc.min.js'></script>
<script src='dist-web/eosjs-jssig.min.js'></script>
```

To cache ABIs and reduce network usage, reuse the `api` object for all transactions.  This implies you should only call `new eosjs_api.Api(...)` once.
```html
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
If you would like readable source files for debugging, change the file reference to the `.js` files inside `dist-web` directory.  These files should only be used for development as they are over 10 times as large as the minified versions, and importing the debug versions will increase loading times for the end user.

## IE11 and Edge Support
If you need to support IE11 or Edge you will also need to install a text-encoding polyfill, as eosjs Signing is dependent on the TextEncoder which IE11 and Edge do not provide.  Pass the TextEncoder and TextDecoder to the API constructor as demonstrated in the [CommonJS example](01_commonjs.md).  Refer to the documentation [here](https://github.com/inexorabletash/text-encoding) to determine the best way to include it in your project.