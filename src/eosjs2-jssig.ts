// copyright defined in eosjs2/LICENSE.txt

'use strict';

const ecc = require('eosjs-ecc');
import { SignatureProvider, SignatureProviderArgs } from './eosjs2-api';

export default class JsSignatureProvider implements SignatureProvider {
    keys = new Map<string, string>();
    availableKeys = [] as string[];

    constructor(privateKeys: string[]) {
        for (let k of privateKeys) {
            let pub = ecc.PrivateKey.fromString(k).toPublic().toString();
            this.keys.set(pub, k);
            this.availableKeys.push(pub);
        }
    }

    async getAvailableKeys() {
        return this.availableKeys;
    }

    async sign({ chainId, requiredKeys, serializedTransaction }: SignatureProviderArgs) {
        let signBuf = Buffer.concat([new Buffer(chainId, 'hex'), new Buffer(serializedTransaction), new Buffer(new Uint8Array(32))]);
        return requiredKeys.map(pub => ecc.Signature.sign(signBuf, this.keys.get(pub)).toString());
    }
}
