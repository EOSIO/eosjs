To submit a transaction, call `transact` on the api object, passing in two parameters.

The first parameter specifies the actions in the transaction, and their corresponding authorizations, as well as any data necessary for the action to execute.  An example for the [`buyrambytes` action](https://github.com/EOSIO/eosio.contracts/blob/52fbd4ac7e6c38c558302c48d00469a4bed35f7c/contracts/eosio.system/include/eosio.system/eosio.system.hpp#L1028) is shown below.
```javascript
{ 
   actions: [{
     account: 'eosio',
     name: 'buyrambytes',
     authorization: [{
       actor: 'useraaaaaaaa',
       permission: 'active',
     }],
     data: {
       payer: 'useraaaaaaaa',
       receiver: 'useraaaaaaaa',
       bytes: 8192,
     },
   }]
}
```
The second parameter is an [optional configuration object parameter](https://github.com/EOSIO/eosjs/blob/master/src/eosjs-api.ts#L215).  This optional parameter can override the default values of `broadcast: true` and `sign: true`, and can be used to fill [TAPOS](https://eosio.stackexchange.com/questions/2362/what-is-transaction-as-proof-of-stake-tapos-and-when-would-a-smart-contract) fields with the specified `expireSeconds` and either `blocksBehind` or `useLastIrreversible` if necessary.  A combination of these fields are required if the first parameter specified above does not itself contain the TAPOS fields `expiration`, `ref_block_num`, and `ref_block_prefix`.  In this case it does not, so the fields are necessary.
```javascript
{
  blocksBehind: 3,
  expireSeconds: 30,
}
```
Below is a complete example transaction to call the `buyrambytes` action with `useraaaaaaaa`'s active permission, `useraaaaaaaa` is also both the payer and receiver of **8192** bytes of RAM.  
The transaction will reference the block 3 blocks behind the head block, and will automatically expire the transaction 30 seconds after the time present in this referenced block.
```javascript
(async () => {
  await api.transact({
   actions: [{
     account: 'eosio',
     name: 'buyrambytes',
     authorization: [{
       actor: 'useraaaaaaaa',
       permission: 'active',
     }],
     data: {
       payer: 'useraaaaaaaa',
       receiver: 'useraaaaaaaa',
       bytes: 8192,
     },
   }]
  }, {
   blocksBehind: 3,
   expireSeconds: 30,
  });
})();
```

Alternatively, the transaction could be submitted without the optional configuration object by specifying the TAPOS fields `expiration`, `ref_block_num`, and `ref_block_prefix` explicity in the action.
```javascript
(async () => {
  await api.transact({
   expiration: '2019-09-19T16:39:15',
   ref_block_num: '50477227',
   ref_block_prefix: '1022379673',
   actions: [{
     account: 'eosio',
     name: 'buyrambytes',
     authorization: [{
       actor: 'useraaaaaaaa',
       permission: 'active',
     }],
     data: {
       payer: 'useraaaaaaaa',
       receiver: 'useraaaaaaaa',
       bytes: 8192,
     },
   }]
  });
})();
```
