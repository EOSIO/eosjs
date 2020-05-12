/**
 * @module Javascript-API
 * copyright defined in eosjs/LICENSE.txt
 */

import { Abi, PushTransactionArgs } from './eosjs-rpc-interfaces';
import { Anyvar, Authorization } from './eosjs-serialize';
import { WasmAbi } from './eosjs-wasmabi';
import { ActionBuilder } from './eosjs-api';

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

/** Stores and retrieves WASM Abis */
export interface WasmAbiProvider {
    /** WasmAbi objects associated with account name */
    wasmAbis: Map<string, WasmAbi>;

    /** Set an array of WasmAbis */
    setWasmAbis: (wasmAbis: WasmAbi[]) => void;
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

/** Optional query configuration object */
export interface QueryConfig {
    sign?: boolean;
    requiredKeys?: string[];
    authorization?: Authorization[];
}

/**
 * A Query may be any of the following:
 *  * string:                                           method
 *  * [string, Query[]]:                                [method, filter]
 *  * [string, Anyvar, Query[]]:                        [method, arg, filter]
 *  * {method: string, arg?: Anyvar, filter?: Query[]}  explicit form
 */
export type Query =
   string | [string, Query[]] | [string, Anyvar, Query[]] | { method: string, arg?: Anyvar, filter?: Query[] };

export type ContextFreeGroupCallback =
    (index: {cfa: number, cfd: number}) =>
        { action?: ActionBuilder; contextFreeAction?: ActionBuilder; contextFreeData?: any; };
