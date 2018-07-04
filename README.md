## eosjs2

Library for talking to the eos api.

## Browser

`npm run build-web` or `yarn build-web`

```html
<pre style="width: 100%; height: 100%; margin:0px; "></pre>

<script src='dist-web/eosjs2-debug.js'></script>
<script src='dist-web/eosjs2-jsonrpc-debug.js'></script>
<script src='dist-web/eosjs2-jssig-debug.js'></script>
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

## Node / ES2015

`npm install eosjs2` or `yarn add eosjs2`

```javascript
import eosjs2 from 'eosjs2';

// or use named imports
// import { Api, Rpc, SignatureProvider } from 'eosjs2';

const rpc = new eosjs2.Rpc.JsonRpc('http://localhost:8000');
const signatureProvider = new eosjs2.SignatureProvider(['5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr']);
const api = new eosjs2.Api({ rpc, signatureProvider });

(async () => {
    try {
        const result = await api.pushTransaction({
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
        console.log(result)
    } catch (e) {
        // handle error
    }
})();

```
