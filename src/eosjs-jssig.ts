/**
 * @module JS-Sig
 */
// copyright defined in eosjs/LICENSE.txt

import { ec } from 'elliptic';

import { SignatureProvider, SignatureProviderArgs } from './eosjs-api-interfaces';
import {
    PrivateKey,
    PublicKey,
    Signature,
} from './eosjs-key-conversions';
import {
    convertLegacyPublicKey,
    KeyType,
} from './eosjs-numeric';

/** expensive to construct; so we do it once and reuse it */
const defaultEc = new ec('secp256k1') as any;

/** Construct the digest from transaction details */
function digestFromSerializedData(
    chainId: string,
    serializedTransaction: Uint8Array,
    serializedContextFreeData?: Uint8Array,
    e = defaultEc) {
    const signBuf = Buffer.concat([
        new Buffer(chainId, 'hex'),
        new Buffer(serializedTransaction),
        new Buffer(
            serializedContextFreeData ?
                new Uint8Array(e.hash(serializedContextFreeData).update(serializedContextFreeData).digest()) :
                new Uint8Array(32)
        ),
    ]);
    return e.hash().update(signBuf).digest();
}

/** Signs transactions using in-process private keys */
class JsSignatureProvider implements SignatureProvider {
    /** map public to private keys */
    public keys = new Map<string, ec.KeyPair>();

    /** public keys */
    public availableKeys = [] as string[];

    /** @param privateKeys private keys to sign with */
    constructor(privateKeys: string[]) {
        for (const k of privateKeys) {
            const priv = PrivateKey.fromString(k);
            const privElliptic = priv.toElliptic();
            const pubStr = PublicKey.fromElliptic(privElliptic, priv.getType()).toString();
            this.keys.set(pubStr, privElliptic);
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
        const digest = digestFromSerializedData( chainId, serializedTransaction, serializedContextFreeData, defaultEc);

        const signatures = [] as string[];
        for (const key of requiredKeys) {
            const publicKey = PublicKey.fromString(key);
            const privKey = this.keys.get(convertLegacyPublicKey(key));
            let tries = 0;
            let sig: Signature;
            const isCanonical = (sigData: Uint8Array) =>
                !(sigData[1] & 0x80) && !(sigData[1] === 0 && !(sigData[2] & 0x80))
                && !(sigData[33] & 0x80) && !(sigData[33] === 0 && !(sigData[34] & 0x80));

            do {
                const ellipticSig = privKey.sign(digest, { canonical: true, pers: [++tries] });
                sig = Signature.fromElliptic(ellipticSig, publicKey.getType());
            } while (!isCanonical(sig.toBinary()));

            signatures.push(sig.toString());
        }

        return { signatures, serializedTransaction, serializedContextFreeData };
    }
}

export {
    PrivateKey,
    PublicKey,
    Signature,
    digestFromSerializedData,
    JsSignatureProvider,
};
