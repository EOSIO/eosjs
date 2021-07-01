/**
 * @module Serialize
 */
// copyright defined in eosjs/LICENSE.txt
/* eslint-disable max-classes-per-file */
/* eslint-disable jsdoc/check-indentation */

import * as numeric from './eosjs-numeric';
import { TransactionHeader } from './eosjs-api-interfaces';
import { Abi, BlockTaposInfo } from './eosjs-rpc-interfaces';
import { Query } from './eosjs-api-interfaces';

/** A field in an abi */
export interface Field {
    /** Field name */
    name: string;

    /** Type name in string form */
    typeName: string;

    /** Type of the field */
    type: Type;
}

/** Options for serialize() and deserialize() */
export interface SerializerOptions {
    bytesAsUint8Array?: boolean;
}

/** State for serialize() and deserialize() */
export class SerializerState {
    public options: SerializerOptions;

    /** Have any binary extensions been skipped? */
    public skippedBinaryExtension = false;

    constructor(options: SerializerOptions = {}) {
        this.options = options;
    }
}

/**
 * An Anyvar (non-short form) may be any of the following:
 *  * null
 *  * string
 *  * number
 *    * Caution: assumes number is int32. Use {type, value} form for other numeric types
 *  * an array of anyvar
 *  * {type, value}
 *      * type is a string matching one of the predefined types in anyvarDefs
 *      * value:
 *          * If type === 'any_object', then value is an object. The values within the object are anyvar.
 *          * If type === 'any_array', then value is an array of anyvar.
 *          * Else, value must be eosjs-compatible with the specified type (e.g. uint64 should be a string
 *            containing the value in decimal).
 *  * Other object. The values within the object are anyvar.
 *
 * The short form is more convenient, but it can't be converted back to binary (serialized).
 * Wherever the anyvar would have {type, value}, it has just the value instead.
 */
export type Anyvar = null | string | number | Anyvar[] | { type: string, value: any } | Record<string, unknown>;

interface AnyvarDef {
    index: number;
    useShortForm: boolean;
    type: {
        name: string,
        serialize(buffer: SerialBuffer, value: any): void,
        deserialize(buffer: SerialBuffer, state?: SerializerState): any,
    };
}

/** A type in an abi */
export interface Type {
    /** Type name */
    name: string;

    /** Type name this is an alias of, if any */
    aliasOfName: string;

    /** Type this is an array of, if any */
    arrayOf: Type;

    /** Type this is an optional of, if any */
    optionalOf: Type;

    /** Marks binary extension fields */
    extensionOf?: Type;

    /** Base name of this type, if this is a struct */
    baseName: string;

    /** Base of this type, if this is a struct */
    base: Type;

    /** Contained fields, if this is a struct */
    fields: Field[];

    /** Convert `data` to binary form and store in `buffer` */
    serialize: (buffer: SerialBuffer, data: any, state?: SerializerState, allowExtensions?: boolean) => void;

    /** Convert data in `buffer` from binary form */
    deserialize: (buffer: SerialBuffer, state?: SerializerState, allowExtensions?: boolean) => any;
}

/** Structural representation of a symbol */
export interface Symbol {
    /** Name of the symbol, not including precision */
    name: string;

    /** Number of digits after the decimal point */
    precision: number;
}

export interface Contract {
    actions: Map<string, Type>;
    types: Map<string, Type>;
}

export interface Authorization {
    actor: string;
    permission: string;
}

/** Action with data in structured form */
export interface Action {
    account: string;
    name: string;
    authorization: Authorization[];
    data: any;
    hex_data?: string;
}

/** Action with data in serialized hex form */
export interface SerializedAction {
    account: string;
    name: string;
    authorization: Authorization[];
    data: string;
}

/** Serialize and deserialize data */
export class SerialBuffer {
    /** Amount of valid data in `array` */
    public length: number;

    /** Data in serialized (binary) form */
    public array: Uint8Array;

    /** Current position while reading (deserializing) */
    public readPos = 0;

    public textEncoder: TextEncoder;
    public textDecoder: TextDecoder;

    /**
     * @param __namedParameters
     * `array`: `null` if serializing, or binary data to deserialize
     * `textEncoder`: `TextEncoder` instance to use. Pass in `null` if running in a browser
     * `textDecoder`: `TextDecider` instance to use. Pass in `null` if running in a browser
     */
    constructor({ textEncoder, textDecoder, array } = {} as
        { textEncoder?: TextEncoder, textDecoder?: TextDecoder, array?: Uint8Array }) {
        this.array = array || new Uint8Array(1024);
        this.length = array ? array.length : 0;
        this.textEncoder = textEncoder || new TextEncoder();
        this.textDecoder = textDecoder || new TextDecoder('utf-8', { fatal: true });
    }

    /** Resize `array` if needed to have at least `size` bytes free */
    public reserve(size: number): void {
        if (this.length + size <= this.array.length) {
            return;
        }
        let l = this.array.length;
        while (this.length + size > l) {
            l = Math.ceil(l * 1.5);
        }
        const newArray = new Uint8Array(l);
        newArray.set(this.array);
        this.array = newArray;
    }

    /** Is there data available to read? */
    public haveReadData(): boolean {
        return this.readPos < this.length;
    }

    /** Restart reading from the beginning */
    public restartRead(): void {
        this.readPos = 0;
    }

    /** Return data with excess storage trimmed away */
    public asUint8Array(): Uint8Array {
        return new Uint8Array(this.array.buffer, this.array.byteOffset, this.length);
    }

    /** Append bytes */
    public pushArray(v: number[] | Uint8Array): void {
        this.reserve(v.length);
        this.array.set(v, this.length);
        this.length += v.length;
    }

    /** Append bytes */
    public push(...v: number[]): void {
        this.pushArray(v);
    }

    /** Get a single byte */
    public get(): number {
        if (this.readPos < this.length) {
            return this.array[this.readPos++];
        }
        throw new Error('Read past end of buffer');
    }

    /** Append bytes in `v`. Throws if `len` doesn't match `v.length` */
    public pushUint8ArrayChecked(v: Uint8Array, len: number): void {
        if (v.length !== len) {
            throw new Error('Binary data has incorrect size');
        }
        this.pushArray(v);
    }

    /** Get `len` bytes */
    public getUint8Array(len: number): Uint8Array {
        if (this.readPos + len > this.length) {
            throw new Error('Read past end of buffer');
        }
        const result = new Uint8Array(this.array.buffer, this.array.byteOffset + this.readPos, len);
        this.readPos += len;
        return result;
    }

    /** Skip `len` bytes */
    public skip(len: number): void {
        if (this.readPos + len > this.length) {
            throw new Error('Read past end of buffer');
        }
        this.readPos += len;
    }

    /** Append a `uint16` */
    public pushUint16(v: number): void {
        this.push((v >> 0) & 0xff, (v >> 8) & 0xff);
    }

    /** Get a `uint16` */
    public getUint16(): number {
        let v = 0;
        v |= this.get() << 0;
        v |= this.get() << 8;
        return v;
    }

