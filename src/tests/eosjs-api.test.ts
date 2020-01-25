import { TextDecoder, TextEncoder } from 'text-encoding';
import { Api } from '../eosjs-api';
import { JsonRpc } from '../eosjs-jsonrpc';
import { JsSignatureProvider } from '../eosjs-jssig';

const transaction = {
    expiration: '2018-09-04T18:42:49',
    ref_block_num: 38096,
    ref_block_prefix: 505360011,
    max_net_usage_words: 0,
    max_cpu_usage_ms: 0,
    delay_sec: 0,
    context_free_actions: [] as any,
    actions: [
        {
            account: 'testeostoken',
            name: 'transfer',
            authorization: [
                {
                    actor: 'thegazelle',
                    permission: 'active',
                },
            ],
            data: {
                from: 'thegazelle',
                to: 'remasteryoda',
                quantity: '1.0000 EOS',
                memo: 'For a secure future.',
            },
            hex_data: `00808a517dc354cb6012f557656ca4ba102700000000000004454f530000000014466f722
        06120736563757265206675747572652e`,
        },
        {
            account: 'testeostoken',
            name: 'transfer',
            authorization: [
                {
                    actor: 'thegazelle',
                    permission: 'active',
                },
            ],
            data: {
                from: 'thegazelle',
                to: 'remasteryoda',
                quantity: '2.0000 EOS',
                memo: 'For a second secure future (multiverse?)',
            },
            hex_data: `00808a517dc354cb6012f557656ca4ba204e00000000000004454f530000000028466f722061207365636f6e642073656
        37572652066757475726520286d756c746976657273653f29`,
        },
    ],
    transaction_extensions: [] as any,
};

const serializedTx = [
    41, 210, 142, 91, 208, 148, 139, 46, 31, 30, 0, 0, 0, 0, 2, 48, 21, 164,
    25, 83, 149, 177, 202, 0, 0, 0, 87, 45, 60, 205, 205, 1, 0, 128, 138, 81,
    125, 195, 84, 203, 0, 0, 0, 0, 168, 237, 50, 50, 0, 48, 21, 164, 25, 83,
    149, 177, 202, 0, 0, 0, 87, 45, 60, 205, 205, 1, 0, 128, 138, 81, 125,
    195, 84, 203, 0, 0, 0, 0, 168, 237, 50, 50, 0, 0,
];

const deserializedTx = {
    actions: [
        {
            account: 'testeostoken',
            authorization: [{ actor: 'thegazelle', permission: 'active' }],
            data: '',
            name: 'transfer',
        },
        {
            account: 'testeostoken',
            authorization: [{ actor: 'thegazelle', permission: 'active' }],
            data: '',
            name: 'transfer',
        },
    ],
    context_free_actions: [] as any,
    delay_sec: 0,
    expiration: '2018-09-04T18:42:49.000',
    max_cpu_usage_ms: 0,
    max_net_usage_words: 0,
    ref_block_num: 38096,
    ref_block_prefix: 505360011,
    transaction_extensions: [] as any,
};

const serializedActions = [
    {
        account: 'testeostoken',
        authorization: [{ actor: 'thegazelle', permission: 'active' }],
        data: "00808A517DC354CB6012F557656CA4BA102700000000000004454F530000000014466F72206120736563757265206675747572652E", // tslint:disable-line
        name: 'transfer',
    },
    {
        account: 'testeostoken',
        authorization: [{ actor: 'thegazelle', permission: 'active' }],
        data: "00808A517DC354CB6012F557656CA4BA204E00000000000004454F530000000028466F722061207365636F6E64207365637572652066757475726520286D756C746976657273653F29", // tslint:disable-line
        name: 'transfer',
    },
];

const deserializedActions = [
    {
        account: 'testeostoken',
        authorization: [{ actor: 'thegazelle', permission: 'active' }],
        data: {
            from: 'thegazelle',
            memo: 'For a secure future.',
            quantity: '1.0000 EOS',
            to: 'remasteryoda',
        },
        name: 'transfer',
    },
    {
        account: 'testeostoken',
        authorization: [{ actor: 'thegazelle', permission: 'active' }],
        data: {
            from: 'thegazelle',
            memo: 'For a second secure future (multiverse?)',
            quantity: '2.0000 EOS',
            to: 'remasteryoda',
        },
        name: 'transfer',
    },
];

