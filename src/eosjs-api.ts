/**
 * @module API
 */
// copyright defined in eosjs/LICENSE.txt

import { inflate, deflate } from 'pako';

import {
    AbiProvider,
    AuthorityProvider,
    BinaryAbi,
    CachedAbi,
    ContextFreeGroupCallback,
    Query,
    QueryConfig,
    SignatureProvider,
    TransactConfig,
    WasmAbiProvider
} from './eosjs-api-interfaces';
import { JsonRpc } from './eosjs-jsonrpc';
import {
    Abi,
    GetInfoResult,
    PushTransactionArgs,
    GetBlockHeaderStateResult,
    GetBlockResult
} from './eosjs-rpc-interfaces';
import * as ser from './eosjs-serialize';
import { RpcError } from './eosjs-rpcerror';
import { WasmAbi } from './eosjs-wasmabi';

const abiAbi = require('../src/abi.abi.json');
const transactionAbi = require('../src/transaction.abi.json');

export class Api {
    /** Issues RPC calls */
    public rpc: JsonRpc;

    /** Get subset of `availableKeys` needed to meet authorities in a `transaction` */
    public authorityProvider: AuthorityProvider;

    /** Supplies ABIs in raw form (binary) */
    public abiProvider: AbiProvider;

    /** Signs transactions */
    public signatureProvider: SignatureProvider;

    /** Manages WASM Abis */
    public wasmAbiProvider: WasmAbiProvider;

    /** Identifies chain */
    public chainId: string;

    public textEncoder: TextEncoder;
    public textDecoder: TextDecoder;

    /** Converts abi files between binary and structured form (`abi.abi.json`) */
    public abiTypes: Map<string, ser.Type>;

    /** Converts transactions between binary and structured form (`transaction.abi.json`) */
    public transactionTypes: Map<string, ser.Type>;

    /** Holds information needed to serialize contract actions */
    public contracts = new Map<string, ser.Contract>();

    /** Fetched abis */
    public cachedAbis = new Map<string, CachedAbi>();

    /**
     * @param args
     *    * `rpc`: Issues RPC calls
     *    * `authorityProvider`: Get public keys needed to meet authorities in a transaction
     *    * `abiProvider`: Supplies ABIs in raw form (binary)
     *    * `signatureProvider`: Signs transactions
     *    * `wasmAbiProvider`: Manages WASM Abis
     *    * `chainId`: Identifies chain
     *    * `textEncoder`: `TextEncoder` instance to use. Pass in `null` if running in a browser
     *    * `textDecoder`: `TextDecoder` instance to use. Pass in `null` if running in a browser
     */
    constructor(args: {
        rpc: JsonRpc,
        authorityProvider?: AuthorityProvider,
        abiProvider?: AbiProvider,
        signatureProvider: SignatureProvider,
        wasmAbiProvider?: WasmAbiProvider,
        chainId?: string,
        textEncoder?: TextEncoder,
        textDecoder?: TextDecoder,
    }) {
        this.rpc = args.rpc;
        this.authorityProvider = args.authorityProvider || args.rpc;
        this.abiProvider = args.abiProvider || args.rpc;
        this.signatureProvider = args.signatureProvider;
        this.wasmAbiProvider = args.wasmAbiProvider;
        this.chainId = args.chainId;
        this.textEncoder = args.textEncoder;
        this.textDecoder = args.textDecoder;

        this.abiTypes = ser.getTypesFromAbi(ser.createInitialTypes(), abiAbi);
        this.transactionTypes = ser.getTypesFromAbi(ser.createInitialTypes(), transactionAbi);
    }

    /** Decodes an abi as Uint8Array into json. */
    public rawAbiToJson(rawAbi: Uint8Array): Abi {
        const buffer = new ser.SerialBuffer({
            textEncoder: this.textEncoder,
            textDecoder: this.textDecoder,
            array: rawAbi,
        });
        if (!ser.supportedAbiVersion(buffer.getString())) {
            throw new Error('Unsupported abi version');
        }
        buffer.restartRead();
        return this.abiTypes.get('abi_def').deserialize(buffer);
    }