    /** Append a `uint32` */
    public pushUint32(v: number): void {
        this.push((v >> 0) & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >> 24) & 0xff);
    }

    /** Get a `uint32` */
    public getUint32(): number {
        let v = 0;
        v |= this.get() << 0;
        v |= this.get() << 8;
        v |= this.get() << 16;
        v |= this.get() << 24;
        return v >>> 0;
    }

    /** Append a `uint64`. *Caution*: `number` only has 53 bits of precision */
    public pushNumberAsUint64(v: number): void {
        this.pushUint32(v >>> 0);
        this.pushUint32(Math.floor(v / 0x10000_0000) >>> 0);
    }

    /**
     * Get a `uint64` as a `number`. *Caution*: `number` only has 53 bits of precision; some values will change.
     * `numeric.binaryToDecimal(serialBuffer.getUint8Array(8))` recommended instead
     */
    public getUint64AsNumber(): number {
        const low = this.getUint32();
        const high = this.getUint32();
        return (high >>> 0) * 0x10000_0000 + (low >>> 0);
    }

    /** Append a `varuint32` */
    public pushVaruint32(v: number): void {
        while (true) {
            if (v >>> 7) {
                this.push(0x80 | (v & 0x7f));
                v = v >>> 7;
            } else {
                this.push(v);
                break;
            }
        }
    }

    /** Get a `varuint32` */
    public getVaruint32(): number {
        let v = 0;
        let bit = 0;
        while (true) {
            const b = this.get();
            v |= (b & 0x7f) << bit;
            bit += 7;
            if (!(b & 0x80)) {
                break;
            }
        }
        return v >>> 0;
    }

    /** Append a `varint32` */
    public pushVarint32(v: number): void {
        this.pushVaruint32((v << 1) ^ (v >> 31));
    }

    /** Get a `varint32` */
    public getVarint32(): number {
        const v = this.getVaruint32();
        if (v & 1) {
            return ((~v) >> 1) | 0x8000_0000;
        } else {
            return v >>> 1;
        }
    }

    /** Append a `float32` */
    public pushFloat32(v: number): void {
        this.pushArray(new Uint8Array((new Float32Array([v])).buffer));
    }

    /** Get a `float32` */
    public getFloat32(): number {
        return new Float32Array(this.getUint8Array(4).slice().buffer)[0];
    }

    /** Append a `float64` */
    public pushFloat64(v: number): void {
        this.pushArray(new Uint8Array((new Float64Array([v])).buffer));
    }

    /** Get a `float64` */
    public getFloat64(): number {
        return new Float64Array(this.getUint8Array(8).slice().buffer)[0];
    }

    /** Append a `name` */
    public pushName(s: string): void {
        if (typeof s !== 'string') {
            throw new Error('Expected string containing name');
        }
        const regex = new RegExp(/^[.1-5a-z]{0,12}[.1-5a-j]?$/);
        if (!regex.test(s)) {
            throw new Error('Name should be less than 13 characters, or less than 14 if last character is between 1-5 or a-j, and only contain the following symbols .12345abcdefghijklmnopqrstuvwxyz'); // eslint-disable-line
        }
        const charToSymbol = (c: number): number => {
            if (c >= 'a'.charCodeAt(0) && c <= 'z'.charCodeAt(0)) {
                return (c - 'a'.charCodeAt(0)) + 6;
            }
            if (c >= '1'.charCodeAt(0) && c <= '5'.charCodeAt(0)) {
                return (c - '1'.charCodeAt(0)) + 1;
            }
            return 0;
        };
        const a = new Uint8Array(8);
        let bit = 63;
        for (let i = 0; i < s.length; ++i) {
            let c = charToSymbol(s.charCodeAt(i));
            if (bit < 5) {
                c = c << 1;
            }
            for (let j = 4; j >= 0; --j) {
                if (bit >= 0) {
                    a[Math.floor(bit / 8)] |= ((c >> j) & 1) << (bit % 8);
                    --bit;
                }
            }
        }
        this.pushArray(a);
    }

    /** Get a `name` */
    public getName(): string {
        const a = this.getUint8Array(8);
        let result = '';
        for (let bit = 63; bit >= 0;) {
            let c = 0;
            for (let i = 0; i < 5; ++i) {
                if (bit >= 0) {
                    c = (c << 1) | ((a[Math.floor(bit / 8)] >> (bit % 8)) & 1);
                    --bit;
                }
            }
            if (c >= 6) {
                result += String.fromCharCode(c + 'a'.charCodeAt(0) - 6);
            } else if (c >= 1) {
                result += String.fromCharCode(c + '1'.charCodeAt(0) - 1);
            } else {
                result += '.';
            }
        }
        while (result.endsWith('.')) {
            result = result.substr(0, result.length - 1);
        }
        return result;
    }

    /** Append length-prefixed binary data */
    public pushBytes(v: number[] | Uint8Array): void {
        this.pushVaruint32(v.length);
        this.pushArray(v);
    }

    /** Get length-prefixed binary data */
    public getBytes(): Uint8Array {
        return this.getUint8Array(this.getVaruint32());
    }

    /** Append a string */
    public pushString(v: string): void {
        this.pushBytes(this.textEncoder.encode(v));
    }

    /** Get a string */
    public getString(): string {
        return this.textDecoder.decode(this.getBytes());
    }

    /** Append a `symbol_code`. Unlike `symbol`, `symbol_code` doesn't include a precision. */
    public pushSymbolCode(name: string): void {
        if (typeof name !== 'string') {
            throw new Error('Expected string containing symbol_code');
        }
        const a = [];
        a.push(...this.textEncoder.encode(name));
        while (a.length < 8) {
            a.push(0);
        }
        this.pushArray(a.slice(0, 8));
    }

    /** Get a `symbol_code`. Unlike `symbol`, `symbol_code` doesn't include a precision. */
    public getSymbolCode(): string {
        const a = this.getUint8Array(8);
        let len;
        for (len = 0; len < a.length; ++len) {
            if (!a[len]) {
                break;
            }
        }
        const name = this.textDecoder.decode(new Uint8Array(a.buffer, a.byteOffset, len));
        return name;
    }

    /** Append a `symbol` */
    public pushSymbol({ name, precision }: { name: string, precision: number }): void {
        if (!/^[A-Z]{1,7}$/.test(name)) {
            throw new Error('Expected symbol to be A-Z and between one and seven characters');
        }
        const a = [precision & 0xff];
        a.push(...this.textEncoder.encode(name));
        while (a.length < 8) {
            a.push(0);
        }
        this.pushArray(a.slice(0, 8));
    }

    /** Get a `symbol` */
    public getSymbol(): { name: string, precision: number } {
        const precision = this.get();
        const a = this.getUint8Array(7);
        let len;
        for (len = 0; len < a.length; ++len) {
            if (!a[len]) {
                break;
            }
        }
        const name = this.textDecoder.decode(new Uint8Array(a.buffer, a.byteOffset, len));
        return { name, precision };
    }

    /** Append an asset */
    public pushAsset(s: string): void {
        if (typeof s !== 'string') {
            throw new Error('Expected string containing asset');
        }
        s = s.trim();
        let pos = 0;
        let amount = '';
        let precision = 0;
        if (s[pos] === '-') {
            amount += '-';
            ++pos;
        }
        let foundDigit = false;
        while (pos < s.length && s.charCodeAt(pos) >= '0'.charCodeAt(0) && s.charCodeAt(pos) <= '9'.charCodeAt(0)) {
            foundDigit = true;
            amount += s[pos];
            ++pos;
        }
        if (!foundDigit) {
            throw new Error('Asset must begin with a number');
        }
        if (s[pos] === '.') {
            ++pos;
            while (pos < s.length && s.charCodeAt(pos) >= '0'.charCodeAt(0) && s.charCodeAt(pos) <= '9'.charCodeAt(0)) {
                amount += s[pos];
                ++precision;
                ++pos;
            }
        }
        const name = s.substr(pos).trim();
        this.pushArray(numeric.signedDecimalToBinary(8, amount));
        this.pushSymbol({ name, precision });
    }

    /** Get an asset */
    public getAsset(): string {
        const amount = this.getUint8Array(8);
        const { name, precision } = this.getSymbol();
        let s = numeric.signedBinaryToDecimal(amount, precision + 1);
        if (precision) {
            s = s.substr(0, s.length - precision) + '.' + s.substr(s.length - precision);
        }
        return s + ' ' + name;
    }

    /** Append a public key */
    public pushPublicKey(s: string): void {
        const key = numeric.stringToPublicKey(s);
        this.push(key.type);
        this.pushArray(key.data);
    }

    /** Get a public key */
    public getPublicKey(): string {
        const type = this.get();
        let data: Uint8Array;
        if (type === numeric.KeyType.wa) {
            const begin = this.readPos;
            this.skip(34);
            this.skip(this.getVaruint32());
            data = new Uint8Array(this.array.buffer, this.array.byteOffset + begin, this.readPos - begin);
        } else {
            data = this.getUint8Array(numeric.publicKeyDataSize);
        }
        return numeric.publicKeyToString({ type, data });
    }

    /** Append a private key */
    public pushPrivateKey(s: string): void {
        const key = numeric.stringToPrivateKey(s);
        this.push(key.type);
        this.pushArray(key.data);
    }

    /** Get a private key */
    public getPrivateKey(): string {
        const type = this.get();
        const data = this.getUint8Array(numeric.privateKeyDataSize);
        return numeric.privateKeyToString({ type, data });
    }

    /** Append a signature */
    public pushSignature(s: string): void {
        const key = numeric.stringToSignature(s);
        this.push(key.type);
        this.pushArray(key.data);
    }

    /** Get a signature */
    public getSignature(): string {
        const type = this.get();
        let data: Uint8Array;
        if (type === numeric.KeyType.wa) {
            const begin = this.readPos;
            this.skip(65);
            this.skip(this.getVaruint32());
            this.skip(this.getVaruint32());
            data = new Uint8Array(this.array.buffer, this.array.byteOffset + begin, this.readPos - begin);
        } else {
            data = this.getUint8Array(numeric.signatureDataSize);
        }
        return numeric.signatureToString({ type, data });
    }
} // SerialBuffer

