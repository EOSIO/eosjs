// Copyright 2018 Todd Fleming
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

'use strict';

import * as ecc from 'eosjs-ecc';

class EosError extends Error {
    constructor(json) {
        if (json.error.details)
            super(json.error.details[0].message);
        else
            super(json.message);
        this.json = json;
    }
}

class EosBuffer {
    constructor() {
        this.length = 0;
        this.array = new Uint8Array(1024);
        this.readPos = 0;
    }

    reserve(size) {
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

    pushArray(v) {
        if (v instanceof EosBuffer)
            v = v.asUint8Array();
        this.reserve(v.length);
        this.array.set(v, this.length);
        this.length += v.length;
    }

    push(...v) {
        this.pushArray(v);
    }

    get() {
        if (this.readPos < this.length)
            return this.array[this.readPos++];
        throw new Error('Read past end of buffer');
    }

    getUint8Array(len) {
        if (this.readPos + len > this.length)
            throw new Error('Read past end of buffer');
        let result = new Uint8Array(this.array.buffer, this.readPos, len);
        this.readPos += len;
        return result;
    }

    pushUint16(v) {
        this.push((v >> 0) & 0xff, (v >> 8) & 0xff);
    }

    getUint16() {
        let v = 0;
        v |= this.get() << 0;
        v |= this.get() << 8;
        return v;
    }

    pushUint32(v) {
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

    pushVaruint32(v) {
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

    pushName(s) {
        function charToSymbol(c) {
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
        this.push(...a);
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
        while (result.endsWith('.'))
            result = result.substr(0, result.length - 1);
        return result;
    }

    pushBytes(v) {
        this.pushVaruint32(v.length);
        this.pushArray(v);
    }

    getBytes() {
        return this.getUint8Array(this.getVaruint32());
    }
} // EosBuffer

function dateToSec(date) {
    return Math.round(Date.parse(date + 'Z') / 1000);
}

function secToDate(sec) {
    let s = (new Date(sec * 1000)).toISOString();
    return s.substr(0, s.length - 1);
}

function serializeUnknown(buffer, data) {
    throw new Error("Don't know how to serialize " + this.name);
}

function deserializeUnknown(buffer) {
    throw new Error("Don't know how to deserialize " + this.name);
}

function serializeStruct(buffer, data) {
    if (this.base)
        this.base.serialize(buffer, data);
    for (let field of this.fields) {
        if (!(field.name in data))
            throw new Error('missing ' + this.name + '.' + field.name + ' (type=' + field.type.name + ')');
        field.type.serialize(buffer, data[field.name]);
    }
    return buffer;
}

function deserializeStruct(buffer) {
    let result;
    if (this.base)
        result = this.base.deserialize(buffer);
    else
        result = {};
    for (let field of this.fields)
        result[field.name] = field.type.deserialize(buffer);
    return result;
}

function serializeArray(buffer, data) {
    buffer.pushVaruint32(data.length);
    for (let item of data)
        this.arrayOf.serialize(buffer, item);
    return buffer;
}

function deserializeArray(buffer) {
    let len = buffer.getVaruint32();
    let result = [];
    for (let i = 0; i < len; ++i)
        result.push(this.arrayOf.deserialize(buffer));
    return result;
}

function serializeOptional(buffer, data) {
    // TODO
    throw new Error("Don't know how to serialize " + this.name);
}

function deserializeOptional(buffer) {
    // TODO
    throw new Error("Don't know how to deserialize " + this.name);
}

function createType(attrs = {}) {
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

function createInitialTypes() {
    return {
        action_name: createType({ name: 'action_name', aliasOfName: 'name' }),
        permission_name: createType({ name: 'permission_name', aliasOfName: 'name' }),

        bytes: createType({
            name: 'bytes',
            serialize(buffer, data) { buffer.pushBytes(data); return buffer; },
            deserialize(buffer) { return buffer.getBytes(); },
        }),

        uint8: createType({
            name: 'uint8',
            serialize(buffer, data) { buffer.push(data); return buffer; },
            deserialize(buffer) { return buffer.get(); },
        }),
        int8: createType({
            name: 'int8',
            serialize(buffer, data) { buffer.push(data); return buffer; },
            deserialize(buffer) { return buffer.get() << 24 >> 24; },
        }),
        uint16: createType({
            name: 'uint16',
            serialize(buffer, data) { buffer.pushUint16(data); return buffer; },
            deserialize(buffer) { return buffer.getUint16(); },
        }),
        int16: createType({
            name: 'int16',
            serialize(buffer, data) { buffer.pushUint16(data); return buffer; },
            deserialize(buffer) { return buffer.getUint16() << 16 >> 16; },
        }),
        uint32: createType({
            name: 'uint32',
            serialize(buffer, data) { buffer.pushUint32(data); return buffer; },
            deserialize(buffer) { return buffer.getUint32(); },
        }),
        int32: createType({
            name: 'int32',
            serialize(buffer, data) { buffer.pushUint32(data); return buffer; },
            deserialize(buffer) { return buffer.getUint32() | 0; },
        }),
        varuint32: createType({
            name: 'varuint32',
            serialize(buffer, data) { buffer.pushVaruint32(data); return buffer; },
            deserialize(buffer) { return buffer.getVaruint32(); },
        }),

        name: createType({
            name: 'name',
            serialize(buffer, data) { buffer.pushName(data); return buffer; },
            deserialize(buffer) { return buffer.getName(); },
        }),
        time: createType({
            name: 'time',
            serialize(buffer, data) { buffer.pushUint32(dateToSec(data)); return buffer; },
            deserialize(buffer) { return secToDate(buffer.getUint32()); },
        }),

        // TODO: implement these types
        checksum256: createType({ name: 'checksum256' }),
        field_name: createType({ name: 'field_name' }),
        int64: createType({ name: 'int64' }),
        producer_schedule: createType({ name: 'producer_schedule' }),
        public_key: createType({ name: 'public_key' }),
        signature: createType({ name: 'signature' }),
        string: createType({ name: 'string' }),
        transaction_id_type: createType({ name: 'transaction_id_type' }),
        type_name: createType({ name: 'type_name' }),
        uint128: createType({ name: 'uint128' }),
    };
} // createInitialTypes()

function getType(types, name) {
    let type = types[name];
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

function getTypesFromAbi(initialTypes, abi) {
    let types = { ...initialTypes };
    for (let { new_type_name, type } of abi.types)
        types[new_type_name] =
            createType({ name: new_type_name, aliasOfName: type, });
    for (let { name, base, fields } of abi.structs) {
        types[name] = createType({
            name,
            baseName: base,
            fields: fields.map(({ name, type }) => ({ name, typeName: type, type: null })),
            serialize: serializeStruct,
            deserialize: deserializeStruct,
        });
    }
    for (let name in types) {
        let type = types[name];
        if (type.baseName)
            type.base = getType(types, type.baseName);
        for (let field of type.fields)
            field.type = getType(types, field.typeName);
    }
    return types;
} // getTypesFromAbi

function transactionHeader(refBlock, expireSeconds) {
    return {
        expiration: secToDate(dateToSec(refBlock.timestamp) + expireSeconds),
        ref_block_num: refBlock.block_num,
        ref_block_prefix: refBlock.ref_block_prefix,
    };
};

function arrayToHex(data) {
    let result = '';
    for (let x of data)
        result += ('00' + x.toString(16)).slice(-2);
    return result;
}

class Api {
    constructor({ endpoint, chainId = '00'.repeat(32) }) {
        this.endpoint = endpoint;
        this.chainId = chainId;
        this.contracts = {};
    }

    async fetch(path, body) {
        let response = await fetch(this.endpoint + path, {
            body: JSON.stringify(body),
            method: 'POST',
        });
        let json = await response.json();
        if (!response.ok)
            throw new EosError(json)
        return json;
    }

    async get_info() { return await this.fetch('/v1/chain/get_info', {}); }
    async get_code(account_name) { return await this.fetch('/v1/chain/get_code', { account_name }); }
    async get_block(block_num_or_id) { return await this.fetch('/v1/chain/get_block', { block_num_or_id }); }
    async get_account(account_name) { return await this.fetch('/v1/chain/get_account', { account_name }); }

    async get_table_rows({
        json = true,
        code,
        scope,
        table,
        table_key = '',
        lower_bound = '',
        upper_bound = '',
        limit = 10 }) {

        return await this.fetch(
            '/v1/chain/get_table_rows', {
                json,
                code,
                scope,
                table,
                table_key,
                lower_bound,
                upper_bound,
                limit
            });
    }

    async loadContract(accountName) {
        let code = await this.get_code(accountName);
        let types = getTypesFromAbi(
            accountName === 'eosio' ? createInitialTypes() : this.contracts.eosio.types,
            code.abi);
        let actions = {};
        for (let { name, type } of code.abi.actions)
            actions[name] = getType(types, type);
        this.contracts[accountName] = { types, actions };
    }

    async sendTransaction(privateKeys, transaction) {
        let tx = this.serializeTransaction(transaction).asUint8Array()
        let signatures = privateKeys.map(key => {
            let chainIdBuf = new Buffer(this.chainId, 'hex');
            let signBuf = Buffer.concat([chainIdBuf, new Buffer(tx)]);
            return eos.ecc.Signature.sign(signBuf, key).toString();
        });
        return await this.fetch('/v1/chain/push_transaction', {
            signatures,
            compression: 0,
            packed_context_free_data: '',
            packed_trx: arrayToHex(tx),
        });
    }

    serializeActionData(accountName, actionName, data) {
        let contract = this.contracts[accountName];
        if (!contract)
            throw new Error('Missing contract for ' + accountName + '; call loadContract() to fix')
        let action = contract.actions[actionName];
        if (!action)
            throw new Error('Unknown action ' + actionName + ' in contract ' + accountName);
        return action.serialize(new EosBuffer, data);
    }

    createAction(accountName, actionName, authorization, data) {
        return {
            account: accountName,
            name: actionName,
            authorization,
            data: this.serializeActionData(accountName, actionName, data),
        };
    }

    serializeTransaction(transaction) {
        return this.contracts.eosio.types.transaction.serialize(
            new EosBuffer, {
                region: 0,
                max_net_usage_words: 0,
                max_kcpu_usage: 0,
                delay_sec: 0,
                context_free_actions: [],
                actions: [],
                ...transaction,
            });
    }
} // Api

export { ecc, EosError, EosBuffer, Api, dateToSec, secToDate, serializeUnknown, deserializeUnknown, serializeStruct, deserializeStruct, serializeArray, deserializeArray, createType, getType, getTypesFromAbi, createInitialTypes, transactionHeader, };
global.eos_altjs = { ecc, EosError, EosBuffer, Api, dateToSec, secToDate, serializeUnknown, deserializeUnknown, serializeStruct, deserializeStruct, serializeArray, deserializeArray, createType, getType, getTypesFromAbi, createInitialTypes, transactionHeader, };
