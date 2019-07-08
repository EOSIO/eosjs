/**
 * @module JS-Sig
 */
// copyright defined in eosjs/LICENSE.txt

import { ec } from 'elliptic';
import { SignatureProvider, SignatureProviderArgs } from './eosjs-api-interfaces';
import { convertLegacyPublicKey, signatureToString, KeyType } from './eosjs-numeric';
import { SerialBuffer } from './eosjs-serialize';

function hexToUint8Array(hex: string) {
    if (typeof hex !== 'string') {
        throw new Error('Expected string containing hex digits');
    }
    if (hex.length % 2) {
        throw new Error('Odd number of hex digits');
    }
    const l = hex.length / 2;
    const result = new Uint8Array(l);
    for (let i = 0; i < l; ++i) {
        const x = parseInt(hex.substr(i * 2, 2), 16);
        if (Number.isNaN(x)) {
            throw new Error('Expected hex string');
        }
        result[i] = x;
    }
    return result;
}

/** Signs transactions using in-process private keys */
export class JsSignatureProvider implements SignatureProvider {
    public elliptic = new ec('p256') as ec;

    /** map public to private keys */
    public keys = new Map<string, string>();

    /** public keys */
    public availableKeys = [] as string[];

    /** @param privateKeys private keys to sign with */
    constructor(privateKeys: string[]) {
        for (const k of privateKeys) {
            const pub = convertLegacyPublicKey(this.elliptic.keyFromPrivate(k).getPublic().toString());
            this.keys.set(pub, k);
            this.availableKeys.push(pub);
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
        const signBuf = Buffer.concat([
            new Buffer(chainId, 'hex'),
            new Buffer(serializedTransaction),
            new Buffer(
                serializedContextFreeData ?
                    hexToUint8Array(this.elliptic.hash(serializedContextFreeData)) :
                    new Uint8Array(32)
            ),
        ]);
        const signatures = requiredKeys.map(
            (pub) => {
                const keyPair = this.elliptic.keyFromPublic(this.keys.get(pub));
                const signature = this.elliptic.sign(signBuf, keyPair);
                const sigData = new SerialBuffer();
                sigData.push(signature.recoveryParam);
                sigData.pushArray(signature.r.toArray());
                sigData.pushArray(signature.s.toArray());
                return signatureToString({
                    type: KeyType.r1,
                    data: sigData.asUint8Array().slice()
                });
            });
        return { signatures, serializedTransaction, serializedContextFreeData };
    }
}
