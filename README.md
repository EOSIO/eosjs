## eos-altjs

Library for talking to the eos api.

## Example use

```html
<pre style="width: 100%; height: 100%; margin:0px; "></pre>

<script src='dist/eosjs2-debug.js'></script>
<script src='dist/eosjs2-jsonrpc-debug.js'></script>
<script src='dist/eosjs2-jssig-debug.js'></script>
<script>
    let pre = document.getElementsByTagName('pre')[0];
    let rpc = new eosjs2_jsonrpc.JsonRpc('http://localhost:8000');
    let signatureProvider = new eosjs2_jssig.default(['5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr']);
    let api = new eosjs2.Api({ rpc, signatureProvider });

    (async () => {
        try {
            let result = await api.pushTransaction({
                blocksBehind: 3,
                expireSeconds: 10,
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
                }],
            });
            pre.textContent += '\n\nTransaction pushed!\n\n' + JSON.stringify(result, null, 4);
        } catch (e) {
            pre.textContent += '\nCaught exception: ' + e;
            if (e instanceof eosjs2_jsonrpc.RpcError)
                pre.textContent += '\n\n' + JSON.stringify(e.json, null, 4);
        }
    })();
</script>
```
