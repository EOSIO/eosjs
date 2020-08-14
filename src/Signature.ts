import { BNInput, ec as EC } from 'elliptic';
import BN = require('bn.js');

import {
    Key,
    KeyType,
    signatureToString,
    stringToSignature,
} from './eosjs-numeric';
import { constructElliptic, PublicKey } from './eosjs-key-conversions';

/** Represents/stores a Signature and provides easy conversion for use with `elliptic` lib */
export class Signature {
    constructor(private signature: Key, private ec: EC) {}

    /** Instantiate Signature from an EOSIO-format Signature */
    public static fromString(sig: string, ec?: EC): Signature {
        const signature = stringToSignature(sig);
        if (!ec) {
            ec = constructElliptic(signature.type);
        }
        return new Signature(signature, ec);
    }

    /** Instantiate Signature from an `elliptic`-format Signature */
    public static fromElliptic(ellipticSig: EC.Signature, keyType: KeyType, ec?: EC): Signature {
        const r = ellipticSig.r.toArray('be', 32);
        const s = ellipticSig.s.toArray('be', 32);
        let eosioRecoveryParam;
        if (keyType === KeyType.k1 || keyType === KeyType.r1) {
            eosioRecoveryParam = ellipticSig.recoveryParam + 27;
            if (ellipticSig.recoveryParam <= 3) {
                eosioRecoveryParam += 4;
            }
        } else if (keyType === KeyType.wa) {
            eosioRecoveryParam = ellipticSig.recoveryParam;
        }
        const sigData = new Uint8Array([eosioRecoveryParam].concat(r, s));
        if (!ec) {
            ec = constructElliptic(keyType);
        }
        return new Signature({
            type: keyType,
            data: sigData,
        }, ec);
    }

    /** Export Signature as `elliptic`-format Signature
     * NOTE: This isn't an actual elliptic-format Signature, as ec.Signature is not exported by the library.
     * That's also why the return type is `any`.  We're *actually* returning an object with the 3 params
     * not an ec.Signature.
     * Further NOTE: @types/elliptic shows ec.Signature as exported; it is *not*.  Hence the `any`.
     */
    public toElliptic(): any {
        const lengthOfR = 32;
        const lengthOfS = 32;
        const r = new BN(this.signature.data.slice(1, lengthOfR + 1));
        const s = new BN(this.signature.data.slice(lengthOfR + 1, lengthOfR + lengthOfS + 1));

        let ellipticRecoveryBitField;
        if (this.signature.type === KeyType.k1 || this.signature.type === KeyType.r1) {
            ellipticRecoveryBitField = this.signature.data[0] - 27;
            if (ellipticRecoveryBitField > 3) {
                ellipticRecoveryBitField -= 4;
            }
        } else if (this.signature.type === KeyType.wa) {
            ellipticRecoveryBitField = this.signature.data[0];
        }
        const recoveryParam = ellipticRecoveryBitField & 3;
        return { r, s, recoveryParam };
    }

    /** Export Signature as EOSIO-format Signature */
    public toString(): string {
        return signatureToString(this.signature);
    }

    /** Export Signature in binary format */
    public toBinary(): Uint8Array {
        return this.signature.data;
    }

    /** Get key type from signature */
    public getType(): KeyType {
        return this.signature.type;
    }

    /** Verify a signature with a message or hashed message digest and public key */
    public verify(data: BNInput, publicKey: PublicKey, shouldHash: boolean = true, encoding: BufferEncoding = 'utf8'): boolean {
        if (shouldHash) {
            if (typeof data === 'string') {
                data = Buffer.from(data, encoding);
            }
            data = this.ec.hash().update(data).digest();
        }
        const ellipticSignature = this.toElliptic();
        const ellipticPublicKey = publicKey.toElliptic();
        return this.ec.verify(data, ellipticSignature, ellipticPublicKey, encoding);
    }

    /** Recover a public key from a message or hashed message digest and signature */
    public recover(data: BNInput, shouldHash: boolean = true, encoding: BufferEncoding = 'utf8'): PublicKey {
        if (shouldHash) {
            if (typeof data === 'string') {
                data = Buffer.from(data, encoding);
            }
            data = this.ec.hash().update(data).digest();
        }
        const ellipticSignature = this.toElliptic();
        const recoveredPublicKey = this.ec.recoverPubKey(
            data,
            ellipticSignature,
            ellipticSignature.recoveryParam,
            encoding
        );
        const ellipticKPub = this.ec.keyFromPublic(recoveredPublicKey);
        return PublicKey.fromElliptic(ellipticKPub, this.getType(), this.ec);
    }
}
