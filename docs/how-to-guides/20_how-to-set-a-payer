To set a separate payer for the resources for a transaction, use the `transaction_extensions` array to add a resource payer object to specify the `payer`, `max_net_bytes`, `max_cpu_us`, and `max_memory_bytes`.  This functionality requires the `RESOURCE_PAYER` feature to be enabled on the chain.

```javascript
return await api.transact({
    transaction_extensions: [
        {
            payer: 'alice',
            max_net_bytes: 4096,
            max_cpu_us: 250,
            max_memory_bytes: 0
        }
    ],
    actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
            actor: 'bob',
            permission: 'active',
        }, {
            actor: 'alice',
            permission: 'active',
        }],
        data: {
            from: 'bob',
            to: 'alice',
            quantity: '0.0001 SYS',
            memo: 'resource payer',
        },
    }]
}, {
    blocksBehind: 3,
    expireSeconds: 30
});
```
