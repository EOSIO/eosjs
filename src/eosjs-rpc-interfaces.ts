/**
 * @module RPC-API-Methods
 * copyright defined in eosjs/LICENSE.txt
 */

/** Structured format for abis */
export interface Abi {
    version: string;
    types: { new_type_name: string, type: string }[];
    structs: { name: string, base: string, fields: { name: string, type: string }[] }[];
    actions: { name: string, type: string, ricardian_contract: string }[];
    tables: { name: string, type: string, index_type: string, key_names: string[], key_types: string[] }[];
    ricardian_clauses: { id: string, body: string }[];
    error_messages: { error_code: string, error_msg: string }[];
    abi_extensions: { tag: number, value: string }[];
    variants?: { name: string, types: string[] }[];
    action_results?: { name: string, result_type: string }[],
    kv_tables?: { [key: string]: { type: string, primary_index: { name: string, type: string }, secondary_indices: { [key: string]: { type: string }}[] } }[],
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

export interface AccountResourceInfo {
    used: number;
    available: number;
    max: number;
    last_usage_update_time?: string;
    current_used?: number;
}

export interface Asset {
    amount: number;
    symbol: string;
}

export interface Authority {
    threshold: number;
    keys: KeyWeight[];
    accounts: PermissionLevelWeight[];
    waits: WaitWeight[];
}

export interface KeyWeight {
    key: string;
    weight: number;
}

export interface Permission {
    perm_name: string;
    parent: string;
    required_auth: Authority;
}

export interface PermissionLevel {
    actor: string;
    permission: string;
}

export interface PermissionLevelWeight {
    permission: PermissionLevel;
    weight: number;
}

export interface WaitWeight {
    wait_sec: number;
    weight: number;
}

/** Return value of `/v1/chain/get_abi` */
export interface GetAbiResult {
    account_name: string;
    abi: Abi;
}

/** Return value of `/v1/chain/get_account` */
export interface GetAccountResult {
    account_name: string;
    head_block_num: number;
    head_block_time: string;
    privileged: boolean;
    last_code_update: string;
    created: string;
    core_liquid_balance?: Asset;
    ram_quota: number;
    net_weight: number;
    cpu_weight: number;
    net_limit: AccountResourceInfo;
    cpu_limit: AccountResourceInfo;
    ram_usage: number;
    permissions: Permission[];
    total_resources: any;
    self_delegated_bandwidth: any;
    refund_request: any;
    voter_info: any;
    rex_info: any;
}

/** Return value of `/v1/chain/get_block_info` */
export interface GetBlockInfoResult {
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

/** Return value of `/v1/chain/get_block_header_state` */
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

/** Return value of `/v1/chain/get_currency_stats` */
export interface GetCurrencyStatsResult {
    supply: Asset;
    max_supply: Asset;
    issuer: string;
}

/** Return value of `/v1/chain/get_info` */
export interface GetInfoResult {
    server_version: string;
    chain_id: string;
    head_block_num: number;
    last_irreversible_block_num: number;
    last_irreversible_block_id: string;
    last_irreversible_block_time: string;
    head_block_id: string;
    head_block_time: string;
    head_block_producer: string;
    virtual_block_cpu_limit: number;
    virtual_block_net_limit: number;
    block_cpu_limit: number;
    block_net_limit: number;
}

/** Return value of /v1/chain/get_producer_schedule */
export interface GetProducerScheduleResult {
    active: any;
    pending: any;
    proposed: any;
}

/** Return value of `/v1/chain/get_producers` */
export interface GetProducersResult {
    rows: string[]|object[];
    total_producer_vote_weight: number;
    more: string;
}

/** Return value of `/v1/chain/get_raw_code_and_abi` */
export interface GetRawCodeAndAbiResult {
    account_name: string;
    wasm: string;
    abi: string;
}

/** Return value of `/v1/chain/get_raw_abi` */
export interface GetRawAbiResult {
    account_name: string;
    code_hash: string;
    abi_hash: string;
    abi: string;
}

/** Return value of `/v1/chain/get_scheduled_transactions` */
export interface GetScheduledTransactionsResult {
    transactions: any[];
    more: string;
}

/** Return value of `/v1/chain/get_table_rows` and `/v1/chain/get_kv_table_rows` */
export interface GetTableRowsResult {
    rows: any[];
    more: boolean;
    next_key: string;
    next_key_bytes: string;
}

export interface GetTableByScopeResultRow {
    code: string;
    scope: string;
    table: string;
    payer: string;
    count: number;
}

/** Return value of `/v1/chain/get_table_by_scope` */
export interface GetTableByScopeResult {
    rows: GetTableByScopeResultRow[];
    more: string;
}

/** Arguments for `push_transaction` */
export interface PushTransactionArgs {
    signatures: string[];
    compression?: number;
    serializedTransaction: Uint8Array;
    serializedContextFreeData?: Uint8Array;
}

/** Return value of `/v1/chain/push_transaction` */
export interface PushTransactionResult {

}

export interface DBSizeIndexCount {
    index: string;
    row_count: number;
}

/** Return value of `/v1/db_size/get` */
export interface DBSizeGetResult {
    free_bytes: number;
    used_bytes: number;
    size: number;
    indices: DBSizeIndexCount[];
}

export interface OrderedActionResult {
    global_action_seq: number;
    account_action_seq: number;
    block_num: number;
    block_time: string;
    action_trace: any;
}

/** Return value of `/v1/history/get_actions` */
export interface GetActionsResult {
    actions: OrderedActionResult[];
    last_irreversible_block: number;
    time_limit_exceeded_error?: boolean;
}

/** Return value of `/v1/history/get_transaction` */
export interface GetTransactionResult {
    id: string;
    trx: any;
    block_time: string;
    block_num: number;
    last_irreversible_block: number;
    traces: any[];
}

/** Return value of `/v1/history/get_key_accounts` */
export interface GetKeyAccountsResult {
    account_names: string[];
}

/** Return value of `/v1/history/get_controlled_accounts` */
export interface GetControlledAccountsResult {
    controlled_accounts: string[];
}
