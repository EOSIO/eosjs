import { ec, curve } from 'elliptic';
import {
    Key,
    KeyType,
    publicKeyToString,
    stringToPublicKey,
} from './eosjs-numeric';

/** Represents/stores a public key and provides easy conversion for use with `elliptic` lib */
export class PublicKey {
    /** expensive to construct; so we do it once and reuse it */
    private e = new ec('secp256k1');

    constructor(private key: Key) {}

    /** Instantiate public key from an EOSIO-format public key */
    public static fromString(publicKeyStr: string): PublicKey {
        return new PublicKey(stringToPublicKey(publicKeyStr));
    }

    /** Instantiate public key from an `elliptic`-format public key */
    public static fromElliptic(publicKey: ec.KeyPair, keyType: KeyType = KeyType.k1): PublicKey {
        const x = publicKey.getPublic().getX().toArray();
        const y = publicKey.getPublic().getY().toArray();
        if (!keyType) {
            keyType = KeyType.k1;
        }
        return new PublicKey({
            type: keyType,
            data: new Uint8Array([(y[31] & 1) ? 3 : 2].concat(x)),
        });
    }

    /** Export public key as EOSIO-format public key */
    public toString(): string {
        return publicKeyToString(this.key);
    }

    /** Export public key as `elliptic`-format public key */
    public toElliptic(): ec.KeyPair {
        return this.e.keyPair({
            pub: new Buffer(this.key.data),
        });
    }
}
