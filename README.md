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

<script src='https://.../eos-altjs-debug.js'></script>
<script>
    let eos = window.eos_altjs;
    let pre = document.getElementsByTagName('pre')[0];

    (async () => {
        let endpoint = 'https://...:8888';
        let privateKeys = ['...'];

        try {
            let api = new eos.Api({ endpoint });
            api.chainId = (await api.get_info()).chain_id;
            let result = await api.pushTransaction(privateKeys, {
                // Reference 3 blocks behind the head and expire 10 seconds after
                ...await api.easyTransactionHeader(3, 10),
                actions: [
                    await api.easyCreateAction('test', 'dosomething',
                        [{
                            actor: 'test',
                            permission: 'active',
                        }],
                        {
                            user: 'test',
                            other_data: 1234,
                        }),
                ],
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
