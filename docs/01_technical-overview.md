As stated in the [introduction](index.md), `eosjs` integrates with EOSIO-based blockchains using the [EOSIO Nodeos RPC API](https://developers.eos.io/eosio-nodeos/reference).

In general, there are two objects that are used to interact with a blockchain via `eosjs`: the `JsonRpc` object, and the `Api` object.

## JsonRpc
The `JsonRpc` object is typically used when signing is not necessary.  Some examples include [getting block information](how-to-guides/00_how-to-get-block-information.md), [getting transaction information](how-to-guides/02_how-to-get-transaction-information.md), or [getting table information](how-to-guides/09_how-to-get-table-information.md).  

The requests made by the `JsonRpc` object will either use a built-in `fetch` library, or [the `fetch` library passed in by the user](basic-usage/01_commonjs.md) to issue requests to the endpoint specified when instantiating the `JsonRpc` object.  When the various methods ([get_abi](https://github.com/EOSIO/eosjs/blob/master/src/eosjs-jsonrpc.ts#L66), [get_account](https://github.com/EOSIO/eosjs/blob/master/src/eosjs-jsonrpc.ts#L71), [get_block_header_state](https://github.com/EOSIO/eosjs/blob/master/src/eosjs-jsonrpc.ts#L76), etc) of the `JsonRpc` object are invoked, the calls are delegated to the `JsonRpc` object's [fetch function](https://github.com/EOSIO/eosjs/blob/master/src/eosjs-jsonrpc.ts#L42-L63), which in turn, delegate the requests to the `fetch` library.

## Api
The `Api` object is typically used when transacting on an EOSIO-based blockchain.  Some examples include [staking](how-to-guides/03_how-to-stake.md), [creating an account](how-to-guides/05_how-to-create-an-account.md), or [proposing multi-sig transactions](how-to-guides/13_how-to-propose-a-multisig-transaction.md).

The typical use of the `Api` object is to call its [`transact` method](https://github.com/EOSIO/eosjs/blob/master/src/eosjs-api.ts#L214-L254).  This method performs a number of steps depending on the input passed to it:

* The `transact` method first checks if the **chainId** was set in the `Api` constructor, and if not, uses the [`JsonRpc` object's](#jsonrpc) [`get_info`](https://github.com/EOSIO/eosjs/blob/master/src/eosjs-jsonrpc.ts#L101) method to retrieve the **chainId**.  
* The `transact` method then checks if the `expireSeconds` and either `blocksBehind` or `useLastIrreversible` fields are set and well-formed in the [optional configuration object, as specified in *How to Submit a Transaction*](how-to-guides/01_how-to-submit-a-transaction.md#).  
    * If so, either the *last_irreversible_block_num* or the block *blocksBehind* the head block retrieved from [`JsonRpc`'s `get_info`](https://github.com/EOSIO/eosjs/blob/master/src/eosjs-jsonrpc.ts#L101) is set as the reference block and the transaction header is serialized using this reference block and the `expireSeconds` field.
* The `transact` method then checks if the appropriate TAPOS fields are present in the transaction ([they can either be specified directly in the transaction or in the optional configuration object](how-to-guides/01_how-to-submit-a-transaction.md#)) and throws an Error if not.
* The necessary `abi`s for a transaction are then retrieved for the case when `transact` is expected to sign the transaction.
* The `actions` are serialized using the `eosjs-serialize` `ser` object.
* The entire transaction is then [serialized](https://github.com/EOSIO/eosjs/blob/master/src/eosjs-api.ts#L154-L166), also using the `eosjs-serialize` `ser` object.
* The transaction is then optionally signed, using the `signatureProvider`, the previously retrieved `abi`s, the private keys of the `signatureProvider`, and the `chainId`.
* The transaction is then optionally compressed, using the `deflate` function of a Javascript zlib library.
* The transaction is then optionally broadcasted using `JsonRpc`'s [`push_transaction`](https://github.com/EOSIO/eosjs/blob/master/src/eosjs-jsonrpc.ts#L187).