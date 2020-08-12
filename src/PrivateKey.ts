import { BNInput, ec as EC } from 'elliptic';
import {
    Key,
    KeyType,
    privateKeyToLegacyString,
    privateKeyToString,
    stringToPrivateKey,
} from './eosjs-numeric';
import { constructElliptic, PublicKey, Signature } from './eosjs-key-conversions';

/** Represents/stores a private key and provides easy conversion for use with `elliptic` lib */
export class PrivateKey {
    constructor(private key: Key, private ec: EC) {}

    /** Instantiate private key from an `elliptic`-format private key */
    public static fromElliptic(privKey: EC.KeyPair, keyType: KeyType, ec?: EC): PrivateKey {
        if (!ec) {
            ec = constructElliptic(keyType);
        }
        return new PrivateKey({
            type: keyType,
            data: privKey.getPrivate().toArrayLike(Buffer, 'be', 32),
        }, ec);
    }

    /** Instantiate private key from an EOSIO-format private key */
    public static fromString(keyString: string, ec?: EC): PrivateKey {
        const privateKey = stringToPrivateKey(keyString);
        if (!ec) {
            ec = constructElliptic(privateKey.type);
        }
        return new PrivateKey(privateKey, ec);
    }

    /** Export private key as `elliptic`-format private key */
    public toElliptic() {
        return this.ec.keyFromPrivate(this.key.data);
    }

    public toLegacyString(): string {
        return privateKeyToLegacyString(this.key);
    }

    /** Export private key as EOSIO-format private key */
    public toString(): string {
        return privateKeyToString(this.key);
    }

    /** Get key type from key */
    public getType(): KeyType {
        return this.key.type;
    }

    /** Retrieve the public key from a private key */
    public getPublicKey(): PublicKey {
        const ellipticPrivateKey = this.toElliptic();
        return PublicKey.fromElliptic(ellipticPrivateKey, this.getType(), this.ec);
    }

    /** Sign a message or hashed message digest with private key */
    public sign(data: BNInput, shouldHash: boolean = true, encoding: BufferEncoding = 'utf8'): Signature {
        if (shouldHash) {
            if (typeof data === 'string') {
                data = Buffer.from(data, encoding);
            }
            data = this.ec.hash().update(data).digest();
        }
        let tries = 0;
        let signature: Signature;
        const isCanonical = (sigData: Uint8Array) =>
            !(sigData[1] & 0x80) && !(sigData[1] === 0 && !(sigData[2] & 0x80))
            && !(sigData[33] & 0x80) && !(sigData[33] === 0 && !(sigData[34] & 0x80));
        const constructSignature = (options: EC.SignOptions) => {
            const ellipticPrivateKey = this.toElliptic();
            const ellipticSignature = ellipticPrivateKey.sign(data, options);
            return Signature.fromElliptic(ellipticSignature, this.getType(), this.ec);
        };

        if (this.key.type === KeyType.k1) {
            do {
                signature = constructSignature({canonical: true, pers: [++tries]});
            } while (!isCanonical(signature.toBinary()));
        } else {
            signature = constructSignature({canonical: true});
        }
        return signature;
    }

    /** Validate a private key */
    public isValid(): boolean {
        try {
            const ellipticPrivateKey = this.toElliptic();
            const validationObj = ellipticPrivateKey.validate();
            return validationObj.result;
        } catch {
            return false;
        }
    }
}
