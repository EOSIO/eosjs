/**
 * @module Javascript-API
 * copyright defined in eosjs/LICENSE.txt
 */

import { Abi, PushTransactionArgs } from './eosjs-rpc-interfaces';
import { Anyvar, Authorization, Action, SerializedAction } from './eosjs-serialize';

/** Arguments to `getRequiredKeys` */
export interface AuthorityProviderArgs {
    /** Transaction that needs to be signed */
    transaction: any;

    /** Public keys associated with the private keys that the `SignatureProvider` holds */
    availableKeys: string[];
}

/** Get subset of `availableKeys` needed to meet authorities in `transaction` */
export interface AuthorityProvider {
    /** Get subset of `availableKeys` needed to meet authorities in `transaction` */
    getRequiredKeys: (args: AuthorityProviderArgs) => Promise<string[]>;
}

/** Retrieves raw ABIs for a specified accountName */
export interface AbiProvider {
    /** Retrieve the BinaryAbi */
    getRawAbi: (accountName: string) => Promise<BinaryAbi>;
}

/** Structure for the raw form of ABIs */
export interface BinaryAbi {
    /** account which has deployed the ABI */
    accountName: string;

    /** abi in binary form */
    abi: Uint8Array;
}

/** Holds a fetched abi */
export interface CachedAbi {
    /** abi in binary form */
    rawAbi: Uint8Array;

    /** abi in structured form */
    abi: Abi;
}

/** Arguments to `sign` */
export interface SignatureProviderArgs {
    /** Chain transaction is for */
    chainId: string;

    /** Public keys associated with the private keys needed to sign the transaction */
    requiredKeys: string[];

    /** Transaction to sign */
    serializedTransaction: Uint8Array;

    /** Context-free data to sign */
    serializedContextFreeData?: Uint8Array;

    /** ABIs for all contracts with actions included in `serializedTransaction` */
    abis: BinaryAbi[];
}

/** Signs transactions */
export interface SignatureProvider {
    /** Public keys associated with the private keys that the `SignatureProvider` holds */
    getAvailableKeys: () => Promise<string[]>;

    /** Sign a transaction */
    sign: (args: SignatureProviderArgs) => Promise<PushTransactionArgs>;
}

export interface Transaction {
    expiration?: string;
    ref_block_num?: number;
    ref_block_prefix?: number;
    max_net_usage_words?: number;
    max_cpu_usage_ms?: number;
    delay_sec?: number;
    context_free_actions?: Action[];
    context_free_data?: Uint8Array[];
    actions: Action[];
    transaction_extensions?: [number, string][];
}

/** Optional transact configuration object */
export interface TransactConfig {
    broadcast?: boolean;
    sign?: boolean;
    requiredKeys?: string[];
    compression?: boolean;
    blocksBehind?: number;
    useLastIrreversible?: boolean;
    expireSeconds?: number;
}

export interface TransactionHeader {
    expiration: string;
    ref_block_num: number;
    ref_block_prefix: number;
}

/** Optional query configuration object */
export interface QueryConfig {
    sign?: boolean;
    requiredKeys?: string[];
    authorization?: Authorization[];
}

/**
 * A Query may be any of the following:
 * * string:                                           method
 * * [string, Query[]]:                                [method, filter]
 * * [string, Anyvar, Query[]]:                        [method, arg, filter]
 * * {method: string, arg?: Anyvar, filter?: Query[]}  explicit form
 */
export type Query =
   string | [string, Query[]] | [string, Anyvar, Query[]] | { method: string, arg?: Anyvar, filter?: Query[] };

export type ContextFreeGroupCallback =
    (index: {cfa: number, cfd: number}) => {
        action?: SerializedAction;
        contextFreeAction?: SerializedAction;
        contextFreeData?: Uint8Array;
    };

export interface ActionSerializerType {
    [actionName: string]: any;
};
