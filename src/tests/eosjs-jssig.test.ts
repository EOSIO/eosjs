import { JsSignatureProvider } from '../eosjs-jssig';

describe('JsSignatureProvider', () => {
    const privateKeys = ['key1', 'key2', 'key3'];
    const publicKeys = [
        'PUB_K1_8iD9ABKFH5b9JyFgb5PE51BdCV74qGN9UMfg9V3TwaExCQWxJm',
        'PUB_K1_8f2o2LLQ3phteqyazxirQZnQzQFpnjLnXiUFEJcsSYhnjWNvSX',
        'PUB_K1_5imfbmmHC83VRxLRTcvovviAc6LPpyszcDuKtkwka9e9Jg37Hp',
    ];

    // These didn't test the correctness of signing. They also depend on the now-removed eosjs-ecc.

    it('builds public keys from private when constructed', async () => {
        /*
        const eccPkFromString = jest.spyOn(ecc.PrivateKey, 'fromString');
        eccPkFromString.mockImplementation((k) => ecc.PrivateKey.fromHex(ecc.sha256(k)));
        const provider = new JsSignatureProvider(privateKeys);
        const actualPublicKeys = await provider.getAvailableKeys();

        expect(eccPkFromString).toHaveBeenCalledTimes(privateKeys.length);
        expect(actualPublicKeys).toEqual(publicKeys);
        */
    });

    it('signs a transaction', async () => {
        /*
        const eccSignatureSign = jest.spyOn(ecc.Signature, 'sign');
        eccSignatureSign.mockImplementation((buffer, signKey) => signKey);

        const provider = new JsSignatureProvider(privateKeys);
        const chainId = '12345';
        const requiredKeys = [
            publicKeys[0],
            publicKeys[2],
        ];
        const serializedTransaction = new Uint8Array([
            0, 16, 32, 128, 255,
        ]);
        const abis: any[] = [];

        const signOutput = await provider.sign({ chainId, requiredKeys, serializedTransaction, abis });

        expect(eccSignatureSign).toHaveBeenCalledTimes(2);
        expect(signOutput).toEqual({ signatures: [privateKeys[0], privateKeys[2]], serializedTransaction });
        */
    });
});
