// copyright defined in eosjs/LICENSE.txt

/** Structured format for abis */
export interface Abi {
    version: string;
    types: Array<{ new_type_name: string, type: string }>;
    structs: Array<{ name: string, base: string, fields: Array<{ name: string, type: string }> }>;
    actions: Array<{ name: string, type: string, ricardian_contract: string }>;
    tables: Array<{ name: string, type: string, index_type: string, key_names: string[], key_types: string[] }>;
    ricardian_clauses: Array<{ id: string, body: string }>;
    error_messages: Array<{ error_code: string, error_msg: string }>;
    abi_extensions: Array<{ tag: number, value: string }>;
    variants?: Array<{ name: string, types: string[] }>;
}

/** Return value of `/v1/chain/get_abi` */
export interface GetAbiResult {
    account_name: string;
    abi: Abi;
}

/** Subset of `GetBlockResult` needed to calculate TAPoS fields in transactions */
export interface BlockTaposInfo {
    timestamp: string;
    block_num: number;
    ref_block_prefix: number;
}

/** Return value of `/v1/chain/get_block` */
export interface GetBlockResult {
    timestamp: string;
    producer: string;
    confirmed: number;
    previous: string;
    transaction_mroot: string;
    action_mroot: string;
    schedule_version: number;
    producer_signature: string;
    id: string;
    block_num: number;
    ref_block_prefix: number;
}

/** Return value of `/v1/chain/get_code` */
export interface GetCodeResult {
    account_name: string;
    code_hash: string;
    wast: string;
    wasm: string;
    abi: Abi;
}

/** Return value of `/v1/chain/get_info` */
export interface GetInfoResult {
    server_version: string;
    chain_id: string;
    head_block_num: number;
    last_irreversible_block_num: number;
    last_irreversible_block_id: string;
    head_block_id: string;
    head_block_time: string;
    head_block_producer: string;
    virtual_block_cpu_limit: number;
    virtual_block_net_limit: number;
    block_cpu_limit: number;
    block_net_limit: number;
}

/** Return value of `/v1/chain/get_raw_code_and_abi` */
export interface GetRawCodeAndAbiResult {
    account_name: string;
    wasm: string;
    abi: string;
}

/** Arguments for `push_transaction` */
export interface PushTransactionArgs {
    signatures: string[];
    serializedTransaction: Uint8Array;
}