/** Is this a supported ABI version? */
export const supportedAbiVersion = (version: string): boolean => {
    return version.startsWith('eosio::abi/1.');
};

const checkDateParse = (date: string): number => {
    const result = Date.parse(date);
    if (Number.isNaN(result)) {
        throw new Error('Invalid time format');
    }
    return result;
};

/** Convert date in ISO format to `time_point` (miliseconds since epoch) */
export const dateToTimePoint = (date: string): number => {
    return Math.round(checkDateParse(date + 'Z') * 1000);
};

/** Convert `time_point` (miliseconds since epoch) to date in ISO format */
export const timePointToDate = (us: number): string => {
    const s = (new Date(us / 1000)).toISOString();
    return s.substr(0, s.length - 1);
};

/** Convert date in ISO format to `time_point_sec` (seconds since epoch) */
export const dateToTimePointSec = (date: string): number => {
    return Math.round(checkDateParse(date + 'Z') / 1000);
};

/** Convert `time_point_sec` (seconds since epoch) to to date in ISO format */
export const timePointSecToDate = (sec: number): string => {
    const s = (new Date(sec * 1000)).toISOString();
    return s.substr(0, s.length - 1);
};

/** Convert date in ISO format to `block_timestamp_type` (half-seconds since a different epoch) */
export const dateToBlockTimestamp = (date: string): number => {
    return Math.round((checkDateParse(date + 'Z') - 946684800000) / 500);
};

/** Convert `block_timestamp_type` (half-seconds since a different epoch) to to date in ISO format */
export const blockTimestampToDate = (slot: number): string => {
    const s = (new Date(slot * 500 + 946684800000)).toISOString();
    return s.substr(0, s.length - 1);
};

/** Convert `string` to `Symbol`. format: `precision,NAME`. */
export const stringToSymbol = (s: string): { name: string, precision: number } => {
    if (typeof s !== 'string') {
        throw new Error('Expected string containing symbol');
    }
    const m = s.match(/^([0-9]+),([A-Z]+)$/);
    if (!m) {
        throw new Error('Invalid symbol');
    }
    return { name: m[2], precision: +m[1] };
};

/** Convert `Symbol` to `string`. format: `precision,NAME`. */
export const symbolToString = ({ name, precision }: { name: string, precision: number }): string => {
    return precision + ',' + name;
};

/** Convert binary data to hex */
export const arrayToHex = (data: Uint8Array): string => {
    let result = '';
    for (const x of data) {
        result += ('00' + x.toString(16)).slice(-2);
    }
    return result.toUpperCase();
};

/** Convert hex to binary data */
export const hexToUint8Array = (hex: string): Uint8Array => {
    if (typeof hex !== 'string') {
        throw new Error('Expected string containing hex digits');
    }
    if (hex.length % 2) {
        throw new Error('Odd number of hex digits');
    }
    const l = hex.length / 2;
    const result = new Uint8Array(l);
    for (let i = 0; i < l; ++i) {
        const x = parseInt(hex.substr(i * 2, 2), 16);
        if (Number.isNaN(x)) {
            throw new Error('Expected hex string');
        }
        result[i] = x;
    }
    return result;
};

function serializeUnknown(buffer: SerialBuffer, data: any): SerialBuffer {
    throw new Error('Don\'t know how to serialize ' + this.name);
}

function deserializeUnknown(buffer: SerialBuffer): SerialBuffer {
    throw new Error('Don\'t know how to deserialize ' + this.name);
}

