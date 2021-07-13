/**
 * @module WebCrypto-Sig
 */
// copyright defined in eosjs/LICENSE.txt

import { ec } from 'elliptic';

import { SignatureProvider, SignatureProviderArgs } from './eosjs-api-interfaces';
import { PushTransactionArgs } from './eosjs-rpc-interfaces';
import {
    PrivateKey,
    PublicKey,
    Signature,
    generateWebCryptoKeyPair,
} from './eosjs-key-conversions';
import { convertLegacyPublicKey } from './eosjs-numeric';

const crypto = (typeof(window) !== 'undefined' ? window.crypto : require('crypto').webcrypto);

/** expensive to construct; so we do it once and reuse it */
const defaultEc = new ec('p256');

/** Construct the buffer from transaction details, web crypto will sign it */
const bufferFromSerializedData = (
    chainId: string,
    serializedTransaction: Uint8Array,
    serializedContextFreeData?: Uint8Array,
    e = defaultEc): Buffer => {
    const signBuf = Buffer.concat([
        Buffer.from(chainId, 'hex'),
        Buffer.from(serializedTransaction),
        Buffer.from(
            serializedContextFreeData ?
                new Uint8Array(e.hash().update(serializedContextFreeData).digest()) :
                new Uint8Array(32)
        ),
    ]);
    return signBuf;
};

/** Signs transactions using Web Crypto API private keys */
class WebCryptoSignatureProvider implements SignatureProvider {
    /** Map public key to private CryptoKey. User can populate this manually or use addCryptoKeyPair(). */
    public keys = new Map<string, CryptoKey>();

    /** Public keys as string array. User must populate this if not using addCryptoKeyPair() */
    public availableKeys = [] as string[];

    /** Add Web Crypto KeyPair to the `SignatureProvider` */
    public async addCryptoKeyPair({ privateKey, publicKey }: CryptoKeyPair): Promise<void> {
        const pubKey = await PublicKey.fromWebCrypto(publicKey);
        const publicKeyStr = pubKey.toString();
        this.keys.set(publicKeyStr, privateKey);
        this.availableKeys.push(publicKeyStr);
        return;
    };

    /** Public keys associated with the private keys that the `SignatureProvider` holds */
    public async getAvailableKeys(): Promise<string[]> {
        return this.availableKeys;
    }

    /** Sign a transaction */
    public async sign(
        { chainId, requiredKeys, serializedTransaction, serializedContextFreeData }: SignatureProviderArgs,
    ): Promise<PushTransactionArgs> {
        const buffer = bufferFromSerializedData( chainId, serializedTransaction, serializedContextFreeData, defaultEc);

        const signatures = [] as string[];
        for (const key of requiredKeys) {
            const publicKey = PublicKey.fromString(convertLegacyPublicKey(key));
            const privWebCrypto = this.keys.get(convertLegacyPublicKey(key));
            const webCryptoSig = await crypto.subtle.sign(
                {
                    name: 'ECDSA',
                    hash: {
                        name: 'SHA-256'
                    }
                },
                privWebCrypto,
                buffer
            );
            const signature = await Signature.fromWebCrypto(buffer, webCryptoSig, publicKey);
            signatures.push(signature.toString());
        }

        return { signatures, serializedTransaction, serializedContextFreeData };
    }
}

export {
    generateWebCryptoKeyPair,
    PrivateKey,
    PublicKey,
    Signature,
    bufferFromSerializedData,
    WebCryptoSignatureProvider,
};
