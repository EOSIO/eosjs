/**
 * @module Numeric
 */
// copyright defined in eosjs/LICENSE.txt

const ripemd160 = require('./ripemd').RIPEMD160.hash as (a: Uint8Array) => ArrayBuffer;

const base58Chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function create_base58_map() {
    const base58M = Array(256).fill(-1) as number[];
    for (let i = 0; i < base58Chars.length; ++i) {
        base58M[base58Chars.charCodeAt(i)] = i;
    }
    return base58M;
}

const base58Map = create_base58_map();

function create_base64_map() {
    const base64M = Array(256).fill(-1) as number[];
    for (let i = 0; i < base64Chars.length; ++i) {
        base64M[base64Chars.charCodeAt(i)] = i;
    }
    base64M['='.charCodeAt(0)] = 0;
    return base64M;
}

const base64Map = create_base64_map();

/** Is `bignum` a negative number? */
export function isNegative(bignum: Uint8Array) {
    return (bignum[bignum.length - 1] & 0x80) !== 0;
}

/** Negate `bignum` */
export function negate(bignum: Uint8Array) {
    let carry = 1;
    for (let i = 0; i < bignum.length; ++i) {
        const x = (~bignum[i] & 0xff) + carry;
        bignum[i] = x;
        carry = x >> 8;
    }
}

/**
 * Convert an unsigned decimal number in `s` to a bignum
 * @param size bignum size (bytes)
 */
export function decimalToBinary(size: number, s: string) {
    const result = new Uint8Array(size);
    for (let i = 0; i < s.length; ++i) {
        const srcDigit = s.charCodeAt(i);
        if (srcDigit < '0'.charCodeAt(0) || srcDigit > '9'.charCodeAt(0)) {
            throw new Error('invalid number');
        }
        let carry = srcDigit - '0'.charCodeAt(0);
        for (let j = 0; j < size; ++j) {
            const x = result[j] * 10 + carry;
            result[j] = x;
            carry = x >> 8;
        }
        if (carry) {
            throw new Error('number is out of range');
        }
    }
    return result;
}

/**
 * Convert a signed decimal number in `s` to a bignum
 * @param size bignum size (bytes)
 */
export function signedDecimalToBinary(size: number, s: string) {
    const negative = s[0] === '-';
    if (negative) {
        s = s.substr(1);
    }
    const result = decimalToBinary(size, s);
    if (negative) {
        negate(result);
        if (!isNegative(result)) {
            throw new Error('number is out of range');
        }
    } else if (isNegative(result)) {
        throw new Error('number is out of range');
    }
    return result;
}

/**
 * Convert `bignum` to an unsigned decimal number
 * @param minDigits 0-pad result to this many digits
 */
export function binaryToDecimal(bignum: Uint8Array, minDigits = 1) {
    const result = Array(minDigits).fill('0'.charCodeAt(0)) as number[];
    for (let i = bignum.length - 1; i >= 0; --i) {
        let carry = bignum[i];
        for (let j = 0; j < result.length; ++j) {
            const x = ((result[j] - '0'.charCodeAt(0)) << 8) + carry;
            result[j] = '0'.charCodeAt(0) + x % 10;
            carry = (x / 10) | 0;
        }
        while (carry) {
            result.push('0'.charCodeAt(0) + carry % 10);
            carry = (carry / 10) | 0;
        }
    }
    result.reverse();
    return String.fromCharCode(...result);
}

/**
 * Convert `bignum` to a signed decimal number
 * @param minDigits 0-pad result to this many digits
 */
export function signedBinaryToDecimal(bignum: Uint8Array, minDigits = 1) {
    if (isNegative(bignum)) {
        const x = bignum.slice();
        negate(x);
        return '-' + binaryToDecimal(x, minDigits);
    }
    return binaryToDecimal(bignum, minDigits);
}

function base58ToBinaryVarSize(s: string) {
    const result = [] as number[];
    for (let i = 0; i < s.length; ++i) {
        let carry = base58Map[s.charCodeAt(i)];
        if (carry < 0) {
            throw new Error('invalid base-58 value');
        }
        for (let j = 0; j < result.length; ++j) {
            const x = result[j] * 58 + carry;
            result[j] = x & 0xff;
            carry = x >> 8;
        }
        if (carry) {
            result.push(carry);
        }
    }
    for (const ch of s) {
        if (ch === '1') {
            result.push(0);
        } else {
            break;
        }
    }
    result.reverse();
    return new Uint8Array(result);
}

/**
 * Convert an unsigned base-58 number in `s` to a bignum
 * @param size bignum size (bytes)
 */
