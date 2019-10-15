import { ec } from 'elliptic';
import {
    Key,
    KeyType,
    privateKeyToString,
    stringToPrivateKey,
} from './eosjs-numeric';

/** Represents/stores a private key and provides easy conversion for use with `elliptic` lib */
export class PrivateKey {
    constructor(private key: Key) {}

    /** Instantiate private key from an `elliptic`-format private key */
    public static fromElliptic(privKey: ec.KeyPair, keyType = KeyType.k1): PrivateKey {
        const privArray = privKey.getPrivate().toArray();
        return new PrivateKey({
            type: keyType,
            data: privKey.getPrivate().toBuffer(),
        });
    }

    /** Instantiate private key from an EOSIO-format private key */
    public static fromString(keyString: string): PrivateKey {
        const key: Key = stringToPrivateKey(keyString);
        if (key.type !== KeyType.k1) {
            throw new Error('Key type isn\'t k1');
        }
        return new PrivateKey(key);
    }

    /** Export private key as `elliptic`-format private key */
    public toElliptic(ecurve?: ec) {
        /** expensive to construct; so we do it only as needed */
        if (!ecurve) {
            if (this.key.type === KeyType.r1) {
                ecurve = new ec('secp256r1') as any;
            } else {
                ecurve = new ec('secp256k1') as any;
            }
        }
        return ecurve.keyFromPrivate(this.key.data);
    }

    /** Export private key as EOSIO-format private key */
    public toString(): string {
        return privateKeyToString(this.key);
    }
}