describe('eosjs-api', () => {
    let api: any;
    const fetch = async (input: any, init: any): Promise<any> => ({
        ok: true,
        json: async () => {
            if (input === '/v1/chain/get_raw_code_and_abi') {
                return {
                    account_name: 'testeostoken',
                    abi: "DmVvc2lvOjphYmkvMS4wAQxhY2NvdW50X25hbWUEbmFtZQUIdHJhbnNmZXIABARmcm9tDGFjY291bnRfbmFtZQJ0bwxhY2NvdW50X25hbWUIcXVhbnRpdHkFYXNzZXQEbWVtbwZzdHJpbmcGY3JlYXRlAAIGaXNzdWVyDGFjY291bnRfbmFtZQ5tYXhpbXVtX3N1cHBseQVhc3NldAVpc3N1ZQADAnRvDGFjY291bnRfbmFtZQhxdWFudGl0eQVhc3NldARtZW1vBnN0cmluZwdhY2NvdW50AAEHYmFsYW5jZQVhc3NldA5jdXJyZW5jeV9zdGF0cwADBnN1cHBseQVhc3NldAptYXhfc3VwcGx5BWFzc2V0Bmlzc3VlcgxhY2NvdW50X25hbWUDAAAAVy08zc0IdHJhbnNmZXLnBSMjIFRyYW5zZmVyIFRlcm1zICYgQ29uZGl0aW9ucwoKSSwge3tmcm9tfX0sIGNlcnRpZnkgdGhlIGZvbGxvd2luZyB0byBiZSB0cnVlIHRvIHRoZSBiZXN0IG9mIG15IGtub3dsZWRnZToKCjEuIEkgY2VydGlmeSB0aGF0IHt7cXVhbnRpdHl9fSBpcyBub3QgdGhlIHByb2NlZWRzIG9mIGZyYXVkdWxlbnQgb3IgdmlvbGVudCBhY3Rpdml0aWVzLgoyLiBJIGNlcnRpZnkgdGhhdCwgdG8gdGhlIGJlc3Qgb2YgbXkga25vd2xlZGdlLCB7e3RvfX0gaXMgbm90IHN1cHBvcnRpbmcgaW5pdGlhdGlvbiBvZiB2aW9sZW5jZSBhZ2FpbnN0IG90aGVycy4KMy4gSSBoYXZlIGRpc2Nsb3NlZCBhbnkgY29udHJhY3R1YWwgdGVybXMgJiBjb25kaXRpb25zIHdpdGggcmVzcGVjdCB0byB7e3F1YW50aXR5fX0gdG8ge3t0b319LgoKSSB1bmRlcnN0YW5kIHRoYXQgZnVuZHMgdHJhbnNmZXJzIGFyZSBub3QgcmV2ZXJzaWJsZSBhZnRlciB0aGUge3t0cmFuc2FjdGlvbi5kZWxheX19IHNlY29uZHMgb3Igb3RoZXIgZGVsYXkgYXMgY29uZmlndXJlZCBieSB7e2Zyb219fSdzIHBlcm1pc3Npb25zLgoKSWYgdGhpcyBhY3Rpb24gZmFpbHMgdG8gYmUgaXJyZXZlcnNpYmx5IGNvbmZpcm1lZCBhZnRlciByZWNlaXZpbmcgZ29vZHMgb3Igc2VydmljZXMgZnJvbSAne3t0b319JywgSSBhZ3JlZSB0byBlaXRoZXIgcmV0dXJuIHRoZSBnb29kcyBvciBzZXJ2aWNlcyBvciByZXNlbmQge3txdWFudGl0eX19IGluIGEgdGltZWx5IG1hbm5lci4KAAAAAAClMXYFaXNzdWUAAAAAAKhs1EUGY3JlYXRlAAIAAAA4T00RMgNpNjQBCGN1cnJlbmN5AQZ1aW50NjQHYWNjb3VudAAAAAAAkE3GA2k2NAEIY3VycmVuY3kBBnVpbnQ2NA5jdXJyZW5jeV9zdGF0cwAAAA===", // tslint:disable-line
                };
            }

            return transaction;
        },
    });

    beforeEach(() => {
        const rpc = new JsonRpc('', { fetch });
        const signatureProvider = new JsSignatureProvider(['5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr']);
        const chainId = '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca';
        api = new Api({
            rpc, signatureProvider, chainId, textDecoder: new TextDecoder(), textEncoder: new TextEncoder(),
        });
    });

    it('Doesnt crash', () => {
        expect(api).toBeTruthy();
    });

    it('getAbi returns an abi', async () => {
        const response = await api.getAbi('testeostoken');
        expect(response).toBeTruthy();
    });

    it('getTransactionAbis returns abis by transactions', async () => {
        const response = await api.getTransactionAbis(transaction);
        expect(response[0].abi.length).toBeGreaterThan(0);
    });

    it('getContract returns a contract', async () => {
        const response = await api.getContract('testeostoken');
        expect(response.actions).toBeTruthy();
    });

    it('deserializeTransaction converts tx from binary', () => {
        const tx = api.deserializeTransaction(serializedTx);
        expect(tx).toEqual(deserializedTx);
    });

    it('serializeActions converts actions to hex', async () => {
        const response = await api.serializeActions(transaction.actions);

        expect(response).toEqual(serializedActions);
    });

    it('deserializeActions converts actions from hex', async () => {
        const response = await api.deserializeActions(serializedActions);

        expect(response).toEqual(deserializedActions);
    });

    it('hasRequiredTaposFields returns true, if required fields are present', () => {
        const response = api.hasRequiredTaposFields(transaction);

        expect(response).toEqual(true);
    });
});
