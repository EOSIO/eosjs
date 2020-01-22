import { BNInput, ec as EC } from 'elliptic';
import {
    Key,
    KeyType,
    publicKeyToString,
    stringToPublicKey,
} from './eosjs-numeric';
import { Signature } from './Signature';
import { PrivateKey } from './PrivateKey';

/** Represents/stores a public key and provides easy conversion for use with `elliptic` lib */
export class PublicKey {
    constructor(private key: Key, private ec: EC) {}

    /** Instantiate public key from an EOSIO-format public key */
    public static fromString(publicKeyStr: string): PublicKey {
        const key = stringToPublicKey(publicKeyStr);
        return new PublicKey(key, constructElliptic(key.type));
    }

    /** Instantiate public key from an `elliptic`-format public key */
    public static fromElliptic(publicKey: EC.KeyPair, keyType: KeyType): PublicKey {
        const x = publicKey.getPublic().getX().toArray();
        const y = publicKey.getPublic().getY().toArray();
        return new PublicKey({
            type: keyType,
            data: new Uint8Array([(y[31] & 1) ? 3 : 2].concat(x)),
        }, constructElliptic(keyType));
    }

    /** Retrieve the public key from a private key */
    public static fromPrivateKey(privateKey: PrivateKey): PublicKey {
        const ellipticPrivateKey = privateKey.toElliptic();
        return PublicKey.fromElliptic(ellipticPrivateKey, privateKey.getType());
    }

    /** Export public key as EOSIO-format public key */
    public toString(): string {
        return publicKeyToString(this.key);
    }

    /** Export public key as `elliptic`-format public key */
    public toElliptic(): EC.KeyPair {
        return this.ec.keyPair({
            pub: new Buffer(this.key.data),
        });
    }

    /** Get key type from key */
    public getType(): KeyType {
        return this.key.type;
    }

    /** Validate a public key */
    public validate(): boolean {
        const ellipticPublicKey = this.toElliptic();
        const validationObj = ellipticPublicKey.validate();
        return validationObj.result;
    }

    /** Recover a public key from a message digest and signature */
    public static recover(digest: BNInput, signature: Signature, encoding?: string): PublicKey {
        const ec = constructElliptic(signature.getType());
        const ellipticSignature = signature.toElliptic();
        const recoveredPublicKey = ec.recoverPubKey(
            digest,
            ellipticSignature,
            ellipticSignature.recoveryParam,
            encoding
        );
        const ellipticKPub = ec.keyFromPublic(recoveredPublicKey);
        return PublicKey.fromElliptic(ellipticKPub, signature.getType());
    }
}

/** Construct the elliptic curve object based on key type */
const constructElliptic = (type: KeyType): EC => {
    if (type === KeyType.k1) {
        return new EC('secp256k1') as any;
    }
    return new EC('p256') as any;
};
