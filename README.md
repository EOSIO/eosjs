## eos-altjs

Alternative library for talking to the eos api.

Features:
* Entire source lives in a single file for easy reference
* Only dependancy is eosjs-ecc for signing transactions
* Errors don't get dropped on the floor

Limitations:
* Many ABI types not yet supported
* It uses all provided keys to sign instead of querying the API for the needed set
* No wallet support

## Example use

```html
<pre style="width: 100%; height: 100%; margin:0px; "></pre>

<script src='https://.../eosjs2-debug.js'></script>
<script>
    let pre = document.getElementsByTagName('pre')[0];

    (async () => {
        let endpoint = 'http://localhost:8000';
        let privateKeys = ['5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr'];

        try {
            let api = new eosjs2.Api({ endpoint });
            let result = await api.pushTransaction(privateKeys, {
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
            if (e instanceof eos.EosError)
                pre.textContent += '\n\n' + JSON.stringify(e.json, null, 4);
        }
    })();
</script>
```
