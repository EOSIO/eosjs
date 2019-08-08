/**
 * @module JS-Sig
 */
// copyright defined in eosjs/LICENSE.txt

import { SignatureProvider, SignatureProviderArgs } from './eosjs-api-interfaces';
import {
    signatureToString, stringToPrivateKey, KeyType, convertLegacyPublicKey,
    publicKeyToString
} from './eosjs-numeric';
import { ec } from 'elliptic';

/** Signs transactions using in-process private keys */
export class JsSignatureProvider implements SignatureProvider {
    /** map public to private keys */
    public keys = new Map<string, string>();

    /** public keys */
    public availableKeys = [] as string[];

    /** @param privateKeys private keys to sign with */
    constructor(privateKeys: string[]) {
        const e = new ec('secp256k1') as any;
        for (const k of privateKeys) {
            const bin = stringToPrivateKey(k);
            if (bin.type !== KeyType.k1) {
                throw new Error('Key type isn\'t k1');
            }
            const priv = e.keyFromPrivate(bin.data);
            const pub = priv.getPublic();
            const x = pub.getX().toArray();
            const y = pub.getY().toArray();
            const pubStr = publicKeyToString({
                type: KeyType.k1,
                data: new Uint8Array([(y[31] & 1) ? 3 : 2].concat(x)),
            });
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
        { chainId, requiredKeys, serializedTransaction, serializedContextFreeData }: SignatureProviderArgs
    ) {
        const e = new ec('secp256k1') as any;
        const signBuf = Buffer.concat([
            new Buffer(chainId, 'hex'),
            new Buffer(serializedTransaction),
            new Buffer(
                serializedContextFreeData ?
                    new Uint8Array(e.hash(serializedContextFreeData).update(serializedContextFreeData).digest()) :
                    new Uint8Array(32)
            ),
        ]);
        const digest = e.hash().update(signBuf).digest();

        const signatures = [] as string[];
        for (const key of requiredKeys) {
            const privKey = this.keys.get(convertLegacyPublicKey(key)) as any;
            const sig = privKey.sign(digest, { canonical: true });
            // console.log('check:', sig.s.cmp(privKey.ec.nh) <= 0);
            const r = sig.r.toArray();
            const s = sig.s.toArray();
            const sigData = new Uint8Array([sig.recoveryParam + 27 + 4].concat(r, s));
            const sigStr = signatureToString({
                type: KeyType.k1,
                data: sigData,
            });
            signatures.push(sigStr);
        }

        return { signatures, serializedTransaction, serializedContextFreeData };
    }
}
