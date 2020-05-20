const fs = require('fs');
const path = require('path');
const { JsonRpc, RpcError, Api, WasmAbi } = require('../../dist');
const { JsSignatureProvider } = require('../../dist/eosjs-jssig');
const { WasmAbiProvider } = require('../../dist/eosjs-wasmabi');
const fetch = require('node-fetch');
const { TextEncoder, TextDecoder } = require('util');

const privateKey = '5JuH9fCXmU3xbj8nRmhPZaVrxxXrdPaRmZLW1cznNTmTQR2Kg5Z'; // replace with "bob" account private key
/* new accounts for testing can be created by unlocking a cleos wallet then calling: 
 * 1) cleos create key --to-console (copy this privateKey & publicKey)
 * 2) cleos wallet import 
 * 3) cleos create account bob publicKey
 * 4) cleos create account alice publicKey
 */

const rpc = new JsonRpc('http://localhost:8888', { fetch });
const signatureProvider = new JsSignatureProvider([privateKey]);
const wasmAbiProvider = new WasmAbiProvider();
const api = new Api({ rpc, signatureProvider, wasmAbiProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

const setWasmAbi = async () => {
    await wasmAbiProvider.setWasmAbis([
        new WasmAbi({
            account: 'eosio.token',
            mod: new global.WebAssembly.Module(fs.readFileSync(path.join(__dirname + '/token_abi.wasm'))), // tslint:disable-line
            memoryThreshold: 32000,
            textEncoder: api.textEncoder,
            textDecoder: api.textDecoder,
            print(x) { process.stdout.write(x); },
        })
    ]);
};

const transactWithConfig = async (config, memo) => await api.transact({
    actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
            actor: 'bob',
            permission: 'active',
        }],
        data: {
            from: 'bob',
            to: 'alice',
            quantity: '0.0001 SYS',
            memo,
        },
    }]
}, config);

const transactWithoutConfig = async () => {
    const transactionResponse = await transactWithConfig({ blocksBehind: 3, expireSeconds: 30}, 'transactWithoutConfig');
    const blockInfo = await rpc.get_block(transactionResponse.processed.block_num - 3);
    const currentDate = new Date();
    const timePlusTen = currentDate.getTime() + 10000;
    const timeInISOString = (new Date(timePlusTen)).toISOString();
    const expiration = timeInISOString.substr(0, timeInISOString.length - 1);

    return await api.transact({
        expiration,
        ref_block_num: blockInfo.block_num & 0xffff,
        ref_block_prefix: blockInfo.ref_block_prefix,
        actions: [{
            account: 'eosio.token',
            name: 'transfer',
            authorization: [{
                actor: 'bob',
                permission: 'active',
            }],
            data: {
                from: 'bob',
                to: 'alice',
                quantity: '0.0001 SYS',
                memo: 'transactWithoutConfig2',
            },
        }]
    });
};

const transactWithShorthandApiJson = async () => {
    await api.getAbi('eosio.token');
    return await api.transact({
        actions: [
          api.with('eosio.token').as('bob').transfer({
            from: 'bob',
            to: 'alice',
            quantity: '0.0001 SYS',
            memo: 'transactWithShorthandApiJson'
          })
        ]
    }, {
        blocksBehind: 3,
        expireSeconds: 30
    });
};

const transactWithShorthandTxJson = async () => {
    await api.getAbi('eosio.token');
    const tx = api.buildTransaction();
    tx.with('eosio.token').as('bob').transfer({
        from: 'bob',
        to: 'alice',
        quantity: '0.0001 SYS',
        memo: 'transactWithShorthandTxJson'
    });
    return await tx.send({
        blocksBehind: 3,
        expireSeconds: 30
    });
};

const transactWithShorthandApiWasm = async () => {
    await setWasmAbi();
    return await api.transact({
        actions: [
            api.with('eosio.token').as('bob').transfer('bob', 'alice', '0.0001 SYS', 'transactWithShorthandApiWasm')
        ]
    }, {
        blocksBehind: 3,
        expireSeconds: 30
    });
};

const transactWithShorthandTxWasm = async () => {
    await setWasmAbi();
    const tx = api.buildTransaction();
    tx.with('eosio.token').as('bob').transfer('bob', 'alice', '0.0001 SYS', 'transactWithShorthandTxWasm');
    return await tx.send({
        blocksBehind: 3,
        expireSeconds: 30
    });
};

const broadcastResult = async (signaturesAndPackedTransaction) => await api.pushSignedTransaction(signaturesAndPackedTransaction);

const transactShouldFail = async () => await api.transact({
    actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
            actor: 'bob',
            permission: 'active',
        }],
        data: {
            from: 'bob',
            to: 'alice',
            quantity: '0.0001 SYS',
            memo: '',
        },
    }]
});
  
const rpcShouldFail = async () => await rpc.get_block(-1);

module.exports = {
    transactWithConfig,
    transactWithoutConfig,
    broadcastResult,
    transactShouldFail,
    transactWithShorthandApiJson,
    transactWithShorthandApiWasm,
    transactWithShorthandTxJson,
    transactWithShorthandTxWasm,
    rpcShouldFail
};