function serializeStruct(
    this: Type, buffer: SerialBuffer, data: any, state = new SerializerState(), allowExtensions = true
): void {
    if (typeof data !== 'object') {
        throw new Error('expected object containing data: ' + JSON.stringify(data));
    }
    if (this.base) {
        this.base.serialize(buffer, data, state, allowExtensions);
    }
    for (const field of this.fields) {
        if (field.name in data) {
            if (state.skippedBinaryExtension) {
                throw new Error('unexpected ' + this.name + '.' + field.name);
            }
            field.type.serialize(
                buffer, data[field.name], state, allowExtensions && field === this.fields[this.fields.length - 1]);
        } else {
            if (allowExtensions && field.type.extensionOf) {
                state.skippedBinaryExtension = true;
            } else {
                throw new Error('missing ' + this.name + '.' + field.name + ' (type=' + field.type.name + ')');
            }
        }
    }
}

function deserializeStruct(this: Type, buffer: SerialBuffer, state = new SerializerState(), allowExtensions = true): any {
    let result;
    if (this.base) {
        result = this.base.deserialize(buffer, state, allowExtensions);
    } else {
        result = {};
    }
    for (const field of this.fields) {
        if (allowExtensions && field.type.extensionOf && !buffer.haveReadData()) {
            state.skippedBinaryExtension = true;
        } else {
            result[field.name] = field.type.deserialize(buffer, state, allowExtensions);
        }
    }
    return result;
}

function serializeVariant(
    this: Type, buffer: SerialBuffer, data: any, state?: SerializerState, allowExtensions?: boolean
): void {
    if (!Array.isArray(data) || data.length !== 2 || typeof data[0] !== 'string') {
        throw new Error('expected variant: ["type", value]');
    }
    const i = this.fields.findIndex((field: Field) => field.name === data[0]);
    if (i < 0) {
        throw new Error(`type "${data[0]}" is not valid for variant`);
    }
    buffer.pushVaruint32(i);
    this.fields[i].type.serialize(buffer, data[1], state, allowExtensions);
}

function deserializeVariant(this: Type, buffer: SerialBuffer, state?: SerializerState, allowExtensions?: boolean): any[] {
    const i = buffer.getVaruint32();
    if (i >= this.fields.length) {
        throw new Error(`type index ${i} is not valid for variant`);
    }
    const field = this.fields[i];
    return [field.name, field.type.deserialize(buffer, state, allowExtensions)];
}

function serializeArray(
    this: Type, buffer: SerialBuffer, data: any[], state?: SerializerState, allowExtensions?: boolean
): void {
    buffer.pushVaruint32(data.length);
    for (const item of data) {
        this.arrayOf.serialize(buffer, item, state, false);
    }
}

function deserializeArray(this: Type, buffer: SerialBuffer, state?: SerializerState, allowExtensions?: boolean): any[] {
    const len = buffer.getVaruint32();
    const result = [];
    for (let i = 0; i < len; ++i) {
        result.push(this.arrayOf.deserialize(buffer, state, false));
    }
    return result;
}

function serializeOptional(
    this: Type, buffer: SerialBuffer, data: any, state?: SerializerState, allowExtensions?: boolean
): void {
    if (data === null || data === undefined) {
        buffer.push(0);
    } else {
        buffer.push(1);
        this.optionalOf.serialize(buffer, data, state, allowExtensions);
    }
}

function deserializeOptional(this: Type, buffer: SerialBuffer, state?: SerializerState, allowExtensions?: boolean): any {
    if (buffer.get()) {
        return this.optionalOf.deserialize(buffer, state, allowExtensions);
    } else {
        return null;
    }
}

function serializeExtension(
    this: Type, buffer: SerialBuffer, data: any, state?: SerializerState, allowExtensions?: boolean
): void {
    this.extensionOf.serialize(buffer, data, state, allowExtensions);
}

function deserializeExtension(this: Type, buffer: SerialBuffer, state?: SerializerState, allowExtensions?: boolean): any {
    return this.extensionOf.deserialize(buffer, state, allowExtensions);
}

function serializeObject(
    this: Type, buffer: SerialBuffer, data: any, state?: SerializerState, allowExtensions?: boolean
): void {
    const entries = Object.entries(data);
    buffer.pushVaruint32(entries.length);
    for (const [key, value] of entries) {
        const keyType = this.fields[0].type;
        const dataType = this.fields[1].type;
        keyType.serialize(buffer, key, state, allowExtensions);
        dataType.serialize(buffer, value, state, allowExtensions);
    }
}

function deserializeObject(this: Type, buffer: SerialBuffer, state?: SerializerState, allowExtensions?: boolean): any {
    const len = buffer.getVaruint32();
    const result = {} as any;
    for (let i = 0; i < len; ++i) {
        const keyType = this.fields[0].type;
        const dataType = this.fields[1].type;
        const key = keyType.deserialize(buffer, state, allowExtensions);
        (result as any)[key] = dataType.deserialize(buffer, state, allowExtensions);
    }
    return result;
}

function serializePair(
    this: Type, buffer: SerialBuffer, data: any, state?: SerializerState, allowExtensions?: boolean
): void {
    buffer.pushVaruint32(data.length);
    data.forEach((item: [number, string]) => {
        this.fields[0].type.serialize(buffer, item[0], state, allowExtensions);
        this.fields[1].type.serialize(buffer, item[1], state, allowExtensions);
    });
}

function deserializePair(this: Type, buffer: SerialBuffer, state?: SerializerState, allowExtensions?: boolean): any {
    const result = [] as any;
    const len = buffer.getVaruint32();
    for (let i = 0; i < len; ++i) {
        result.push(this.fields[0].type.deserialize(buffer, state, allowExtensions));
        result.push(this.fields[1].type.deserialize(buffer, state, allowExtensions));
    }
    return result;
}

interface CreateTypeArgs {
    name?: string;
    aliasOfName?: string;
    arrayOf?: Type;
    optionalOf?: Type;
    extensionOf?: Type;
    baseName?: string;
    base?: Type;
    fields?: Field[];
    serialize?: (buffer: SerialBuffer, data: any, state?: SerializerState, allowExtensions?: boolean) => void;
    deserialize?: (buffer: SerialBuffer, state?: SerializerState, allowExtensions?: boolean) => any;
}

const createType = (attrs: CreateTypeArgs): Type => {
    return {
        name: '<missing name>',
        aliasOfName: '',
        arrayOf: null,
        optionalOf: null,
        extensionOf: null,
        baseName: '',
        base: null,
        fields: [],
        serialize: serializeUnknown,
        deserialize: deserializeUnknown,
        ...attrs,
    };
};

const checkRange = (orig: number, converted: number): number => {
    if (Number.isNaN(+orig) || Number.isNaN(+converted) || (typeof orig !== 'number' && typeof orig !== 'string')) {
        throw new Error('Expected number');
    }
    if (+orig !== +converted) {
        throw new Error('Number is out of range');
    }
    return +orig;
};

