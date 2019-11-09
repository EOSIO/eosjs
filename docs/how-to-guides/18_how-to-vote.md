To vote for a block produder, [submit a transaction](01_how-to-submit-a-transaction.md) to the [`voteproducer`](https://github.com/EOSIO/eosio.contracts/blob/52fbd4ac7e6c38c558302c48d00469a4bed35f7c/contracts/eosio.system/include/eosio.system/eosio.system.hpp#L1130) action of the `eosio` account.

In the example shown below `useraaaaaaaa` votes for producers `userbbbbbbbb` and `usercccccccc`.
```javascript
(async () => {
  await api.transact({
    actions: [{
      account: 'eosio',
      name: 'voteproducer',
      authorization: [{
        actor: 'useraaaaaaaa',
        permission: 'active',
      }],
      data: {
        voter: 'useraaaaaaaa',
        proxy: '',
        producers: ['userbbbbbbbb', 'usercccccccc']
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

`useraaaaaaaa` can also delegate their vote to a proxy.  In the example shown below, `useraaaaaaaa` delegates their vote to the proxy `userbbbbbbbb`.
```javascript
(async () => {
  await api.transact({
    actions: [{
      account: 'eosio',
      name: 'voteproducer',
      authorization: [{
        actor: 'useraaaaaaaa',
        permission: 'active',
      }],
      data: {
        voter: 'useraaaaaaaa',
        proxy: 'userbbbbbbbb',
        producers: []
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

**Note** that if the `proxy` field is used, the `producers` list must be empty, and vice verse, if the `producers` list is used, the `proxy` field must be an empty string.