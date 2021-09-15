import {ec as EC} from 'elliptic';
import { KeyType } from './eosjs-numeric';
import { PublicKey } from './PublicKey';
import { PrivateKey } from './PrivateKey';

const crypto = (typeof(window) !== 'undefined' ? window.crypto : require('crypto').webcrypto);

export interface CryptoKeyPair {
    privateKey: CryptoKey;
    publicKey: CryptoKey;
}

export const generateKeyPair = (
    type: KeyType, options: { secureEnv?: boolean, ecOptions?: EC.GenKeyPairOptions } = {}
): { publicKey: PublicKey, privateKey: PrivateKey } => {
    if (!options.secureEnv) {
        throw new Error('Key generation is completely INSECURE in production environments in the browser. ' +
            'If you are absolutely certain this does NOT describe your environment, set `secureEnv` in your ' +
            'options to `true`.  If this does describe your environment and you set `secureEnv` to `true`, ' +
            'YOU DO SO AT YOUR OWN RISK AND THE RISK OF YOUR USERS.');
    }
    let ec;
    if (type === KeyType.k1) {
        ec = new EC('secp256k1');
    } else {
        ec = new EC('p256');
    }
    const ellipticKeyPair = ec.genKeyPair(options.ecOptions);
    const publicKey = PublicKey.fromElliptic(ellipticKeyPair, type, ec);
    const privateKey = PrivateKey.fromElliptic(ellipticKeyPair, type, ec);
    return {publicKey, privateKey};
};

/** Construct a p256/secp256r1 CryptoKeyPair from Web Crypto
 * Note: While creating a key that is not extractable means that it would not be possible
 * to convert the private key to string, it is not necessary to have the key extractable
 * for the Web Crypto Signature Provider.  Additionally, creating a key that is extractable
 * introduces security concerns.  For this reason, this function only creates CryptoKeyPairs
 * where the private key is not extractable and the public key is extractable.
 */
export const generateWebCryptoKeyPair = async (
    keyUsage: KeyUsage[] = ['sign', 'verify']
): Promise<CryptoKeyPair> => {
    return await crypto.subtle.generateKey(
        {
            name: 'ECDSA',
            namedCurve: 'P-256'
        },
        false,
        keyUsage
    );
};
