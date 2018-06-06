// copyright defined in eosjs2/LICENSE.txt

'use strict';

import { Abi, GetInfoResult, JsonRpc } from './eosjs2-jsonrpc';
import * as ser from './eosjs2-serialize';

export interface SignatureProviderArgs {
    chainId: string;
    serializedTransaction: Uint8Array;
}

export interface SignatureProvider {
    sign: (args: SignatureProviderArgs) => Promise<string[]>;
}

export class Api {
    rpc: JsonRpc;
    signatureProvider: SignatureProvider;
    chainId: string;
    contracts = new Map<string, ser.Contract>();

    constructor(args: { rpc: JsonRpc, signatureProvider: SignatureProvider, chainId: string }) {
        this.rpc = args.rpc;
        this.signatureProvider = args.signatureProvider;
        this.chainId = args.chainId;
    }

    async getContract(accountName: string, reload = false): Promise<ser.Contract> {
        if (!reload && this.contracts.get(accountName))
            return this.contracts.get(accountName);
        // HACK: transaction lives in msig's api
        let initialTypes = accountName === 'eosio.msig' ?
            ser.createInitialTypes() :
            (await this.getContract('eosio.msig')).types;
        let abi: Abi;
        try {
            abi = (await this.rpc.get_abi(accountName)).abi;
        } catch (e) {
            e.message = 'fetching abi for ' + accountName + ': ' + e.message;
            throw e;
        }
        if (!abi)
            throw new Error("Missing abi for " + accountName);
        let types = ser.getTypesFromAbi(initialTypes, abi);
        let actions = new Map<string, ser.Type>();
        for (let { name, type } of abi.actions)
            actions.set(name, ser.getType(types, type));
        let result = { types, actions };
        this.contracts.set(accountName, result);
        return result;
    }

    serializeTransaction(transaction: any) {
        let buffer = new ser.SerialBuffer;
        this.contracts.get('eosio.msig').types.get('transaction').serialize(
            buffer, {
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

    async serializeActions(actions: ser.Action[]) {
        return await Promise.all(actions.map(async ({ account, name, authorization, data }) => {
            return ser.serializeAction(await this.getContract(account), account, name, authorization, data);
        }));
    }

    async pushTransaction({ blocksBehind, expireSeconds, actions, ...transaction }: any) {
        let info: GetInfoResult;
        if (!this.chainId) {
            info = await this.rpc.get_info();
            this.chainId = info.chain_id;
        }
        if (blocksBehind !== undefined && expireSeconds !== undefined) {
            if (!info)
                info = await this.rpc.get_info();
            let refBlock = await this.rpc.get_block(info.head_block_num - blocksBehind);
            transaction = { ...ser.transactionHeader(refBlock, expireSeconds), ...transaction };
        }
        transaction = { ...transaction, actions: await this.serializeActions(actions) };
        let serializedTransaction = this.serializeTransaction(transaction);
        let signatures = await this.signatureProvider.sign({ chainId: this.chainId, serializedTransaction: serializedTransaction });
        return await this.rpc.push_transaction({
            signatures,
            serializedTransaction,
        });
    }
} // Api
