To transfer an eosio token, [submit a transaction](01_how-to-submit-a-transaction.md) to the [`transfer`](https://github.com/EOSIO/eosio.contracts/blob/52fbd4ac7e6c38c558302c48d00469a4bed35f7c/contracts/eosio.token/include/eosio.token/eosio.token.hpp#L83) action of the account storing the token you wish to transfer.

In the example shown below `useraaaaaaaa` transfers **1.0000 EOS** token stored in the `eosio.token` account from `useraaaaaaaa` to `userbbbbbbbb`.
```javascript
(async () => {
  await api.transact({
    actions: [{
      account: 'eosio.token',
      name: 'transfer',
      authorization: [{
        actor: 'useraaaaaaaa',
        permission: 'active',
      }],
      data: {
        from: 'useraaaaaaaa',
        to: 'userbbbbbbbb',
        quantity: '1.0000 EOS',
        memo: 'some memo'
      }
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
})();
```