import { ec as EC } from 'elliptic';
import {
    Key,
    KeyType,
    publicKeyToLegacyString,
    publicKeyToString,
    stringToPublicKey,
    arrayToString,
    stringToArray,
} from './eosjs-numeric';

const crypto = (typeof(window) !== 'undefined' ? window.crypto : require('crypto').webcrypto);

/** Represents/stores a public key and provides easy conversion for use with `elliptic` lib */
export class PublicKey {
    constructor(private key: Key, private ec: EC) {}

    /** Instantiate public key from an EOSIO-format public key */
    public static fromString(publicKeyStr: string, ec?: EC): PublicKey {
        const key = stringToPublicKey(publicKeyStr);
        if (!ec) {
            if (key.type === KeyType.k1) {
                ec = new EC('secp256k1');
            } else {
                ec = new EC('p256');
            }
        }
        return new PublicKey(key, ec);
    }

    /** Instantiate public key from an `elliptic`-format public key */
    public static fromElliptic(publicKey: EC.KeyPair, keyType: KeyType, ec?: EC): PublicKey {
        const x = publicKey.getPublic().getX().toArray('be', 32);
        const y = publicKey.getPublic().getY().toArray('be', 32);
        if (!ec) {
            if (keyType === KeyType.k1) {
                ec = new EC('secp256k1');
            } else {
                ec = new EC('p256');
            }
        }
        return new PublicKey({
            type: keyType,
            data: new Uint8Array([(y[31] & 1) ? 3 : 2].concat(x)),
        }, ec);
    }

    /** Instantiate public key from a `CryptoKey`-format public key */
    public static async fromWebCrypto(publicKey: CryptoKey): Promise<PublicKey> {
        if (publicKey.extractable === false) {
            throw new Error('Crypto Key is not extractable');
        }
        const ec = new EC('p256');

        const extractedArrayBuffer = await crypto.subtle.exportKey('spki', publicKey);
        const extractedDecoded = arrayToString(extractedArrayBuffer);
        const derHex = Buffer.from(extractedDecoded, 'binary').toString('hex');
        const publicKeyHex = derHex.replace('3059301306072a8648ce3d020106082a8648ce3d030107034200', '');
        const publicKeyEc = ec.keyFromPublic(publicKeyHex, 'hex');
        return PublicKey.fromElliptic(publicKeyEc, KeyType.r1, ec);
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

    /** Export public key as `CryptoKey`-format public key */
    public async toWebCrypto(extractable: boolean = false): Promise<CryptoKey> {
        const publicKeyEc = this.toElliptic();
        const publicKeyHex = publicKeyEc.getPublic('hex');

        const derHex = `3059301306072a8648ce3d020106082a8648ce3d030107034200${publicKeyHex}`;
        const derBase64 = Buffer.from(derHex, 'hex').toString('binary');
        const spkiArrayBuffer = stringToArray(derBase64);
        return await crypto.subtle.importKey(
            'spki',
            spkiArrayBuffer,
            {
                name: 'ECDSA',
                namedCurve: 'P-256'
            },
            extractable,
            ['verify']
        );
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
