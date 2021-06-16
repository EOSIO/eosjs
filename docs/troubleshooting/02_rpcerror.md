When a call to the chain_api is performed and fails, it will result in an RPCError object being generated to inform why the transaction failed.

The RPCError object will error with the concise message, for instance 'Invalid transaction', but additional details can be found in both the `details` field and the `json` field.  The `json` field holds the entire json response from `nodeos` while the `details` field specifically holds the error object in the `json`.  This is typically in different places of the `json` depending on what endpoint is used in `nodeos` so the `details` field is available to quickly see the error information without needing to search through the `json` object.

As you can see below, the concise error message might not give enough information to really discern the issue.  While the error has `eosio_assert_message assertion failure` as the concise error, in the `details` field the `overdrawn balance` error mentioned.  It's important to note that the format of the `details` object can be different depending on what endpoint is used.
```javascript
RpcError: eosio_assert_message assertion failure
    at new RpcError (eosjs-rpcerror.ts:20:13)
    at JsonRpc.<anonymous> (eosjs-jsonrpc.ts:90:23)
    at step (eosjs-jsonrpc.js:37:23)
    at Object.next (eosjs-jsonrpc.js:18:53)
    at fulfilled (eosjs-jsonrpc.js:9:58)
    at processTicksAndRejections (node:internal/process/task_queues:94:5) {
    details: {
        code: 3050003,
        name: 'eosio_assert_message_exception',
        message: 'eosio_assert_message assertion failure',
        stack: [
            {
                context: {
                    level: 'error',
                    file: 'cf_system.cpp',
                    line: 14,
                    method: 'eosio_assert',
                    hostname: '',
                    thread_name: 'nodeos',
                    timestamp: '2021-06-16T05:26:03.665'
                },
                format: 'assertion failure with message: ${s}',
                data: { s: 'overdrawn balance' }
            },
            {
                context: {
                    level: 'warn',
                    file: 'apply_context.cpp',
                    line: 143,
                    method: 'exec_one',
                    hostname: '',
                    thread_name: 'nodeos',
                    timestamp: '2021-06-16T05:26:03.665'
                },
                format: 'pending console output: ${console}',
                data: { console: '' }
            }
        ]
    },
    json: {
        head_block_num: 1079,
        head_block_id: '00003384ff2dd671472e8290e7ee0fbc00ee1f450ce5c10de0a9c245ab5b5b22',
        last_irreversible_block_num: 1070,
        last_irreversible_block_id: '00003383946519b67bac1a0f31898826b472d81fd40b7fccb49a2f486bd292d1',
        code_hash: '800bb7fedd86155047064bffdaa3c32cca76cda40eb80f5c4a7676c7f57da579',
        pending_transactions: [],
        result: {
            id: '01a0cbb6c0215df53f07ecdcf0fb750a4134938b38a72946a0f6f25cf3f43bcb',
            block_num: 1079,
            block_time: '2021-06-14T21:13:04.500',
            producer_block_id: null,
            receipt: null,
            elapsed: 189,
            net_usage: 137,
            scheduled: false,
            action_traces: [Array],
            account_ram_delta: null,
            except: [Object],
            error_code: '10000000000000000000',
            bill_to_accounts: []
        }
    },
    isFetchError: true
}
```
