
import { JsonRpc } from '../eosjs-jsonrpc';
import { JsSignatureProvider } from '../eosjs-jssig';
import { Api } from '../eosjs-api';
import * as ser from '../eosjs-serialize';
import fetch from 'node-fetch';
const { TextEncoder, TextDecoder } = require('util');
import {
    AbiJsonToBinResult,
    GetAbiResult,
    GetAccountResult,
    GetAccountsByAuthorizersResult,
    GetActivatedProtocolFeaturesResult,
    GetBlockHeaderStateResult,
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
    GetTableByScopeResult,
    PushTransactionArgs,
    ReadOnlyTransactResult,
    AbiBinToJsonResult,
    TraceApiGetBlockResult,
    DBSizeGetResult,
} from '../eosjs-rpc-interfaces';
import { Transaction, TransactResult } from '../eosjs-api-interfaces';
import 'jest-extended';

const privateKey = '5JuH9fCXmU3xbj8nRmhPZaVrxxXrdPaRmZLW1cznNTmTQR2Kg5Z';

const rpc = new JsonRpc('http://localhost:8888', { fetch });
const signatureProvider = new JsSignatureProvider([privateKey]);
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

/** Checking types with verifyType/complexOrPrimitive
 * To ensure that the data structure coming from eos matches the declared types in eosjs for developers and documentation
 * Since typescript is not a runtime language, it's required to test with javascript format
 * Create an object matching the typescript type with some requirements:
 * nullable: make the key a string and add a `&` character to the end
 * optional: make the key a string and add a `?` character to the end (same as typescript)
 * []: remove array symbols from simple/complex types, use arrays for std::pair
 * Map<>: use Map<> in the value field
 * |: operates the same as typescript but does not work for complex types
 */

