// copyright defined in eosjs2/LICENSE.txt

'use strict';

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
