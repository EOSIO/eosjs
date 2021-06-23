/**
 * @module JSON-RPC
 */
// copyright defined in eosjs/LICENSE.txt

import { AbiProvider, AuthorityProvider, AuthorityProviderArgs, BinaryAbi, TransactResult } from './eosjs-api-interfaces';
import { base64ToBinary, convertLegacyPublicKeys } from './eosjs-numeric';
import {
    AbiBinToJsonResult,
    AbiJsonToBinResult,
    GetAbiResult,
    GetAccountResult,
    GetAccountsByAuthorizersResult,
    GetActivatedProtocolFeaturesParams,
    GetActivatedProtocolFeaturesResult,
    GetBlockInfoResult,
    GetBlockResult,
    GetCodeResult,
    GetCodeHashResult,
    GetCurrencyStatsResult,
    GetInfoResult,
    GetProducerScheduleResult,
    GetProducersResult,
    GetRawCodeAndAbiResult,
    GetRawAbiResult,
    GetScheduledTransactionsResult,
    GetTableRowsResult,
    PushTransactionArgs,
    PackedTrx,
    ReadOnlyTransactResult,
    GetBlockHeaderStateResult,
    GetTableByScopeResult,
    DBSizeGetResult,
    TraceApiGetBlockResult,
    GetActionsResult,
    GetTransactionResult,
    GetKeyAccountsResult,
    GetControlledAccountsResult,
} from './eosjs-rpc-interfaces';
import { Authorization } from './eosjs-serialize';
import { RpcError } from './eosjs-rpcerror';

const arrayToHex = (data: Uint8Array): string => {
    let result = '';
    for (const x of data) {
        result += ('00' + x.toString(16)).slice(-2);
    }
    return result;
};

/** Make RPC calls */
export class JsonRpc implements AuthorityProvider, AbiProvider {
    public endpoint: string;
    public fetchBuiltin: (input?: any, init?: any) => Promise<any>;

    /**
     * @param args
     * `fetch`:
     * browsers: leave `null` or `undefined`
     * node: provide an implementation
     */
    constructor(
        endpoint: string,
        args: {
            fetch?: (input?: any, init?: any) => Promise<any>
        } = {}
    ) {
        this.endpoint = endpoint.replace(/\/$/, '');
        if (args.fetch) {
            this.fetchBuiltin = args.fetch;
        } else {
            this.fetchBuiltin = (global as any).fetch;
        }
    }

    /** Post `body` to `endpoint + path`. Throws detailed error information in `RpcError` when available. */
    public async fetch(path: string, body: any): Promise<any> {
        let response;
        let json;
        try {
            const f = this.fetchBuiltin;
            response = await f(this.endpoint + path, {
                body: JSON.stringify(body),
                method: 'POST',
            });
            json = await response.json();
            if (json.processed && json.processed.except) {
                throw new RpcError(json);
            } else if (json.result && json.result.except) {
                throw new RpcError(json);
            }
        } catch (e) {
            e.isFetchError = true;
            throw e;
        }
        if (!response.ok) {
            throw new RpcError(json);
        }
        return json;
    }

    public async abi_bin_to_json(
        code: string,
        action: string,
        binargs: string,
    ): Promise<AbiBinToJsonResult> {
        return await this.fetch('/v1/chain/abi_bin_to_json', { code, action, binargs });
    }

    public async abi_json_to_bin(
        code: string,
        action: string,
        args: any[],
    ): Promise<AbiJsonToBinResult> {
        return await this.fetch('/v1/chain/abi_json_to_bin', { code, action, args });
    }

    /** Raw call to `/v1/chain/get_abi` */
    public async get_abi(accountName: string): Promise<GetAbiResult> {
        return await this.fetch('/v1/chain/get_abi', { account_name: accountName });
    }

    /** Raw call to `/v1/chain/get_account` */
    public async get_account(accountName: string): Promise<GetAccountResult> {
        return await this.fetch('/v1/chain/get_account', { account_name: accountName });
    }

    /** Raw call to `/v1/chain/get_accounts_by_authorizers` */
    public async get_accounts_by_authorizers(accounts: Authorization[], keys: string[]): Promise<GetAccountsByAuthorizersResult> {
        return await this.fetch('/v1/chain/get_accounts_by_authorizers', { accounts, keys });
    }

    /** Raw call to `get_activated_protocol_features` */
    public async get_activated_protocol_features({
        limit = 10,
        search_by_block_num = false,
        reverse = false,
        lower_bound = null,
        upper_bound = null,
    }: GetActivatedProtocolFeaturesParams): Promise<GetActivatedProtocolFeaturesResult> {
        return await this.fetch('/v1/chain/get_activated_protocol_features', { lower_bound, upper_bound, limit, search_by_block_num, reverse });
    }