/** Create the set of types built-in to the abi format */
export const createInitialTypes = (): Map<string, Type> => {
    const result: Map<string, Type> = new Map(Object.entries({
        bool: createType({
            name: 'bool',
            serialize: (buffer: SerialBuffer, data: boolean) => {
                if ( !(typeof data === 'boolean' || typeof data === 'number' && ( data === 1 || data === 0))) {
                    throw new Error('Expected boolean or number equal to 1 or 0');
                }
                buffer.push(data ? 1 : 0);
            },
            deserialize: (buffer: SerialBuffer) => { return !!buffer.get(); },
        }),
        uint8: createType({
            name: 'uint8',
            serialize: (buffer: SerialBuffer, data: number) => { buffer.push(checkRange(data, data & 0xff)); },
            deserialize: (buffer: SerialBuffer) => { return buffer.get(); },
        }),
        int8: createType({
            name: 'int8',
            serialize: (buffer: SerialBuffer, data: number) => { buffer.push(checkRange(data, data << 24 >> 24)); },
            deserialize: (buffer: SerialBuffer) => { return buffer.get() << 24 >> 24; },
        }),
        uint16: createType({
            name: 'uint16',
            serialize: (buffer: SerialBuffer, data: number) => { buffer.pushUint16(checkRange(data, data & 0xffff)); },
            deserialize: (buffer: SerialBuffer) => { return buffer.getUint16(); },
        }),
        int16: createType({
            name: 'int16',
            serialize: (buffer: SerialBuffer, data: number) => { buffer.pushUint16(checkRange(data, data << 16 >> 16)); },
            deserialize: (buffer: SerialBuffer) => { return buffer.getUint16() << 16 >> 16; },
        }),
        uint32: createType({
            name: 'uint32',
            serialize: (buffer: SerialBuffer, data: number) => { buffer.pushUint32(checkRange(data, data >>> 0)); },
            deserialize: (buffer: SerialBuffer) => { return buffer.getUint32(); },
        }),
        uint64: createType({
            name: 'uint64',
            serialize: (buffer: SerialBuffer, data: string | number) => {
                buffer.pushArray(numeric.decimalToBinary(8, '' + data));
            },
            deserialize: (buffer: SerialBuffer) => { return numeric.binaryToDecimal(buffer.getUint8Array(8)); },
        }),
        int64: createType({
            name: 'int64',
            serialize: (buffer: SerialBuffer, data: string | number) => {
                buffer.pushArray(numeric.signedDecimalToBinary(8, '' + data));
            },
            deserialize: (buffer: SerialBuffer) => { return numeric.signedBinaryToDecimal(buffer.getUint8Array(8)); },
        }),
        int32: createType({
            name: 'int32',
            serialize: (buffer: SerialBuffer, data: number) => { buffer.pushUint32(checkRange(data, data | 0)); },
            deserialize: (buffer: SerialBuffer) => { return buffer.getUint32() | 0; },
        }),
        varuint32: createType({
            name: 'varuint32',
            serialize: (buffer: SerialBuffer, data: number) => { buffer.pushVaruint32(checkRange(data, data >>> 0)); },
            deserialize: (buffer: SerialBuffer) => { return buffer.getVaruint32(); },
        }),
        varint32: createType({
            name: 'varint32',
            serialize: (buffer: SerialBuffer, data: number) => { buffer.pushVarint32(checkRange(data, data | 0)); },
            deserialize: (buffer: SerialBuffer) => { return buffer.getVarint32(); },
        }),
        uint128: createType({
            name: 'uint128',
            serialize: (buffer: SerialBuffer, data: string) => { buffer.pushArray(numeric.decimalToBinary(16, '' + data)); },
            deserialize: (buffer: SerialBuffer) => { return numeric.binaryToDecimal(buffer.getUint8Array(16)); },
        }),
        int128: createType({
            name: 'int128',
            serialize: (buffer: SerialBuffer, data: string) => {
                buffer.pushArray(numeric.signedDecimalToBinary(16, '' + data));
            },
            deserialize: (buffer: SerialBuffer) => { return numeric.signedBinaryToDecimal(buffer.getUint8Array(16)); },
        }),
        float32: createType({
            name: 'float32',
            serialize: (buffer: SerialBuffer, data: number) => { buffer.pushFloat32(data); },
            deserialize: (buffer: SerialBuffer) => { return buffer.getFloat32(); },
        }),
        float64: createType({
            name: 'float64',
            serialize: (buffer: SerialBuffer, data: number) => { buffer.pushFloat64(data); },
            deserialize: (buffer: SerialBuffer) => { return buffer.getFloat64(); },
        }),
        float128: createType({
            name: 'float128',
            serialize: (buffer: SerialBuffer, data: string) => { buffer.pushUint8ArrayChecked(hexToUint8Array(data), 16); },
            deserialize: (buffer: SerialBuffer) => { return arrayToHex(buffer.getUint8Array(16)); },
        }),

        bytes: createType({
            name: 'bytes',
            serialize: (buffer: SerialBuffer, data: string | Uint8Array | number[]) => {
                if (data instanceof Uint8Array || Array.isArray(data)) {
                    buffer.pushBytes(data);
                } else {
                    buffer.pushBytes(hexToUint8Array(data));
                }
            },
            deserialize: (buffer: SerialBuffer, state?: SerializerState) => {
                if (state && state.options.bytesAsUint8Array) {
                    return buffer.getBytes();
                } else {
                    return arrayToHex(buffer.getBytes());
                }
            },
        }),
        string: createType({
            name: 'string',
            serialize: (buffer: SerialBuffer, data: string) => { buffer.pushString(data); },
            deserialize: (buffer: SerialBuffer) => { return buffer.getString(); },
        }),
        name: createType({
            name: 'name',
            serialize: (buffer: SerialBuffer, data: string) => { buffer.pushName(data); },
            deserialize: (buffer: SerialBuffer) => { return buffer.getName(); },
        }),
        time_point: createType({
            name: 'time_point',
            serialize: (buffer: SerialBuffer, data: string) => { buffer.pushNumberAsUint64(dateToTimePoint(data)); },
            deserialize: (buffer: SerialBuffer) => { return timePointToDate(buffer.getUint64AsNumber()); },
        }),
        time_point_sec: createType({
            name: 'time_point_sec',
            serialize: (buffer: SerialBuffer, data: string) => { buffer.pushUint32(dateToTimePointSec(data)); },
            deserialize: (buffer: SerialBuffer) => { return timePointSecToDate(buffer.getUint32()); },
        }),
        block_timestamp_type: createType({
            name: 'block_timestamp_type',
            serialize: (buffer: SerialBuffer, data: string) => { buffer.pushUint32(dateToBlockTimestamp(data)); },
            deserialize: (buffer: SerialBuffer) => { return blockTimestampToDate(buffer.getUint32()); },
        }),
        symbol_code: createType({
            name: 'symbol_code',
            serialize: (buffer: SerialBuffer, data: string) => { buffer.pushSymbolCode(data); },
            deserialize: (buffer: SerialBuffer) => { return buffer.getSymbolCode(); },
        }),
        symbol: createType({
            name: 'symbol',
            serialize: (buffer: SerialBuffer, data: string) => { buffer.pushSymbol(stringToSymbol(data)); },
            deserialize: (buffer: SerialBuffer) => { return symbolToString(buffer.getSymbol()); },
        }),
        asset: createType({
            name: 'asset',
            serialize: (buffer: SerialBuffer, data: string) => { buffer.pushAsset(data); },
            deserialize: (buffer: SerialBuffer) => { return buffer.getAsset(); },
        }),
        checksum160: createType({
            name: 'checksum160',
            serialize: (buffer: SerialBuffer, data: string) => { buffer.pushUint8ArrayChecked(hexToUint8Array(data), 20); },
            deserialize: (buffer: SerialBuffer) => { return arrayToHex(buffer.getUint8Array(20)); },
        }),
        checksum256: createType({
            name: 'checksum256',
            serialize: (buffer: SerialBuffer, data: string) => { buffer.pushUint8ArrayChecked(hexToUint8Array(data), 32); },
            deserialize: (buffer: SerialBuffer) => { return arrayToHex(buffer.getUint8Array(32)); },
        }),
        checksum512: createType({
            name: 'checksum512',
            serialize: (buffer: SerialBuffer, data: string) => { buffer.pushUint8ArrayChecked(hexToUint8Array(data), 64); },
            deserialize: (buffer: SerialBuffer) => { return arrayToHex(buffer.getUint8Array(64)); },
        }),
        public_key: createType({
            name: 'public_key',
            serialize: (buffer: SerialBuffer, data: string) => { buffer.pushPublicKey(data); },
            deserialize: (buffer: SerialBuffer) => { return buffer.getPublicKey(); },
        }),
        private_key: createType({
            name: 'private_key',
            serialize: (buffer: SerialBuffer, data: string) => { buffer.pushPrivateKey(data); },
            deserialize: (buffer: SerialBuffer) => { return buffer.getPrivateKey(); },
        }),
        signature: createType({
            name: 'signature',
            serialize: (buffer: SerialBuffer, data: string) => { buffer.pushSignature(data); },
            deserialize: (buffer: SerialBuffer) => { return buffer.getSignature(); },
        }),
    }));

    result.set('extended_asset', createType({
        name: 'extended_asset',
        baseName: '',
        fields: [
            { name: 'quantity', typeName: 'asset', type: result.get('asset') },
            { name: 'contract', typeName: 'name', type: result.get('name') },
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));

    return result;
}; // createInitialTypes()

export const createAbiTypes = (): Map<string, Type> => {
    const initialTypes = createInitialTypes();
    initialTypes.set('extensions_entry', createType({
        name: 'extensions_entry',
        baseName: '',
        fields: [
            { name: 'tag', typeName: 'uint16', type: null },
            { name: 'value', typeName: 'bytes', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('type_def', createType({
        name: 'type_def',
        baseName: '',
        fields: [
            { name: 'new_type_name', typeName: 'string', type: null },
            { name: 'type', typeName: 'string', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('field_def', createType({
        name: 'field_def',
        baseName: '',
        fields: [
            { name: 'name', typeName: 'string', type: null },
            { name: 'type', typeName: 'string', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('struct_def', createType({
        name: 'struct_def',
        baseName: '',
        fields: [
            { name: 'name', typeName: 'string', type: null },
            { name: 'base', typeName: 'string', type: null },
            { name: 'fields', typeName: 'field_def[]', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('action_def', createType({
        name: 'action_def',
        baseName: '',
        fields: [
            { name: 'name', typeName: 'name', type: null },
            { name: 'type', typeName: 'string', type: null },
            { name: 'ricardian_contract', typeName: 'string', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('table_def', createType({
        name: 'table_def',
        baseName: '',
        fields: [
            { name: 'name', typeName: 'name', type: null },
            { name: 'index_type', typeName: 'string', type: null },
            { name: 'key_names', typeName: 'string[]', type: null },
            { name: 'key_types', typeName: 'string[]', type: null },
            { name: 'type', typeName: 'string', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('clause_pair', createType({
        name: 'clause_pair',
        baseName: '',
        fields: [
            { name: 'id', typeName: 'string', type: null },
            { name: 'body', typeName: 'string', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('error_message', createType({
        name: 'error_message',
        baseName: '',
        fields: [
            { name: 'error_code', typeName: 'uint64', type: null },
            { name: 'error_msg', typeName: 'string', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('variant_def', createType({
        name: 'variant_def',
        baseName: '',
        fields: [
            { name: 'name', typeName: 'string', type: null },
            { name: 'types', typeName: 'string[]', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('action_result', createType({
        name: 'action_result',
        baseName: '',
        fields: [
            { name: 'name', typeName: 'name', type: null },
            { name: 'result_type', typeName: 'string', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('primary_key_index_def', createType({
        name: 'primary_key_index_def',
        baseName: '',
        fields: [
            { name: 'name', typeName: 'name', type: null },
            { name: 'type', typeName: 'string', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('secondary_index_def', createType({
        name: 'secondary_index_def',
        baseName: '',
        fields: [
            { name: 'type', typeName: 'string', type: null },
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('secondary_indices', createType({
        name: 'secondary_indices',
        baseName: '',
        fields: [
            { name: 'name', typeName: 'name', type: null },
            { name: 'secondary_index_def', typeName: 'secondary_index_def', type: null }
        ],
        serialize: serializeObject,
        deserialize: deserializeObject,
    }));
    initialTypes.set('kv_table_entry_def', createType({
        name: 'kv_table_entry_def',
        baseName: '',
        fields: [
            { name: 'type', typeName: 'string', type: null },
            { name: 'primary_index', typeName: 'primary_key_index_def', type: null },
            { name: 'secondary_indices', typeName: 'secondary_indices', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('kv_table', createType({
        name: 'kv_table',
        baseName: '',
        fields: [
            { name: 'name', typeName: 'name', type: null },
            { name: 'kv_table_entry_def', typeName: 'kv_table_entry_def', type: null }
        ],
        serialize: serializeObject,
        deserialize: deserializeObject
    }));
    initialTypes.set('abi_def', createType({
        name: 'abi_def',
        baseName: '',
        fields: [
            { name: 'version', typeName: 'string', type: null },
            { name: 'types', typeName: 'type_def[]', type: null },
            { name: 'structs', typeName: 'struct_def[]', type: null },
            { name: 'actions', typeName: 'action_def[]', type: null },
            { name: 'tables', typeName: 'table_def[]', type: null },
            { name: 'ricardian_clauses', typeName: 'clause_pair[]', type: null },
            { name: 'error_messages', typeName: 'error_message[]', type: null },
            { name: 'abi_extensions', typeName: 'extensions_entry[]', type: null },
            { name: 'variants', typeName: 'variant_def[]$', type: null },
            { name: 'action_results', typeName: 'action_result[]$', type: null },
            { name: 'kv_tables', typeName: 'kv_table$', type: null },
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    return initialTypes;
};

export const createTransactionExtensionTypes = (): Map<string, Type> => {
    const initialTypes = createInitialTypes();
    initialTypes.set('resource_payer', createType({
        name: 'resource_payer',
        baseName: '',
        fields: [
            { name: 'payer', typeName: 'name', type: null },
            { name: 'max_net_bytes', typeName: 'uint64', type: null },
            { name: 'max_cpu_us', typeName: 'uint64', type: null },
            { name: 'max_memory_bytes', typeName: 'uint64', type: null },
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    return initialTypes;
};

export const createTransactionTypes = (): Map<string, Type> => {
    const initialTypes = createInitialTypes();
    initialTypes.set('permission_level', createType({
        name: 'permission_level',
        baseName: '',
        fields: [
            { name: 'actor', typeName: 'name', type: null },
            { name: 'permission', typeName: 'name', type: null },
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('action', createType({
        name: 'action',
        baseName: '',
        fields: [
            { name: 'account', typeName: 'name', type: null },
            { name: 'name', typeName: 'name', type: null },
            { name: 'authorization', typeName: 'permission_level[]', type: null },
            { name: 'data', typeName: 'bytes', type: null },
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('extension', createType({
        name: 'extension',
        baseName: '',
        fields: [
            { name: 'type', typeName: 'uint16', type: null },
            { name: 'data', typeName: 'bytes', type: null },
        ],
        serialize: serializePair,
        deserialize: deserializePair,
    }));
    initialTypes.set('transaction_header', createType({
        name: 'transaction_header',
        baseName: '',
        fields: [
            { name: 'expiration', typeName: 'time_point_sec', type: null },
            { name: 'ref_block_num', typeName: 'uint16', type: null },
            { name: 'ref_block_prefix', typeName: 'uint32', type: null },
            { name: 'max_net_usage_words', typeName: 'varuint32', type: null },
            { name: 'max_cpu_usage_ms', typeName: 'uint8', type: null },
            { name: 'delay_sec', typeName: 'varuint32', type: null },
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('transaction', createType({
        name: 'transaction',
        baseName: 'transaction_header',
        fields: [
            { name: 'context_free_actions', typeName: 'action[]', type: null },
            { name: 'actions', typeName: 'action[]', type: null },
            { name: 'transaction_extensions', typeName: 'extension', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    return initialTypes;
};

/** Get type from `types` */
export const getType = (types: Map<string, Type>, name: string): Type => {
    const type = types.get(name);
    if (type && type.aliasOfName) {
        return getType(types, type.aliasOfName);
    }
    if (type) {
        return type;
    }
    if (name.endsWith('[]')) {
        return createType({
            name,
            arrayOf: getType(types, name.substr(0, name.length - 2)),
            serialize: serializeArray,
            deserialize: deserializeArray,
        });
    }
    if (name.endsWith('?')) {
        return createType({
            name,
            optionalOf: getType(types, name.substr(0, name.length - 1)),
            serialize: serializeOptional,
            deserialize: deserializeOptional,
        });
    }
    if (name.endsWith('$')) {
        return createType({
            name,
            extensionOf: getType(types, name.substr(0, name.length - 1)),
            serialize: serializeExtension,
            deserialize: deserializeExtension,
        });
    }
    throw new Error('Unknown type: ' + name);
};

/**
 * Get types from abi
 *
 * @param initialTypes Set of types to build on.
 * In most cases, it's best to fill this from a fresh call to `getTypesFromAbi()`.
 */
export const getTypesFromAbi = (initialTypes: Map<string, Type>, abi?: Abi): Map<string, Type> => {
    const types = new Map(initialTypes);
    if (abi && abi.types) {
        for (const { new_type_name, type } of abi.types) {
            types.set(new_type_name,
                createType({ name: new_type_name, aliasOfName: type }));
        }
    }
    if (abi && abi.structs) {
        for (const { name, base, fields } of abi.structs) {
            types.set(name, createType({
                name,
                baseName: base,
                fields: fields.map(({ name: n, type }) => ({ name: n, typeName: type, type: null })),
                serialize: serializeStruct,
                deserialize: deserializeStruct,
            }));
        }
    }
    if (abi && abi.variants) {
        for (const { name, types: t } of abi.variants) {
            types.set(name, createType({
                name,
                fields: t.map((s) => ({ name: s, typeName: s, type: null })),
                serialize: serializeVariant,
                deserialize: deserializeVariant,
            }));
        }
    }
    for (const [name, type] of types) {
        if (type.baseName) {
            type.base = getType(types, type.baseName);
        }
        for (const field of type.fields) {
            field.type = getType(types, field.typeName);
        }
    }
    return types;
}; // getTypesFromAbi

const reverseHex = (h: string): string => {
    return h.substr(6, 2) + h.substr(4, 2) + h.substr(2, 2) + h.substr(0, 2);
};

/** TAPoS: Return transaction fields which reference `refBlock` and expire `expireSeconds` after `timestamp` */
export const transactionHeader = (refBlock: BlockTaposInfo, expireSeconds: number): TransactionHeader => {
    const timestamp = refBlock.header ? refBlock.header.timestamp : refBlock.timestamp;
    const prefix = parseInt(reverseHex(refBlock.id.substr(16, 8)), 16);

    return {
        expiration: timePointSecToDate(dateToTimePointSec(timestamp) + expireSeconds),
        ref_block_num: refBlock.block_num & 0xffff,
        ref_block_prefix: prefix,
    };
};

/** Convert action data to serialized form (hex) */
export const serializeActionData = (
    contract: Contract, account: string, name: string, data: any, textEncoder: TextEncoder, textDecoder: TextDecoder
): string => {
    const action = contract.actions.get(name);
    if (!action) {
        throw new Error(`Unknown action ${name} in contract ${account}`);
    }
    const buffer = new SerialBuffer({ textEncoder, textDecoder });
    action.serialize(buffer, data);
    return arrayToHex(buffer.asUint8Array());
};

/** Return action in serialized form */
export const serializeAction = (
    contract: Contract, account: string, name: string, authorization: Authorization[],
    data: any, textEncoder: TextEncoder, textDecoder: TextDecoder
): SerializedAction => {
    return {
        account,
        name,
        authorization,
        data: serializeActionData(contract, account, name, data, textEncoder, textDecoder),
    };
};

/** Deserialize action data. If `data` is a `string`, then it's assumed to be in hex. */
export const deserializeActionData = (
    contract: Contract, account: string, name: string, data: string | Uint8Array | number[],
    textEncoder: TextEncoder, textDecoder: TextDecoder
): any => {
    const action = contract.actions.get(name);
    if (typeof data === 'string') {
        data = hexToUint8Array(data);
    }
    if (!action) {
        throw new Error(`Unknown action ${name} in contract ${account}`);
    }
    const buffer = new SerialBuffer({ textDecoder, textEncoder });
    buffer.pushArray(data);
    return action.deserialize(buffer);
};

/** Deserialize action. If `data` is a `string`, then it's assumed to be in hex. */
export const deserializeAction = (
    contract: Contract, account: string, name: string, authorization: Authorization[],
    data: string | Uint8Array | number[], textEncoder: TextEncoder, textDecoder: TextDecoder
): Action => {
    return {
        account,
        name,
        authorization,
        data: deserializeActionData(contract, account, name, data, textEncoder, textDecoder),
    };
};

export const serializeAnyvar = (buffer: SerialBuffer, anyvar: Anyvar): void => {
    let def: AnyvarDef;
    let value: any;
    if (anyvar === null) {
        [def, value] = [anyvarDefs.null_t, anyvar];
    } else if (typeof anyvar === 'string') {
        [def, value] = [anyvarDefs.string, anyvar];
    } else if (typeof anyvar === 'number') {
        [def, value] = [anyvarDefs.int32, anyvar];
    } else if (anyvar instanceof Uint8Array) {
        [def, value] = [anyvarDefs.bytes, anyvar];
    } else if (Array.isArray(anyvar)) {
        [def, value] = [anyvarDefs.any_array, anyvar];
    } else if (Object.keys(anyvar).length === 2 && anyvar.hasOwnProperty('type') && anyvar.hasOwnProperty('value')) {
        [def, value] = [(anyvarDefs as any)[(anyvar as any).type] as AnyvarDef, (anyvar as any).value];
    } else {
        [def, value] = [anyvarDefs.any_object, anyvar];
    }
    buffer.pushVaruint32(def.index);
    def.type.serialize(buffer, value);
};

export const deserializeAnyvar = (buffer: SerialBuffer, state?: SerializerState): any => {
    const defIndex = buffer.getVaruint32();
    if (defIndex >= anyvarDefsByIndex.length) {
        throw new Error('Tried to deserialize unknown anyvar type');
    }
    const def = anyvarDefsByIndex[defIndex];
    const value = def.type.deserialize(buffer, state);
    if (state && (state.options as any).useShortForm || def.useShortForm) {
        return value;
    } else {
        return { type: def.type.name, value };
    }
};

export const deserializeAnyvarShort = (buffer: SerialBuffer): any => {
    return deserializeAnyvar(buffer, new SerializerState({ useShortForm: true } as any));
};

export const serializeAnyObject = (buffer: SerialBuffer, obj: any): void => {
    const entries = Object.entries(obj);
    buffer.pushVaruint32(entries.length);
    for (const [key, value] of entries) {
        buffer.pushString(key);
        serializeAnyvar(buffer, value as Anyvar);
    }
};

export const deserializeAnyObject = (buffer: SerialBuffer, state?: SerializerState): any => {
    const len = buffer.getVaruint32();
    const result = {};
    for (let i = 0; i < len; ++i) {
        let key = buffer.getString();
        if (key in result) {
            let j = 1;
            while (key + '_' + j in result) {
                ++j;
            }
            key = key + '_' + j;
        }
        (result as any)[key] = deserializeAnyvar(buffer, state);
    }
    return result;
};

export const serializeAnyArray = (buffer: SerialBuffer, arr: Anyvar[]): void => {
    buffer.pushVaruint32(arr.length);
    for (const x of arr) {
        serializeAnyvar(buffer, x);
    }
};

export const deserializeAnyArray = (buffer: SerialBuffer, state?: SerializerState): any[] => {
    const len = buffer.getVaruint32();
    const result = [];
    for (let i = 0; i < len; ++i) {
        result.push(deserializeAnyvar(buffer, state));
    }
    return result;
};

const addAdditionalTypes = (): Map<string, Type> => {
    const initialTypes = createInitialTypes();
    initialTypes.set('null_t', createType({
        name: 'null_t',
        serialize: (buffer: SerialBuffer, anyvar: Anyvar) => {},
        deserialize: (buffer: SerialBuffer, state?: SerializerState) => {}
    }));
    initialTypes.set('any_object', createType({
        name: 'any_object',
        serialize: serializeAnyObject,
        deserialize: deserializeAnyObject
    }));
    initialTypes.set('any_array', createType({
        name: 'any_array',
        serialize: serializeAnyArray,
        deserialize: deserializeAnyArray
    }));
    return initialTypes;
};

const additionalTypes = addAdditionalTypes();

const anyvarDefs = {
    null_t: { index: 0, useShortForm: true, type: additionalTypes.get('null_t') },
    int64: { index: 1, useShortForm: false, type: additionalTypes.get('int64') },
    uint64: { index: 2, useShortForm: false, type: additionalTypes.get('uint64') },
    int32: { index: 3, useShortForm: true, type: additionalTypes.get('int32') },
    uint32: { index: 4, useShortForm: false, type: additionalTypes.get('uint32') },
    int16: { index: 5, useShortForm: false, type: additionalTypes.get('int16') },
    uint16: { index: 6, useShortForm: false, type: additionalTypes.get('uint16') },
    int8: { index: 7, useShortForm: false, type: additionalTypes.get('int8') },
    uint8: { index: 8, useShortForm: false, type: additionalTypes.get('uint8') },
    time_point: { index: 9, useShortForm: false, type: additionalTypes.get('time_point') },
    checksum256: { index: 10, useShortForm: false, type: additionalTypes.get('checksum256') },
    float64: { index: 11, useShortForm: false, type: additionalTypes.get('float64') },
    string: { index: 12, useShortForm: true, type: additionalTypes.get('string') },
    any_object: { index: 13, useShortForm: true, type: additionalTypes.get('any_object') },
    any_array: { index: 14, useShortForm: true, type: additionalTypes.get('any_array') },
    bytes: { index: 15, useShortForm: false, type: additionalTypes.get('bytes') },
    symbol: { index: 16, useShortForm: false, type: additionalTypes.get('symbol') },
    symbol_code: { index: 17, useShortForm: false, type: additionalTypes.get('symbol_code') },
    asset: { index: 18, useShortForm: false, type: additionalTypes.get('asset') },
};

const anyvarDefsByIndex = [
    anyvarDefs.null_t,
    anyvarDefs.int64,
    anyvarDefs.uint64,
    anyvarDefs.int32,
    anyvarDefs.uint32,
    anyvarDefs.int16,
    anyvarDefs.uint16,
    anyvarDefs.int8,
    anyvarDefs.uint8,
    anyvarDefs.time_point,
    anyvarDefs.checksum256,
    anyvarDefs.float64,
    anyvarDefs.string,
    anyvarDefs.any_object,
    anyvarDefs.any_array,
    anyvarDefs.bytes,
    anyvarDefs.symbol,
    anyvarDefs.symbol_code,
    anyvarDefs.asset,
];

export const serializeQuery = (buffer: SerialBuffer, query: Query): void => {
    let method: string;
    let arg: Anyvar;
    let filter: Query[];
    if (typeof query === 'string') {
        method = query;
    } else if (Array.isArray(query) && query.length === 2) {
        [method, filter] = query;
    } else if (Array.isArray(query) && query.length === 3) {
        [method, arg, filter] = query;
    } else {
        [method, arg, filter] = [query.method, query.arg, query.filter];
    }
    buffer.pushString(method);

    if (arg === undefined) {
        buffer.push(0);
    } else {
        buffer.push(1);
        serializeAnyvar(buffer, arg);
    }

    if (filter === undefined) {
        buffer.push(0);
    } else {
        buffer.pushVaruint32(filter.length);
        for (const q of filter) {
            serializeQuery(buffer, q);
        }
    }
};
