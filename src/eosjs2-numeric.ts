// copyright defined in eosjs2/LICENSE.txt

'use strict';

const ripemd160 = require('./ripemd').RIPEMD160.hash as (a: Uint8Array) => ArrayBuffer;

const base58_chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function create_base58_map() {
    let base58_map = Array(256).fill(-1) as number[];
    for (let i = 0; i < base58_chars.length; ++i)
        base58_map[base58_chars.charCodeAt(i)] = i;
    return base58_map;
}

const base58_map = create_base58_map();

export function isNegative(bin: Uint8Array) {
    return (bin[bin.length - 1] & 0x80) !== 0;
}

export function negate(bin: Uint8Array) {
    let carry = 1;
    for (let i = 0; i < bin.length; ++i) {
        let x = (~bin[i] & 0xff) + carry;
        bin[i] = x;
        carry = x >> 8;
    }
}

export function decimalToBinary(size: number, s: string) {
    let result = new Uint8Array(size);
    for (let i = 0; i < s.length; ++i) {
        let srcDigit = s.charCodeAt(i);
        if (srcDigit < '0'.charCodeAt(0) || srcDigit > '9'.charCodeAt(0))
            throw new Error("invalid number");
        let carry = srcDigit - '0'.charCodeAt(0);
        for (let j = 0; j < size; ++j) {
            let x = result[j] * 10 + carry;
            result[j] = x;
            carry = x >> 8;
        }
        if (carry)
            throw new Error("number is out of range");
    }
    return result;
}

export function signedDecimalToBinary(size: number, s: string) {
    let negative = s[0] === '-';
    if (negative)
        s = s.substr(1);
    let result = decimalToBinary(size, s);
    if (negative)
        negate(result);
    return result;
}

