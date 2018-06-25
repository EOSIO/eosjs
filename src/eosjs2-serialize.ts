// copyright defined in eosjs2/LICENSE.txt

'use strict';

import { Abi, BlockTaposInfo } from './eosjs2-jsonrpc';

export interface Field {
    name: string;
    typeName: string;
    type: Type;
}

export interface Type {
    name: string;
    aliasOfName: string;
    arrayOf: Type;
    optionalOf: Type;
    baseName: string;
    base: Type;
    fields: Field[];
    serialize: (buffer: SerialBuffer, data: any) => void;
    deserialize: (buffer: SerialBuffer) => any;
}

export interface Uint64 {
    low: number;
    high: number;
}

export interface Int64 {
    low: number;
    high: number;
}

export interface Symbol {
    name: string;
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

export interface Action {
    account: string;
    name: string;
    authorization: Authorization[];
    data: any;
}

export interface SerializedAction {
    account: string;
    name: string;
    authorization: Authorization[];
    data: Uint8Array;
}

export class SerialBuffer {
    length = 0;
    array = new Uint8Array(1024);
    readPos = 0;
    textEncoder: TextEncoder;
    textDecoder: TextDecoder;

    constructor({ textEncoder, textDecoder } = {} as { textEncoder: TextEncoder, textDecoder: TextDecoder }) {
        this.textEncoder = textEncoder || new TextEncoder;
        this.textDecoder = textDecoder || new TextDecoder('utf-8', { fatal: true });
    }

    reserve(size: number) {
        if (this.length + size <= this.array.length)
            return;
        let l = this.array.length;
        while (this.length + size > l)
            l = Math.ceil(l * 1.5);
        let newArray = new Uint8Array(l);
        newArray.set(this.array);
        this.array = newArray;
    }

    asUint8Array() {
        return new Uint8Array(this.array.buffer, 0, this.length);
    }

    pushArray(v: number[] | Uint8Array) {
        this.reserve(v.length);
        this.array.set(v, this.length);
        this.length += v.length;
    }

    push(...v: number[]) {
        this.pushArray(v);
    }

    get() {
        if (this.readPos < this.length)
            return this.array[this.readPos++];
        throw new Error('Read past end of buffer');
    }

    pushUint8ArrayChecked(v: Uint8Array, len: number) {
        if (v.length !== len)
            throw new Error('Binary data has incorrect size');
        this.pushArray(v);
    }

    getUint8Array(len: number) {
        if (this.readPos + len > this.length)
            throw new Error('Read past end of buffer');
        let result = new Uint8Array(this.array.buffer, this.readPos, len);
        this.readPos += len;
        return result;
    }

    pushUint16(v: number) {
        this.push((v >> 0) & 0xff, (v >> 8) & 0xff);
    }

    getUint16() {
        let v = 0;
        v |= this.get() << 0;
        v |= this.get() << 8;
        return v;
    }

    pushUint32(v: number) {
        this.push((v >> 0) & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >> 24) & 0xff);
    }

    getUint32() {
        let v = 0;
        v |= this.get() << 0;
        v |= this.get() << 8;
        v |= this.get() << 16;
        v |= this.get() << 24;
        return v >>> 0;
    }

    pushUint64(v: Uint64) {
        this.pushUint32(v.low);
        this.pushUint32(v.high);
    }

    getUint64(): Uint64 {
        let low = this.getUint32();
        let high = this.getUint32();
        return { low, high };
    }

    pushInt64(v: Int64) {
        this.pushUint32(v.low);
        this.pushUint32(v.high);
    }

    getInt64(): Int64 {
        return this.getUint64();
    }