    /** Encodes a json abi as Uint8Array. */
    public jsonToRawAbi(jsonAbi: Abi): Uint8Array {
        const buffer = new ser.SerialBuffer({
            textEncoder: this.textEncoder,
            textDecoder: this.textDecoder,
        });
        this.abiTypes.get('abi_def').serialize(buffer, jsonAbi);
        if (!ser.supportedAbiVersion(buffer.getString())) {
            throw new Error('Unsupported abi version');
        }
        return buffer.asUint8Array();
    }

    /** Get abi in both binary and structured forms. Fetch when needed. */
    public async getCachedAbi(accountName: string, reload = false): Promise<CachedAbi> {
        if (!reload && this.cachedAbis.get(accountName)) {
            return this.cachedAbis.get(accountName);
        }
        let cachedAbi: CachedAbi;
        try {
            const rawAbi = (await this.abiProvider.getRawAbi(accountName)).abi;
            const abi = this.rawAbiToJson(rawAbi);
            cachedAbi = { rawAbi, abi };
        } catch (e) {
            e.message = `fetching abi for ${accountName}: ${e.message}`;
            throw e;
        }
        if (!cachedAbi) {
            throw new Error(`Missing abi for ${accountName}`);
        }
        this.cachedAbis.set(accountName, cachedAbi);
        return cachedAbi;
    }

    /** Get abi in structured form. Fetch when needed. */
    public async getAbi(accountName: string, reload = false): Promise<Abi> {
        return (await this.getCachedAbi(accountName, reload)).abi;
    }

    /** Get abis needed by a transaction */
    public async getTransactionAbis(transaction: any, reload = false): Promise<BinaryAbi[]> {
        const actions = (transaction.context_free_actions || []).concat(transaction.actions);
        const accounts: string[] = actions.map((action: ser.Action): string => action.account);
        const uniqueAccounts: Set<string> = new Set(accounts);
        const actionPromises: Array<Promise<BinaryAbi>> = [...uniqueAccounts]
            .filter((account: string) => !this.wasmAbiProvider || !this.wasmAbiProvider.wasmAbis.get(account))
            .map(async (account: string): Promise<BinaryAbi> => ({
                accountName: account, abi: (await this.getCachedAbi(account, reload)).rawAbi,
            }));
        return Promise.all(actionPromises);
    }

    /** Get data needed to serialize actions in a contract */
    public async getContract(accountName: string, reload = false): Promise<ser.Contract> {
        if (!reload && this.contracts.get(accountName)) {
            return this.contracts.get(accountName);
        }
        const abi = await this.getAbi(accountName, reload);
        const types = ser.getTypesFromAbi(ser.createInitialTypes(), abi);
        const actions = new Map<string, ser.Type>();
        for (const { name, type } of abi.actions) {
            actions.set(name, ser.getType(types, type));
        }
        const result = { types, actions };
        this.contracts.set(accountName, result);
        return result;
    }

    /** Convert `value` to binary form. `type` must be a built-in abi type or in `transaction.abi.json`. */
    public serialize(buffer: ser.SerialBuffer, type: string, value: any): void {
        this.transactionTypes.get(type).serialize(buffer, value);
    }

    /** Convert data in `buffer` to structured form. `type` must be a built-in abi type or in `transaction.abi.json`. */
    public deserialize(buffer: ser.SerialBuffer, type: string): any {
        return this.transactionTypes.get(type).deserialize(buffer);
    }

    /** Convert a transaction to binary */
    public serializeTransaction(transaction: any): Uint8Array {
        const buffer = new ser.SerialBuffer({ textEncoder: this.textEncoder, textDecoder: this.textDecoder });
        this.serialize(buffer, 'transaction', {
            max_net_usage_words: 0,
            max_cpu_usage_ms: 0,
            delay_sec: 0,
            context_free_actions: [],
            actions: [],
            transaction_extensions: [],
            ...transaction,
        });
        return buffer.asUint8Array();
    }

