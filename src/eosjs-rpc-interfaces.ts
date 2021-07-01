/**
 * @module RPC-API-Methods
 * copyright defined in eosjs/LICENSE.txt
 */

import { TransactionReceiptHeader, TransactionTrace } from './eosjs-api-interfaces';
import { Authorization } from './eosjs-serialize';

/** Structured format for abis */
export interface Abi {
    version: string;
    types: { new_type_name: string, type: string }[];
    structs: { name: string, base: string, fields: { name: string, type: string }[] }[];
    actions: { name: string, type: string, ricardian_contract: string }[];
    tables: { name: string, type: string, index_type: string, key_names: string[], key_types: string[] }[];
    ricardian_clauses: { id: string, body: string }[];
    error_messages: { error_code: number, error_msg: string }[];
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
    new_producers?: ProducerScheduleType;
    header_extensions: [number, string][];
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

export interface ResourceOverview {
    owner: string;
    ram_bytes: number;
    net_weight: string;
    cpu_weight: string;
}

export interface ResourceDelegation {
    from: string;
    to: string;
    net_weight: string;
    cpu_weight: string;
}

export interface RefundRequest {
    owner: string;
    request_time: string;
    net_amount: string;
    cpu_amount: string;
}

export interface VoterInfo {
    owner: string;
    proxy: string;
    producers: string[];
    staked: number;
    last_vote_weight: string;
    proxied_vote_weight: string;
    is_proxy: number;
    flags1: number;
    reserved2: number;
    reserved3: string;
}

export interface RexBalance {
    version: number;
    owner: string;
    vote_stake: string;
    rex_balance: string;
    matured_rex: number;
    rex_maturities: any;
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

/** Return value of `/v1/chain/abi_bin_to_json` */
export interface AbiBinToJsonResult {
    args: 'any'
}

/** Return value of `/v1/chain/abi_json_to_bin` */
export interface AbiJsonToBinResult {
    binargs: 'string'
}

/** Return value of `/v1/chain/get_abi` */
export interface GetAbiResult {
    account_name: string;
    abi?: Abi;
}

/** Return value of `/v1/chain/get_account` */
export interface GetAccountResult {
    account_name: string;
    head_block_num: number;
    head_block_time: string;
    privileged: boolean;
    last_code_update: string;
    created: string;
    core_liquid_balance?: string;
    ram_quota: number;
    net_weight: number;
    cpu_weight: number;
    net_limit: AccountResourceInfo;
    cpu_limit: AccountResourceInfo;
    ram_usage: number;
    permissions: Permission[];
    total_resources: ResourceOverview|null;
    self_delegated_bandwidth: ResourceDelegation|null;
    refund_request: RefundRequest|null;
    voter_info: any;
    rex_info: any;
}

export interface AccountResult {
    account_name: string;
    permission_name: string;
    authorizing_account?: Authorization;
    authorizing_key?: string;
    weight: number;
    threshold: number;
}

/** Return value of `/v1/chain/get_accounts_by_authorizers` */
export interface GetAccountsByAuthorizersResult {
    accounts: AccountResult[];
}

export interface GetActivatedProtocolFeaturesParams {
    limit?: number;
    search_by_block_num?: boolean;
    reverse?: boolean;
    lower_bound?: number;
    upper_bound?: number;
}

export interface ActivatedProtocolFeature {
    feature_digest: string;
    activation_ordinal: number;
    activation_block_num: number;
    description_digest: string;
    dependencies: string[];
    protocol_feature_type: string;
    specification: { name: string, value: string, };
}

/** Return value of `/v1/chain/get_activated_protocol_features` */
export interface GetActivatedProtocolFeaturesResult {
    activated_protocol_features: ActivatedProtocolFeature[];
    more?: number;
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
    ref_block_num: number;
    ref_block_prefix: number;
}

/** Returned action from nodeos, data is optional */
export interface ProcessedAction {
    account: string;
    name: string;
    authorization: Authorization[];
    data?: any;
    hex_data?: string;
}
export interface ProcessedTransaction {
    expiration?: string;
    ref_block_num?: number;
    ref_block_prefix?: number;
    max_net_usage_words?: number;
    max_cpu_usage_ms?: number;
    delay_sec?: number;
    context_free_actions?: ProcessedAction[];
    context_free_data?: Uint8Array[];
    actions: ProcessedAction[];
    transaction_extensions?: [number, string][];
}

export interface PackedTransaction {
    id: string;
    signatures: string[];
    compression: number|string;
    packed_context_free_data: string;
    context_free_data: string[];
    packed_trx: string;
    transaction: ProcessedTransaction;
}

export interface PackedTrx {
    signatures: string[];
    compression: number;
    packed_trx: string;
    packed_context_free_data: string;
}

export interface TransactionReceipt extends TransactionReceiptHeader {
    trx: PackedTransaction;
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
    new_producers: ProducerScheduleType|null;
    producer_signature: string;
    transactions: any;
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

export interface ProducerKey {
    producer_name: string;
    block_signing_key: string;
}

export interface BlockSigningAuthority {
    threshold: number;
    keys: KeyWeight[];
}

export interface ProducerAuthority {
    producer_name: string;
    authority: [ number|string, BlockSigningAuthority];
};

export interface ProducerAuthoritySchedule {
    version: number;
    producers: ProducerAuthority[];
}

export interface ProducerScheduleType {
    version: number;
    producers: ProducerKey[];
}

export interface ScheduleInfo {
    schedule_lib_num: number;
    schedule_hash: string;
    schedule: ProducerScheduleType;
}

export interface IncrementalMerkle {
    _active_nodes: string[];
    _node_count: number;
}

export interface ProtocolFeatureActivationSet {
    protocol_features: string[]
}

export interface SecurityGroupInfo {
    version: number;
    participants: string[];
}

export interface StateExtension {
    security_group_info: SecurityGroupInfo
}

/** Return value of `/v1/chain/get_block_header_state` */
export interface GetBlockHeaderStateResult {
    id: string;
    header: SignedBlockHeader;
    pending_schedule: ScheduleInfo;
    activated_protocol_features: ProtocolFeatureActivationSet;
    additional_signatures: string[];
    block_num: number;
    dpos_proposed_irreversible_blocknum: number;
    dpos_irreversible_blocknum: number;
    active_schedule: ProducerAuthoritySchedule;
    blockroot_merkle: IncrementalMerkle;
    producer_to_last_produced: Map<string, number>;
    producer_to_last_implied_irb: Map<string, number>;
    // valid_block_signing_authority: BlockSigningAuthority;
    valid_block_signing_authority: any;
    confirm_count: number[];
    state_extension: [number, StateExtension];
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
    abi?: Abi;
}

/** Return value of `/v1/chain/get_code_hash` */
export interface GetCodeHashResult {
    account_name: string;
    code_hash: string;
}

/** Return value of `/v1/chain/get_currency_stats` */
export interface GetCurrencyStatsResult {
    [key: string]: {
        supply: string;
        max_supply: string;
        issuer: string;
    }
}

/** Return value of `/v1/chain/get_info` */
export interface GetInfoResult {
    server_version: string;
    chain_id: string;
    head_block_num: number;
    last_irreversible_block_num: number;
    last_irreversible_block_id: string;
    last_irreversible_block_time?: string;
    head_block_id: string;
    head_block_time: string;
    head_block_producer: string;
    virtual_block_cpu_limit: number;
    virtual_block_net_limit: number;
    block_cpu_limit: number;
    block_net_limit: number;
    server_version_string?: string;
    fork_db_head_block_num?: number;
    fork_db_head_block_id?: string;
    server_full_version_string?: string;
    first_block_num?: number;
}

/** Return value of /v1/chain/get_producer_schedule */
export interface GetProducerScheduleResult {
    active: ProducerAuthoritySchedule|null;
    pending: ProducerAuthoritySchedule|null;
    proposed: ProducerAuthoritySchedule|null;
}

export interface ProducerDetails {
    owner: string;
    producer_authority?: any[];
    url: string;
    is_active?: number;
    total_votes: string;
    producer_key: string;
    unpaid_blocks?: number;
    last_claim_time?: string;
    location?: number;
}

/** Return value of `/v1/chain/get_producers` */
export interface GetProducersResult {
    rows: ProducerDetails[];
    total_producer_vote_weight: string;
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

export interface DeferredTransaction extends ProcessedTransaction {
    deferred_transaction_generation?: {
        sender_trx_id: string;
        sender_id: string;
        sender: string;
    }
}

export interface GeneratedTransaction {
    trx_id: string;
    sender: string;
    sender_id: string;
    payer: string;
    delay_until: string;
    expiration: string;
    published: string;
    packed_trx?: string[];
    transaction?: DeferredTransaction[]
}

/** Return value of `/v1/chain/get_scheduled_transactions` */
export interface GetScheduledTransactionsResult {
    transactions: GeneratedTransaction[];
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

/** Return value of `/v1/chain/push_ro_transaction` */
export interface ReadOnlyTransactResult {
    head_block_num: number;
    head_block_id: string;
    last_irreversible_block_num: number;
    last_irreversible_block_id: string;
    code_hash: string;
    pending_transactions: string[];
    result: TransactionTrace;
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

export interface TraceApiAction {
    global_sequence: number;
    receiver: string;
    account: string;
    action: string;
    authorization: Authorization[];
    data: any;
    return_value: any;
}

export interface TraceApiTransactionHeader {
    expiration: string;
    ref_block_num: number;
    ref_block_prefix: number;
    max_net_usage_words: number;
    max_cpu_usage_ms: number;
    delay_sec: number;
}

export interface TraceApiTransaction {
    id: string;
    actions: TraceApiAction[];
    status?: string;
    cpu_usage_us?: number;
    net_usage_words?: number;
    signatures?: string[];
    transaction_header?: TraceApiTransactionHeader,
    bill_to_accounts: string[]
}

/** Return value of `/v1/trace_api/get_block` */
export interface TraceApiGetBlockResult {
    id: string;
    number: number;
    previous_id: string;
    status: string;
    timestamp: string;
    producer: string;
    transaction_mroot?: string;
    action_mroot?: string;
    schedule_version: number;
    transactions: TraceApiTransaction;
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
