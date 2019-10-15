import { ec } from 'elliptic';
import BN = require('bn.js');

import {
    Key,
    KeyType,
    signatureToString,
    stringToSignature,
} from './eosjs-numeric';

/** Represents/stores a Signature and provides easy conversion for use with `elliptic` lib */
export class Signature {

    constructor(private signature: Key) {}

    /** Instantiate Signature from an EOSIO-format Signature */
    public static fromString(sig: string): Signature {
        return new Signature(stringToSignature(sig));
    }

    /** Instantiate Signature from an `elliptic`-format Signature */
    public static fromElliptic(ellipticSig: ec.Signature): Signature {
        const r = ellipticSig.r.toArray();
        const s = ellipticSig.s.toArray();
        const sigData = new Uint8Array([ellipticSig.recoveryParam + 27 + 4].concat(r, s));
        return new Signature({
            type: KeyType.k1,
            data: sigData,
        });
    }

    /** Export Signature as `elliptic`-format Signature
     *  NOTE: This isn't an actual elliptic-format Signature, as ec.Signature is not exported by the library.
     *  That's also why the return type is `any`.  We're *actually* returning an object with the 3 params
     *  not an ec.Signature.
     *  Further NOTE: @types/elliptic shows ec.Signature as exported; it is *not*.  Hence the `any`.
     */
    public toElliptic(): any {
        const lengthOfR = 32;
        const lengthOfS = 32;
        const r = new BN(this.signature.data.slice(1, lengthOfR + 1));
        const s = new BN(this.signature.data.slice(lengthOfR + 1, lengthOfR + lengthOfS + 1));

        const recoveryParam = this.signature.data[0] - 27 - 4;
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
}
