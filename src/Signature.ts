import * as EC from 'elliptic';
import {
    Key,
    KeyType,
    signatureToString,
    stringToSignature,
} from './eosjs-numeric';
import BN = require('bn.js');

// ellipticSignatureToEosioSignatureString
// const sig = Signature.toElliptic(Signature.fromString(signOutput.signatures[0]));
// Signature.fromElliptic(ellipticSig).toString()
export class Signature {

    constructor(private signature: Key) {}

    public static fromString(sig: string): Signature {
        return new Signature(stringToSignature(sig));
    }

    public static fromElliptic(ellipticSig: any): Signature {
        const r = ellipticSig.r.toArray();
        const s = ellipticSig.s.toArray();
        const sigData = new Uint8Array([ellipticSig.recoveryParam + 27 + 4].concat(r, s));
        return new Signature({
            type: KeyType.k1,
            data: sigData,
        });
    }

    public toElliptic(): any {
        const lengthOfR = 32;
        const lengthOfS = 32;
        const r = new BN(this.signature.data.slice(1, lengthOfR + 1));
        const s = new BN(this.signature.data.slice(lengthOfR + 1, lengthOfR + lengthOfS + 1));

        const recoveryParam = this.signature.data[0] - 27 - 4;
        return {
            r,
            s,
            recoveryParam,
        };
    }

    public toString(): string {
        return signatureToString(this.signature);
    }

    public toBinary(): Uint8Array {
        return this.signature.data;
    }
}
