/**
 * @module JSON-RPC
 */
// copyright defined in eosjs/LICENSE.txt

import { AbiProvider, AuthorityProvider, AuthorityProviderArgs, BinaryAbi } from "./eosjs-api-interfaces";
import { base64ToBinary, convertLegacyPublicKeys } from "./eosjs-numeric";
import { GetAbiResult, GetBlockResult, GetCodeResult, GetInfoResult, GetRawCodeAndAbiResult, PushTransactionArgs } from "./eosjs-rpc-interfaces"; // tslint:disable-line
import RpcError from "./eosjs-rpcerror";

function arrayToHex(data: Uint8Array) {
    let result = "";
    for (const x of data) {
        result += ("00" + x.toString(16)).slice(-2);
    }
    return result;
}

/** Make RPC calls */
export default class JsonRpc implements AuthorityProvider, AbiProvider {
    public endpoint: string;
    public fetchBuiltin: (input?: Request | string, init?: RequestInit) => Promise<Response>;

    /**
     * @param args
     *    * `fetch`:
     *      * browsers: leave `null` or `undefined`
     *      * node: provide an implementation
     */
    constructor(endpoint: string, args:
        { fetch?: (input?: string | Request, init?: RequestInit) => Promise<Response> } = {},
    ) {
        this.endpoint = endpoint;
        if (args.fetch) {
            this.fetchBuiltin = args.fetch;
        } else {
            this.fetchBuiltin = (global as any).fetch;
        }
    }

    /** Post `body` to `endpoint + path`. Throws detailed error information in `RpcError` when available. */
    public async fetch(path: string, body: any) {
        let response;
        let json;
        try {
            const f = this.fetchBuiltin;
            response = await f(this.endpoint + path, {
                body: JSON.stringify(body),
                method: "POST",
            });
            json = await response.json();
            if (json.processed && json.processed.except) {
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

    /** Raw call to `/v1/chain/get_abi` */
    // tslint:disable-next-line:variable-name
    public async get_abi(account_name: string): Promise<GetAbiResult> {
        return await this.fetch("/v1/chain/get_abi", { account_name });
    }

    /** Raw call to `/v1/chain/get_account` */
    // tslint:disable-next-line:variable-name
    public async get_account(account_name: string): Promise<any> {
        return await this.fetch("/v1/chain/get_account", { account_name });
    }

    /** Raw call to `/v1/chain/get_block_header_state` */
    // tslint:disable-next-line:variable-name
    public async get_block_header_state(block_num_or_id: number | string): Promise<any> {
        return await this.fetch("/v1/chain/get_block_header_state", { block_num_or_id });
    }

    /** Raw call to `/v1/chain/get_block` */
    // tslint:disable-next-line:variable-name
    public async get_block(block_num_or_id: number | string): Promise<GetBlockResult> {
        return await this.fetch("/v1/chain/get_block", { block_num_or_id });
    }

    /** Raw call to `/v1/chain/get_code` */
    // tslint:disable-next-line:variable-name
    public async get_code(account_name: string): Promise<GetCodeResult> {
        return await this.fetch("/v1/chain/get_code", { account_name });
    }

    /** Raw call to `/v1/chain/get_currency_balance` */
    public async get_currency_balance(code: string, account: string, symbol: string = null): Promise<any> {
        return await this.fetch("/v1/chain/get_currency_balance", { code, account, symbol });
    }

    /** Raw call to `/v1/chain/get_currency_stats` */
    public async get_currency_stats(code: string, symbol: string): Promise<any> {
        return await this.fetch("/v1/chain/get_currency_stats", { code, symbol });
    }

    /** Raw call to `/v1/chain/get_info` */
    public async get_info(): Promise<GetInfoResult> {
        return await this.fetch("/v1/chain/get_info", {});
    }

    /** Raw call to `/v1/chain/get_producer_schedule` */
    public async get_producer_schedule(): Promise<any> {
        return await this.fetch("/v1/chain/get_producer_schedule", {});
    }

    /** Raw call to `/v1/chain/get_producers` */
    // tslint:disable-next-line:variable-name
    public async get_producers(json = true, lower_bound = "", limit = 50): Promise<any> {
        return await this.fetch("/v1/chain/get_producers", { json, lower_bound, limit });
    }

    /** Raw call to `/v1/chain/get_raw_code_and_abi` */
    // tslint:disable-next-line:variable-name
    public async get_raw_code_and_abi(account_name: string): Promise<GetRawCodeAndAbiResult> {
        return await this.fetch("/v1/chain/get_raw_code_and_abi", { account_name });
    }

    /** calls `/v1/chain/get_raw_code_and_abi` and pulls out unneeded raw wasm code */
    // TODO: use `/v1/chain/get_raw_abi` directly when it becomes available
    public async getRawAbi(accountName: string): Promise<BinaryAbi> {
        const rawCodeAndAbi = await this.get_raw_code_and_abi(accountName);
        const abi = base64ToBinary(rawCodeAndAbi.abi);
        return { accountName: rawCodeAndAbi.account_name, abi };
    }

    /** Raw call to `/v1/chain/get_table_rows` */
    public async get_table_rows({
        json = true,
        code,
        scope,
        table,
        table_key = "",
        lower_bound = "",
        upper_bound = "",
        limit = 10 }: any): Promise<any> {
        return await this.fetch(
            "/v1/chain/get_table_rows", {
                json,
                code,
                scope,
                table,
                table_key,
                lower_bound,
                upper_bound,
                limit,
            });
    }

    /** Get subset of `availableKeys` needed to meet authorities in `transaction`. Implements `AuthorityProvider` */
    public async getRequiredKeys(args: AuthorityProviderArgs): Promise<string[]> {
        return convertLegacyPublicKeys((await this.fetch("/v1/chain/get_required_keys", {
            transaction: args.transaction,
            available_keys: args.availableKeys,
        })).required_keys);
    }

    /** Push a serialized transaction */
    public async push_transaction({ signatures, serializedTransaction }: PushTransactionArgs): Promise<any> {
        return await this.fetch("/v1/chain/push_transaction", {
            signatures,
            compression: 0,
            packed_context_free_data: "",
            packed_trx: arrayToHex(serializedTransaction),
        });
    }

    /** Raw call to `/v1/db_size/get` */
    public async db_size_get() { return await this.fetch("/v1/db_size/get", {}); }

    /** Raw call to `/v1/history/get_actions` */
    // tslint:disable-next-line:variable-name
    public async history_get_actions(account_name: string, pos: number = null, offset: number = null) {
        return await this.fetch("/v1/history/get_actions", { account_name, pos, offset });
    }

    /** Raw call to `/v1/history/get_transaction` */
    // tslint:disable-next-line:variable-name
    public async history_get_transaction(id: string, block_num_hint: number = null) {
        return await this.fetch("/v1/history/get_transaction", { id, block_num_hint });
    }

    /** Raw call to `/v1/history/get_key_accounts` */
    // tslint:disable-next-line:variable-name
    public async history_get_key_accounts(public_key: string) {
        return await this.fetch("/v1/history/get_key_accounts", { public_key });
    }

    /** Raw call to `/v1/history/get_controlled_accounts` */
    // tslint:disable-next-line:variable-name
    public async history_get_controlled_accounts(controlling_account: string) {
        return await this.fetch("/v1/history/get_controlled_accounts", { controlling_account });
    }
} // JsonRpc