    pushVaruint32(v: number) {
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

    getVaruint32() {
        let v = 0;
        let bit = 0;
        while (true) {
            let b = this.get();
            v |= (b & 0x7f) << bit;
            bit += 7;
            if (!(b & 0x80))
                break;
        }
        return v >>> 0;
    }

    pushFloat32(v: number) {
        this.pushArray(new Uint8Array((new Float32Array([v])).buffer));
    }

    getFloat32() {
        return new Float32Array(this.getUint8Array(4).slice().buffer)[0];
    }

    pushFloat64(v: number) {
        this.pushArray(new Uint8Array((new Float64Array([v])).buffer));
    }

    getFloat64() {
        return new Float64Array(this.getUint8Array(8).slice().buffer)[0];
    }

    pushName(s: string) {
        function charToSymbol(c: number) {
            if (c >= 'a'.charCodeAt(0) && c <= 'z'.charCodeAt(0))
                return (c - 'a'.charCodeAt(0)) + 6;
            if (c >= '1'.charCodeAt(0) && c <= '5'.charCodeAt(0))
                return (c - '1'.charCodeAt(0)) + 1;
            return 0;
        }
        let a = new Uint8Array(8);
        let bit = 63;
        for (let i = 0; i < s.length; ++i) {
            let c = charToSymbol(s.charCodeAt(i));
            if (bit < 5)
                c = c << 1;
            for (let j = 4; j >= 0; --j) {
                if (bit >= 0) {
                    a[Math.floor(bit / 8)] |= ((c >> j) & 1) << (bit % 8);
                    --bit;
                }
            }
        }
        this.pushArray(a);
    }

    getName() {
        let a = this.getUint8Array(8);
        let result = '';
        for (let bit = 63; bit >= 0;) {
            let c = 0;
            for (let i = 0; i < 5; ++i) {
                if (bit >= 0) {
                    c = (c << 1) | ((a[Math.floor(bit / 8)] >> (bit % 8)) & 1);
                    --bit;
                }
            }
            if (c >= 6)
                result += String.fromCharCode(c + 'a'.charCodeAt(0) - 6);
            else if (c >= 1)
                result += String.fromCharCode(c + '1'.charCodeAt(0) - 1);
            else
                result += '.';
        }
        if (result === '.............')
            return result;
        while (result.endsWith('.'))
            result = result.substr(0, result.length - 1);
        return result;
    }

    pushBytes(v: number[] | Uint8Array) {
        this.pushVaruint32(v.length);
        this.pushArray(v);
    }

    getBytes() {
        return this.getUint8Array(this.getVaruint32());
    }

    pushString(v: string) {
        this.pushBytes(this.textEncoder.encode(v));
    }

    getString() {
        return this.textDecoder.decode(this.getBytes());
    }

    pushSymbol({ name, precision }: Symbol) {
        let a = [precision & 0xff];
        a.push(...this.textEncoder.encode(name));
        while (a.length < 8)
            a.push(0);
        this.pushArray(a.slice(0, 8));
    }

    getSymbol(): Symbol {
        let precision = this.get();
        let a = this.getUint8Array(7);
        let len;
        for (len = 0; len < a.length; ++len)
            if (!a[len])
                break;
        let name = this.textDecoder.decode(new Uint8Array(a.buffer, 0, len));
        return { name, precision };
    }

    pushAsset(s: string) {
        // TODO: 56-bit precision loss
        s = s.trim();
        let pos = 0;
        let sign = 1;
        let amount = 0;
        let precision = 0;
        if (s[pos] === '-') {
            sign = -1;
            ++pos;
        }
        let foundDigit = false;
        while (pos < s.length && s.charCodeAt(pos) >= '0'.charCodeAt(0) && s.charCodeAt(pos) <= '9'.charCodeAt(0)) {
            foundDigit = true;
            amount = amount * 10 + s.charCodeAt(pos) - '0'.charCodeAt(0);
            ++pos;
        }
        if (!foundDigit)
            throw new Error('Asset must begin with a number');
        if (s[pos] === '.') {
            ++pos;
            while (pos < s.length && s.charCodeAt(pos) >= '0'.charCodeAt(0) && s.charCodeAt(pos) <= '9'.charCodeAt(0)) {
                amount = amount * 10 + s.charCodeAt(pos) - '0'.charCodeAt(0);
                ++precision;
                ++pos;
            }
        }
        let name = s.substr(pos).trim();
        this.pushInt64(numberToInt64(sign * amount));
        this.pushSymbol({ name, precision });
    }

    getAsset() {
        // TODO
        throw new Error("Don't know how to deserialize asset");
    }
} // SerialBuffer

export function numberToUint64(n: number) {
    return {
        low: n >>> 0,
        high: Math.floor(n / 0x100000000) >>> 0
    };
}

export function uint64ToNumber({ low, high }: Uint64) {
    return (high | 0) * 0x100000000 + (low | 0);
}

export function numberToInt64(n: number) {
    // TODO
    if (n < 0)
        throw new Error("Don't know how to convert negative 64-bit integers")
    return numberToUint64(n);
}

export function dateToTimePointSec(date: string) {
    return Math.round(Date.parse(date + 'Z') / 1000);
}

export function timePointSecToDate(sec: number) {
    let s = (new Date(sec * 1000)).toISOString();
    return s.substr(0, s.length - 1);
}

export function arrayToHex(data: Uint8Array) {
    let result = '';
    for (let x of data)
        result += ('00' + x.toString(16)).slice(-2);
    return result.toUpperCase();
}

export function hexToUint8Array(hex: string) {
    let l = hex.length / 2;
    let result = new Uint8Array(l);
    for (let i = 0; i < l; ++i)
        result[i] = parseInt(hex.substr(i * 2, 2), 16);
    return result;
}

function serializeUnknown(buffer: SerialBuffer, data: any): SerialBuffer {
    throw new Error("Don't know how to serialize " + this.name);
}

function deserializeUnknown(buffer: SerialBuffer): SerialBuffer {
    throw new Error("Don't know how to deserialize " + this.name);
}

function serializeStruct(buffer: SerialBuffer, data: any) {
    if (this.base)
        this.base.serialize(buffer, data);
    for (let field of this.fields) {
        if (!(field.name in data))
            throw new Error('missing ' + this.name + '.' + field.name + ' (type=' + field.type.name + ')');
        field.type.serialize(buffer, data[field.name]);
    }
}

function deserializeStruct(buffer: SerialBuffer) {
    let result;
    if (this.base)
        result = this.base.deserialize(buffer);
    else
        result = {};
    for (let field of this.fields)
        result[field.name] = field.type.deserialize(buffer);
    return result;
}

function serializeArray(buffer: SerialBuffer, data: any[]) {
    buffer.pushVaruint32(data.length);
    for (let item of data)
        this.arrayOf.serialize(buffer, item);
}

function deserializeArray(buffer: SerialBuffer) {
    let len = buffer.getVaruint32();
    let result = [];
    for (let i = 0; i < len; ++i)
        result.push(this.arrayOf.deserialize(buffer));
    return result;
}

function serializeOptional(buffer: SerialBuffer, data: any) {
    // TODO
    throw new Error("Don't know how to serialize " + this.name);
}

function deserializeOptional(buffer: SerialBuffer) {
    // TODO
    throw new Error("Don't know how to deserialize " + this.name);
}

interface CreateTypeArgs {
    name?: string;
    aliasOfName?: string;
    arrayOf?: Type;
    optionalOf?: Type;
    baseName?: string;
    base?: Type;
    fields?: Field[];
    serialize?: (buffer: SerialBuffer, data: any) => void;
    deserialize?: (buffer: SerialBuffer) => any;
}

function createType(attrs: CreateTypeArgs): Type {
    return {
        name: '<missing name>',
        aliasOfName: '',
        arrayOf: null,
        optionalOf: null,
        baseName: '',
        base: null,
        fields: [],
        serialize: serializeUnknown,
        deserialize: deserializeUnknown,
        ...attrs
    };
}

export function createInitialTypes(): Map<string, Type> {
    return new Map(Object.entries({
        bool: createType({
            name: 'bool',
            serialize(buffer: SerialBuffer, data: boolean) { buffer.push(data ? 1 : 0); },
            deserialize(buffer: SerialBuffer) { return !!buffer.get(); },
        }),
        uint8: createType({
            name: 'uint8',
            serialize(buffer: SerialBuffer, data: number) { buffer.push(data); },
            deserialize(buffer: SerialBuffer) { return buffer.get(); },
        }),
        int8: createType({
            name: 'int8',
            serialize(buffer: SerialBuffer, data: number) { buffer.push(data); },
            deserialize(buffer: SerialBuffer) { return buffer.get() << 24 >> 24; },
        }),
        uint16: createType({
            name: 'uint16',
            serialize(buffer: SerialBuffer, data: number) { buffer.pushUint16(data); },
            deserialize(buffer: SerialBuffer) { return buffer.getUint16(); },
        }),
        int16: createType({
            name: 'int16',
            serialize(buffer: SerialBuffer, data: number) { buffer.pushUint16(data); },
            deserialize(buffer: SerialBuffer) { return buffer.getUint16() << 16 >> 16; },
        }),
        uint32: createType({
            name: 'uint32',
            serialize(buffer: SerialBuffer, data: number) { buffer.pushUint32(data); },
            deserialize(buffer: SerialBuffer) { return buffer.getUint32(); },
        }),
        uint64: createType({
            name: 'uint64',
            serialize(buffer: SerialBuffer, data: Uint64) { buffer.pushUint64(data); },
            deserialize(buffer: SerialBuffer) { return buffer.getUint64(); },
        }),
        int64: createType({
            name: 'int64',
            serialize(buffer: SerialBuffer, data: Int64) { buffer.pushInt64(data); },
            deserialize(buffer: SerialBuffer) { return buffer.getInt64(); },
        }),
        int32: createType({
            name: 'int32',
            serialize(buffer: SerialBuffer, data: number) { buffer.pushUint32(data); },
            deserialize(buffer: SerialBuffer) { return buffer.getUint32() | 0; },
        }),
        varuint32: createType({
            name: 'varuint32',
            serialize(buffer: SerialBuffer, data: number) { buffer.pushVaruint32(data); },
            deserialize(buffer: SerialBuffer) { return buffer.getVaruint32(); },
        }),
        uint128: createType({
            name: 'uint128',
            serialize(buffer: SerialBuffer, data: Uint8Array) { buffer.pushUint8ArrayChecked(data, 16); },
            deserialize(buffer: SerialBuffer) { return buffer.getUint8Array(16); },
        }),
        int128: createType({
            name: 'int128',
            serialize(buffer: SerialBuffer, data: Uint8Array) { buffer.pushUint8ArrayChecked(data, 16); },
            deserialize(buffer: SerialBuffer) { return buffer.getUint8Array(16); },
        }),
        float32: createType({
            name: 'float32',
            serialize(buffer: SerialBuffer, data: number) { buffer.pushFloat32(data); },
            deserialize(buffer: SerialBuffer) { return buffer.getFloat32(); },
        }),
        float64: createType({
            name: 'float64',
            serialize(buffer: SerialBuffer, data: number) { buffer.pushFloat64(data); },
            deserialize(buffer: SerialBuffer) { return buffer.getFloat64(); },
        }),
        float128: createType({
            name: 'float128',
            serialize(buffer: SerialBuffer, data: string) { buffer.pushUint8ArrayChecked(hexToUint8Array(data), 16); },
            deserialize(buffer: SerialBuffer) { return arrayToHex(buffer.getUint8Array(16)); },
        }),

        bytes: createType({
            name: 'bytes',
            serialize(buffer: SerialBuffer, data: string) { buffer.pushBytes(hexToUint8Array(data)); },
            deserialize(buffer: SerialBuffer) { return arrayToHex(buffer.getBytes()); },
        }),
        string: createType({
            name: 'string',
            serialize(buffer: SerialBuffer, data: string) { buffer.pushString(data); },
            deserialize(buffer: SerialBuffer) { return buffer.getString(); },
        }),
        name: createType({
            name: 'name',
            serialize(buffer: SerialBuffer, data: string) { buffer.pushName(data); },
            deserialize(buffer: SerialBuffer) { return buffer.getName(); },
        }),
        time_point_sec: createType({
            name: 'time_point_sec',
            serialize(buffer: SerialBuffer, data: string) { buffer.pushUint32(dateToTimePointSec(data)); },
            deserialize(buffer: SerialBuffer) { return timePointSecToDate(buffer.getUint32()); },
        }),
        symbol: createType({
            name: 'symbol',
            serialize(buffer: SerialBuffer, data: Symbol) { buffer.pushSymbol(data); },
            deserialize(buffer: SerialBuffer) { return buffer.getSymbol(); },
        }),
        asset: createType({
            name: 'asset',
            serialize(buffer: SerialBuffer, data: string) { buffer.pushAsset(data); },
            deserialize(buffer: SerialBuffer) { return buffer.getAsset(); },
        }),
        checksum160: createType({
            name: 'checksum160',
            serialize(buffer: SerialBuffer, data: string) { buffer.pushUint8ArrayChecked(hexToUint8Array(data), 20); },
            deserialize(buffer: SerialBuffer) { return arrayToHex(buffer.getUint8Array(20)); },
        }),
        checksum256: createType({
            name: 'checksum256',
            serialize(buffer: SerialBuffer, data: string) { buffer.pushUint8ArrayChecked(hexToUint8Array(data), 32); },
            deserialize(buffer: SerialBuffer) { return arrayToHex(buffer.getUint8Array(32)); },
        }),
        checksum512: createType({
            name: 'checksum512',
            serialize(buffer: SerialBuffer, data: string) { buffer.pushUint8ArrayChecked(hexToUint8Array(data), 64); },
            deserialize(buffer: SerialBuffer) { return arrayToHex(buffer.getUint8Array(64)); },
        }),

        // TODO: implement these types
        public_key: createType({ name: 'public_key' }),
        signature: createType({ name: 'signature' }),
        varint32: createType({ name: 'varint32' }),
        time_point: createType({ name: 'time_point' }),
        block_timestamp_type: createType({ name: 'block_timestamp_type' }),
        symbol_code: createType({ name: 'symbol_code' }),
        extended_asset: createType({ name: 'extended_asset' }),
    }));
} // createInitialTypes()

export function getType(types: Map<string, Type>, name: string): Type {
    let type = types.get(name);
    if (type && type.aliasOfName)
        return getType(types, type.aliasOfName);
    if (type)
        return type;
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
    throw new Error('Unknown type: ' + name);
}

export function getTypesFromAbi(initialTypes: Map<string, Type>, abi: Abi) {
    let types = new Map(initialTypes);
    for (let { new_type_name, type } of abi.types)
        types.set(new_type_name,
            createType({ name: new_type_name, aliasOfName: type, }));
    for (let { name, base, fields } of abi.structs) {
        types.set(name, createType({
            name,
            baseName: base,
            fields: fields.map(({ name, type }) => ({ name, typeName: type, type: null })),
            serialize: serializeStruct,
            deserialize: deserializeStruct,
        }));
    }
    for (let [name, type] of types) {
        if (type.baseName)
            type.base = getType(types, type.baseName);
        for (let field of type.fields)
            field.type = getType(types, field.typeName);
    }
    return types;
} // getTypesFromAbi

export function transactionHeader(refBlock: BlockTaposInfo, expireSeconds: number) {
    return {
        expiration: timePointSecToDate(dateToTimePointSec(refBlock.timestamp) + expireSeconds),
        ref_block_num: refBlock.block_num,
        ref_block_prefix: refBlock.ref_block_prefix,
    };
};

export function serializeActionData(contract: Contract, account: string, name: string, data: any) {
    let action = contract.actions.get(name);
    if (!action)
        throw new Error('Unknown action ' + name + ' in contract ' + account);
    let buffer = new SerialBuffer;
    action.serialize(buffer, data);
    return buffer.asUint8Array();
}

export function serializeAction(contract: Contract, account: string, name: string, authorization: Authorization[], data: any): SerializedAction {
    return {
        account,
        name,
        authorization,
        data: serializeActionData(contract, account, name, data),
    };
}
