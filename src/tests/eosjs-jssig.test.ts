import { JsSignatureProvider } from '../eosjs-jssig';

describe('JsSignatureProvider', () => {
    const privateKeys = [
        '5Juww5SS6aLWxopXBAWzwqrwadiZKz7XpKAiktXTKcfBGi1DWg8', '5JnHjSFwe4r7xyqAUAaVs51G7HmzE86DWGa3VAA5VvQriGYnSUr'
    ];
    const publicKeys = [
        'PUB_K1_7tgwU6E7pAUQJgqEJt66Yi8cWvanTUW8ZfBjeXeJBQvhYTBFvY',
        'PUB_K1_8VaY5CiTexYqgQZyPTJkc3qvWuZUi12QrZL9ssjqW2es7e7bRJ',
    ];
    const signatures = [
        'SIG_K1_Kdj1FjezkWtNyGXE9S1stbZjFnbCffsmEdLLJ72bdtHXHwDjGVBZWPPVVhAJN4U67QK855nybaj6UGn86EUWqie1gLmKVa',
        'SIG_K1_KWYhhDoyoHa2gshpSJbmN3skAwHcyqh8kAnQJhEoRzf18281JvcmJiAp4QXbRyAS3D9or2DsmUnjoyeA8EZrYNRLRPkR4R'
    ];

    // These are simplified tests simply to verify a refactor didn't mess with existing code

    it('builds public keys from private when constructed', async () => {
        const provider = new JsSignatureProvider(privateKeys);
        const actualPublicKeys = await provider.getAvailableKeys();
        expect(actualPublicKeys).toEqual(publicKeys);
    });

    it('signs a transaction', async () => {
        const provider = new JsSignatureProvider(privateKeys);
        const chainId = '12345';
        const requiredKeys = publicKeys;
        const serializedTransaction = new Uint8Array([
            0, 16, 32, 128, 255,
        ]);
        const abis: any[] = [];

        const signOutput = await provider.sign({ chainId, requiredKeys, serializedTransaction, abis });

        expect(signOutput).toEqual({
            signatures,
            serializedTransaction,
            serializedContextFreeData: undefined
        });
    });
});
