import { BNInput, ec as EC } from 'elliptic';
import {
    Key,
    KeyType,
    privateKeyToString,
    stringToPrivateKey,
} from './eosjs-numeric';
import { Signature } from './Signature';

/** Represents/stores a private key and provides easy conversion for use with `elliptic` lib */
export class PrivateKey {
    constructor(private key: Key, private ec: EC) {}

    /** Instantiate private key from an `elliptic`-format private key */
    public static fromElliptic(privKey: EC.KeyPair, keyType: KeyType): PrivateKey {
        return new PrivateKey({
            type: keyType,
            data: privKey.getPrivate().toBuffer(),
        }, constructElliptic(keyType));
    }

    /** Instantiate private key from an EOSIO-format private key */
    public static fromString(keyString: string): PrivateKey {
        const privateKey = stringToPrivateKey(keyString);
        return new PrivateKey(privateKey, constructElliptic(privateKey.type));
    }

    /** Export private key as `elliptic`-format private key */
    public toElliptic() {
        return this.ec.keyFromPrivate(this.key.data);
    }

    /** Export private key as EOSIO-format private key */
    public toString(): string {
        return privateKeyToString(this.key);
    }

    /** Get key type from key */
    public getType(): KeyType {
        return this.key.type;
    }

    /** Sign a message digest with private key */
    public sign(digest: BNInput): Signature {
        let tries = 0;
        let signature: Signature;
        const isCanonical = (sigData: Uint8Array) =>
            !(sigData[1] & 0x80) && !(sigData[1] === 0 && !(sigData[2] & 0x80))
            && !(sigData[33] & 0x80) && !(sigData[33] === 0 && !(sigData[34] & 0x80));
        const constructSignature = (options: EC.SignOptions) => {
            const ellipticPrivateKey = this.toElliptic();
            const ellipticSignature = ellipticPrivateKey.sign(digest, options);
            return Signature.fromElliptic(ellipticSignature, this.getType());
        };

        if (this.key.type === KeyType.k1) {
            do {
                signature = constructSignature({canonical: true, pers: [++tries]});
            } while (!isCanonical(signature.toBinary()));
        } else {
            signature = constructSignature({});
        }
        return signature;
    }
}

/** Construct the elliptic curve object based on key type */
const constructElliptic = (type: KeyType): EC => {
    if (type === KeyType.k1) {
        return new EC('secp256k1') as any;
    }
    return new EC('p256') as any;
};
