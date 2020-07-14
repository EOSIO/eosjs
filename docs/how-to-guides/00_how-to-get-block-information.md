To get block information call `get_block` on the rpc object passing in the block number as a required argument.
```javascript
(async () => { 
  await rpc.get_block(1) //get the first block
})();
```

The block data is returned as JSON.
```json
{ 
  "timestamp": "2018-06-01T12:00:00.000",
  "producer": "",
  "confirmed": 1,
  "previous": "0000000000000000000000000000000000000000000000000000000000000000",
  "transaction_mroot": "0000000000000000000000000000000000000000000000000000000000000000",
  "action_mroot": "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
  "schedule_version": 0,
  "new_producers": null,
  "header_extensions": [],
  "producer_signature": "SIG_K1_111111111111111111111111111111111111111111111111111111111111111116uk5ne",
  "transactions": [],
  "block_extensions": [],
  "id": "00000001bcf2f448225d099685f14da76803028926af04d2607eafcf609c265c",
  "block_num": 1,
  "ref_block_prefix": 2517196066 
}
```