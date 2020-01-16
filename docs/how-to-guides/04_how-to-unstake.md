To unstake resources, [submit a transaction](01_how-to-submit-a-transaction.md) to the [`undelegatebw`](https://github.com/EOSIO/eosio.contracts/blob/52fbd4ac7e6c38c558302c48d00469a4bed35f7c/contracts/eosio.system/include/eosio.system/eosio.system.hpp#L1000) action of the `eosio` account.

In the example shown below `useraaaaaaaa` unstakes **1.0000 SYS** of NET and CPU from the account `mynewaccount`.
```javascript
(async () => {
  await api.transact({
    actions: [{
      account: 'eosio',
      name: 'undelegatebw',
      authorization: [{
        actor: 'useraaaaaaaa',
        permission: 'active',
      }],
      data: {
        from: 'useraaaaaaaa',
        receiver: 'mynewaccount',
        stake_net_quantity: '1.0000 SYS',
        stake_cpu_quantity: '1.0000 SYS',
        transfer: false,
      }
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
})();
```