    /** Serialize context-free data */
    public serializeContextFreeData(contextFreeData: Uint8Array[]): Uint8Array {
        if (!contextFreeData || !contextFreeData.length) {
            return null;
        }
        const buffer = new ser.SerialBuffer({ textEncoder: this.textEncoder, textDecoder: this.textDecoder });
        buffer.pushVaruint32(contextFreeData.length);
        for (const data of contextFreeData) {
            buffer.pushBytes(data);
        }
        return buffer.asUint8Array();
    }

    /** Convert a transaction from binary. Leaves actions in hex. */
    public deserializeTransaction(transaction: Uint8Array): any {
        const buffer = new ser.SerialBuffer({ textEncoder: this.textEncoder, textDecoder: this.textDecoder });
        buffer.pushArray(transaction);
        return this.deserialize(buffer, 'transaction');
    }

    /** Convert actions to hex */
    public async serializeActions(actions: ser.Action[]): Promise<ser.SerializedAction[]> {
        return await Promise.all(actions.map(async (action) => {
            const { account, name, authorization, data } = action;
            if (this.wasmAbiProvider && this.wasmAbiProvider.wasmAbis.get(account)) {
                const wasmAbi = this.wasmAbiProvider.wasmAbis.get(account);
                if (wasmAbi.inst.exports.memory.buffer.length > wasmAbi.memoryThreshold) {
                    await wasmAbi.reset();
                }
                return action;
            }
            const contract = await this.getContract(account);
            if (typeof data !== 'object') {
                return action;
            }
            return ser.serializeAction(
                contract, account, name, authorization, data, this.textEncoder, this.textDecoder);
        }));
    }

    /** Convert actions from hex */
    public async deserializeActions(actions: ser.Action[]): Promise<ser.Action[]> {
        return await Promise.all(actions.map(async (action) => {
            const { account, name, authorization, data } = action;
            if (this.wasmAbiProvider && this.wasmAbiProvider.wasmAbis.get(account)) {
                return action;
            }
            const contract = await this.getContract(account);
            return ser.deserializeAction(
                contract, account, name, authorization, data, this.textEncoder, this.textDecoder);
        }));
    }

    /** Convert a transaction from binary. Also deserializes actions. */
    public async deserializeTransactionWithActions(transaction: Uint8Array | string): Promise<any> {
        if (typeof transaction === 'string') {
            transaction = ser.hexToUint8Array(transaction);
        }
        const deserializedTransaction = this.deserializeTransaction(transaction);
        const deserializedCFActions = await this.deserializeActions(deserializedTransaction.context_free_actions);
        const deserializedActions = await this.deserializeActions(deserializedTransaction.actions);
        return {
            ...deserializedTransaction, context_free_actions: deserializedCFActions, actions: deserializedActions
        };
    }

    /** Deflate a serialized object */
    public deflateSerializedArray(serializedArray: Uint8Array): Uint8Array {
        return deflate(serializedArray, { level: 9 });
    }

    /** Inflate a compressed serialized object */
    public inflateSerializedArray(compressedSerializedArray: Uint8Array): Uint8Array {
        return inflate(compressedSerializedArray);
    }