    /** Raw call to `/v1/chain/get_block_header_state` */
    public async get_block_header_state(blockNumOrId: number | string): Promise<GetBlockHeaderStateResult> {
        return await this.fetch('/v1/chain/get_block_header_state', { block_num_or_id: blockNumOrId });
    }

    /** Raw call to `/v1/chain/get_block_info` */
    public async get_block_info(blockNum: number): Promise<GetBlockInfoResult> {
        return await this.fetch('/v1/chain/get_block_info', { block_num: blockNum });
    }

    /** Raw call to `/v1/chain/get_block` */
    public async get_block(blockNumOrId: number | string): Promise<GetBlockResult> {
        return await this.fetch('/v1/chain/get_block', { block_num_or_id: blockNumOrId });
    }

    /** Raw call to `/v1/chain/get_code` */
    public async get_code(accountName: string): Promise<GetCodeResult> {
        return await this.fetch('/v1/chain/get_code', {
            account_name: accountName,
            code_as_wasm: true
        });
    }

    /** Raw call to `/v1/chain/get_code_hash` */
    public async get_code_hash(accountName: string): Promise<GetCodeHashResult> {
        return await this.fetch('/v1/chain/get_code_hash', { account_name: accountName });
    }

    /** Raw call to `/v1/chain/get_currency_balance` */
    public async get_currency_balance(code: string, account: string, symbol: string = null): Promise<string[]> {
        return await this.fetch('/v1/chain/get_currency_balance', { code, account, symbol });
    }

    /** Raw call to `/v1/chain/get_currency_stats` */
    public async get_currency_stats(code: string, symbol: string): Promise<GetCurrencyStatsResult> {
        return await this.fetch('/v1/chain/get_currency_stats', { code, symbol });
    }

    /** Raw call to `/v1/chain/get_info` */
    public async get_info(): Promise<GetInfoResult> {
        return await this.fetch('/v1/chain/get_info', {});
    }

    /** Raw call to `/v1/chain/get_producer_schedule` */
    public async get_producer_schedule(): Promise<GetProducerScheduleResult> {
        return await this.fetch('/v1/chain/get_producer_schedule', {});
    }

    /** Raw call to `/v1/chain/get_producers` */
    public async get_producers(json = true, lowerBound = '', limit = 50): Promise<GetProducersResult> {
        return await this.fetch('/v1/chain/get_producers', { json, lower_bound: lowerBound, limit });
    }

    /** Raw call to `/v1/chain/get_raw_code_and_abi` */
    public async get_raw_code_and_abi(accountName: string): Promise<GetRawCodeAndAbiResult> {
        return await this.fetch('/v1/chain/get_raw_code_and_abi', { account_name: accountName });
    }

    /** calls `/v1/chain/get_raw_code_and_abi` and pulls out unneeded raw wasm code */
    public async getRawAbi(accountName: string): Promise<BinaryAbi> {
        const rawAbi = await this.get_raw_abi(accountName);
        const abi = base64ToBinary(rawAbi.abi);
        return { accountName: rawAbi.account_name, abi };
    }

    /** Raw call to `/v1/chain/get_raw_abi` */
    public async get_raw_abi(accountName: string): Promise<GetRawAbiResult> {
        return await this.fetch('/v1/chain/get_raw_abi', { account_name: accountName });
    }

    /** Raw call to `/v1/chain/get_scheduled_transactions` */
    public async get_scheduled_transactions(json = true, lowerBound = '', limit = 50): Promise<GetScheduledTransactionsResult> {
        return await this.fetch('/v1/chain/get_scheduled_transactions', { json, lower_bound: lowerBound, limit });
    }

    /** Raw call to `/v1/chain/get_table_rows` */
    public async get_table_rows({
        json = true,
        code,
        scope,
        table,
        lower_bound = '',
        upper_bound = '',
        index_position = 1,
        key_type = '',
        limit = 10,
        reverse = false,
        show_payer = false,
    }: any): Promise<GetTableRowsResult> {
        return await this.fetch(
            '/v1/chain/get_table_rows', {
                json,
                code,
                scope,
                table,
                lower_bound,
                upper_bound,
                index_position,
                key_type,
                limit,
                reverse,
                show_payer,
            });
    }

    /** Raw call to `/v1/chain/get_kv_table_rows` */
    public async get_kv_table_rows({
        json = true,
        code,
        table,
        index_name,
        encode_type = 'bytes',
        index_value,
        lower_bound,
        upper_bound,
        limit = 10,
        reverse = false,
        show_payer = false,
    }: any): Promise<GetTableRowsResult> {
        return await this.fetch(
            '/v1/chain/get_kv_table_rows', {
                json,
                code,
                table,
                index_name,
                encode_type,
                index_value,
                lower_bound,
                upper_bound,
                limit,
                reverse,
                show_payer,
            });
    }

