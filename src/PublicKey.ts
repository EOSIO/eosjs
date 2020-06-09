import { ec as EC } from 'elliptic';
import {
    Key,
    KeyType,
    publicKeyToLegacyString,
    publicKeyToString,
    stringToPublicKey,
} from './eosjs-numeric';
import { constructElliptic } from './eosjs-key-conversions';

/** Represents/stores a public key and provides easy conversion for use with `elliptic` lib */
export class PublicKey {
    constructor(private key: Key, private ec: EC) {}

    /** Instantiate public key from an EOSIO-format public key */
    public static fromString(publicKeyStr: string, ec?: EC): PublicKey {
        const key = stringToPublicKey(publicKeyStr);
        if (!ec) {
            ec = constructElliptic(key.type);
        }
        return new PublicKey(key, ec);
    }

    /** Instantiate public key from an `elliptic`-format public key */
    public static fromElliptic(publicKey: EC.KeyPair, keyType: KeyType, ec?: EC): PublicKey {
        const x = publicKey.getPublic().getX().toArray('be', 32);
        const y = publicKey.getPublic().getY().toArray('be', 32);
        if (!ec) {
            ec = constructElliptic(keyType);
        }
        return new PublicKey({
            type: keyType,
            data: new Uint8Array([(y[31] & 1) ? 3 : 2].concat(x)),
        }, ec);
    }

    /** Export public key as EOSIO-format public key */
    public toString(): string {
        return publicKeyToString(this.key);
    }

    /** Export public key as Legacy EOSIO-format public key */
    public toLegacyString(): string {
        return publicKeyToLegacyString(this.key);
    }

    /** Export public key as `elliptic`-format public key */
    public toElliptic(): EC.KeyPair {
        return this.ec.keyPair({
            pub: Buffer.from(this.key.data),
        });
    }

    /** Get key type from key */
    public getType(): KeyType {
        return this.key.type;
    }

    /** Validate a public key */
    public isValid(): boolean {
        try {
            const ellipticPublicKey = this.toElliptic();
            const validationObj = ellipticPublicKey.validate();
            return validationObj.result;
        } catch {
            return false;
        }
    }
}
