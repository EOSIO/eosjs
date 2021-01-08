
import { JsonRpc } from '../eosjs-jsonrpc';
import fetch from 'node-fetch';
import { Abi, Asset, GetAbiResult, GetAccountResult, GetBlockHeaderStateResult, GetInfoResult } from '../eosjs-rpc-interfaces';
import 'jest-extended';

const rpc = new JsonRpc('http://localhost:8888', { fetch });

describe('Chain Plugin Endpoints', () => {
    it('validates return type of get_abi', async () => {
        const result: GetAbiResult = await rpc.get_abi('todo');
        const getAbiResultKeys: any = {
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
        verifyType(result, getAbiResultKeys);
    });

    it('validates return type of get_account', async () => {
        const result: GetAccountResult = await rpc.get_account('eosio');
        const getAccountResultKeys: any = {
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
        verifyType(result, getAccountResultKeys);
    });

    it('validates return type of get_block_header_state', async () => {
        const info: GetInfoResult = await rpc.get_info();
        const result: GetBlockHeaderStateResult = await rpc.get_block_header_state(info.head_block_id);
        const getBlockHeaderStateResultKeys: any = {
            id: 'string',
            header: {
                timestamp: 'string',
                producer: 'string',
                confirmed: 'number',
                previous: 'string',
                transaction_mroot: 'string',
                action_mroot: 'string',
                schedule_version: 'number',
                new_producers: 'any',
                header_extensions: 'any',
                producer_signature: 'string',
            },
            pending_schedule: 'any',
            activated_protocol_features: 'any',
            block_num: 'number',
            dpos_proposed_irreversible_blocknum: 'number',
            dpos_irreversible_blocknum: 'number',
            active_schedule: 'any',
            blockroot_merkle: 'any',
            producer_to_last_produced: 'any',
            producer_to_last_implied_irb: 'any',
            block_signing_key: 'string',
            confirm_count: 'any',
        };
        verifyType(result, getBlockHeaderStateResultKeys);
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
    } else if (type !== 'any') {
        expect(typeof data).toEqual(type);
    }
};
