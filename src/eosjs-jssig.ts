/**
 * @module JS-Sig
 */
// copyright defined in eosjs/LICENSE.txt

import { SignatureProvider, SignatureProviderArgs } from './eosjs-api-interfaces';
import {
    signatureToString, KeyType, convertLegacyPublicKey,
} from './eosjs-numeric';
import {
  eosioPrivateKeyToEllipticPrivateKeyObject,
  ellipticPublicKeyObjectToEosioPublicKey,
} from './eosjs-key-conversions';
import { ec } from 'elliptic';

/** Signs transactions using in-process private keys */
export class JsSignatureProvider implements SignatureProvider {
    /** expensive to construct; so we do it once and reuse it */
    private e = new ec('secp256k1') as any;

    /** map public to private keys */
    public keys = new Map<string, string>();

    /** public keys */
    public availableKeys = [] as string[];

    /** @param privateKeys private keys to sign with */
    constructor(privateKeys: string[]) {
        for (const k of privateKeys) {
            const priv = eosioPrivateKeyToEllipticPrivateKeyObject(this.e, k);
            const pubStr = ellipticPublicKeyObjectToEosioPublicKey(priv.getPublic());
            this.keys.set(pubStr, priv);
            this.availableKeys.push(pubStr);
        }
    }

    /** Public keys associated with the private keys that the `SignatureProvider` holds */
    public async getAvailableKeys() {
        return this.availableKeys;
    }

    public ellipticSignatureToEosioSignatureString(ellipticSignature: ec.Signature) {
        const r = ellipticSignature.r.toArray();
        const s = ellipticSignature.s.toArray();
        const sigData = new Uint8Array([ellipticSignature.recoveryParam + 27 + 4].concat(r, s));
        const eosioSigStr = signatureToString({
            type: KeyType.k1,
            data: sigData,
        });
        return eosioSigStr;
    }

    /** Sign a transaction */
    public async sign(
        { chainId, requiredKeys, serializedTransaction, serializedContextFreeData }: SignatureProviderArgs
    ) {
        const signBuf = Buffer.concat([
            new Buffer(chainId, 'hex'),
            new Buffer(serializedTransaction),
            new Buffer(
                serializedContextFreeData ?
                    new Uint8Array(this.e.hash(serializedContextFreeData).update(serializedContextFreeData).digest()) :
                    new Uint8Array(32)
            ),
        ]);
        const digest = this.e.hash().update(signBuf).digest();

        const signatures = [] as string[];
        for (const key of requiredKeys) {
            const privKey = this.keys.get(convertLegacyPublicKey(key)) as any;
            let tries = 0;
            let sigData: Uint8Array;
            const isCanonical = () =>
                !(sigData[1] & 0x80) && !(sigData[1] === 0 && !(sigData[2] & 0x80))
                && !(sigData[33] & 0x80) && !(sigData[33] === 0 && !(sigData[34] & 0x80));

            let sig;
            do {
                sig = privKey.sign(digest, { canonical: true, pers: [++tries] });
                const r = sig.r.toArray();
                const s = sig.s.toArray();
                sigData = new Uint8Array([sig.recoveryParam + 27 + 4].concat(r, s));
            } while (!isCanonical());

            const sigStr = signatureToString({
                type: KeyType.k1,
                data: sigData,
            });
            signatures.push(sigStr);
        }

        return { signatures, serializedTransaction, serializedContextFreeData };
    }
}