export function base58ToBinary(size: number, s: string) {
    if (!size) {
        return base58ToBinaryVarSize(s);
    }
    const result = new Uint8Array(size);
    for (let i = 0; i < s.length; ++i) {
        let carry = base58Map[s.charCodeAt(i)];
        if (carry < 0) {
            throw new Error('invalid base-58 value');
        }
        for (let j = 0; j < size; ++j) {
            const x = result[j] * 58 + carry;
            result[j] = x;
            carry = x >> 8;
        }
        if (carry) {
            throw new Error('base-58 value is out of range');
        }
    }
    result.reverse();
    return result;
}

/**
 * Convert `bignum` to a base-58 number
 * @param minDigits 0-pad result to this many digits
 */
export function binaryToBase58(bignum: Uint8Array, minDigits = 1) {
    const result = [] as number[];
    for (const byte of bignum) {
        let carry = byte;
        for (let j = 0; j < result.length; ++j) {
            const x = (base58Map[result[j]] << 8) + carry;
            result[j] = base58Chars.charCodeAt(x % 58);
            carry = (x / 58) | 0;
        }
        while (carry) {
            result.push(base58Chars.charCodeAt(carry % 58));
            carry = (carry / 58) | 0;
        }
    }
    for (const byte of bignum) {
        if (byte) {
            break;
        } else {
            result.push('1'.charCodeAt(0));
        }
    }
    result.reverse();
    return String.fromCharCode(...result);
}

/** Convert an unsigned base-64 number in `s` to a bignum */
export function base64ToBinary(s: string) {
    let len = s.length;
    if ((len & 3) === 1 && s[len - 1] === '=') {
        len -= 1;
    } // fc appends an extra '='
    if ((len & 3) !== 0) {
        throw new Error('base-64 value is not padded correctly');
    }
    const groups = len >> 2;
    let bytes = groups * 3;
    if (len > 0 && s[len - 1] === '=') {
        if (s[len - 2] === '=') {
            bytes -= 2;
        } else {
            bytes -= 1;
        }
    }
    const result = new Uint8Array(bytes);

    for (let group = 0; group < groups; ++group) {
        const digit0 = base64Map[s.charCodeAt(group * 4 + 0)];
        const digit1 = base64Map[s.charCodeAt(group * 4 + 1)];
        const digit2 = base64Map[s.charCodeAt(group * 4 + 2)];
        const digit3 = base64Map[s.charCodeAt(group * 4 + 3)];
        result[group * 3 + 0] = (digit0 << 2) | (digit1 >> 4);
        if (group * 3 + 1 < bytes) {
            result[group * 3 + 1] = ((digit1 & 15) << 4) | (digit2 >> 2);
        }
        if (group * 3 + 2 < bytes) {
            result[group * 3 + 2] = ((digit2 & 3) << 6) | digit3;
        }
    }
    return result;
}

/** Key types this library supports */
export enum KeyType {
    k1 = 0,
    r1 = 1,
    wa = 2,
}

/** Public key data size, excluding type field */
export const publicKeyDataSize = 33;

/** Private key data size, excluding type field */
export const privateKeyDataSize = 32;

/** Signature data size, excluding type field */
export const signatureDataSize = 65;

/** Public key, private key, or signature in binary form */
export interface Key {
    type: KeyType;
    data: Uint8Array;
}

function digestSuffixRipemd160(data: Uint8Array, suffix: string) {
    const d = new Uint8Array(data.length + suffix.length);
    for (let i = 0; i < data.length; ++i) {
        d[i] = data[i];
    }
    for (let i = 0; i < suffix.length; ++i) {
        d[data.length + i] = suffix.charCodeAt(i);
    }
    return ripemd160(d);
}

function stringToKey(s: string, type: KeyType, size: number, suffix: string): Key {
    const whole = base58ToBinary(size ? size + 4 : 0, s);
    const result = { type, data: new Uint8Array(whole.buffer, 0, whole.length - 4) };
    const digest = new Uint8Array(digestSuffixRipemd160(result.data, suffix));
    if (digest[0] !== whole[whole.length - 4] || digest[1] !== whole[whole.length - 3]
        || digest[2] !== whole[whole.length - 2] || digest[3] !== whole[whole.length - 1]) {
        throw new Error('checksum doesn\'t match');
    }
    return result;
}

function keyToString(key: Key, suffix: string, prefix: string) {
    const digest = new Uint8Array(digestSuffixRipemd160(key.data, suffix));
    const whole = new Uint8Array(key.data.length + 4);
    for (let i = 0; i < key.data.length; ++i) {
        whole[i] = key.data[i];
    }
    for (let i = 0; i < 4; ++i) {
        whole[i + key.data.length] = digest[i];
    }
    return prefix + binaryToBase58(whole);
}

