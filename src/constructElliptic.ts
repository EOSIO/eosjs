import {ec as EC} from 'elliptic';
import {KeyType} from './eosjs-numeric';

/** Construct the elliptic curve object based on key type */
export const constructElliptic = (type: KeyType): EC => {
  if (type === KeyType.k1) {
      return new EC('secp256k1');
  }
  return new EC('p256');
};