describe('Chain API Plugin Endpoints', () => {
    it('validates return type of abi_bin_to_json', async () => {
        const result: AbiBinToJsonResult = await rpc.abi_bin_to_json('returnvalue', 'sum', '0500000005000000');
        const abiBinToJsonResult: any = {
            args: 'any'
        };
        verifyType(result, abiBinToJsonResult);
    });

    it('validates return type of abi_json_to_bin', async () => {
        const result: AbiJsonToBinResult = await rpc.abi_json_to_bin('returnvalue', 'sum', [5, 5]);
        const abiJsonToBinResult: any = {
            binargs: 'string'
        };
        verifyType(result, abiJsonToBinResult);
    });

    it('validates return type of get_abi', async () => {
        const result: GetAbiResult = await rpc.get_abi('todo');
        const getAbiResult: any = {
            account_name: 'string',
            'abi?': {
                version: 'string',
                types: {
                    new_type_name: 'string',
                    type: 'string',
                },
                structs: {
                    name: 'string',
                    base: 'string',
                    fields: {
                        name: 'string',
                        type: 'string',
                    },
                },
                actions: {
                    name: 'string',
                    type: 'string',
                    ricardian_contract: 'string',
                },
                tables: {
                    name: 'string',
                    type: 'string',
                    index_type: 'string',
                    key_names: 'string',
                    key_types: 'string',
                },
                ricardian_clauses: {
                    id: 'string',
                    body: 'string',
                },
                error_messages: {
                    error_code: 'number',
                    error_msg: 'string',
                },
                abi_extensions: {
                    tag: 'number',
                    value: 'string',
                },
                'variants?': {
                    name: 'string',
                    types: 'string',
                },
                'action_results?': {
                    name: 'string',
                    result_type: 'string',
                },
                'kv_tables?': {
                    todo: { // key is dynamic, using result from todo account
                        type: 'string',
                        primary_index: {
                            name: 'string',
                            type: 'string',
                        },
                        secondary_indices: {
                            'todo?': { // key is dynamic
                                type: 'string',
                            },
                        },
                    },
                },
            },
        };
        verifyType(result, getAbiResult);
    });

    it('validates return type of get_account', async () => {
        const result: GetAccountResult = await rpc.get_account('eosio');
        const getAccountResult: any = {
            account_name: 'string',
            head_block_num: 'number',
            head_block_time: 'string',
            privileged: 'boolean',
            last_code_update: 'string',
            created: 'string',
            'core_liquid_balance?': 'string',
            ram_quota: 'number',
            net_weight: 'number',
            cpu_weight: 'number',
            net_limit: {
                used: 'number',
                available: 'number',
                max: 'number',
                'last_usage_update_time?': 'string',
                'current_used?': 'number',
            },
            cpu_limit: {
                used: 'number',
                available: 'number',
                max: 'number',
                'last_usage_update_time?': 'string',
                'current_used?': 'number',
            },
            ram_usage: 'number',
            permissions: {
                perm_name: 'string',
                parent: 'string',
                required_auth: {
                    threshold: 'number',
                    keys: {
                        key: 'string',
                        weight: 'number',
                    },
                    accounts: {
                        permission: {
                            actor: 'string',
                            permission: 'string',
                        },
                        weight: 'number',
                    },
                    waits: {
                        wait_sec: 'number',
                        weight: 'number',
                    }
                }
            },
            'total_resources&': {
                owner: 'string',
                ram_bytes: 'number',
                net_weight: 'string',
                cpu_weight: 'string',
            },
            'self_delegated_bandwidth&': {
                from: 'string',
                to: 'string',
                net_weight: 'string',
                cpu_weight: 'string',
            },
            'refund_request&': {
                owner: 'string',
                request_time: 'string',
                net_amount: 'string',
                cpu_amount: 'string',
            },
            'voter_info&': {
                owner: 'string',
                proxy: 'string',
                producers: 'string',
                staked: 'number',
                last_vote_weight: 'string',
                proxied_vote_weight: 'string',
                is_proxy: 'number',
                flags1: 'number',
                reserved2: 'number',
                reserved3: 'string',
            },
            'rex_info&': {
                version: 'number',
                owner: 'string',
                vote_stake: 'string',
                rex_balance: 'string',
                matured_rex: 'number',
                rex_maturities: 'any',
            },
        };
        verifyType(result, getAccountResult);
    });

    it('validates return type of get_accounts_by_authorizers', async () => {
        const result: GetAccountsByAuthorizersResult = await rpc.get_accounts_by_authorizers([
            { actor: 'bob', permission: 'active' },
            { actor: 'cfhello', permission: 'active' }
        ], ['EOS7bxrQUTbQ4mqcoefhWPz1aFieN4fA9RQAiozRz7FrUChHZ7Rb8', 'EOS6nVrBASwwviMy3CntKsb1cD5Ai2gRZnyrxJDqypL3JLL7KCKrK']);
        const getAccountsByAuthorizersResult: any = {
            accounts: {
                account_name: 'string',
                permission_name: 'string',
                'authorizing_key?': 'string',
                'authorizing_account?': {
                    actor: 'string',
                    permission: 'string',
                },
                weight: 'number',
                threshold: 'number',
            }
        };
        verifyType(result, getAccountsByAuthorizersResult);
    });

    it('validates return type of get_activated_protocol_features', async () => {
        const result: GetActivatedProtocolFeaturesResult = await rpc.get_activated_protocol_features({});
        const getActivatedProtocolFeaturesResult: any = {
            activated_protocol_features: {
                feature_digest: 'string',
                activation_ordinal: 'number',
                activation_block_num: 'number',
                description_digest: 'string',
                dependencies: 'string',
                protocol_feature_type: 'string',
                specification: {
                    name: 'string',
                    value: 'string',
                },
            },
            'more?': 'number',
        };
        verifyType(result, getActivatedProtocolFeaturesResult);
    });

    it('validates return type of get_block_header_state', async () => {
        const info: GetInfoResult = await rpc.get_info();
        const result: GetBlockHeaderStateResult = await rpc.get_block_header_state(info.head_block_id);
        const getBlockHeaderStateResult: any = {
            id: 'string',
            header: {
                timestamp: 'string',
                producer: 'string',
                confirmed: 'number',
                previous: 'string',
                transaction_mroot: 'string',
                action_mroot: 'string',
                schedule_version: 'number',
                'new_producers?': {
                    version: 'number',
                    producers: {
                        producer_name: 'string',
                        block_signing_key: 'string',
                    },
                },
                header_extensions: 'any',
                producer_signature: 'string',
            },
            pending_schedule: {
                schedule_lib_num: 'number',
                schedule_hash: 'string',
                schedule: {
                    version: 'number',
                    producers: {
                        producer_name: 'string',
                        block_signing_key: 'string',
                    },
                },
            },
            activated_protocol_features: {
                protocol_features: 'string',
            },
            additional_signatures: 'string',
            block_num: 'number',
            dpos_proposed_irreversible_blocknum: 'number',
            dpos_irreversible_blocknum: 'number',
            active_schedule: {
                version: 'number',
                producers: {
                    producer_name: 'string',
                    authority: [ 'number|string', {
                        threshold: 'number',
                        keys: {
                            key: 'string',
                            weight: 'number',
                        },
                    }],
                },
            },
            blockroot_merkle: {
                _active_nodes: 'string',
                _node_count: 'number',
            },
            producer_to_last_produced: 'Map<string, number>',
            producer_to_last_implied_irb: 'Map<string, number>',
            valid_block_signing_authority: [ 'number|string', {
                threshold: 'number',
                keys: {
                    key: 'string',
                    weight: 'number',
                },
            }],
            confirm_count: 'number',
            state_extension: [ 'number', {
                security_group_info: {
                    version: 'number',
                    participants: 'string',
                },
            }]
        };
        verifyType(result, getBlockHeaderStateResult);
    });

    it('validates return type of get_block_info', async () => {
        const info: GetInfoResult = await rpc.get_info();
        const result: GetBlockInfoResult = await rpc.get_block_info(info.last_irreversible_block_num);
        const getBlockInfoResult: any = {
            timestamp: 'string',
            producer: 'string',
            confirmed: 'number',
            previous: 'string',
            transaction_mroot: 'string',
            action_mroot: 'string',
            schedule_version: 'number',
            producer_signature: 'string',
            id: 'string',
            block_num: 'number',
            ref_block_num: 'number',
            ref_block_prefix: 'number',
        };
        verifyType(result, getBlockInfoResult);
    });

    it('validates return type of get_block', async () => {
        const info: GetInfoResult = await rpc.get_info();
        const result: GetBlockResult = await rpc.get_block(info.last_irreversible_block_num);
        const getBlockResult: any = {
            timestamp: 'string',
            producer: 'string',
            confirmed: 'number',
            previous: 'string',
            transaction_mroot: 'string',
            action_mroot: 'string',
            schedule_version: 'number',
            'new_producers&': {
                version: 'number',
                producers: {
                    producer_name: 'string',
                    block_signing_key: 'string'
                }
            },
            producer_signature: 'string',
            transactions: {
                status: 'string',
                cpu_usage_us: 'number',
                net_usage_words: 'number',
                trx: {
                    id: 'string',
                    signatures: 'string',
                    compression: 'number|string',
                    packed_context_free_data: 'string',
                    context_free_data: 'string',
                    packed_trx: 'string',
                    transaction: {
                        'expiration?': 'string',
                        'ref_block_num?': 'number',
                        'ref_block_prefix?': 'number',
                        'max_net_usage_words?': 'number',
                        'max_cpu_usage_ms?': 'number',
                        'delay_sec?': 'number',
                        'context_free_actions?': {
                            account: 'string',
                            name: 'string',
                            authorization: {
                                actor: 'string',
                                permission: 'string',
                            },
                            'data?': 'any',
                            'hex_data?': 'string',
                        },
                        'context_free_data?': 'number',
                        actions: {
                            account: 'string',
                            name: 'string',
                            authorization: {
                                actor: 'string',
                                permission: 'string',
                            },
                            'data?': 'any',
                            'hex_data?': 'string',
                        },
                        'transaction_extensions?': '[number, string]',
                    },
                },
            },
            id: 'string',
            block_num: 'number',
            ref_block_prefix: 'number',
        };
        verifyType(result, getBlockResult);
    });

    it('validates return type of get_code', async () => {
        const result: GetCodeResult = await rpc.get_code('todo');
        const getCodeResult: any = {
            account_name: 'string',
            code_hash: 'string',
            wast: 'string',
            wasm: 'string',
            'abi?': {
                version: 'string',
                types: {
                    new_type_name: 'string',
                    type: 'string',
                },
                structs: {
                    name: 'string',
                    base: 'string',
                    fields: {
                        name: 'string',
                        type: 'string',
                    },
                },
                actions: {
                    name: 'string',
                    type: 'string',
                    ricardian_contract: 'string',
                },
                tables: {
                    name: 'string',
                    type: 'string',
                    index_type: 'string',
                    key_names: 'string',
                    key_types: 'string',
                },
                ricardian_clauses: {
                    id: 'string',
                    body: 'string',
                },
                error_messages: {
                    error_code: 'number',
                    error_msg: 'string',
                },
                abi_extensions: {
                    tag: 'number',
                    value: 'string',
                },
                'variants?': {
                    name: 'string',
                    types: 'string',
                },
                'action_results?': {
                    name: 'string',
                    result_type: 'string',
                },
                'kv_tables?': {
                    todo: { // key is dynamic, using result from todo account
                        type: 'string',
                        primary_index: {
                            name: 'string',
                            type: 'string',
                        },
                        secondary_indices: {
                            'todo?': { // key is dynamic
                                type: 'string',
                            },
                        },
                    },
                },
            },
        };
        verifyType(result, getCodeResult);
    });

    it('validates return type of get_code_hash', async () => {
        const result: GetCodeHashResult = await rpc.get_code_hash('todo');
        const getCodeHashResult: any = {
            account_name: 'string',
            code_hash: 'string',
        };
        verifyType(result, getCodeHashResult);
    });

    it('validates return type of get_currency_balance', async () => {
        const result: string[] = await rpc.get_currency_balance('eosio.token', 'bob', 'SYS');
        result.forEach((element: any) => {
            expect(typeof element).toEqual('string');
        });
    });

    it('validates return type of get_currency_stats', async () => {
        const result: GetCurrencyStatsResult = await rpc.get_currency_stats('eosio.token', 'SYS');
        const getCurrencyStatsResult: any = {
            SYS: {
                supply: 'string',
                max_supply: 'string',
                issuer: 'string',
            }
        };
        verifyType(result, getCurrencyStatsResult);
    });

    it('validates return type of get_info', async () => {
        const result: GetInfoResult = await rpc.get_info();
        const getInfoResult: any = {
            server_version: 'string',
            chain_id: 'string',
            head_block_num: 'number',
            last_irreversible_block_num: 'number',
            last_irreversible_block_id: 'string',
            'last_irreversible_block_time?': 'string',
            head_block_id: 'string',
            head_block_time: 'string',
            head_block_producer: 'string',
            virtual_block_cpu_limit: 'number',
            virtual_block_net_limit: 'number',
            block_cpu_limit: 'number',
            block_net_limit: 'number',
            'server_version_string?': 'string',
            'fork_db_head_block_num?': 'number',
            'fork_db_head_block_id?': 'string',
            'server_full_version_string?': 'string',
            'first_block_num?': 'number',
        };
        verifyType(result, getInfoResult);
    });

    it('validates return type of get_producer_schedule', async () => {
        const result: GetProducerScheduleResult = await rpc.get_producer_schedule();
        const getProducerScheduleResult: any = {
            'active&': {
                version: 'number',
                producers: {
                    producer_name: 'string',
                    authority: [ 'number|string', {
                        threshold: 'number',
                        keys: {
                            key: 'string',
                            weight: 'number',
                        },
                    }],
                },
            },
            'pending&': {
                version: 'number',
                producers: {
                    producer_name: 'string',
                    authority: [ 'number|string', {
                        threshold: 'number',
                        keys: {
                            key: 'string',
                            weight: 'number',
                        },
                    }],
                },
            },
            'proposed&': {
                version: 'number',
                producers: {
                    producer_name: 'string',
                    authority: [ 'number|string', {
                        threshold: 'number',
                        keys: {
                            key: 'string',
                            weight: 'number',
                        },
                    }],
                },
            },
        };
        verifyType(result, getProducerScheduleResult);
    });

    it('validates return type of get_producers', async () => {
        const result: GetProducersResult = await rpc.get_producers();
        const getProducersResult: any = {
            rows: {
                owner: 'string',
                'producer_authority?': [ 'number|string', {
                    threshold: 'number',
                    keys: {
                        key: 'string',
                        weight: 'number',
                    },
                }],
                url: 'string',
                'is_active?': 'number',
                total_votes: 'string',
                producer_key: 'string',
                'unpaid_blocks?': 'number',
                'last_claim_time?': 'string',
                'location?': 'number',
            },
            total_producer_vote_weight: 'string',
            more: 'string',
        };
        verifyType(result, getProducersResult);
    });

    it('validates return type of get_raw_code_and_abi', async () => {
        const result: GetRawCodeAndAbiResult = await rpc.get_raw_code_and_abi('eosio');
        const getRawCodeAndAbiResult: any = {
            account_name: 'string',
            wasm: 'string',
            abi: 'string',
        };
        verifyType(result, getRawCodeAndAbiResult);
    });

    it('validates return type of get_raw_abi', async () => {
        const result: GetRawAbiResult = await rpc.get_raw_abi('eosio');
        const getRawAbiResult: any = {
            account_name: 'string',
            code_hash: 'string',
            abi_hash: 'string',
            abi: 'string',
        };
        verifyType(result, getRawAbiResult);
    });

    it('validates return type of get_scheduled_transactions', async () => {
        const result: GetScheduledTransactionsResult = await rpc.get_scheduled_transactions();
        const getScheduledTransactionsResult: any = {
            transactions: {
                trx_id: 'string',
                sender: 'string',
                sender_id: 'string',
                payer: 'string',
                delay_until: 'string',
                expiration: 'string',
                published: 'string',
                'packed_trx?': 'string',
                'transaction?': {
                    'expiration?': 'string',
                    'ref_block_num?': 'number',
                    'ref_block_prefix?': 'number',
                    'max_net_usage_words?': 'number',
                    'max_cpu_usage_ms?': 'number',
                    'delay_sec?': 'number',
                    'context_free_actions?': {
                        account: 'string',
                        name: 'string',
                        authorization: {
                            actor: 'string',
                            permission: 'string',
                        },
                        'data?': 'any',
                        'hex_data?': 'string',
                    },
                    'context_free_data?': 'number',
                    'actions': {
                        account: 'string',
                        name: 'string',
                        authorization: {
                            actor: 'string',
                            permission: 'string',
                        },
                        'data?': 'any',
                        'hex_data?': 'string',
                    },
                    'transaction_extensions?': '[number, string]',
                    'deferred_transaction_generation?': {
                        sender_trx_id: 'string',
                        sender_id: 'string',
                        sender: 'string',
                    },
                },
            },
            more: 'string',
        };
        verifyType(result, getScheduledTransactionsResult);
    });

    it('validates return type of get_table_rows', async () => {
        const result: GetTableRowsResult = await rpc.get_table_rows({
            code: 'eosio.token',
            scope: 'eosio.token',
            table: 'accounts',
        });
        const getTableRowsResult: any = {
            rows: 'any',
            more: 'boolean',
            next_key: 'string',
            next_key_bytes: 'string',
        };
        verifyType(result, getTableRowsResult);
    });

    it('validates return type of get_kv_table_rows', async () => {
        const result: GetTableRowsResult = await rpc.get_kv_table_rows({
            code: 'todo',
            table: 'todo',
            index_name: 'map.index',
            encode_type: 'string',
        });
        const getTableRowsResult: any = {
            rows: 'any',
            more: 'boolean',
            next_key: 'string',
            next_key_bytes: 'string',
        };
        verifyType(result, getTableRowsResult);
    });

    it('validates return type of get_table_by_scope', async () => {
        const result: GetTableByScopeResult = await rpc.get_table_by_scope({
            code: 'eosio.token',
            table: 'accounts',
        });
        const getTableByScopeResult: any = {
            rows: 'any',
            more: 'string',
        };
        verifyType(result, getTableByScopeResult);
    });

    it('validates return type of get_required_keys', async () => {
        const info = await rpc.get_info();
        let transaction: Transaction = {
            actions: [{
                account: 'eosio.token',
                name: 'transfer',
                authorization: [{
                    actor: 'bob',
                    permission: 'active',
                }],
                data: {
                    from: 'bob',
                    to: 'alice',
                    quantity: '0.0001 SYS',
                    memo: '',
                },
            }],
            context_free_actions: []
        };
        transaction = {
            ...ser.transactionHeader({
                block_num: info.last_irreversible_block_num,
                id: info.last_irreversible_block_id,
                timestamp: info.last_irreversible_block_time,
            }, 30),
            context_free_actions: await api.serializeActions(transaction.context_free_actions || []),
            actions: await api.serializeActions(transaction.actions),
            ...transaction,
        };

        const availableKeys = await signatureProvider.getAvailableKeys();
        const result: string[] = await rpc.getRequiredKeys({ transaction, availableKeys });
        result.forEach((element: any) => {
            expect(typeof element).toEqual('string');
        });
    });

    it('validates return type of push_transaction', async () => {
        const transaction: PushTransactionArgs = await api.transact({
            actions: [{
                account: 'eosio.token',
                name: 'transfer',
                authorization: [{
                    actor: 'bob',
                    permission: 'active',
                }],
                data: {
                    from: 'bob',
                    to: 'alice',
                    quantity: '0.0001 SYS',
                    memo: '',
                },
            }],
        }, {
            sign: true,
            broadcast: false,
            useLastIrreversible: true,
            expireSeconds: 30,
        }) as PushTransactionArgs;
        const result: TransactResult = await rpc.push_transaction(transaction);
        const transactResult = {
            transaction_id: 'string',
            processed: {
                id: 'string',
                block_num: 'number',
                block_time: 'string',
                'producer_block_id&': 'string',
                'receipt&': {
                    status: 'string',
                    cpu_usage_us: 'number',
                    net_usage_words: 'number',
                },
                elapsed: 'number',
                net_usage: 'number',
                scheduled: 'boolean',
                action_traces: {
                    action_ordinal: 'number',
                    creator_action_ordinal: 'number',
                    closest_unnotified_ancestor_action_ordinal: 'number',
                    receipt: {
                        receiver: 'string',
                        act_digest: 'string',
                        global_sequence: 'number',
                        recv_sequence: 'number',
                        auth_sequence: [ 'string', 'number' ],
                        code_sequence: 'number',
                        abi_sequence: 'number',
                    },
                    receiver: 'string',
                    act: {
                        account: 'string',
                        name: 'string',
                        authorization: {
                            actor: 'string',
                            permission: 'string',
                        },
                        'data?': 'any',
                        'hex_data?': 'string',
                    },
                    context_free: 'boolean',
                    elapsed: 'number',
                    console: 'string',
                    trx_id: 'string',
                    block_num: 'number',
                    block_time: 'string',
                    'producer_block_id&': 'string',
                    account_ram_deltas: {
                        account: 'string',
                        delta: 'number',
                    },
                    account_disk_deltas: {
                        account: 'string',
                        delta: 'number',
                    },
                    except: 'any',
                    'error_code&': 'number',
                    'return_value?': 'any',
                    'return_value_hex_data?': 'string',
                    'return_value_data?': 'any',
                    'inline_traces?': 'any', // ActionTrace, recursive?
                },
                'account_ram_delta&': {
                    account: 'string',
                    delta: 'number',
                },
                'except&': 'string',
                'error_code&': 'number',
                bill_to_accounts: 'string',
            },
        };
        verifyType(result, transactResult);
    });

    it('validates return type of push_ro_transaction', async () => {
        const transaction: PushTransactionArgs = await api.transact({
            actions: [{
                account: 'readonly',
                name: 'get',
                authorization: [{
                    actor: 'readonly',
                    permission: 'active',
                }],
                data: {},
            }],
        }, {
            sign: true,
            broadcast: false,
            useLastIrreversible: true,
            expireSeconds: 30,
        }) as PushTransactionArgs;
        const result: ReadOnlyTransactResult = await rpc.push_ro_transaction(transaction);
        const readOnlyTransactResult: any = {
            head_block_num: 'number',
            head_block_id: 'string',
            last_irreversible_block_num: 'number',
            last_irreversible_block_id: 'string',
            code_hash: 'string',
            pending_transactions: 'string',
            result: {
                id: 'string',
                block_num: 'number',
                block_time: 'string',
                'producer_block_id&': 'string',
                'receipt&': {
                    status: 'string',
                    cpu_usage_us: 'number',
                    net_usage_words: 'number',
                },
                elapsed: 'number',
                net_usage: 'number',
                scheduled: 'boolean',
                action_traces: {
                    action_ordinal: 'number',
                    creator_action_ordinal: 'number',
                    closest_unnotified_ancestor_action_ordinal: 'number',
                    receipt: {
                        receiver: 'string',
                        act_digest: 'string',
                        global_sequence: 'number',
                        recv_sequence: 'number',
                        auth_sequence: [ 'string', 'number' ],
                        code_sequence: 'number',
                        abi_sequence: 'number',
                    },
                    receiver: 'string',
                    act: {
                        account: 'string',
                        name: 'string',
                        authorization: {
                            actor: 'string',
                            permission: 'string',
                        },
                        'data?': 'any',
                        'hex_data?': 'string',
                    },
                    context_free: 'boolean',
                    elapsed: 'number',
                    console: 'string',
                    trx_id: 'string',
                    block_num: 'number',
                    block_time: 'string',
                    'producer_block_id&': 'string',
                    account_ram_deltas: {
                        account: 'string',
                        delta: 'number',
                    },
                    account_disk_deltas: {
                        account: 'string',
                        delta: 'number',
                    },
                    except: 'any',
                    'error_code&': 'number',
                    'return_value?': 'any',
                    'return_value_hex_data?': 'string',
                    'return_value_data?': 'any',
                    'inline_traces?': 'any', // ActionTrace, recursive?
                },
                'account_ram_delta&': {
                    account: 'string',
                    delta: 'number',
                },
                'except&': 'string',
                'error_code&': 'number',
                bill_to_accounts: 'string',
            }
        };
        verifyType(result, readOnlyTransactResult);
    });

    it('validates return type of push_transactions', async () => {
        const transactionA: PushTransactionArgs = await api.transact({
            actions: [{
                account: 'eosio.token',
                name: 'transfer',
                authorization: [{
                    actor: 'bob',
                    permission: 'active',
                }],
                data: {
                    from: 'bob',
                    to: 'alice',
                    quantity: '0.0001 SYS',
                    memo: 'A',
                },
            }],
        }, {
            sign: true,
            broadcast: false,
            useLastIrreversible: true,
            expireSeconds: 30,
        }) as PushTransactionArgs;
        const transactionB: PushTransactionArgs = await api.transact({
            actions: [{
                account: 'eosio.token',
                name: 'transfer',
                authorization: [{
                    actor: 'bob',
                    permission: 'active',
                }],
                data: {
                    from: 'bob',
                    to: 'alice',
                    quantity: '0.0001 SYS',
                    memo: 'B',
                },
            }],
        }, {
            sign: true,
            broadcast: false,
            useLastIrreversible: true,
            expireSeconds: 30,
        }) as PushTransactionArgs;
        const result: TransactResult[] = await rpc.push_transactions([ transactionA, transactionB ]);
        const transactResult = {
            transaction_id: 'string',
            processed: {
                id: 'string',
                block_num: 'number',
                block_time: 'string',
                'producer_block_id&': 'string',
                'receipt&': {
                    status: 'string',
                    cpu_usage_us: 'number',
                    net_usage_words: 'number',
                },
                elapsed: 'number',
                net_usage: 'number',
                scheduled: 'boolean',
                action_traces: {
                    action_ordinal: 'number',
                    creator_action_ordinal: 'number',
                    closest_unnotified_ancestor_action_ordinal: 'number',
                    receipt: {
                        receiver: 'string',
                        act_digest: 'string',
                        global_sequence: 'number',
                        recv_sequence: 'number',
                        auth_sequence: [ 'string', 'number' ],
                        code_sequence: 'number',
                        abi_sequence: 'number',
                    },
                    receiver: 'string',
                    act: {
                        account: 'string',
                        name: 'string',
                        authorization: {
                            actor: 'string',
                            permission: 'string',
                        },
                        'data?': 'any',
                        'hex_data?': 'string',
                    },
                    context_free: 'boolean',
                    elapsed: 'number',
                    console: 'string',
                    trx_id: 'string',
                    block_num: 'number',
                    block_time: 'string',
                    'producer_block_id&': 'string',
                    account_ram_deltas: {
                        account: 'string',
                        delta: 'number',
                    },
                    account_disk_deltas: {
                        account: 'string',
                        delta: 'number',
                    },
                    except: 'any',
                    'error_code&': 'number',
                    'return_value?': 'any',
                    'return_value_hex_data?': 'string',
                    'return_value_data?': 'any',
                    'inline_traces?': 'any', // ActionTrace, recursive?
                },
                'account_ram_delta&': {
                    account: 'string',
                    delta: 'number',
                },
                'except&': 'string',
                'error_code&': 'number',
                bill_to_accounts: 'string',
            },
        };
        result.forEach((transaction: TransactResult) => {
            verifyType(transaction, transactResult);
        });
    });

    it('validates return type of send_transaction', async () => {
        const transaction: PushTransactionArgs = await api.transact({
            actions: [{
                account: 'eosio.token',
                name: 'transfer',
                authorization: [{
                    actor: 'alice',
                    permission: 'active',
                }],
                data: {
                    from: 'alice',
                    to: 'bob',
                    quantity: '0.0001 SYS',
                    memo: '',
                },
            }],
        }, {
            sign: true,
            broadcast: false,
            useLastIrreversible: true,
            expireSeconds: 30,
        }) as PushTransactionArgs;
        const result: TransactResult = await rpc.send_transaction(transaction);
        const transactResult = {
            transaction_id: 'string',
            processed: {
                id: 'string',
                block_num: 'number',
                block_time: 'string',
                'producer_block_id&': 'string',
                'receipt&': {
                    status: 'string',
                    cpu_usage_us: 'number',
                    net_usage_words: 'number',
                },
                elapsed: 'number',
                net_usage: 'number',
                scheduled: 'boolean',
                action_traces: {
                    action_ordinal: 'number',
                    creator_action_ordinal: 'number',
                    closest_unnotified_ancestor_action_ordinal: 'number',
                    receipt: {
                        receiver: 'string',
                        act_digest: 'string',
                        global_sequence: 'number',
                        recv_sequence: 'number',
                        auth_sequence: [ 'string', 'number' ],
                        code_sequence: 'number',
                        abi_sequence: 'number',
                    },
                    receiver: 'string',
                    act: {
                        account: 'string',
                        name: 'string',
                        authorization: {
                            actor: 'string',
                            permission: 'string',
                        },
                        'data?': 'any',
                        'hex_data?': 'string',
                    },
                    context_free: 'boolean',
                    elapsed: 'number',
                    console: 'string',
                    trx_id: 'string',
                    block_num: 'number',
                    block_time: 'string',
                    'producer_block_id&': 'string',
                    account_ram_deltas: {
                        account: 'string',
                        delta: 'number',
                    },
                    account_disk_deltas: {
                        account: 'string',
                        delta: 'number',
                    },
                    except: 'any',
                    'error_code&': 'number',
                    'return_value?': 'any',
                    'return_value_hex_data?': 'string',
                    'return_value_data?': 'any',
                    'inline_traces?': 'any', // ActionTrace, recursive?
                },
                'account_ram_delta&': {
                    account: 'string',
                    delta: 'number',
                },
                'except&': 'string',
                'error_code&': 'number',
                bill_to_accounts: 'string',
            },
        };
        verifyType(result, transactResult);
    });
});

