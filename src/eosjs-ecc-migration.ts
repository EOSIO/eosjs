import {PrivateKey, PublicKey, Signature} from './eosjs-jssig';
import {generateKeyPair} from './eosjs-key-conversions';
import {KeyType} from './eosjs-numeric';

export const ecc = {
    initialize: () => console.error('Method deprecated'),
    unsafeRandomKey: () => console.error('Method deprecated'),
    randomKey: (cpuEntropyBits?: number): Promise<string> => {
        if (cpuEntropyBits !== undefined) {
            console.warn('Argument `cpuEntropyBits` is deprecated, ' +
                'use the options argument instead');
        }

        const { privateKey } = generateKeyPair(KeyType.k1);
        return Promise.resolve(privateKey.toLegacyString());
    },
    seedPrivate: () => console.error('Method deprecated'),
    privateToPublic: (key: string, pubkey_prefix?: string): string => { // tslint:disable-line
        if (pubkey_prefix !== undefined) {
            console.warn('Argument `pubkey_prefix` is deprecated, ' +
                'keys prefixed with PUB_K1_/PUB_R1_/PUB_WA_ going forward');
        }

        const privateKey = PrivateKey.fromString(key);
        const publicKey = privateKey.getPublicKey();
        return publicKey.toLegacyString();
    },
    isValidPublic: (pubkey: string, pubkey_prefix?: string): boolean => { // tslint:disable-line
        if (pubkey_prefix !== undefined) {
            console.warn('Argument `pubkey_prefix` is deprecated, ' +
                'keys prefixed with PUB_K1_/PUB_R1_/PUB_WA_ going forward');
        }

        try {
            const publicKey = PublicKey.fromString(pubkey);
            return publicKey.isValid();
        } catch {
            return false;
        }
    },
    isValidPrivate: (wif: string): boolean => {
        try {
            const privateKey = PrivateKey.fromString(wif);
            return privateKey.isValid();
        } catch {
            return false;
        }
    },
    sign: (data: string|Buffer, privateKey: string|PrivateKey, encoding: string = 'utf8'): string => {
        const privKey = typeof privateKey === 'string' ? PrivateKey.fromString(privateKey) : privateKey;
        const signature = privKey.sign(data, true, encoding);
        return signature.toString();
    },
    signHash: (dataSha256: string|Buffer, privateKey: string|PrivateKey, encoding: string = 'hex') => {
        const privKey = typeof privateKey === 'string' ? PrivateKey.fromString(privateKey) : privateKey;
        const signature = privKey.sign(dataSha256, false, encoding);
        return signature.toString();
    },
    verify: (
        signature: string, data: string, pubKey: string|PublicKey, encoding: string = 'utf8', hashData: boolean = true
    ): boolean => {
        const publicKey = typeof pubKey === 'string' ? PublicKey.fromString(pubKey) : pubKey;
        const sig = Signature.fromString(signature);
        return sig.verify(data, publicKey, hashData, encoding);
    },
    recover: (signature: string, data: string, encoding: string = 'utf8'): string => {
        const sig = Signature.fromString(signature);
        const publicKey = sig.recover(data, true, encoding);
        return publicKey.toLegacyString();
    },
    recoverHash: (signature: string, dataSha256: string|Buffer, encoding: string = 'hex'): string => {
        const sig = Signature.fromString(signature);
        const publicKey = sig.recover(dataSha256, false, encoding);
        return publicKey.toLegacyString();
    },
    sha256: (data: string|Buffer, resultEncoding?: string, encoding?: string): string|Buffer => {
        if (encoding !== undefined) {
            console.warn('Argument `encoding` is deprecated');
        }
        if (resultEncoding !== undefined) {
            console.warn('Argument `resultEncoding` is deprecated');
        }

        return require('./eosjs-key-conversions').sha256(data);
    }
};
