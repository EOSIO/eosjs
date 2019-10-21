To propose a transaction, [submit a transaction](01_how-to-submit-a-transaction.md) to the [`propose`](https://github.com/EOSIO/eosio.contracts/blob/52fbd4ac7e6c38c558302c48d00469a4bed35f7c/contracts/eosio.msig/include/eosio.msig/eosio.msig.hpp#L39) action of the `eosio.msig` account.

## Serializing Actions
The `data` field of the `propose` action has a `tx` field, which is a [`transaction`](https://github.com/EOSIO/eosio.contracts/blob/6ca72e709faba179726a20571929a9eeaea47d08/tests/test_contracts/eosio.msig.old/eosio.msig.abi#L48) type.  This `transaction` type contains an [`action`](https://github.com/EOSIO/eosio.contracts/blob/6ca72e709faba179726a20571929a9eeaea47d08/tests/test_contracts/eosio.msig.old/eosio.msig.abi#L21) type, which contains [`bytes`](https://github.com/EOSIO/eosio.contracts/blob/6ca72e709faba179726a20571929a9eeaea47d08/tests/test_contracts/eosio.msig.old/eosio.msig.abi#L27) as it's `data` field.  Because of this, we must first serialize a list of [`action`](https://github.com/EOSIO/eosio.contracts/blob/6ca72e709faba179726a20571929a9eeaea47d08/tests/test_contracts/eosio.msig.old/eosio.msig.abi#L21) objects.

## serializeActions
In the example shown below, a transaction for the `eosio` `updateauth` action is serialized using the `api` object's `serializeActions` method.
```javascript
const actions = [
  {
    account: 'eosio',
    name: 'updateauth',
    authorization: [
      {
        actor: 'useraaaaaaaa',
        permission: 'active',
      }
    ],
    data: {
      account: 'useraaaaaaaa',
      permission: 'active',
      parent: '',
      auth: {
        threshold: 1,
        keys: [
          {
            key: 'PUB_R1_6FPFZqw5ahYrR9jD96yDbbDNTdKtNqRbze6oTDLntrsANgQKZu',
            weight: 1
          }
        ],
        accounts:[],
        waits:[]
      }
    }
  }
];

(async () => {
  const serialized_actions = await api.serializeActions(actions)
}
```
An example output of `serialized_actions` call made above is shown below.
```javascript
[
  {
    account: 'eosio',
    name: 'updateauth',
    authorization: [ [Object] ],
    data: 'F0F0C30F3FFCF0C300000000A8ED3232000000000000000001000000010003FD9ABF3D22615D5621BF74D2D0A652992DE1338E552AD85D5EAF1F39DCAADDB301000000'
  }
]
```

## Propose Input
In the example shown below, the `serialized_actions` list created above is used in the `actions` field of the `proposeInput`'s `trx` field.

[Below](#propose) `useraaaaaaaa` proposes a multi-sig transaction, which calls the `updateauth` action of the `eosio` account (see [`actions`](#serializeactions) above).  This proposal is called `changeowner` and both `useraaaaaaaa` and `userbbbbbbbb` must sign the multi-sig transaction before `2019-09-14T16:39:15`.
```javascript
const proposeInput = {
    proposer: 'useraaaaaaaa',
    proposal_name: 'changeowner',
    requested: [
      {
        actor: 'useraaaaaaaa',
        permission: 'active'
      },
      {
        actor: 'userbbbbbbbb',
        permission: 'active'
      }
    ],
    trx: {
      expiration: '2019-09-14T16:39:15',
      ref_block_num: 0,
      ref_block_prefix: 0,
      max_net_usage_words: 0,
      max_cpu_usage_ms: 0,
      delay_sec: 0,
      context_free_actions: [],
      actions: serialized_actions,
      transaction_extensions: []
    }
  };
```

## Propose
In the example below, a transaction is submitted to the `propose` action of the `eosio.msig` contract using the `proposeInput` object created [above](#propose-input).
```javascript
await api.transact({
  actions: [{
    account: 'eosio.msig',
    name: 'propose',
    authorization: [{
      actor: 'useraaaaaaaa',
      permission: 'active',
    }],
    data: proposeInput,
  }]
}, {
  blocksBehind: 3,
  expireSeconds: 30,
  broadcast: true,
  sign: true
});
```

## Propose a Multi-sig Transaction
Below all three steps to propose a multi-sig transaction are provided.

```javascript
// CREATE ACTION TO PROPOSE
const actions = [
  {
    account: 'eosio',
    name: 'updateauth',
    authorization: [
      {
        actor: 'useraaaaaaaa',
        permission: 'active',
      }
    ], data: {
      account: 'useraaaaaaaa',
      permission: 'active',
      parent: '',
      auth: {
        threshold: 1,
        keys: [
          {
            key: 'PUB_R1_6FPFZqw5ahYrR9jD96yDbbDNTdKtNqRbze6oTDLntrsANgQKZu',
            weight: 1
          }
        ],
        accounts:[],
        waits:[]
      }
    },
  }
];

(async () => {
  const serialized_actions = await api.serializeActions(actions)

  // BUILD THE MULTISIG PROPOSE TRANSACTION
  proposeInput = {
    proposer: 'useraaaaaaaa',
    proposal_name: 'changeowner',
    requested: [
      {
        actor: 'useraaaaaaaa',
        permission: 'active'
      },
      {
        actor: 'userbbbbbbbb',
        permission: 'active'
      }
    ],
    trx: {
      expiration: '2019-09-16T16:39:15',
      ref_block_num: 0,
      ref_block_prefix: 0,
      max_net_usage_words: 0,
      max_cpu_usage_ms: 0,
      delay_sec: 0,
      context_free_actions: [],
      actions: serialized_actions,
      transaction_extensions: []
    }
  };

  //PROPOSE THE TRANSACTION
  const result = await api.transact({
    actions: [{
      account: 'eosio.msig',
      name: 'propose',
      authorization: [{
        actor: 'useraaaaaaaa',
        permission: 'active',
      }],
      data: proposeInput,
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
    broadcast: true,
    sign: true
  });
})();
```