describe('DB Size API Plugin Endpoints', () => {
    it('validates return type of get', async () => {
        const result: DBSizeGetResult = await rpc.db_size_get();
        const dbSizeGetResult: any = {
            free_bytes: 'number',
            used_bytes: 'number',
            size: 'number',
            indices: {
                index: 'string',
                row_count: 'number',
            },
        };
        verifyType(result, dbSizeGetResult);
    });
});

describe('Trace API Plugin Endpoints', () => {
    it('validates return type of get_block', async () => {
        const info: GetInfoResult = await rpc.get_info();
        const result: TraceApiGetBlockResult = await rpc.trace_get_block(info.last_irreversible_block_num);
        const traceApiGetBlockResult: any = {
            id: 'string',
            number: 'number',
            previous_id: 'string',
            status: 'string',
            timestamp: 'string',
            producer: 'string',
            transaction_mroot: 'string',
            action_mroot: 'string',
            schedule_version: 'number',
            transactions: {
                id: 'string',
                actions: {
                    global_sequence: 'number',
                    receiver: 'string',
                    account: 'string',
                    action: 'string',
                    authorization: {
                        account: 'string',
                        permission: 'string'
                    },
                    data: 'string',
                    return_value: 'string',
                },
                status: 'string',
                cpu_usage_us: 'number',
                net_usage_words: 'number',
                signatures: 'string',
                transaction_header: 'any',
                bill_to_accounts: 'string',
            },
        };
        verifyType(result, traceApiGetBlockResult);
    });
});


