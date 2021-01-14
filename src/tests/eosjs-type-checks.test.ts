
import { JsonRpc } from '../eosjs-jsonrpc';
import fetch from 'node-fetch';
import {
    GetAbiResult,
    GetAccountResult,
    GetBlockHeaderStateResult,
    GetBlockInfoResult,
    GetBlockResult,
    GetCodeResult,
    GetCurrencyStatsResult,
    GetInfoResult,
    GetProducerScheduleResult,
    GetProducersResult,
    GetRawCodeAndAbiResult,
    GetRawAbiResult,
    GetScheduledTransactionsResult,
    GetTableRowsResult,
    GetTableByScopeResult,
} from '../eosjs-rpc-interfaces';
import 'jest-extended';

const rpc = new JsonRpc('http://localhost:8888', { fetch });

describe('Chain Plugin Endpoints', () => {
    it('validates return type of get_abi', async () => {
        const result: GetAbiResult = await rpc.get_abi('todo');
        const getAbiResult: any = {
            account_name: 'string',
            abi: {
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
                    error_code: 'string',
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
            'core_liquid_balance?': {
                amount: 'number',
                symbol: 'string',
            },
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
            total_resources: 'any',
            self_delegated_bandwidth: 'any',
            refund_request: 'any',
            voter_info: 'any',
            rex_info: 'any',
        };
        verifyType(result, getAccountResult);
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
                    // [ 0, { threshold: 1, keys: [ [Object] ] } ]
                    authority: 'any',
                },
            },
            blockroot_merkle: {
                _active_nodes: 'string',
                _node_count: 'number',
            },
            producer_to_last_produced: 'Map<string, number>',
            producer_to_last_implied_irb: 'Map<string, number>',
            valid_block_signing_authority: 'any',
            confirm_count: 'number'
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
            'new_producers?': 'any',
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
                            data: 'any',
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
                            data: 'any',
                            'hex_data?': 'string',
                        },
                        'transaction_extensions?': {
                            type: 'number',
                            data: 'string',
                        },
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
            abi: {
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
                    error_code: 'string',
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

    it('validates return type of get_currency_balance', async () => {
        const result: string[] = await rpc.get_currency_balance('eosio.token', 'bob', 'SYS');
        const getCurrencyBalanceResult: any = 'string';
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
        };
        verifyType(result, getInfoResult);
    });

    it('validates return type of get_producer_schedule', async () => {
        const result: GetProducerScheduleResult = await rpc.get_producer_schedule();
        const getProducerScheduleResult: any = {
            // nodeos has them listed as variant
            active: 'any',
            pending: 'any',
            proposed: 'any',
        };
        verifyType(result, getProducerScheduleResult);
    });

    it('validates return type of get_producer_schedule', async () => {
        const result: GetProducerScheduleResult = await rpc.get_producer_schedule();
        const getProducerScheduleResult: any = {
            // nodeos has them listed as variant
            active: 'any',
            pending: 'any',
            proposed: 'any',
        };
        verifyType(result, getProducerScheduleResult);
    });

    it('validates return type of get_producers', async () => {
        const result: GetProducersResult = await rpc.get_producers();
        const getProducersResult: any = {
            // nodeos has object listed as variant
            rows: 'string|object',
            total_producer_vote_weight: 'string',
            more: 'string',
        };
        verifyType(result, getProducersResult);
    });

    it('validates return type of get_raw_code_and_abi', async () => {
        const result: GetRawCodeAndAbiResult = await rpc.get_raw_code_and_abi('todo');
        const getRawCodeAndAbiResult: any = {
            account_name: 'string',
            wasm: 'string',
            abi: 'string',
        };
        verifyType(result, getRawCodeAndAbiResult);
    });

    it('validates return type of get_raw_abi', async () => {
        const result: GetRawAbiResult = await rpc.get_raw_abi('todo');
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
                    data: 'any',
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
                    data: 'any',
                    'hex_data?': 'string',
                },
                'transaction_extensions?': {
                    type: 'number',
                    data: 'string',
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
            lower_bound: 'ac8acfe7-cd4e-4d22-8400-218b697a4517',
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
});

const verifyType = (data: any, type: any): void => {
    const verifiedKeys: string[] = Object.keys(type).filter((key: string) => {
        const formattedKey = key.replace('?', '');
        if (key.includes('?')) {
            if (!data.hasOwnProperty(formattedKey)) return false;
        }
        return true;
    }).map((key: string) => {
        const formattedKey = key.replace('?', '');
        if (Array.isArray(data[formattedKey])) {
            data[formattedKey].forEach((element: any) => {
                complexOrPrimative(element, type[key]);
            });
        } else {
            complexOrPrimative(data[formattedKey], type[key]);
        }
        return formattedKey;
    });
    expect(data).toContainAllKeys(verifiedKeys);
};

const complexOrPrimative = (data: any, type: any): void => {
    if (typeof type === 'object') {
        verifyType(data, type);
    } else if (type.includes('Map')) {
        const types = type.replace('Map<', '').replace('>', '').split(', ');
        data.forEach((value: any, index: number) => {
            complexOrPrimative(value, types[index]);
        });
    } else if (type.includes('|')) {
        const types = type.split('|');
        expect(typeof data).toBeOneOf(types);
    } else if (type !== 'any') {
        expect(typeof data).toEqual(type);
    }
};
