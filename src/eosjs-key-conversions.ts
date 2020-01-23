import {ec as EC} from 'elliptic';
import {KeyType} from './eosjs-numeric';

export { PrivateKey } from './PrivateKey';
export { PublicKey } from './PublicKey';
export { Signature } from './Signature';

/** Construct the elliptic curve object based on key type */
export const constructElliptic = (type: KeyType): EC => {
    if (type === KeyType.k1) {
        return new EC('secp256k1') as any;
    }
    return new EC('p256') as any;
};
