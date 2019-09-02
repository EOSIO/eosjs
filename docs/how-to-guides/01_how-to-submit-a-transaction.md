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
The second parameter is an [optional configuration object parameter](https://github.com/EOSIO/eosjs/blob/master/src/eosjs-api.ts#L215).  This parameter can override the default value of `broadcast: true`, and can be used to fill [TAPOS](https://eosio.stackexchange.com/questions/2362/what-is-transaction-as-proof-of-stake-tapos-and-when-would-a-smart-contract) fields with the specified `blocksBehind` and `expireSeconds`.  Given no configuration object, transactions are expected to be unpacked with TAPOS fields (`expiration`, `ref_block_num`, `ref_block_prefix`) and will automatically be broadcast onto the chain.
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
  console.log(await api.transact({
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
  }));
})();
```
Above we console log the response from the EOSIO network.  An example of an expected response is shown below.
```javascript
{
  transaction_id: 'b3598da4e007173e6d1b94d7be306299dd0a6813d114cf9a08c8e88a5756f1eb',
  processed: {
    id: 'b3598da4e007173e6d1b94d7be306299dd0a6813d114cf9a08c8e88a5756f1eb',
    block_num: 46632826,
    block_time: '2019-08-28T03:45:21.500',
    producer_block_id: null,
    receipt: { status: 'executed', cpu_usage_us: 605, net_usage_words: 14 },
    elapsed: 605,
    net_usage: 112,
    scheduled: false,
    action_traces: [ [Object] ],
    account_ram_delta: null,
    except: null,
    error_code: null
  }
}
```
