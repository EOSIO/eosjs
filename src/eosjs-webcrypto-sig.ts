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
} from './eosjs-key-conversions';
import { convertLegacyPublicKey } from './eosjs-numeric';

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

/** Signs transactions using in-process private keys */
class WebCryptoSignatureProvider implements SignatureProvider {
    /** map public to private keys */
    public keys = new Map<string, PrivateKey>();

    /** public keys */
    public availableKeys = [] as string[];

    /** @param privateKeys private keys to sign with */
    constructor(privateKeys: string[]) {
        for (const k of privateKeys) {
            const privateKey = PrivateKey.fromString(k);
            const publicKey = privateKey.getPublicKey().toString();
            this.keys.set(publicKey, privateKey);
            this.availableKeys.push(publicKey);
        }
    }

    /** Public keys associated with the private keys that the `SignatureProvider` holds */
    public async getAvailableKeys(): Promise<string[]> {
        return this.availableKeys;
    }

    /** Sign a transaction */
    public async sign(
        { chainId, requiredKeys, serializedTransaction, serializedContextFreeData }: SignatureProviderArgs,
    ): Promise<PushTransactionArgs> {
        const digest = bufferFromSerializedData( chainId, serializedTransaction, serializedContextFreeData, defaultEc);

        const signatures = [] as string[];
        for (const key of requiredKeys) {
            const privateKey = this.keys.get(convertLegacyPublicKey(key));
            const signature = privateKey.webCryptoSign(digest);
            signatures.push(signature.toString());
        }

        return { signatures, serializedTransaction, serializedContextFreeData };
    }
}

export {
    PrivateKey,
    PublicKey,
    Signature,
    bufferFromSerializedData,
    WebCryptoSignatureProvider,
};
