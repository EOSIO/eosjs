import { ec } from 'elliptic';
import {
    stringToPrivateKey,
    KeyType,
    publicKeyToString
} from './eosjs-numeric';

export const ellipticPublicKeyObjectToEosioPublicKey = (publicKey: any, keyType: KeyType = KeyType.k1): string => {
    const x = publicKey.getX().toArray();
    const y = publicKey.getY().toArray();
    return publicKeyToString({
        type: keyType,
        data: new Uint8Array([(y[31] & 1) ? 3 : 2].concat(x)),
    });
};

export const eosioPrivateKeyToEllipticPrivateKeyObject = (e: ec, key: string): any => {
    const bin = stringToPrivateKey(key);
    if (bin.type !== KeyType.k1) {
        throw new Error('Key type isn\'t k1');
    }
    return e.keyFromPrivate(bin.data);
};
