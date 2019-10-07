import { ec, curve } from 'elliptic';
import {
    Key,
    KeyType,
    publicKeyToString,
} from './eosjs-numeric';

// eosioPublicKeyToEllipticPublicKeyObject
// PublicKey.fromString(key).toElliptic()

// ellipticPublicKeyObjectToEosioPublicKey
export class PublicKey {
    /** expensive to construct; so we do it once and reuse it */
    private e = new ec('secp256k1') as any;

    constructor(private key: Key) {}

    public static fromEllipticKey(publicKey: curve.base.BasePoint, keyType: KeyType): PublicKey {
        const x = publicKey.getX().toArray();
        const y = publicKey.getY().toArray();
        if (!keyType) {
            keyType = KeyType.k1;
        }
        return new PublicKey({
            type: keyType,
            data: new Uint8Array([(y[31] & 1) ? 3 : 2].concat(x)),
        });
    }

    public toString (): string {
        return publicKeyToString(this.key);
    }
}
