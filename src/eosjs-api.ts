/**
 * @module API
 */
// copyright defined in eosjs/LICENSE.txt
/* eslint-disable max-classes-per-file */

import { inflate, deflate } from 'pako';

import {
    AbiProvider,
    ActionSerializerType,
    AuthorityProvider,
    BinaryAbi,
    CachedAbi,
    ContextFreeGroupCallback,
    Query,
    QueryConfig,
    SignatureProvider,
    TransactConfig,
    Transaction,
    TransactResult,
} from './eosjs-api-interfaces';
import { JsonRpc } from './eosjs-jsonrpc';
import {
    Abi,
    BlockTaposInfo,
    GetInfoResult,
    PushTransactionArgs,
    GetBlockHeaderStateResult,
    GetBlockInfoResult,
    GetBlockResult,
    ReadOnlyTransactResult,
} from './eosjs-rpc-interfaces';
import * as ser from './eosjs-serialize';

export class Api {
    /** Issues RPC calls */
    public rpc: JsonRpc;

    /** Get subset of `availableKeys` needed to meet authorities in a `transaction` */
    public authorityProvider: AuthorityProvider;

    /** Supplies ABIs in raw form (binary) */
    public abiProvider: AbiProvider;

    /** Signs transactions */
    public signatureProvider: SignatureProvider;

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
     * * `rpc`: Issues RPC calls
     * * `authorityProvider`: Get public keys needed to meet authorities in a transaction
     * * `abiProvider`: Supplies ABIs in raw form (binary)
     * * `signatureProvider`: Signs transactions
     * * `chainId`: Identifies chain
     * * `textEncoder`: `TextEncoder` instance to use. Pass in `null` if running in a browser
     * * `textDecoder`: `TextDecoder` instance to use. Pass in `null` if running in a browser
     */
    constructor(args: {
        rpc: JsonRpc,
        authorityProvider?: AuthorityProvider,
        abiProvider?: AbiProvider,
        signatureProvider: SignatureProvider,
        chainId?: string,
        textEncoder?: TextEncoder,
        textDecoder?: TextDecoder,
    }) {
        this.rpc = args.rpc;
        this.authorityProvider = args.authorityProvider || args.rpc;
        this.abiProvider = args.abiProvider || args.rpc;
        this.signatureProvider = args.signatureProvider;
        this.chainId = args.chainId;
        this.textEncoder = args.textEncoder;
        this.textDecoder = args.textDecoder;

        this.abiTypes = ser.getTypesFromAbi(ser.createAbiTypes());
        this.transactionTypes = ser.getTypesFromAbi(ser.createTransactionTypes());
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
    public async getTransactionAbis(transaction: Transaction, reload = false): Promise<BinaryAbi[]> {
        const actions = (transaction.context_free_actions || []).concat(transaction.actions);
        const accounts: string[] = actions.map((action: ser.Action): string => action.account);
        const uniqueAccounts: Set<string> = new Set(accounts);
        const actionPromises: Promise<BinaryAbi>[] = [...uniqueAccounts].map(
            async (account: string): Promise<BinaryAbi> => ({
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
    public serializeTransaction(transaction: Transaction): Uint8Array {
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
    public deserializeTransaction(transaction: Uint8Array): Transaction {
        const buffer = new ser.SerialBuffer({ textEncoder: this.textEncoder, textDecoder: this.textDecoder });
        buffer.pushArray(transaction);
        return this.deserialize(buffer, 'transaction');
    }

    private transactionExtensions = [
        { id: 1, type: 'resource_payer', keys: ['payer', 'max_net_bytes', 'max_cpu_us', 'max_memory_bytes'] },
    ];

    // Order of adding to transaction_extension is transaction_extension id ascending
    public serializeTransactionExtensions(transaction: Transaction): [number, string][] {
        let transaction_extensions: [number, string][] = [];
        if (transaction.resource_payer) {
            const extensionBuffer = new ser.SerialBuffer({ textEncoder: this.textEncoder, textDecoder: this.textDecoder });
            const types = ser.getTypesFromAbi(ser.createTransactionExtensionTypes());
            types.get('resource_payer').serialize(extensionBuffer, transaction.resource_payer);
            transaction_extensions = [...transaction_extensions, [1, ser.arrayToHex(extensionBuffer.asUint8Array())]];
        }
        return transaction_extensions;
    };

    // Usage: transaction = {...transaction, ...this.deserializeTransactionExtensions(transaction.transaction_extensions)}
    public deserializeTransactionExtensions(data: [number, string][]): any[] {
        const transaction = {} as any;
        data.forEach((extensionData: [number, string]) => {
            const transactionExtension = this.transactionExtensions.find(extension => extension.id === extensionData[0]);
            if (transactionExtension === undefined) {
                throw new Error(`Transaction Extension could not be determined: ${extensionData}`);
            }
            const types = ser.getTypesFromAbi(ser.createTransactionExtensionTypes());
            const extensionBuffer = new ser.SerialBuffer({ textEncoder: this.textEncoder, textDecoder: this.textDecoder });
            extensionBuffer.pushArray(ser.hexToUint8Array(extensionData[1]));
            const deserializedObj = types.get(transactionExtension.type).deserialize(extensionBuffer);
            if (extensionData[0] === 1) {
                deserializedObj.max_net_bytes = Number(deserializedObj.max_net_bytes);
                deserializedObj.max_cpu_us = Number(deserializedObj.max_cpu_us);
                deserializedObj.max_memory_bytes = Number(deserializedObj.max_memory_bytes);
                transaction.resource_payer = deserializedObj;
            }
        });
        return transaction;
    };

    // Transaction extensions are serialized and moved to `transaction_extensions`, deserialized objects are not needed on the transaction
    public deleteTransactionExtensionObjects(transaction: Transaction): Transaction {
        delete transaction.resource_payer;
        return transaction;
    }

    /** Convert actions to hex */
    public async serializeActions(actions: ser.Action[]): Promise<ser.SerializedAction[]> {
        return await Promise.all(actions.map(async (action) => {
            const { account, name, authorization, data } = action;
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
        return await Promise.all(actions.map(async ({ account, name, authorization, data }) => {
            const contract = await this.getContract(account);
            return ser.deserializeAction(
                contract, account, name, authorization, data, this.textEncoder, this.textDecoder);
        }));
    }

    /** Convert a transaction from binary. Also deserializes actions. */
    public async deserializeTransactionWithActions(transaction: Uint8Array | string): Promise<Transaction> {
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
     * `broadcast`: broadcast this transaction?
     * `sign`: sign this transaction?
     * `compression`: compress this transaction?
     * `readOnlyTrx`: read only transaction?
     * `returnFailureTraces`: return failure traces? (only available for read only transactions currently)
     *
     * If both `blocksBehind` and `expireSeconds` are present,
     * then fetch the block which is `blocksBehind` behind head block,
     * use it as a reference for TAPoS, and expire the transaction `expireSeconds` after that block's time.
     *
     * If both `useLastIrreversible` and `expireSeconds` are present,
     * then fetch the last irreversible block, use it as a reference for TAPoS,
     * and expire the transaction `expireSeconds` after that block's time.
     *
     * @returns node response if `broadcast`, `{signatures, serializedTransaction}` if `!broadcast`
     */
    public async transact(
        transaction: Transaction,
        {
            broadcast = true,
            sign = true,
            readOnlyTrx,
            returnFailureTraces,
            requiredKeys,
            compression,
            blocksBehind,
            useLastIrreversible,
            expireSeconds
        }:
        TransactConfig = {}): Promise<TransactResult|ReadOnlyTransactResult|PushTransactionArgs>
    {
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
            transaction_extensions: await this.serializeTransactionExtensions(transaction),
            context_free_actions: await this.serializeActions(transaction.context_free_actions || []),
            actions: await this.serializeActions(transaction.actions)
        };
        transaction = this.deleteTransactionExtensionObjects(transaction);
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
            if (compression) {
                return this.pushCompressedSignedTransaction(
                    pushTransactionArgs,
                    readOnlyTrx,
                    returnFailureTraces,
                ) as Promise<TransactResult|ReadOnlyTransactResult>;
            }
            return this.pushSignedTransaction(
                pushTransactionArgs,
                readOnlyTrx,
                returnFailureTraces,
            ) as Promise<TransactResult|ReadOnlyTransactResult>;
        }
        return pushTransactionArgs as PushTransactionArgs;
    }

    public async query(
        account: string, short: boolean, query: Query,
        { sign, requiredKeys, authorization = [] }: QueryConfig
    ): Promise<any> {
        const info = await this.rpc.get_info();
        const refBlock = await this.tryRefBlockFromGetInfo(info);
        const queryBuffer = new ser.SerialBuffer({ textEncoder: this.textEncoder, textDecoder: this.textDecoder });
        ser.serializeQuery(queryBuffer, query);

        const transaction = {
            ...ser.transactionHeader(refBlock, 60 * 30),
            context_free_actions: [] as ser.Action[],
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

        const response = await this.rpc.send_transaction({
            signatures,
            compression: 0,
            serializedTransaction
        }) as any;

        const returnBuffer = new ser.SerialBuffer({
            textEncoder: this.textEncoder,
            textDecoder: this.textDecoder,
            array: ser.hexToUint8Array(response.processed.action_traces[0][1].return_value)
        });
        if (short) {
            return ser.deserializeAnyvarShort(returnBuffer);
        } else {
            return ser.deserializeAnyvar(returnBuffer);
        }
    }

    /** Broadcast a signed transaction */
    public async pushSignedTransaction(
        { signatures, serializedTransaction, serializedContextFreeData }: PushTransactionArgs,
        readOnlyTrx = false,
        returnFailureTraces = false,
    ): Promise<TransactResult|ReadOnlyTransactResult> {
        if (readOnlyTrx) {
            return this.rpc.push_ro_transaction({
                signatures,
                serializedTransaction,
                serializedContextFreeData,
            }, returnFailureTraces);
        }
        return this.rpc.push_transaction({
            signatures,
            serializedTransaction,
            serializedContextFreeData
        });
    }

    public async pushCompressedSignedTransaction(
        { signatures, serializedTransaction, serializedContextFreeData }: PushTransactionArgs,
        readOnlyTrx = false,
        returnFailureTraces = false,
    ): Promise<TransactResult|ReadOnlyTransactResult> {
        const compressedSerializedTransaction = this.deflateSerializedArray(serializedTransaction);
        const compressedSerializedContextFreeData =
            this.deflateSerializedArray(serializedContextFreeData || new Uint8Array(0));

        if (readOnlyTrx) {
            return this.rpc.push_ro_transaction({
                signatures,
                compression: 1,
                serializedTransaction: compressedSerializedTransaction,
                serializedContextFreeData: compressedSerializedContextFreeData
            }, returnFailureTraces);
        }
        return this.rpc.push_transaction({
            signatures,
            compression: 1,
            serializedTransaction: compressedSerializedTransaction,
            serializedContextFreeData: compressedSerializedContextFreeData
        });
    }

    private async generateTapos(
        info: GetInfoResult | undefined,
        transaction: Transaction,
        blocksBehind: number | undefined,
        useLastIrreversible: boolean | undefined,
        expireSeconds: number
    ): Promise<Transaction> {
        if (!info) {
            info = await this.rpc.get_info();
        }
        if (useLastIrreversible) {
            const block = await this.tryRefBlockFromGetInfo(info);
            return { ...ser.transactionHeader(block, expireSeconds), ...transaction };
        }

        const taposBlockNumber: number = info.head_block_num - blocksBehind;

        const refBlock: GetBlockHeaderStateResult | GetBlockResult | GetBlockInfoResult =
            taposBlockNumber <= info.last_irreversible_block_num
                ? await this.tryGetBlockInfo(taposBlockNumber)
                : await this.tryGetBlockHeaderState(taposBlockNumber);

        return { ...ser.transactionHeader(refBlock, expireSeconds), ...transaction };
    }

    // eventually break out into TransactionValidator class
    private hasRequiredTaposFields({ expiration, ref_block_num, ref_block_prefix }: Transaction): boolean {
        return !!(expiration && typeof(ref_block_num) === 'number' && typeof(ref_block_prefix) === 'number');
    }

    private async tryGetBlockHeaderState(taposBlockNumber: number): Promise<GetBlockHeaderStateResult | GetBlockResult | GetBlockInfoResult>
    {
        try {
            return await this.rpc.get_block_header_state(taposBlockNumber);
        } catch (error) {
            return await this.tryGetBlockInfo(taposBlockNumber);
        }
    }

    private async tryGetBlockInfo(blockNumber: number): Promise<GetBlockInfoResult | GetBlockResult> {
        try {
            return await this.rpc.get_block_info(blockNumber);
        } catch (error) {
            return await this.rpc.get_block(blockNumber);
        }
    }

    private async tryRefBlockFromGetInfo(info: GetInfoResult): Promise<BlockTaposInfo | GetBlockInfoResult | GetBlockResult> {
        if (
            info.hasOwnProperty('last_irreversible_block_id') &&
            info.hasOwnProperty('last_irreversible_block_num') &&
            info.hasOwnProperty('last_irreversible_block_time')
        ) {
            return {
                block_num: info.last_irreversible_block_num,
                id: info.last_irreversible_block_id,
                timestamp: info.last_irreversible_block_time,
            };
        } else {
            const block = await this.tryGetBlockInfo(info.last_irreversible_block_num);
            return {
                block_num: block.block_num,
                id: block.id,
                timestamp: block.timestamp,
            };
        }
    }

    public with(accountName: string): ActionBuilder {
        return new ActionBuilder(this, accountName);
    }

    public buildTransaction(cb?: (tx: TransactionBuilder) => void): TransactionBuilder|void {
        const tx = new TransactionBuilder(this);
        if (cb) {
            return cb(tx);
        }
        return tx as TransactionBuilder;
    }
} // Api

export class TransactionBuilder {
    private api: Api;
    private actions: ActionBuilder[] = [];
    private contextFreeGroups: ContextFreeGroupCallback[] = [];
    constructor(api: Api) {
        this.api = api;
    }

    public with(accountName: string): ActionBuilder {
        const actionBuilder = new ActionBuilder(this.api, accountName);
        this.actions.push(actionBuilder);
        return actionBuilder;
    }

    public associateContextFree(contextFreeGroup: ContextFreeGroupCallback): TransactionBuilder {
        this.contextFreeGroups.push(contextFreeGroup);
        return this;
    }

    public async send(config?: TransactConfig): Promise<PushTransactionArgs|ReadOnlyTransactResult|TransactResult> {
        const contextFreeDataSet: Uint8Array[] = [];
        const contextFreeActions: ser.SerializedAction[] = [];
        const actions: ser.SerializedAction[] = this.actions.map((actionBuilder) => actionBuilder.serializedData as ser.SerializedAction);
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
            context_free_data: contextFreeDataSet,
            context_free_actions: contextFreeActions,
            actions
        }, config);
    }
}

export class ActionBuilder {
    private api: Api;
    private readonly accountName: string;
    public serializedData: ser.SerializedAction;

    constructor(api: Api, accountName: string) {
        this.api = api;
        this.accountName = accountName;
    }

    public as(actorName: string | ser.Authorization[] = []): ActionSerializerType {
        let authorization: ser.Authorization[] = [];
        if (actorName && typeof actorName === 'string') {
            authorization = [{ actor: actorName, permission: 'active'}];
        } else {
            authorization = actorName as ser.Authorization[];
        }

        return new ActionSerializer(this, this.api, this.accountName, authorization) as ActionSerializerType;
    }
}

class ActionSerializer implements ActionSerializerType {
    constructor(
        parent: ActionBuilder,
        api: Api,
        accountName: string,
        authorization: ser.Authorization[],
    ) {
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
                [name]: (...args: any[]) => {
                    const data: { [key: string]: any } = {};
                    args.forEach((arg, index) => {
                        const field = type.fields[index];
                        data[field.name] = arg;
                    });
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
