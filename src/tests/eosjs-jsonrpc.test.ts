import { JsonRpc } from '../eosjs-jsonrpc';
import { RpcError } from '../eosjs-rpcerror';

describe('JSON RPC', () => {
    const endpointExtraSlash = 'http://localhost/';
    const endpoint = 'http://localhost';
    const fetchMock = fetch as any;
    let jsonRpc: JsonRpc;

    beforeEach(() => {
        fetchMock.resetMocks();
        jsonRpc = new JsonRpc(endpointExtraSlash);
    });

    it('throws error bad status', async () => {
        let actMessage = '';
        const expMessage = 'Not Found';
        const accountName = 'myaccountaaa';
        const expReturn = { data: '12345', message: expMessage };

        fetchMock.once(JSON.stringify(expReturn), { status: 404 });

        // async / await don't play well with expect().toThrow()
        try {
            await jsonRpc.get_abi(accountName);
        } catch (e) {
            expect(e).toBeInstanceOf(RpcError);
            actMessage = e.message;
        }

        expect(actMessage).toEqual(expMessage);
    });

    it('throws error unprocessed', async () => {
        let actMessage = '';
        const expMessage = 'Not Processed';
        const accountName = 'myaccountaaa';
        const expReturn = {
            data: '12345',
            processed: {
                except: {
                    message: expMessage,
                },
            },
        };

        fetchMock.once(JSON.stringify(expReturn));

        try {
            await jsonRpc.get_abi(accountName);
        } catch (e) {
            expect(e).toBeInstanceOf(RpcError);
            actMessage = e.message;
        }

        expect(actMessage).toEqual(expMessage);
    });

    it('calls provided fetch instead of default', async () => {
        const expPath = '/v1/chain/get_abi';
        const accountName = 'myaccountaaa';
        const expReturn = { data: '12345' };
        const expParams = {
            body: JSON.stringify({
                account_name: accountName,
            }),
            method: 'POST',
        };

        const mockResp = {
            json() {
                return expReturn;
            },
            ok: true,
        };
        const myFetch = jest.fn();
        myFetch.mockReturnValue(mockResp);
        jsonRpc = new JsonRpc(endpoint, { fetch: myFetch });

        await jsonRpc.get_abi(accountName);

        expect(myFetch).toBeCalledWith(endpoint + expPath, expParams);

    });

    it('calls get_abi', async () => {
        const expPath = '/v1/chain/get_abi';
        const accountName = 'myaccountaaa';
        const expReturn = { data: '12345' };
        const expParams = {
            body: JSON.stringify({
                account_name: accountName,
            }),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.get_abi(accountName);

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls get_account', async () => {
        const expPath = '/v1/chain/get_account';
        const accountName = 'myaccountaaa';
        const expReturn = { data: '12345' };
        const expParams = {
            body: JSON.stringify({
                account_name: accountName,
            }),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.get_account(accountName);

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls get_block_header_state', async () => {
        const expPath = '/v1/chain/get_block_header_state';
        const blockNumOrId = 1234;
        const expReturn = { data: '12345' };
        const expParams = {
            body: JSON.stringify({
                block_num_or_id: blockNumOrId,
            }),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.get_block_header_state(blockNumOrId);

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls get_block', async () => {
        const expPath = '/v1/chain/get_block';
        const blockNumOrId = 1234;
        const expReturn = { data: '12345' };
        const expParams = {
            body: JSON.stringify({
                block_num_or_id: blockNumOrId,
            }),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.get_block(blockNumOrId);

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls get_code', async () => {
        const expPath = '/v1/chain/get_code';
        const accountName = 'myaccountaaa';
        const expReturn = { data: '12345' };
        const expParams = {
            body: JSON.stringify({
                account_name: accountName,
            }),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.get_code(accountName);

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls get_currency_balance with all params', async () => {
        const expPath = '/v1/chain/get_currency_balance';
        const code = 'morse';
        const account = 'myaccountaaa';
        const symbol = 'EOS';
        const expReturn = { data: '12345' };
        const expParams = {
            body: JSON.stringify({
                code,
                account,
                symbol,
            }),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.get_currency_balance(code, account, symbol);

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls get_currency_balance with default params', async () => {
        const expPath = '/v1/chain/get_currency_balance';
        const code = 'morse';
        const account = 'myaccountaaa';
        const symbol: string = null;
        const expReturn = { data: '12345' };
        const expParams = {
            body: JSON.stringify({
                code,
                account,
                symbol,
            }),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.get_currency_balance(code, account);

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls get_currency_stats with all params', async () => {
        const expPath = '/v1/chain/get_currency_stats';
        const code = 'morse';
        const symbol = 'EOS';
        const expReturn = { data: '12345' };
        const expParams = {
            body: JSON.stringify({
                code,
                symbol,
            }),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.get_currency_stats(code, symbol);

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls get_info', async () => {
        const expPath = '/v1/chain/get_info';
        const expReturn = { data: '12345' };
        const expParams = {
            body: JSON.stringify({}),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.get_info();

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls get_producer_schedule', async () => {
        const expPath = '/v1/chain/get_producer_schedule';
        const expReturn = { data: '12345' };
        const expParams = {
            body: JSON.stringify({}),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.get_producer_schedule();

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls get_producers with all params', async () => {
        const expPath = '/v1/chain/get_producers';
        const json = false;
        const lowerBound = 'zero';
        const limit = 10;
        const expReturn = { data: '12345' };
        const expParams = {
            body: JSON.stringify({
                json,
                lower_bound: lowerBound,
                limit,
            }),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.get_producers(json, lowerBound, limit);

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls get_producers with default params', async () => {
        const expPath = '/v1/chain/get_producers';
        const json = true;
        const lowerBound = '';
        const limit = 50;
        const expReturn = { data: '12345' };
        const expParams = {
            body: JSON.stringify({
                json,
                lower_bound: lowerBound,
                limit,
            }),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.get_producers();

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls get_raw_code_and_abi', async () => {
        const expPath = '/v1/chain/get_raw_code_and_abi';
        const accountName = 'myaccountaaa';
        const expReturn = { data: '12345' };
        const expParams = {
            body: JSON.stringify({
                account_name: accountName,
            }),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.get_raw_code_and_abi(accountName);

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls get_scheduled_transactions', async () => {
        const expPath = '/v1/chain/get_scheduled_transactions';
        const json = true;
        const lowerBound = '';
        const limit = 50;
        const expReturn = { data: '12345' };
        const expParams = {
            body: JSON.stringify({
                json,
                lower_bound: lowerBound,
                limit,
            }),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.get_scheduled_transactions();

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls get_table_rows with all params', async () => {
        const expPath = '/v1/chain/get_table_rows';
        const json = false;
        const code = 'morse';
        const scope = 'minty';
        const table = 'coffee';
        const tableKey = 'front_door';
        const lowerBound = 'zero';
        const upperBound = 'five';
        const limit = 20;
        const indexPosition = 1;
        const keyType = 'str';
        const expReturn = { data: '12345' };
        const reverse = false;
        const showPayer = false;
        const callParams = {
            json,
            code,
            scope,
            table,
            table_key: tableKey,
            lower_bound: lowerBound,
            upper_bound: upperBound,
            index_position: indexPosition,
            key_type: keyType,
            limit,
            reverse,
            show_payer: showPayer,
        };
        const expParams = {
            body: JSON.stringify(callParams),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.get_table_rows(callParams);

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls get_table_rows with default params', async () => {
        const expPath = '/v1/chain/get_table_rows';
        const json = true;
        const code = 'morse';
        const scope = 'minty';
        const table = 'coffee';
        const tableKey = '';
        const lowerBound = '';
        const upperBound = '';
        const limit = 10;
        const indexPosition = 1;
        const keyType = '';
        const reverse = false;
        const showPayer = false;
        const expReturn = { data: '12345' };
        const callParams = {
            code,
            scope,
            table,
        };
        const expParams = {
            body: JSON.stringify({
                json,
                code,
                scope,
                table,
                table_key: tableKey,
                lower_bound: lowerBound,
                upper_bound: upperBound,
                index_position: indexPosition,
                key_type: keyType,
                limit,
                reverse,
                show_payer: showPayer,
            }),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.get_table_rows(callParams);

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls get_table_by_scope with all params', async () => {
        const expPath = '/v1/chain/get_table_by_scope';
        const code = 'morse';
        const table = 'coffee';
        const lowerBound = 'minty';
        const upperBound = 'minty';
        const limit = 20;
        const expReturn = { data: '12345' };
        const callParams = {
            code,
            table,
            lower_bound: lowerBound,
            upper_bound: upperBound,
            limit,
        };
        const expParams = {
            body: JSON.stringify(callParams),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.get_table_by_scope(callParams);

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls get_table_by_scope with default params', async () => {
        const expPath = '/v1/chain/get_table_by_scope';
        const code = 'morse';
        const table = 'coffee';
        const lowerBound = '';
        const upperBound = '';
        const limit = 10;
        const expReturn = { data: '12345' };
        const callParams = {
            code,
            table,
        };
        const expParams = {
            body: JSON.stringify({
                code,
                table,
                lower_bound: lowerBound,
                upper_bound: upperBound,
                limit,
            }),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.get_table_by_scope(callParams);

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls getRequiredKeys', async () => {
        const expPath = '/v1/chain/get_required_keys';
        const keys = ['key1', 'key2', 'key3'];
        const expReturn = { required_keys: keys };
        const callParams = {
            transaction: 'mytxn',
            availableKeys: keys,
        };
        const expParams = {
            body: JSON.stringify({
                transaction: callParams.transaction,
                available_keys: callParams.availableKeys,
            }),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.getRequiredKeys(callParams);

        expect(response).toEqual(expReturn.required_keys);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls push_transaction', async () => {
        const expPath = '/v1/chain/push_transaction';
        const signatures = [
            'George Washington',
            'John Hancock',
            'Abraham Lincoln',
        ];
        const serializedTransaction = new Uint8Array([
            0, 16, 32, 128, 255,
        ]);

        const limit = 50;
        const expReturn = { data: '12345' };
        const callParams = {
            signatures,
            serializedTransaction,
        };
        const expParams = {
            body: JSON.stringify({
                signatures,
                compression: 0,
                packed_context_free_data: '',
                packed_trx: '00102080ff',
            }),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.push_transaction(callParams);

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls send_transaction', async () => {
        const expPath = '/v1/chain/send_transaction';
        const signatures = [
            'George Washington',
            'John Hancock',
            'Abraham Lincoln',
        ];
        const serializedTransaction = new Uint8Array([
            0, 16, 32, 128, 255,
        ]);

        const limit = 50;
        const expReturn = { data: '12345' };
        const callParams = {
            signatures,
            serializedTransaction,
        };
        const expParams = {
            body: JSON.stringify({
                signatures,
                compression: 0,
                packed_context_free_data: '',
                packed_trx: '00102080ff',
            }),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.send_transaction(callParams);

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls db_size_get', async () => {
        const expPath = '/v1/db_size/get';
        const expReturn = { data: '12345' };
        const expParams = {
            body: JSON.stringify({}),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.db_size_get();

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls history_get_actions with all params', async () => {
        const expPath = '/v1/history/get_actions';
        const accountName = 'myaccountaaa';
        const pos = 5;
        const offset = 10;
        const expReturn = { data: '12345' };
        const expParams = {
            body: JSON.stringify({
                account_name: accountName,
                pos,
                offset,
            }),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.history_get_actions(accountName, pos, offset);

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls history_get_actions with default params', async () => {
        const expPath = '/v1/history/get_actions';
        const accountName = 'myaccountaaa';
        const pos: number = null;
        const offset: number = null;
        const expReturn = { data: '12345' };
        const expParams = {
            body: JSON.stringify({
                account_name: accountName,
                pos,
                offset,
            }),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.history_get_actions(accountName);

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls history_get_transaction with all params', async () => {
        const expPath = '/v1/history/get_transaction';
        const id = 'myaccountaaa';
        const blockNumHint = 20;
        const expReturn = { data: '12345' };
        const expParams = {
            body: JSON.stringify({
                id,
                block_num_hint: blockNumHint,
            }),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.history_get_transaction(id, blockNumHint);

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls history_get_transaction with default params', async () => {
        const expPath = '/v1/history/get_transaction';
        const id = 'myaccountaaa';
        const blockNumHint: number = null;
        const expReturn = { data: '12345' };
        const expParams = {
            body: JSON.stringify({
                id,
                block_num_hint: blockNumHint,
            }),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.history_get_transaction(id);

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls history_get_key_accounts', async () => {
        const expPath = '/v1/history/get_key_accounts';
        const publicKey = 'key12345';
        const expReturn = { data: '12345' };
        const expParams = {
            body: JSON.stringify({
                public_key: publicKey,
            }),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.history_get_key_accounts(publicKey);

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

    it('calls history_get_controlled_accounts', async () => {
        const expPath = '/v1/history/get_controlled_accounts';
        const controllingAccount = 'key12345';
        const expReturn = { data: '12345' };
        const expParams = {
            body: JSON.stringify({
                controlling_account: controllingAccount,
            }),
            method: 'POST',
        };

        fetchMock.once(JSON.stringify(expReturn));

        const response = await jsonRpc.history_get_controlled_accounts(controllingAccount);

        expect(response).toEqual(expReturn);
        expect(fetch).toBeCalledWith(endpoint + expPath, expParams);
    });

});
