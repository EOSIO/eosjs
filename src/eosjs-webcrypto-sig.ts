/**
 * @module WebCrypto-Sig
 */
// copyright defined in eosjs/LICENSE.txt

import { ec } from 'elliptic';

import { SignatureProvider, SignatureProviderArgs } from './eosjs-api-interfaces';
import { PushTransactionArgs } from './eosjs-rpc-interfaces';
import { PublicKey } from './PublicKey';
import { Signature } from './Signature';
import { convertLegacyPublicKey } from './eosjs-numeric';

/** expensive to construct; so we do it once and reuse it */
const defaultEc = new ec('p256');

/** Construct the buffer from transaction details, web crypto will sign it */
export const bufferFromSerializedData = (
    chainId: string,
    serializedTransaction: Uint8Array,
    serializedContextFreeData?: Uint8Array,
    e = defaultEc
): Buffer => {
    const signBuf = Buffer.concat([
        Buffer.from(chainId, 'hex'),
        Buffer.from(serializedTransaction),
        Buffer.from(
            serializedContextFreeData
                ? new Uint8Array(e.hash().update(serializedContextFreeData).digest())
                : new Uint8Array(32)
        ),
    ]);
    return signBuf;
};

/** Signs transactions using Web Crypto API private keys */
export class WebCryptoSignatureProvider implements SignatureProvider {
    /** Map public key to private CryptoKey. User must populate this. */
    public keys = new Map<string, CryptoKey>();

    /** public keys */
    public availableKeys = [] as string[];

    /** Public keys associated with the private keys that the `SignatureProvider` holds */
    public async getAvailableKeys(): Promise<string[]> {
        return this.availableKeys;
    }

    /** Sign a transaction */
    public async sign({
        chainId,
        requiredKeys,
        serializedTransaction,
        serializedContextFreeData,
    }: SignatureProviderArgs): Promise<PushTransactionArgs> {
        const digest = bufferFromSerializedData(
            chainId,
            serializedTransaction,
            serializedContextFreeData,
            defaultEc
        );

        const signatures = [] as string[];
        for (const key of requiredKeys) {
            const publicKey = PublicKey.fromString(convertLegacyPublicKey(key));
            const privWebCrypto = this.keys.get(convertLegacyPublicKey(key));
            const webCryptoSig = await crypto.subtle.sign(
                {
                    name: 'ECDSA',
                    hash: {
                        name: 'SHA-256',
                    },
                },
                privWebCrypto,
                digest
            );
            const signature = Signature.fromWebCrypto(digest, webCryptoSig, publicKey, defaultEc);
            signatures.push(signature.toString());
        }

        return { signatures, serializedTransaction, serializedContextFreeData };
    }
}
