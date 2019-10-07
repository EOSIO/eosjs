import { ec } from 'elliptic';
import {
    stringToPrivateKey,
    Key,
    KeyType,
} from './eosjs-numeric';

// ellipticPrivateKeyObjectToEosioPrivateKey
// PrivateKey.fromElliptic(key).toString()

// eosioPrivateKeyToEllipticPrivateKeyObject
export class PrivateKey {

    constructor(private key: Key) {}

    // static fromElliptic(key: ec.KeyPair): PrivateKey {
    //     return new PrivateKey(key.getPrivate().toString())
    // }

    public static fromString(keyString: string): PrivateKey {
        const key: Key = stringToPrivateKey(keyString);
        if (key.type !== KeyType.k1) {
            throw new Error('Key type isn\'t k1');
        }
        return new PrivateKey(key);
    }

    public toElliptic() {
        /** expensive to construct; so we do it when needed */
        let e: ec;
        if (this.key.type === KeyType.r1) {
            e = new ec('secp256r1') as any;
        } else {
            e = new ec('secp256k1') as any;
        }
        return e.keyFromPrivate(this.key.data);
    }

    // public toString(): string {

    // }
}