    /** Raw call to `/v1/chain/get_table_by_scope` */
    public async get_table_by_scope({
        code,
        table,
        lower_bound = '',
        upper_bound = '',
        limit = 10,
    }: any): Promise<GetTableByScopeResult> {
        return await this.fetch(
            '/v1/chain/get_table_by_scope', {
                code,
                table,
                lower_bound,
                upper_bound,
                limit,
            });
    }

    /** Get subset of `availableKeys` needed to meet authorities in `transaction`. Implements `AuthorityProvider` */
    public async getRequiredKeys(args: AuthorityProviderArgs): Promise<string[]> {
        return convertLegacyPublicKeys((await this.fetch('/v1/chain/get_required_keys', {
            transaction: args.transaction,
            available_keys: args.availableKeys,
        })).required_keys);
    }

    /** Push a serialized transaction (replaced by send_transaction, but returned format has changed) */
    public async push_transaction(
        { signatures, compression = 0, serializedTransaction, serializedContextFreeData }: PushTransactionArgs
    ): Promise<TransactResult> {
        return await this.fetch('/v1/chain/push_transaction', {
            signatures,
            compression,
            packed_context_free_data: arrayToHex(serializedContextFreeData || new Uint8Array(0)),
            packed_trx: arrayToHex(serializedTransaction),
        });
    }

    /** Raw call to `/v1/chain/push_ro_transaction */
    public async push_ro_transaction({ signatures, compression = 0, serializedTransaction }: PushTransactionArgs,
        returnFailureTraces: boolean = false): Promise<ReadOnlyTransactResult> {
        return await this.fetch('/v1/chain/push_ro_transaction', {
            transaction: {
                signatures,
                compression,
                packed_context_free_data: arrayToHex(new Uint8Array(0)),
                packed_trx: arrayToHex(serializedTransaction),
            },
            return_failure_traces: returnFailureTraces,
        });
    }

    public async push_transactions(transactions: PushTransactionArgs[]): Promise<TransactResult[]> {
        const packedTrxs: PackedTrx[] = transactions.map(({signatures, compression = 0, serializedTransaction, serializedContextFreeData }: PushTransactionArgs) => {
            return {
                signatures,
                compression,
                packed_context_free_data: arrayToHex(serializedContextFreeData || new Uint8Array(0)),
                packed_trx: arrayToHex(serializedTransaction),
            };
        });
        return await this.fetch('/v1/chain/push_transactions', packedTrxs );
    }

    /** Send a serialized transaction */
    public async send_transaction(
        { signatures, compression = 0, serializedTransaction, serializedContextFreeData }: PushTransactionArgs
    ): Promise<TransactResult> {
        return await this.fetch('/v1/chain/send_transaction', {
            signatures,
            compression,
            packed_context_free_data: arrayToHex(serializedContextFreeData || new Uint8Array(0)),
            packed_trx: arrayToHex(serializedTransaction),
        });
    }

    /** Raw call to `/v1/db_size/get` */
    public async db_size_get(): Promise<DBSizeGetResult> { return await this.fetch('/v1/db_size/get', {}); }

    /** Raw call to `/v1/trace_api/get_block` */
    public async trace_get_block(block_num: number): Promise<TraceApiGetBlockResult> {
        return await this.fetch('/v1/trace_api/get_block', { block_num });
    }

    /** Raw call to `/v1/history/get_actions` */
    public async history_get_actions(accountName: string, pos: number = null, offset: number = null): Promise<GetActionsResult> {
        return await this.fetch('/v1/history/get_actions', { account_name: accountName, pos, offset });
    }

    /** Raw call to `/v1/history/get_transaction` */
    public async history_get_transaction(id: string, blockNumHint: number = null): Promise<GetTransactionResult> {
        return await this.fetch('/v1/history/get_transaction', { id, block_num_hint: blockNumHint });
    }

    /** Raw call to `/v1/history/get_key_accounts` */
    public async history_get_key_accounts(publicKey: string): Promise<GetKeyAccountsResult> {
        return await this.fetch('/v1/history/get_key_accounts', { public_key: publicKey });
    }

    /** Raw call to `/v1/history/get_controlled_accounts` */
    public async history_get_controlled_accounts(controllingAccount: string): Promise<GetControlledAccountsResult> {
        return await this.fetch('/v1/history/get_controlled_accounts', { controlling_account: controllingAccount });
    }
} // JsonRpc
