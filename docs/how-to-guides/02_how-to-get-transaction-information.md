**Note** that [`history_get_transaction`](https://github.com/EOSIO/eosjs/blob/849c03992e6ce3cb4b6a11bf18ab17b62136e5c9/src/eosjs-jsonrpc.ts#L205) below uses the deprecated `/v1/history/get_transaction` endpoint of a node.

To get a transaction's information, call [`history_get_transaction`](https://github.com/EOSIO/eosjs/blob/849c03992e6ce3cb4b6a11bf18ab17b62136e5c9/src/eosjs-jsonrpc.ts#L205) on the rpc object passing in the transaction's id and optionally, it's block number as arguments.
```javascript
(async () => {
  await rpc.history_get_transaction('b3598da4e007173e6d1b94d7be306299dd0a6813d114cf9a08c8e88a5756f1eb', 46632826)
})();
```

The transaction info is returned as JSON.
```javascript
{
  id: 'b3598da4e007173e6d1b94d7be306299dd0a6813d114cf9a08c8e88a5756f1eb',
  trx: {
    receipt: {
      status: 'executed',
      cpu_usage_us: 2070,
      net_usage_words: 14,
      trx: [Array]
    },
    trx: {
      expiration: '2019-08-28T03:45:47',
      ref_block_num: 36720,
      ref_block_prefix: 654845510,
      max_net_usage_words: 0,
      max_cpu_usage_ms: 0,
      delay_sec: 0,
      context_free_actions: [],
      actions: [Array],
      transaction_extensions: [],
      signatures: [Array],
      context_free_data: []
    }
  },
  block_time: '2019-08-28T03:45:21.500',
  block_num: 46632826,
  last_irreversible_block: 46784285,
  traces: []
}
```