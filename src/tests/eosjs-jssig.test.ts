import { ec } from 'elliptic';

import { Signature, PrivateKey, PublicKey } from '../eosjs-key-conversions';
import {
    JsSignatureProvider,
    digestFromSerializedData
} from '../eosjs-jssig';
import { KeyType } from '../eosjs-numeric';
import { SignatureProviderArgs } from '../eosjs-api-interfaces';

describe('JsSignatureProvider', () => {
    const privateKeys = [
        '5Juww5SS6aLWxopXBAWzwqrwadiZKz7XpKAiktXTKcfBGi1DWg8',
        '5JnHjSFwe4r7xyqAUAaVs51G7HmzE86DWGa3VAA5VvQriGYnSUr',
        '5K4XZH5XR2By7Q5KTcZnPAmUMU5yjUNBdoKzzXyrLfmiEZJqoKE',
    ];
    const privateKeysR1 = [
        'PVT_R1_GrfEfbv5at9kbeHcGagQmvbFLdm6jqEpgE1wsGbrfbZNjpVgT',
        'PVT_R1_wCpPsaY9o8NU9ZsuwaYVQUDkCfj1aWJZGVcmMM6XyYHJVqvqp',
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
    const r1FormatPublicKeys = [
        'PUB_R1_4ztaVy8L9zbmzTdpfq5GcaFYwGwXTNmN3qW7qcgHMmfUZhpzQQ',
        'PUB_R1_5xawnnr3mWayv2wkiqBGWqu4RQLNJffLSXHiL3BofdY7ortMy4',
    ];
    const signatures = [
        'SIG_K1_HKkqi3zray76i63ZQwAHWMjoLk3wTa1ajZWPcUnrhgmSWQYEHDJsxkny6VDTWEmVdfktxpGoTA81qe6QuCrDmazeQndmxh',
        'SIG_K1_HCaY9Y9qdjnkRhE9hokAyp3pFtkMmjpxF6xTd514Vo8vLVSWKek5m5aHfCaka9TqZUbajkhhd4BfBLxSwCwZUEmy8cvt1x',
        'SIG_K1_GrZqp9ZkuhBeNpeQ5b2L2UWUUrNU1gHbTyMzkyWRhiXNkxPP84Aq9eziU399eBf9xJw8MqHHjz7R2wMTMXhXjHLgpZYFeA',
    ];
    const eccSignatures = [
        'SIG_K1_KeEyJFpkp63Qq5E1zRD9aNZtTjpStvdkdnL31Z7wVmhYtrKGtpVdMBJnXyEUXNkNEyo4d4i4Q79qmRpCUsCRdFqhV6KAeF',
        'SIG_K1_JvgMmFSDhipS1SeBLNBMdAxayAsWS3GuVGSHS7YQth5Z5ZpijxnZgaa23dYD1efQhpEgtEggdRfHMmp31RDXjmJdZYoKLm',
        'SIG_K1_JwMqV2nbEntHSq9AuG3Zq1JBc5YqD2SftMHCTGK4A8DYGn1VPQ8QAduwCNksT5JhYgAmGMzPyJdZ2Ws4p8TCvQ16LeNhrw',
    ];

    // These are simplified tests simply to verify a refactor didn't mess with existing code
    describe('secp256k1 elliptic', () => {
        it('Retrieves the public key from a private key', () => {
            const privateKey = PrivateKey.fromString(privateKeys[0]);
            const publicKey = privateKey.getPublicKey();
            expect(publicKey.toString()).toEqual(k1FormatPublicKeys[0]);
        });

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
                signatures: expect.any(Array),
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
            const eosSig = Signature.fromElliptic(ellipticSig, KeyType.k1);
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

            const signature = Signature.fromString(signOutput.signatures[0]);
            expect(
                signature.verify(
                    digestFromSerializedData(chainId, serializedTransaction),
                    PublicKey.fromString(k1FormatPublicKeys[0])
                )
            ).toEqual(true);
        });

        it('ensure public key functions are actual inverses of each other', async () => {
            const eosioPubKey = PublicKey.fromString(k1FormatPublicKeys[0]);
            const ellipticPubKey = eosioPubKey.toElliptic();
            const finalEosioKeyAsK1String = PublicKey.fromElliptic(ellipticPubKey, KeyType.k1).toString();
            expect(finalEosioKeyAsK1String).toEqual(k1FormatPublicKeys[0]);
        });

        it('verify that PUB_K1_ and Legacy pub formats are consistent', () => {
            const eosioLegacyPubKey = legacyPublicKeys[0];
            const ellipticPubKey = PublicKey.fromString(eosioLegacyPubKey).toElliptic();
            expect(PublicKey.fromElliptic(ellipticPubKey, KeyType.k1).toString()).toEqual(k1FormatPublicKeys[0]);
        });

        it('ensure private key functions are actual inverses of each other', async () => {
            const priv = privateKeys[0];
            const privEosioKey = PrivateKey.fromString(priv);
            const privEllipticKey = privEosioKey.toElliptic();
            const finalEosioKeyAsString = PrivateKey.fromElliptic(privEllipticKey, KeyType.k1).toString();
            expect(privEosioKey.toString()).toEqual(finalEosioKeyAsString);
        });

        it('verify that public key validate function correctly assesses public keys', () => {
            const publicKey = PublicKey.fromString(k1FormatPublicKeys[0]);
            expect(publicKey.validate()).toEqual(true);
        });

        it('Ensure elliptic sign, recover, verify flow works', () => {
            const ellipticEc = new ec('secp256k1');
            const KPrivStr = privateKeys[0];
            const KPriv = PrivateKey.fromString(KPrivStr);

            const dataAsString = 'some string';
            const ellipticHashedString = ellipticEc.hash().update(dataAsString).digest();
            const sig = KPriv.sign(ellipticHashedString);
            const KPub = sig.recoverPublicKey(ellipticHashedString);

            expect(KPub.toString()).toEqual(k1FormatPublicKeys[0]);
            const valid = sig.verify(ellipticHashedString, KPub);
            expect(valid).toEqual(true);
        });
    });

    describe('p256 elliptic', () => {
        it('Retrieves the public key from a private key', () => {
            const privateKey = PrivateKey.fromString(privateKeysR1[0]);
            const publicKey = privateKey.getPublicKey();
            expect(publicKey.toString()).toEqual(r1FormatPublicKeys[0]);
        });

        it('builds public keys from private when constructed', async () => {
            const provider = new JsSignatureProvider(privateKeysR1);
            const actualPublicKeys = await provider.getAvailableKeys();
            expect(actualPublicKeys).toEqual(r1FormatPublicKeys);
        });

        it('signs a transaction', async () => {
            const provider = new JsSignatureProvider(privateKeysR1);
            const chainId = '12345';
            const requiredKeys = r1FormatPublicKeys;
            const serializedTransaction = new Uint8Array([
                0, 16, 32, 128, 255,
            ]);

            const signOutput = await provider.sign(
                { chainId, requiredKeys, serializedTransaction } as SignatureProviderArgs
            );

            expect(signOutput).toEqual({
                signatures: expect.any(Array),
                serializedTransaction,
                serializedContextFreeData: undefined
            });
        });

        it('confirm elliptic conversion functions are actually reciprocal', async () => {
            const provider = new JsSignatureProvider(privateKeysR1);
            const chainId = '12345';
            const requiredKeys = r1FormatPublicKeys;
            const serializedTransaction = new Uint8Array([
                0, 16, 32, 128, 255,
            ]);

            const signOutput = await provider.sign(
                { chainId, requiredKeys, serializedTransaction } as SignatureProviderArgs
            );

            const sig: Signature = Signature.fromString(signOutput.signatures[0]);
            const ellipticSig: ec.Signature = sig.toElliptic();
            const eosSig = Signature.fromElliptic(ellipticSig, KeyType.r1);
            expect(sig).toEqual(eosSig);
        });

        it('verify a transaction', async () => {
            const provider = new JsSignatureProvider([privateKeysR1[0]]);
            const chainId = '12345';
            const requiredKeys = [r1FormatPublicKeys[0]];
            const serializedTransaction = new Uint8Array([
                0, 16, 32, 128, 255,
            ]);

            const signOutput = await provider.sign(
                { chainId, requiredKeys, serializedTransaction } as SignatureProviderArgs
            );

            const signature = Signature.fromString(signOutput.signatures[0]);
            expect(
                signature.verify(
                    digestFromSerializedData(chainId, serializedTransaction),
                    PublicKey.fromString(r1FormatPublicKeys[0])
                )
            ).toEqual(true);
        });

        it('ensure public key functions using p256 format are actual inverses of each other', async () => {
            const eosioPubKey = PublicKey.fromString(r1FormatPublicKeys[0]);
            const ellipticPubKey = eosioPubKey.toElliptic();
            const finalEosioKeyAsR1String = PublicKey.fromElliptic(ellipticPubKey, KeyType.r1).toString();
            expect(finalEosioKeyAsR1String).toEqual(r1FormatPublicKeys[0]);
        });

        it('ensure private key functions using p256 format are actual inverses of each other', async () => {
            const priv = privateKeysR1[0];
            const privEosioKey = PrivateKey.fromString(priv);
            const privEllipticKey = privEosioKey.toElliptic();
            const finalEosioKeyAsString = PrivateKey.fromElliptic(privEllipticKey, KeyType.r1).toString();
            expect(privEosioKey.toString()).toEqual(finalEosioKeyAsString);
        });

        it('verify that public key validate function correctly assesses public keys', () => {
            const publicKey = PublicKey.fromString(r1FormatPublicKeys[0]);
            expect(publicKey.validate()).toEqual(true);
        });

        it('Ensure elliptic sign, recover, verify flow works', () => {
            const ellipticEc = new ec('p256');
            const KPrivStr = privateKeysR1[0];
            const KPriv = PrivateKey.fromString(KPrivStr);

            const dataAsString = 'some string';
            const ellipticHashedString = ellipticEc.hash().update(dataAsString).digest();
            const sig = KPriv.sign(ellipticHashedString);
            const KPub = sig.recoverPublicKey(ellipticHashedString);

            expect(KPub.toString()).toEqual(r1FormatPublicKeys[0]);
            const valid = sig.verify(ellipticHashedString, KPub);
            expect(valid).toEqual(true);
        });
    });
});
