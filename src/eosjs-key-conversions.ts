import {ec as EC} from 'elliptic';
import * as hash from 'hash.js';
import { KeyType } from './eosjs-numeric';

export { PrivateKey } from './PrivateKey';
export { PublicKey } from './PublicKey';
export { Signature } from './Signature';
export {
    generateKeyPair,
    generateWebCryptoKeyPair,
} from './KeyUtil';

/** Construct the elliptic curve object based on key type */
export const constructElliptic = (type: KeyType): EC => {
    if (type === KeyType.k1) {
        return new EC('secp256k1');
    }
    return new EC('p256');
};

export const sha256 = (data: string|Buffer): number[]|string => {
    return hash.sha256().update(data).digest();
};
