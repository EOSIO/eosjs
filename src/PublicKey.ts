import { ec, curve } from 'elliptic';
import {
    Key,
    KeyType,
    publicKeyToString,
    stringToPublicKey,
} from './eosjs-numeric';

// eosioPublicKeyToEllipticPublicKeyObject
// PublicKey.fromString(key).toElliptic()

// ellipticPublicKeyObjectToEosioPublicKey
export class PublicKey {
    /** expensive to construct; so we do it once and reuse it */
    private e = new ec('secp256k1');

    constructor(private key: Key) {}

    public static fromString(publicKeyStr: string): PublicKey {
        return new PublicKey(stringToPublicKey(publicKeyStr));
    }

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

    public toString(): string {
        return publicKeyToString(this.key);
    }

    public toElliptic(): ec.KeyPair {
        return this.e.keyPair({
            pub: new Buffer(this.key.data),
        });
    }
}