export function binaryToDecimal(bin: Uint8Array, minDigits = 1) {
    let result = Array(minDigits).fill('0'.charCodeAt(0)) as number[];
    for (let i = bin.length - 1; i >= 0; --i) {
        let carry = bin[i];
        for (let j = 0; j < result.length; ++j) {
            let x = ((result[j] - '0'.charCodeAt(0)) << 8) + carry;
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

export function signedBinaryToDecimal(bin: Uint8Array, minDigits = 1) {
    if (isNegative(bin)) {
        let x = bin.slice();
        negate(x);
        return '-' + binaryToDecimal(x, minDigits);
    }
    return binaryToDecimal(bin, minDigits);
}

export function base58ToBinary(size: number, s: string) {
    let result = new Uint8Array(size);
    for (let i = 0; i < s.length; ++i) {
        let carry = base58_map[s.charCodeAt(i)];
        if (carry < 0)
            throw new Error("invalid base-58 value");
        for (let j = 0; j < size; ++j) {
            let x = result[j] * 58 + carry;
            result[j] = x;
            carry = x >> 8;
        }
        if (carry)
            throw new Error("base-58 value is out of range");
    }
    result.reverse();
    return result;
}

export function binaryToBase58(bin: Uint8Array, minDigits = 1) {
    let result = [] as number[];
    for (let byte of bin) {
        let carry = byte;
        for (let j = 0; j < result.length; ++j) {
            let x = (base58_map[result[j]] << 8) + carry;
            result[j] = base58_chars.charCodeAt(x % 58);
            carry = (x / 58) | 0;
        }
        while (carry) {
            result.push(base58_chars.charCodeAt(carry % 58));
            carry = (carry / 58) | 0;
        }
    }
    for (let byte of bin)
        if (byte)
            break;
        else
            result.push('1'.charCodeAt(0));
    result.reverse();
    return String.fromCharCode(...result);
}

export const enum KeyType {
    k1 = 0,
    r1 = 1,
};

export const publicKeyDataSize = 33;
export const privateKeyDataSize = 32;
export const signatureDataSize = 65;

export interface Key {
    type: KeyType;
    data: Uint8Array;
};

function digestSuffixRipemd160(data: Uint8Array, suffix: string) {
    let d = new Uint8Array(data.length + suffix.length);
    for (let i = 0; i < data.length; ++i)
        d[i] = data[i];
    for (let i = 0; i < suffix.length; ++i)
        d[data.length + i] = suffix.charCodeAt(i);
    return ripemd160(d);
}

function stringToKey(s: string, type: KeyType, size: number, suffix: string): Key {
    let whole = base58ToBinary(size + 4, s);
    let result = { type, data: new Uint8Array(whole.buffer, 0, size) };
    let digest = new Uint8Array(digestSuffixRipemd160(result.data, suffix));
    if (digest[0] !== whole[size + 0] || digest[1] !== whole[size + 1] || digest[2] !== whole[size + 2] || digest[3] !== whole[size + 3])
        throw new Error("checksum doesn't match");
    return result;
}

function keyToString(key: Key, suffix: string, prefix: string) {
    let digest = new Uint8Array(digestSuffixRipemd160(key.data, suffix));
    let whole = new Uint8Array(key.data.length + 4);
    for (let i = 0; i < key.data.length; ++i)
        whole[i] = key.data[i];
    for (let i = 0; i < 4; ++i)
        whole[i + key.data.length] = digest[i];
    return prefix + binaryToBase58(whole);
}

export function stringToPublicKey(s: string): Key {
    if (s.substr(0, 3) == "EOS") {
        let whole = base58ToBinary(publicKeyDataSize + 4, s.substr(3));
        let key = { type: KeyType.k1, data: new Uint8Array(publicKeyDataSize) };
        for (let i = 0; i < publicKeyDataSize; ++i)
            key.data[i] = whole[i];
        let digest = new Uint8Array(ripemd160(key.data));
        if (digest[0] !== whole[publicKeyDataSize] || digest[1] !== whole[34] || digest[2] !== whole[35] || digest[3] !== whole[36])
            throw new Error("checksum doesn't match");
        return key;
    } else if (s.substr(0, 7) == "PUB_R1_") {
        return stringToKey(s.substr(7), KeyType.r1, publicKeyDataSize, "R1");
    } else {
        throw new Error("unrecognized public key format");
    }
}

export function publicKeyToString(key: Key) {
    if (key.type == KeyType.k1 && key.data.length == publicKeyDataSize) {
        let digest = new Uint8Array(ripemd160(key.data));
        let whole = new Uint8Array(publicKeyDataSize + 4);
        for (let i = 0; i < publicKeyDataSize; ++i)
            whole[i] = key.data[i];
        for (let i = 0; i < 4; ++i)
            whole[i + publicKeyDataSize] = digest[i];
        return "EOS" + binaryToBase58(whole);
    } else if (key.type == KeyType.r1 && key.data.length == publicKeyDataSize) {
        return keyToString(key, "R1", "PUB_R1_");
    } else {
        throw new Error("unrecognized public key format");
    }
}

export function stringToPrivateKey(s: string): Key {
    if (s.substr(0, 7) == "PVT_R1_")
        return stringToKey(s.substr(7), KeyType.r1, privateKeyDataSize, "R1");
    else
        throw new Error("unrecognized private key format");
}

export function privateKeyToString(signature: Key) {
    if (signature.type == KeyType.r1)
        return keyToString(signature, "R1", "PVT_R1_");
    else
        throw new Error("unrecognized private key format");
}

export function stringToSignature(s: string): Key {
    if (s.substr(0, 7) == "SIG_K1_")
        return stringToKey(s.substr(7), KeyType.k1, signatureDataSize, "K1");
    else if (s.substr(0, 7) == "SIG_R1_")
        return stringToKey(s.substr(7), KeyType.r1, signatureDataSize, "R1");
    else
        throw new Error("unrecognized signature format");
}

export function signatureToString(signature: Key) {
    if (signature.type == KeyType.k1)
        return keyToString(signature, "K1", "SIG_K1_");
    else if (signature.type == KeyType.r1)
        return keyToString(signature, "R1", "SIG_R1_");
    else
        throw new Error("unrecognized signature format");
}