    /**
     * Create and optionally broadcast a transaction.
     *
     * Named Parameters:
     *    * `broadcast`: broadcast this transaction?
     *    * `sign`: sign this transaction?
     *    * `compression`: compress this transaction?
     *    * If both `blocksBehind` and `expireSeconds` are present,
     *      then fetch the block which is `blocksBehind` behind head block,
     *      use it as a reference for TAPoS, and expire the transaction `expireSeconds` after that block's time.
     *    * If both `useLastIrreversible` and `expireSeconds` are present,
     *      then fetch the last irreversible block, use it as a reference for TAPoS,
     *      and expire the transaction `expireSeconds` after that block's time.
     * @returns node response if `broadcast`, `{signatures, serializedTransaction}` if `!broadcast`
     */
    public async transact(
        transaction: any,
        { broadcast = true, sign = true, requiredKeys, compression, blocksBehind, useLastIrreversible, expireSeconds }:
            TransactConfig = {}): Promise<any> {
        let info: GetInfoResult;

        if (typeof blocksBehind === 'number' && useLastIrreversible) {
            throw new Error('Use either blocksBehind or useLastIrreversible');
        }

        if (!this.chainId) {
            info = await this.rpc.get_info();
            this.chainId = info.chain_id;
        }

        if ((typeof blocksBehind === 'number' || useLastIrreversible) && expireSeconds) {
            transaction = await this.generateTapos(info, transaction, blocksBehind, useLastIrreversible, expireSeconds);
        }

        if (!this.hasRequiredTaposFields(transaction)) {
            throw new Error('Required configuration or TAPOS fields are not present');
        }

        const abis: BinaryAbi[] = await this.getTransactionAbis(transaction);
        transaction = {
            ...transaction,
            context_free_actions: await this.serializeActions(transaction.context_free_actions || []),
            actions: await this.serializeActions(transaction.actions)
        };
        const serializedTransaction = this.serializeTransaction(transaction);
        const serializedContextFreeData = this.serializeContextFreeData(transaction.context_free_data);
        let pushTransactionArgs: PushTransactionArgs = {
            serializedTransaction, serializedContextFreeData, signatures: []
        };

        if (sign) {
            if (!requiredKeys) {
                const availableKeys = await this.signatureProvider.getAvailableKeys();
                requiredKeys = await this.authorityProvider.getRequiredKeys({ transaction, availableKeys });
            }

            pushTransactionArgs = await this.signatureProvider.sign({
                chainId: this.chainId,
                requiredKeys,
                serializedTransaction,
                serializedContextFreeData,
                abis,
            });
        }
        if (broadcast) {
            let result;
            if (compression) {
                result = await this.pushCompressedSignedTransaction(pushTransactionArgs);
            } else {
                result = await this.pushSignedTransaction(pushTransactionArgs);
            }
            if (this.wasmAbiProvider && result.processed && result.processed.action_traces) {
                for (const at of result.processed.action_traces) {
                    if (at.act && this.wasmAbiProvider.wasmAbis.get(at.act.account)) {
                        const abi = this.wasmAbiProvider.wasmAbis.get(at.act.account);
                        const name = at.act.name;
                        if (at.act.hasOwnProperty('data')) {
                            try {
                                const j = abi.action_args_bin_to_json(name, ser.hexToUint8Array(at.act.data));
                                at.act.name = j.long_name;
                                at.act.data = j.args;
                            } catch (e) { } // tslint:disable-line no-empty
                        }
                        if (at.hasOwnProperty('return_value')) {
                            try {
                                const j = abi.action_ret_bin_to_json(name, ser.hexToUint8Array(at.return_value));
                                at.act.name = j.long_name;
                                at.return_value = j.return_value;
                            } catch (e) { } // tslint:disable-line no-empty
                        }
                    }
                }
            }
            return result;
        }
        return pushTransactionArgs;
    }

