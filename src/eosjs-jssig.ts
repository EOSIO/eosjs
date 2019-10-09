/**
 * @module JS-Sig
 */
// copyright defined in eosjs/LICENSE.txt

import { SignatureProvider, SignatureProviderArgs } from './eosjs-api-interfaces';
import {
    PrivateKey,
    PublicKey,
    Signature,
} from './eosjs-key-conversions';
import {
    convertLegacyPublicKey,
    digestFromSerializedData,
    KeyType,
} from './eosjs-numeric';

import { ec } from 'elliptic';

/** Signs transactions using in-process private keys */
export class JsSignatureProvider implements SignatureProvider {
    /** map public to private keys */
    public keys = new Map<string, string>();

    /** public keys */
    public availableKeys = [] as string[];

    /** expensive to construct; so we do it once and reuse it */
    private e = new ec('secp256k1') as any;

    /** @param privateKeys private keys to sign with */
    constructor(privateKeys: string[]) {
        for (const k of privateKeys) {
            // What is there to do about this 'as any'?
            const priv = PrivateKey.fromString(k).toElliptic() as any;
            const pubStr = PublicKey.fromElliptic(priv, KeyType.k1).toString();
            this.keys.set(pubStr, priv);
            this.availableKeys.push(pubStr);
        }
    }

    /** Public keys associated with the private keys that the `SignatureProvider` holds */
    public async getAvailableKeys() {
        return this.availableKeys;
    }

    /** Sign a transaction */
    public async sign(
        { chainId, requiredKeys, serializedTransaction, serializedContextFreeData }: SignatureProviderArgs,
    ) {
        const digest = digestFromSerializedData( chainId, serializedTransaction, serializedContextFreeData, this.e);

        const signatures = [] as string[];
        for (const key of requiredKeys) {
            const privKey = this.keys.get(convertLegacyPublicKey(key)) as any;
            let tries = 0;
            let sig: Signature;
            const isCanonical = (sigData: Uint8Array) =>
                !(sigData[1] & 0x80) && !(sigData[1] === 0 && !(sigData[2] & 0x80))
                && !(sigData[33] & 0x80) && !(sigData[33] === 0 && !(sigData[34] & 0x80));

            do {
                const ellipticSig = privKey.sign(digest, { canonical: true, pers: [++tries] });
                sig = Signature.fromElliptic(ellipticSig);
            } while (!isCanonical(sig.toBinary()));

            signatures.push(sig.toString());
        }

        return { signatures, serializedTransaction, serializedContextFreeData };
    }
}
