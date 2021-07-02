After the release of v2.2 of nodeos, the resource payer feature is available to sponsor the resources for a transaction.  To set a separate payer for the resources for a transaction, add a `resource_payer` object to your transaction that specifies the `payer`, `max_net_bytes`, `max_cpu_us`, and `max_memory_bytes`.  This functionality requires the `RESOURCE_PAYER` protocol feature to be enabled on the chain.

A typical use-case for this feature has a service or application pay for the resources of a transaction instead of their users. Since authorization is required for both the user in the transaction and the payer, a possible workflow would have the transaction signed by the user's wallet application and then also signed by the service/application before sent to nodeos.

```javascript
{
    resource_payer: {
        payer: 'alice',
        max_net_bytes: 4096,
        max_cpu_us: 400,
        max_memory_bytes: 0
    },
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
}
```