/** Convert key in `s` to binary form */
export function stringToPublicKey(s: string): Key {
    if (typeof s !== 'string') {
        throw new Error('expected string containing public key');
    }
    if (s.substr(0, 3) === 'EOS') {
        const whole = base58ToBinary(publicKeyDataSize + 4, s.substr(3));
        const key = { type: KeyType.k1, data: new Uint8Array(publicKeyDataSize) };
        for (let i = 0; i < publicKeyDataSize; ++i) {
            key.data[i] = whole[i];
        }
        const digest = new Uint8Array(ripemd160(key.data));
        if (digest[0] !== whole[publicKeyDataSize] || digest[1] !== whole[34]
            || digest[2] !== whole[35] || digest[3] !== whole[36]) {
            throw new Error('checksum doesn\'t match');
        }
        return key;
    } else if (s.substr(0, 7) === 'PUB_K1_') {
        return stringToKey(s.substr(7), KeyType.k1, publicKeyDataSize, 'K1');
    } else if (s.substr(0, 7) === 'PUB_R1_') {
        return stringToKey(s.substr(7), KeyType.r1, publicKeyDataSize, 'R1');
    } else if (s.substr(0, 7) === 'PUB_WA_') {
        return stringToKey(s.substr(7), KeyType.wa, 0, 'WA');
    } else {
        throw new Error('unrecognized public key format');
    }
}

/** Convert `key` to string (base-58) form */
export function publicKeyToString(key: Key) {
    if (key.type === KeyType.k1 && key.data.length === publicKeyDataSize) {
        return keyToString(key, 'K1', 'PUB_K1_');
    } else if (key.type === KeyType.r1 && key.data.length === publicKeyDataSize) {
        return keyToString(key, 'R1', 'PUB_R1_');
    } else if (key.type === KeyType.wa) {
        return keyToString(key, 'WA', 'PUB_WA_');
    } else {
        throw new Error('unrecognized public key format');
    }
}

/** If a key is in the legacy format (`EOS` prefix), then convert it to the new format (`PUB_K1_`).
 * Leaves other formats untouched
 */
export function convertLegacyPublicKey(s: string) {
    if (s.substr(0, 3) === 'EOS') {
        return publicKeyToString(stringToPublicKey(s));
    }
    return s;
}

/** If a key is in the legacy format (`EOS` prefix), then convert it to the new format (`PUB_K1_`).
 * Leaves other formats untouched
 */
export function convertLegacyPublicKeys(keys: string[]) {
    return keys.map(convertLegacyPublicKey);
}

/** Convert key in `s` to binary form */
export function stringToPrivateKey(s: string): Key {
    if (typeof s !== 'string') {
        throw new Error('expected string containing private key');
    }
    if (s.substr(0, 7) === 'PVT_R1_') {
        return stringToKey(s.substr(7), KeyType.r1, privateKeyDataSize, 'R1');
    } else {
        // todo: Verify checksum: sha256(sha256(key.data)).
        //       Not critical since a bad key will fail to produce a
        //       valid signature anyway.
        const whole = base58ToBinary(privateKeyDataSize + 5, s);
        const key = { type: KeyType.k1, data: new Uint8Array(privateKeyDataSize) };
        if (whole[0] !== 0x80) {
            throw new Error('unrecognized private key type');
        }
        for (let i = 0; i < privateKeyDataSize; ++i) {
            key.data[i] = whole[i + 1];
        }
        return key;
    }
}

/** Convert `key` to string (base-58) form */
export function privateKeyToString(key: Key) {
    if (key.type === KeyType.r1) {
        return keyToString(key, 'R1', 'PVT_R1_');
    } else {
        throw new Error('unrecognized private key format');
    }
}

/** Convert key in `s` to binary form */
export function stringToSignature(s: string): Key {
    if (typeof s !== 'string') {
        throw new Error('expected string containing signature');
    }
    if (s.substr(0, 7) === 'SIG_K1_') {
        return stringToKey(s.substr(7), KeyType.k1, signatureDataSize, 'K1');
    } else if (s.substr(0, 7) === 'SIG_R1_') {
        return stringToKey(s.substr(7), KeyType.r1, signatureDataSize, 'R1');
    } else if (s.substr(0, 7) === 'SIG_WA_') {
        return stringToKey(s.substr(7), KeyType.wa, 0, 'WA');
    } else {
        throw new Error('unrecognized signature format');
    }
}

/** Convert `signature` to string (base-58) form */
export function signatureToString(signature: Key) {
    if (signature.type === KeyType.k1) {
        return keyToString(signature, 'K1', 'SIG_K1_');
    } else if (signature.type === KeyType.r1) {
        return keyToString(signature, 'R1', 'SIG_R1_');
    } else if (signature.type === KeyType.wa) {
        return keyToString(signature, 'WA', 'SIG_WA_');
    } else {
        throw new Error('unrecognized signature format');
    }
}
