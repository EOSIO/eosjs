/* eslint-disable @typescript-eslint/no-floating-promises */
import {ec as EC} from 'elliptic';
const { subtle, CryptoKey } = require('crypto').webcrypto;

import {generateKeyPair, generateWebCryptoKeyPair, PrivateKey, PublicKey, sha256, Signature} from '../eosjs-key-conversions';
import {digestFromSerializedData, JsSignatureProvider} from '../eosjs-jssig';
import {KeyType} from '../eosjs-numeric';
import {SignatureProviderArgs} from '../eosjs-api-interfaces';
import { WebCryptoSignatureProvider } from '../eosjs-webcrypto-sig';

describe('WebCryptoSignatureProvider', () => {

    it('generates a private and public key pair', async () => {
        const { privateKey, publicKey } = await generateWebCryptoKeyPair();

        expect(privateKey).toBeInstanceOf(CryptoKey);
        expect(privateKey.type).toEqual('private');
        expect(privateKey.extractable).toBeFalsy();
        expect(privateKey.algorithm).toEqual({ name: 'ECDSA', namedCurve: 'P-256' });
        expect(privateKey.usages).toEqual(['sign']);

        expect(publicKey).toBeInstanceOf(CryptoKey);
        expect(publicKey.type).toEqual('public');
        expect(publicKey.extractable).toBeTruthy();
        expect(publicKey.algorithm).toEqual({ name: 'ECDSA', namedCurve: 'P-256' });
        expect(publicKey.usages).toEqual(['verify']);
    });

    it('generates a private and public key pair with no usages', async () => {
        const {privateKey, publicKey} = await generateWebCryptoKeyPair([]);
        expect(privateKey.usages.length).toEqual(0);
        expect(publicKey).toBeInstanceOf(CryptoKey);
        expect(publicKey.usages.length).toEqual(0);
    });

    it('fails to convert private non-extractable CryptoKey to PrivateKey', async () => {
        const { privateKey } = await generateWebCryptoKeyPair();
        const convertPrivateKey = async (priv: CryptoKey) => {
            return await PrivateKey.fromWebCrypto(priv);
        };
        expect(convertPrivateKey(privateKey)).rejects.toThrow('Crypto Key is not extractable');
    });

    it('converts private extractable CryptoKey to PrivateKey', async () => {
        const { privateKey } = await subtle.generateKey(
            {
                name: 'ECDSA',
                namedCurve: 'P-256'
            },
            true,
            ['sign', 'verify']
        );
        const priv = await PrivateKey.fromWebCrypto(privateKey);
        expect(priv).toBeInstanceOf(PrivateKey);
    });

    it('fails to convert public non-extractable CryptoKey to PublicKey', async () => {
        const { publicKey: pub } = generateKeyPair(KeyType.r1, { secureEnv: true });
        const publicKey = await pub.toWebCrypto(false);
        expect(publicKey.extractable).toBeFalsy();
        const convertPublicKey = async (pubKey: CryptoKey) => {
            return await PublicKey.fromWebCrypto(pubKey);
        };
        expect(convertPublicKey(publicKey)).rejects.toThrow('Crypto Key is not extractable');
    });

    it('converts public extractable CryptoKey to PublicKey', async () => {
        const { publicKey } = await generateWebCryptoKeyPair();
        const pub = await PublicKey.fromWebCrypto(publicKey);
        expect(pub).toBeInstanceOf(PublicKey);
    });

    it('builds keys/availableKeys list from CryptoKeyPair with `addCryptoKeyPair`', async () => {
        const provider = new WebCryptoSignatureProvider();
        const cryptoKeyPair = await generateWebCryptoKeyPair();
        await provider.addCryptoKeyPair(cryptoKeyPair);
        const keys = await provider.getAvailableKeys();
        expect(provider.keys.size).toEqual(1);
        expect(keys.length).toEqual(1);
    });

    it('signs a transaction', async () => {
        const provider = new WebCryptoSignatureProvider();
        const { privateKey, publicKey } = await generateWebCryptoKeyPair();
        await provider.addCryptoKeyPair({ privateKey, publicKey });
        const pub = await PublicKey.fromWebCrypto(publicKey);
        const pubStr = pub.toString();
        const chainId = '12345';
        const requiredKeys = [ pubStr ];
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

    it('verify a signature constructed by Web Crypto', async () => {
        const provider = new WebCryptoSignatureProvider();
        const { privateKey, publicKey } = await generateWebCryptoKeyPair();
        await provider.addCryptoKeyPair({ privateKey, publicKey });
        const pub = await PublicKey.fromWebCrypto(publicKey);
        const pubStr = pub.toString();
        const chainId = '12345';
        const requiredKeys = [ pubStr ];
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
                pub,
                false
            )
        ).toEqual(true);
    });

    it('confirm a keyPair constructed from elliptic can be converted reciprocally', async () => {
        const ec = new EC('p256');
        const keyPairEc = ec.genKeyPair();
        const privateKey = PrivateKey.fromElliptic(keyPairEc, KeyType.r1, ec);
        const publicKey = PublicKey.fromElliptic(keyPairEc, KeyType.r1, ec);

        const webCryptoPriv = await privateKey.toWebCrypto(true);
        const webCryptoPub = await publicKey.toWebCrypto(true);

        const exportedPrivateKey = await PrivateKey.fromWebCrypto(webCryptoPriv);
        const exportedPublicKey = await PublicKey.fromWebCrypto(webCryptoPub);

        expect(exportedPrivateKey.toString()).toEqual(privateKey.toString());
        expect(exportedPublicKey.toString()).toEqual(publicKey.toString());
        expect(publicKey.isValid()).toBeTruthy();
        expect(exportedPublicKey.isValid()).toBeTruthy();
    });

    it('confirm a keyPair constructed from Web Crypto can be converted reciprocally', async () => {
        const ec = new EC('p256');
        const { privateKey, publicKey } = await subtle.generateKey(
            {
                name: 'ECDSA',
                namedCurve: 'P-256'
            },
            true,
            ['sign', 'verify']
        );

        const priv = await PrivateKey.fromWebCrypto(privateKey);
        const pub = await PublicKey.fromWebCrypto(publicKey);

        const privEc = priv.toElliptic();
        const pubEc = pub.toElliptic();

        const exportedPrivateKey = PrivateKey.fromElliptic(privEc, KeyType.r1, ec);
        const exportedPublicKey = PublicKey.fromElliptic(pubEc, KeyType.r1, ec);

        expect(exportedPrivateKey.toString()).toEqual(priv.toString());
        expect(exportedPublicKey.toString()).toEqual(pub.toString());
        expect(pub.isValid()).toBeTruthy();
        expect(exportedPublicKey.isValid()).toBeTruthy();
    });

    it('Ensure Web Crypt sign, recover, verify flow works', async () => {
        const { privateKey, publicKey } = await subtle.generateKey(
            {
                name: 'ECDSA',
                namedCurve: 'P-256'
            },
            true,
            ['sign', 'verify']
        );
        const priv = await PrivateKey.fromWebCrypto(privateKey);
        const pub = await PublicKey.fromWebCrypto(publicKey);

        const dataAsString = 'some string';
        const enc = new TextEncoder();
        const encoded = enc.encode(dataAsString);

        const sig = await priv.webCryptoSign(encoded);
        const recoveredPub = sig.recover(encoded, true);

        expect(recoveredPub.toString()).toEqual(pub.toString());
        expect(recoveredPub.isValid()).toBeTruthy();
        const valid = sig.verify(encoded, recoveredPub, true);
        expect(valid).toEqual(true);
    });

});