    public async query(
            account: string, short: boolean, query: Query,
            { sign, requiredKeys, authorization = [] }: QueryConfig
        ): Promise<any> {
        const info = await this.rpc.get_info();
        // TODO: replace get_block; needs rodeos changes
        const refBlock = await this.rpc.get_block(info.last_irreversible_block_num);
        const queryBuffer = new ser.SerialBuffer({ textEncoder: this.textEncoder, textDecoder: this.textDecoder });
        ser.serializeQuery(queryBuffer, query);

        const transaction = {
            ...ser.transactionHeader(refBlock, 60 * 30),
            context_free_actions: [] as any[],
            actions: [{
                account,
                name: 'queryit',
                authorization,
                data: ser.arrayToHex(queryBuffer.asUint8Array()),
            }],
        };

        const serializedTransaction = this.serializeTransaction(transaction);
        let signatures: string[] = [];
        if (sign) {
            const abis: BinaryAbi[] = await this.getTransactionAbis(transaction);
            if (!requiredKeys) {
                const availableKeys = await this.signatureProvider.getAvailableKeys();
                requiredKeys = await this.authorityProvider.getRequiredKeys({ transaction, availableKeys });
            }

            const signResponse = await this.signatureProvider.sign({
                chainId: this.chainId,
                requiredKeys,
                serializedTransaction,
                serializedContextFreeData: null,
                abis,
            });

            signatures = signResponse.signatures;
        }

        const response = await this.rpc.fetchBuiltin(this.rpc.endpoint + '/v1/chain/send_transaction', {
            body: JSON.stringify({
                signatures,
                compression: 0,
                packed_context_free_data: '',
                packed_trx: ser.arrayToHex(serializedTransaction),
            }),
            method: 'POST',
        });
        const json = await response.json();
        if (json.code) {
            throw new RpcError(json);
        }

        const returnBuffer = new ser.SerialBuffer({
            textEncoder: this.textEncoder,
            textDecoder: this.textDecoder,
            array: ser.hexToUint8Array(json.processed.action_traces[0][1].return_value)
        });
        if (short) {
            return ser.deserializeAnyvarShort(returnBuffer);
        } else {
            return ser.deserializeAnyvar(returnBuffer);
        }
    }

    /** Broadcast a signed transaction */
    public async pushSignedTransaction(
        { signatures, serializedTransaction, serializedContextFreeData }: PushTransactionArgs
    ): Promise<any> {
        return this.rpc.push_transaction({
            signatures,
            serializedTransaction,
            serializedContextFreeData
        });
    }

    public async pushCompressedSignedTransaction(
        { signatures, serializedTransaction, serializedContextFreeData }: PushTransactionArgs
    ): Promise<any> {
        const compressedSerializedTransaction = this.deflateSerializedArray(serializedTransaction);
        const compressedSerializedContextFreeData =
            this.deflateSerializedArray(serializedContextFreeData || new Uint8Array(0));

        return this.rpc.push_transaction({
            signatures,
            compression: 1,
            serializedTransaction: compressedSerializedTransaction,
            serializedContextFreeData: compressedSerializedContextFreeData
        });
    }

    private async generateTapos(
        info: GetInfoResult | undefined,
        transaction: any,
        blocksBehind: number | undefined,
        useLastIrreversible: boolean | undefined,
        expireSeconds: number
    ) {
        if (!info) {
            info = await this.rpc.get_info();
        }

        const taposBlockNumber: number = useLastIrreversible
          ? info.last_irreversible_block_num : info.head_block_num - blocksBehind;

        const refBlock: GetBlockHeaderStateResult | GetBlockResult =
          taposBlockNumber <= info.last_irreversible_block_num
          ? await this.rpc.get_block(taposBlockNumber)
          : await this.tryGetBlockHeaderState(taposBlockNumber);

        return { ...ser.transactionHeader(refBlock, expireSeconds), ...transaction };
    }

    // eventually break out into TransactionValidator class
    private hasRequiredTaposFields({ expiration, ref_block_num, ref_block_prefix }: any): boolean {
        return !!(expiration && typeof(ref_block_num) === 'number' && typeof(ref_block_prefix) === 'number');
    }

    private async tryGetBlockHeaderState(taposBlockNumber: number):
        Promise<GetBlockHeaderStateResult | GetBlockResult> {
        try {
            return await this.rpc.get_block_header_state(taposBlockNumber);
        } catch (error) {
            return await this.rpc.get_block(taposBlockNumber);
        }
    }

    public with(accountName: string): ActionBuilder {
        return new ActionBuilder(this, accountName);
    }