const verifyType = (data: any, type: any): void => {
    const verifiedKeys: string[] = Object.keys(type).filter((key: string) => {
        const formattedKey = key.replace('?', '').replace('&', '');
        if (key.includes('?')) {
            if (!data.hasOwnProperty(formattedKey)) return false;
        }
        return true;
    }).map((key: string) => {
        const formattedKey = key.replace('?', '').replace('&', '');
        if (Array.isArray(data[formattedKey])) {
            if (Array.isArray(type[key])) {
                data[formattedKey].forEach((element: any, index: number) => {
                    if (Array.isArray(element)) {
                        element.forEach((secondElement: any, secondIndex: number) => {
                            complexOrPrimitive(secondElement, type[key][secondIndex], formattedKey);
                        });
                    } else {
                        complexOrPrimitive(element, type[key][index], formattedKey);
                    }
                });
            } else {
                data[formattedKey].forEach((element: any) => {
                    complexOrPrimitive(element, type[key], formattedKey);
                });
            }
        } else if (key.includes('&')) {
            if (data[formattedKey] !== null) {
                complexOrPrimitive(data[formattedKey], type[key], formattedKey);
            }
        } else {
            complexOrPrimitive(data[formattedKey], type[key], formattedKey);
        }
        return formattedKey;
    });
    expect(data).toContainAllKeys(verifiedKeys);
};

const complexOrPrimitive = (data: any, type: any, formattedKey: any): void => {
    if (typeof type === 'object') {
        verifyType(data, type);
    } else if (type.includes('Map')) {
        const types = type.replace('Map<', '').replace('>', '').split(', ');
        data.forEach((value: any, index: number) => {
            complexOrPrimitive(value, types[index], formattedKey);
        });
    } else if (type.includes('|')) {
        const types = type.split('|');
        expect(typeof data).toBeOneOf(types);
    } else if (type !== 'any') {
        expect(typeof data).toEqual(type);
    }
};
