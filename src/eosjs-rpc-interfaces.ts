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

export interface BlockHeader {
    timestamp: string;
    producer: string;
    confirmed: number;
    previous: string;
    transaction_mroot: string;
    action_mroot: string;
    schedule_version: number;
    new_producers: any;
    header_extensions: any;
}

export interface SignedBlockHeader extends BlockHeader {
    producer_signature: string;
}

/** Return value of `/v1/chain/get_abi` */
export interface GetAbiResult {
    account_name: string;
    abi: Abi;
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

/** Used to calculate TAPoS fields in transactions */
export interface BlockTaposInfo {
    block_num: number;
    id: string;
    timestamp?: string;
    header?: BlockHeader;
}

/** Return value of `v1/chain/get_block_header_state */
export interface GetBlockHeaderStateResult {
    id: string;
    header: SignedBlockHeader;
    pending_schedule: any;
    activated_protocol_features: any;
    block_num: number;
    dpos_proposed_irreversible_blocknum: number;
    dpos_irreversible_blocknum: number;
    active_schedule: any;
    blockroot_merkle: any;
    producer_to_last_produced: any;
    producer_to_last_implied_irb: any;
    block_signing_key: string;
    confirm_count: any;
}

/** Subset of `GetBlockHeaderStateResult` used to calculate TAPoS fields in transactions */
export interface BlockHeaderStateTaposInfo {
    block_num: number;
    id: string;
    header: SignedBlockHeader;
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
    serializedContextFreeData?: Uint8Array;
}