    public buildTransaction(cb?: (tx: TransactionBuilder) => void) {
        const tx = new TransactionBuilder(this);
        if (cb) {
            return cb(tx);
        }
        return tx;
    }
} // Api

export class TransactionBuilder { // tslint:disable-line max-classes-per-file
    private api: Api;
    private actions: ActionBuilder[] = [];
    private contextFreeGroups: any[] = [];
    constructor(api: Api) {
        this.api = api;
    }

    public with(accountName: string): ActionBuilder {
        const actionBuilder = new ActionBuilder(this.api, accountName);
        this.actions.push(actionBuilder);
        return actionBuilder;
    }

    public associateContextFree(contextFreeGroup: ContextFreeGroupCallback) {
        this.contextFreeGroups.push(contextFreeGroup);
        return this;
    }

    public async send(config?: TransactConfig): Promise<any> {
        const contextFreeDataSet: any[] = [];
        const contextFreeActions: ActionBuilder[] = [];
        const actions: any[] = this.actions.map((actionBuilder) => actionBuilder.serializedData);
        await Promise.all(this.contextFreeGroups.map(
            async (contextFreeCallback: ContextFreeGroupCallback) => {
                const { action, contextFreeAction, contextFreeData } = contextFreeCallback({
                    cfd: contextFreeDataSet.length,
                    cfa: contextFreeActions.length
                });
                if (action) {
                    actions.push(action);
                }
                if (contextFreeAction) {
                    contextFreeActions.push(contextFreeAction);
                }
                if (contextFreeData) {
                    contextFreeDataSet.push(contextFreeData);
                }
            }
        ));
        this.contextFreeGroups = [];
        this.actions = [];
        return await this.api.transact({
            contextFreeData: contextFreeDataSet,
            contextFreeActions,
            actions
        }, config);
    }
}

export class ActionBuilder { // tslint:disable-line max-classes-per-file
    private api: Api;
    private readonly accountName: string;
    public serializedData: any;

    constructor(api: Api, accountName: string) {
        this.api = api;
        this.accountName = accountName;
    }

    public as(actorName?: string | ser.Authorization[]) {
        let authorization: any[] = [];
        if (actorName && typeof actorName === 'string') {
            authorization = [{ actor: actorName, permission: 'active'}];
        }

        const wasmAbi = this.api.wasmAbiProvider.wasmAbis.get(this.accountName);
        return new ActionSerializer(this, this.api, this.accountName, authorization, wasmAbi);
    }
}

class ActionSerializer { // tslint:disable-line max-classes-per-file
    constructor(
        parent: ActionBuilder,
        api: Api,
        accountName: string,
        authorization: ser.Authorization[],
        wasmAbi: WasmAbi
    ) {
        if (wasmAbi) {
            Object.keys(wasmAbi.actions).forEach((action) => {
                Object.assign(this, {
                    [action]: (...args: any[]) => {
                        const serializedData = wasmAbi.actions[action](authorization, ...args);
                        serializedData.data = ser.arrayToHex(serializedData.data);
                        parent.serializedData = serializedData;
                        return serializedData;
                    }
                });
            });
        } else {
            const jsonAbi = api.cachedAbis.get(accountName);
            if (!jsonAbi) {
                throw new Error('ABI must be cached before using ActionBuilder, run api.getAbi()');
            }
            const types = ser.getTypesFromAbi(ser.createInitialTypes(), jsonAbi.abi);
            const actions = new Map<string, ser.Type>();
            for (const { name, type } of jsonAbi.abi.actions) {
                actions.set(name, ser.getType(types, type));
            }
            actions.forEach((type, name) => {
                Object.assign(this, {
                    [name]: (data: any) => {
                        const serializedData = ser.serializeAction(
                            { types, actions },
                            accountName,
                            name,
                            authorization,
                            data,
                            api.textEncoder,
                            api.textDecoder
                        );
                        parent.serializedData = serializedData;
                        return serializedData;
                    }
                });
            });
        }
    }
}
