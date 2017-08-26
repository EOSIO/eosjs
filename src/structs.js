const {PublicKey} = require('eosjs-ecc')
const json = require('eosjs-json')
const Fcbuffer = require('fcbuffer')
const ByteBuffer = require('bytebuffer')
const assert = require('assert')

const {isName} = require('./format')
const {encodeName, decodeName} = require('./format')

/** Configures Fcbuffer for EOS specific structs and types. */
module.exports = (config = {}) => {

  const structLookup = name => structs[name]

  const override = Object.assign({},
    assetOverride,
    authorityOverride,
    messageDataOverride(structLookup),
    config.override
  )

  const eosTypes = {
    Name: ()=> [Name],
    PublicKey: () => [PublicKeyType],
  }

  const customTypes = Object.assign({}, eosTypes, config.customTypes)
  config = Object.assign({override}, {customTypes}, config)

  const {structs, types, errors} = Fcbuffer(json.schema, config)
  if(errors.length !== 0) {
    throw new Error(JSON.stringify(errors, null, 4))
  }

  return {structs, types}
}

/**
  Name eos::types native.hpp
*/
const Name = (validation) => {
  return {
    fromByteBuffer (b) {
      const n = decodeName(b.readUint64(), false) // b is already in littleEndian
      if(validation.debug) {
        console.error(`${n}`)
      }
      return n
    },
    appendByteBuffer (b, value) {
      if(validation.debug) {
        console.error(`${value}`)
      }
      b.writeUint64(encodeName(value, false)) // b is already in littleEndian
    },
    fromObject (value) {
      return value
    },
    toObject (value) {
      if (validation.defaults && value == null) {
        return ''
      }
      return value
    }
  }
}

const PublicKeyType = (validation) => {
  return {
    fromByteBuffer (b) {
      const bcopy = b.copy(b.offset, b.offset + 33)
      b.skip(33)
      const pubbuf = Buffer.from(bcopy.toBinary(), 'binary')
      return PublicKey.fromBuffer(pubbuf).toString()
    },
    appendByteBuffer (b, value) {
      if(validation.debug) {
        console.error(`${value}`)
      }
      const buf = PublicKey.fromStringOrThrow(value).toBuffer()
      b.append(buf.toString('binary'), 'binary')
    },
    fromObject (value) {
      return value
    },
    toObject (value) {
      if (validation.defaults && value == null) {
        return 'EOS6MRy..'
      }
      return value
    }
  }
}

const assetOverride = ({
  /** shorthand `1 EOS` for `{amount: 1, symbol: 'EOS'}` */
  'Asset.fromObject': (value) => {
    if(typeof value === 'string') {
      const val = value.trim().split(/ +/)
      assert.equal(val.length, 2, 'invalid asset')
      const [amount, symbol] = val
      assert(/^\d+\.?\d*$/.test(amount), 'amount should be digits')
      assert(typeof symbol, 'string', 'symbol should be a string')
      assert(isName(symbol.toLowerCase()), 'symbol should be a valid name')
      return {amount, symbol}
    }
  }
})

const authorityOverride = ({
  /** shorthand `EOS6MRyAj..` */
  'Authority.fromObject': (value) => {
    if(PublicKey.fromString(value)) {
      return {
        threshold: 1,
        keys: [{key: value, weight: 1}],
        accounts: []
      }
    }
  }
})

/**
  Message.data is formatted using the struct mentioned in Message.type.
*/
const messageDataOverride = structLookup => ({
  'Message.data.fromByteBuffer': ({fields, object, b, config}) => {
    const ser = (object.type || '') == '' ? fields.data : structLookup(object.type)
    if(!ser) {
      throw new TypeError(`Unknown Message.type ${object.type}`)
    }
    b.readVarint32() // length prefix (usefull if object.type is unknown)
    object.data = ser.fromByteBuffer(b, config)
  },

  'Message.data.appendByteBuffer': ({fields, object, b}) => {
    const ser = (object.type || '') == '' ? fields.data : structLookup(object.type)
    if(!ser) {
      throw new TypeError(`Unknown Message.type ${object.type}`)
    }
    const b2 = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN)
    ser.appendByteBuffer(b2, object.data)
    b.writeVarint32(b2.offset)
    b.append(b2.copy(0, b2.offset), 'binary')
  },

  'Message.data.fromObject': ({fields, serializedObject, result}) => {
    const {data, type} = serializedObject
    const ser = (type || '') == '' ? fields.data : structLookup(type)
    if(!ser) {
      throw new TypeError(`Unknown Message.type ${type}`)
    }
    result.data = ser.fromObject(data)
  },

  'Message.data.toObject': ({fields, serializedObject, result, config}) => {
    const {data, type} = serializedObject || {}
    const ser = (type || '') == '' ? fields.data : structLookup(type)
    if(!ser) {
      // Types without an ABI will accept hex
      // assert(isHex(data))
      result.data = data
      return
    }

    // Until native ABIs are added, convert Message.data to hex
    // https://github.com/EOSIO/eos/issues/215
    // if(type === 'transfer') {
    const b2 = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN)
    ser.appendByteBuffer(b2, data)
    result.data = b2.copy(0, b2.offset).toString('hex')
    return
    // }

    // Serializable JSON
    // result.data = ser.toObject(data, config)
  }
})
