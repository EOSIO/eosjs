import { ec } from 'elliptic';
import {
    Key,
    KeyType,
    publicKeyToString,
    stringToPublicKey,
} from './eosjs-numeric';

/** Represents/stores a public key and provides easy conversion for use with `elliptic` lib */
export class PublicKey {
    constructor(private key: Key) {}

    /** Instantiate public key from an EOSIO-format public key */
    public static fromString(publicKeyStr: string): PublicKey {
        return new PublicKey(stringToPublicKey(publicKeyStr));
    }

    /** Instantiate public key from an `elliptic`-format public key */
    public static fromElliptic(publicKey: ec.KeyPair, keyType: KeyType = KeyType.k1): PublicKey {
        const x = publicKey.getPublic().getX().toArray();
        const y = publicKey.getPublic().getY().toArray();
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
    public toElliptic(ecurve?: ec): ec.KeyPair {
        /** expensive to construct; so we do it only as needed */
        if (!ecurve) {
            if (this.key.type === KeyType.r1) {
                ecurve = new ec('secp256r1') as any;
            } else {
                ecurve = new ec('secp256k1') as any;
            }
        }
        return ecurve.keyPair({
            pub: new Buffer(this.key.data),
        });
    }
}
