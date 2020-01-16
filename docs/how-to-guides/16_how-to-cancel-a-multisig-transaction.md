To cancel a multi-sig transaction, [submit a transaction](01_how-to-submit-a-transaction.md) to the [`cancel`](https://github.com/EOSIO/eosio.contracts/blob/52fbd4ac7e6c38c558302c48d00469a4bed35f7c/contracts/eosio.msig/include/eosio.msig/eosio.msig.hpp#L88) action of the `eosio.msig` account.

In the example shown below `useraaaaaaaa` cancels the `changeowner` proposal, previously proposed by `useraaaaaaaa`.
```javascript
(async () => {
  await api.transact({
    actions: [{
      account: 'eosio.msig',
      name: 'cancel',
      authorization: [{
        actor: 'useraaaaaaaa',
        permission: 'active',
      }],
      data: {
        proposer: 'useraaaaaaaa',
        proposal_name: 'changeowner',
        canceler: 'useraaaaaaaa'
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
    broadcast: true,
    sign: true
  });
})();
```

**Note** that if a previously proposed transaction has yet to expire, only the proposer of the transaction can cancel it.