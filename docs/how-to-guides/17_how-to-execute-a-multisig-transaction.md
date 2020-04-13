If a multi-sig transaction has been approved by the appropriate parties prior to the proposed transaction's expiration timestamp, it can be executed.

To execute a multi-sig transaction, [submit a transaction](01_how-to-submit-a-transaction.md) to the [`exec`](https://github.com/EOSIO/eosio.contracts/blob/52fbd4ac7e6c38c558302c48d00469a4bed35f7c/contracts/eosio.msig/include/eosio.msig/eosio.msig.hpp#L109) action of the `eosio.msig` account.

In the example shown below `userbbbbbbbb` executes the `changeowner` proposal, previously proposed by `useraaaaaaaa`.
```javascript
(async () => {
  await api.transact({
    actions: [{
      account: 'eosio.msig',
      name: 'exec',
      authorization: [{
        actor: 'userbbbbbbbb',
        permission: 'active',
      }],
      data: {
        proposer: 'useraaaaaaaa',
        proposal_name: 'changeowner',
        executer: 'userbbbbbbbb'
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