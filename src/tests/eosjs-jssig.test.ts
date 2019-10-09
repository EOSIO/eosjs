import { ec } from 'elliptic';

import { Signature, PrivateKey, PublicKey } from '../eosjs-key-conversions';
import {
    JsSignatureProvider,
    digestFromSerializedData
} from '../eosjs-jssig';
import { SignatureProviderArgs } from '../eosjs-api-interfaces';

describe('JsSignatureProvider', () => {
    const privateKeys = [
        '5Juww5SS6aLWxopXBAWzwqrwadiZKz7XpKAiktXTKcfBGi1DWg8',
        '5JnHjSFwe4r7xyqAUAaVs51G7HmzE86DWGa3VAA5VvQriGYnSUr',
        '5K4XZH5XR2By7Q5KTcZnPAmUMU5yjUNBdoKzzXyrLfmiEZJqoKE',
    ];
    const legacyPublicKeys = [
        'EOS7tgwU6E7pAUQJgqEJt66Yi8cWvanTUW8ZfBjeXeJBQvhTU9ypi',
        'EOS8VaY5CiTexYqgQZyPTJkc3qvWuZUi12QrZL9ssjqW2es6aQk2F',
        'EOS7VGhqctkKprW1VUj19DZZiiZLX3YcJqUJCuEcahJmUCw3wJEMu',
    ];
    const k1FormatPublicKeys = [
        'PUB_K1_7tgwU6E7pAUQJgqEJt66Yi8cWvanTUW8ZfBjeXeJBQvhYTBFvY',
        'PUB_K1_8VaY5CiTexYqgQZyPTJkc3qvWuZUi12QrZL9ssjqW2es7e7bRJ',
        'PUB_K1_7VGhqctkKprW1VUj19DZZiiZLX3YcJqUJCuEcahJmUCw9RT8v2',
    ];
    const signatures = [
        'SIG_K1_Kdj1FjezkWtNyGXE9S1stbZjFnbCffsmEdLLJ72bdtHXHwDjGVBZWPPVVhAJN4U67QK855nybaj6UGn86EUWqie1gLmKVa',
        'SIG_K1_KWYhhDoyoHa2gshpSJbmN3skAwHcyqh8kAnQJhEoRzf18281JvcmJiAp4QXbRyAS3D9or2DsmUnjoyeA8EZrYNRLRPkR4R',
        'SIG_K1_KAY1MqDu5Exve184p5svQiLQPtujDn9my3BwSbkAdv3TYV4t7L3WhHbEsF5zW1MkS3VMU6oTtQiVfa3AYZKpoQz49JD7bc',
    ];

    // These are simplified tests simply to verify a refactor didn't mess with existing code

    it('builds public keys from private when constructed', async () => {
        const provider = new JsSignatureProvider(privateKeys);
        const actualPublicKeys = await provider.getAvailableKeys();
        expect(actualPublicKeys).toEqual(k1FormatPublicKeys);
    });

    it('signs a transaction', async () => {
        const provider = new JsSignatureProvider(privateKeys);
        const chainId = '12345';
        const requiredKeys = k1FormatPublicKeys;
        const serializedTransaction = new Uint8Array([
            0, 16, 32, 128, 255,
        ]);

        const signOutput = await provider.sign(
            { chainId, requiredKeys, serializedTransaction } as SignatureProviderArgs
        );

        expect(signOutput).toEqual({
            signatures,
            serializedTransaction,
            serializedContextFreeData: undefined
        });
    });

    it('confirm elliptic conversion functions are actually reciprocal', async () => {
        const provider = new JsSignatureProvider(privateKeys);
        const chainId = '12345';
        const requiredKeys = k1FormatPublicKeys;
        const serializedTransaction = new Uint8Array([
            0, 16, 32, 128, 255,
        ]);

        const signOutput = await provider.sign(
            { chainId, requiredKeys, serializedTransaction } as SignatureProviderArgs
        );

        const sig: Signature = Signature.fromString(signOutput.signatures[0]);
        const ellipticSig: ec.Signature = sig.toElliptic();
        const eosSig = Signature.fromElliptic(ellipticSig);
        expect(sig).toEqual(eosSig);
    });

    it('verify a transaction', async () => {
        const provider = new JsSignatureProvider([privateKeys[0]]);
        const chainId = '12345';
        const requiredKeys = [k1FormatPublicKeys[0]];
        const serializedTransaction = new Uint8Array([
            0, 16, 32, 128, 255,
        ]);

        const signOutput = await provider.sign(
            { chainId, requiredKeys, serializedTransaction } as SignatureProviderArgs
        );

        const EC = new ec('secp256k1');
        const ellipticSig = Signature.fromString(signOutput.signatures[0]).toElliptic();
        expect(
            EC.verify(
                digestFromSerializedData(chainId, serializedTransaction),
                ellipticSig,
                PrivateKey.fromString(privateKeys[0]).toElliptic()
            )
        ).toEqual(true);
    });

    it('ensure public key functions are actual inverses of each other', async () => {
        const eosioPubKey = PublicKey.fromString(k1FormatPublicKeys[0]);
        const ellipticPubKey = eosioPubKey.toElliptic();
        const finalEosioKeyAsK1String = PublicKey.fromElliptic(ellipticPubKey).toString();
        expect(finalEosioKeyAsK1String).toEqual(k1FormatPublicKeys[0]);
    });

    it('verify that PUB_K1_ and Legacy pub formats are consistent', () => {
        const eosioLegacyPubKey = legacyPublicKeys[0];
        const ellipticPubKey = PublicKey.fromString(eosioLegacyPubKey).toElliptic();
        expect(PublicKey.fromElliptic(ellipticPubKey).toString()).toEqual(k1FormatPublicKeys[0]);
    });

    it('ensure private key functions are actual inverses of each other', async () => {
        const priv = privateKeys[0];
        const privEosioKey = PrivateKey.fromString(priv);
        const privEllipticKey = privEosioKey.toElliptic();
        const finalEosioKeyAsString = PrivateKey.fromElliptic(privEllipticKey).toString();
        expect(privEosioKey.toString()).toEqual(finalEosioKeyAsString);
    });
});
