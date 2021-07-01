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
  const transaction = await api.transact({
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
  const transaction = await api.transact({
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

#### Concise Actions
To construct transactions and actions in a more concise way, you can also utilize this format instead:
```javascript
(async () => {
  await api.transact({ 
   actions: [
     api.with('eosio').as('useraaaaaaaa').buyrambytes('useraaaaaaaa', 'useraaaaaaaa', 8192)
   ]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
})();
```
With this concise format of an action, the `with()` function has the account, `as()` contains the actor, and the name of the action is the third function.  The arguments within the action function are listed in the same order as the arguments from the smart contract.  You can also send a longer authentication within the `as()` function, such as `[{ actor: ‘useraaaaaaaa’, permission: ‘active’}]`.

Before using this structure, you need to cache the JSON Abi:
```javascript
(async () => {
  await api.getAbi('eosio');
  ...
})();
```

Additionally, utilizing this structure, a stateful transaction object can be created and passed through your application before sending when ready.  The transaction object can also be created as a callback method.

```javascript
(async () => {
  const tx = api.buildTransaction();
  tx.with('eosio').as('useraaaaaaaa').buyrambytes('useraaaaaaaa', 'useraaaaaaaa', 8192)
  await tx.send({ blocksBehind: 3, expireSeconds: 30 });

  // ...or...

  api.buildTransaction(async (tx) => {
    tx.with('eosio').as('useraaaaaaaa').buyrambytes('useraaaaaaaa', 'useraaaaaaaa', 8192)
    await tx.send({ blocksBehind: 3, expireSeconds: 30 });
  });
})();
```

By using this object and passing it around your application, it might be more difficult for your application to keep the correct references and indexes for context free actions. The transaction object has a function for mapping actions, context free actions, and context free data together.

```javascript
(async () => {
  const tx = api.buildTransaction();
  tx.associateContextFree((index) => ({
    contextFreeData: cfdata,
    contextFreeAction: tx.with('account').as().cfaName(index.cfd, 'context free example'),
    action: tx.with('account').as('actor').actionName('example', index.cfa)
  }));
  await tx.send({ blocksBehind: 3, expireSeconds: 30 });
})();
```

By providing that function inside `tx.associateContextFree()`, the transaction object will provide the correct indexes for the context free action and context free data.  You can input the `index.cfa` or `index.cfd` arguments where your smart contract requires that index in the list of arguments.  Additionally, all three object keys are not necessary in the function, in case for example, the action is not necessary for your context free action.

#### Return Values
From nodeos version 2.1, the ability to receive return values from smart contracts to eosjs has been introduced.  In the above examples, the `transaction` object will include the values `transaction_id` and the `processed` object.  If your smart contract returns values, you will be able to find the values within the `transaction.processed.action_traces` array.  The order of the `action_traces` array matches the order of actions in your transaction and within those `action_trace` objects, you can find your deserialized return value for your action in the `return_value` field.

### Read-Only Transactions
From nodeos version 2.2, read-only queries have been introduced to eosjs. Adding `readOnlyTrx` to the `transact` config will send the transaction through the `push_ro_transaction` endpoint in the `chain_api`.  The `push_ro_transaction` endpoint does not allow the transaction to make any data changes despite the actions in the transaction. The `push_ro_transaction` endpoint may also be used to call normal actions, but any data changes that action will make will be rolled back.

Adding returnFailureTraces to the transact config enables the return of a trace message if your transaction fails. At this time, this is only available for the `push_ro_transaction` endpoint.
