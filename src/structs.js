const {PublicKey} = require('eosjs-ecc')
const json = require('eosjs-json')
const Fcbuffer = require('fcbuffer')
const ByteBuffer = require('bytebuffer')
const assert = require('assert')

const {isName, encodeName, decodeName,
  UDecimalPad, UDecimalImply, UDecimalUnimply} = require('./format')

/** Configures Fcbuffer for EOS specific structs and types. */
module.exports = (config = {}, extendedSchema) => {
  const structLookup = (name, code) => {
    if(code === 'eos') {
      return structs[name]
    }
    const abi = config.abiCache.abi(code)
    const struct = abi.structs[name]
    if(struct != null) {
      return struct
    }
    for(const action of abi.abi.actions) {
      const {action_name, type} = action
      if(action_name === name) {
        const struct = abi.structs[type]
        if(struct != null) {
          return struct
        }
      }
    }
    throw new Error(`Missing ABI struct or action: ${name}`)
  }

  // If eosd does not have an ABI setup for a certain message.type, it will throw
  // an error: `Invalid cast from object_type to string` .. forceMessageDataHex
  // may be used to until native ABI is added or fixed.
  const forceMessageDataHex = config.forceMessageDataHex != null ?
    config.forceMessageDataHex : false

  const override = Object.assign({},
    authorityOverride,
    abiOverride,
    wasmCodeOverride(config),
    messageDataOverride(structLookup, forceMessageDataHex),
    config.override
  )

  const eosTypes = {
    name: ()=> [Name],
    public_key: () => [PublicKeyType],
    asset_symbol: () => [AssetSymbol],
    asset: () => [Asset], // must come after AssetSymbol
  }

  const customTypes = Object.assign({}, eosTypes, config.customTypes)
  config = Object.assign({override}, {customTypes}, config)

  // Do not sort transaction messages
  config.nosort = Object.assign({}, config.nosort)
  config.nosort['transaction.message'] = true

  const schema = Object.assign({}, json.schema, extendedSchema)
  const {structs, types, errors} = Fcbuffer(schema, config)
  if(errors.length !== 0) {
    throw new Error(JSON.stringify(errors, null, 4) + '\nin\n' +
      JSON.stringify(schema, null, 4))
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
      // if(validation.debug) {
      //   console.error(`${n}`, '(Name.fromByteBuffer)')
      // }
      return n
    },

    appendByteBuffer (b, value) {
      // if(validation.debug) {
      //   console.error(`${value}`, (Name.appendByteBuffer))
      // }
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
      // if(validation.debug) {
      //   console.error(`${value}`, 'PublicKeyType.appendByteBuffer')
      // }
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

const AssetSymbol = (validation) => {
  function valid(value) {
    if(typeof value !== 'string') {
      throw new TypeError(`Asset symbol should be a string`)
    }
    if(value.length > 7) {
      throw new TypeError(`Asset symbol is 7 characters or less`)
    }
  }

  const prefix = '\u0004'

  return {
    fromByteBuffer (b) {
      const bcopy = b.copy(b.offset, b.offset + 7)
      b.skip(7)

      // const precision = bcopy.readUint8()
      // console.log('precision', precision)

      const bin = bcopy.toBinary()
      if(bin.slice(0, 1) !== prefix) {
        throw new TypeError(`Asset precision does not match`)
      }
      let symbol = ''
      for(const code of bin.slice(1))  {
        if(code == '\0') {
          break
        }
        symbol += code
      }
      return symbol
    },

    appendByteBuffer (b, value) {
      valid(value)
      value += '\0'.repeat(7 - value.length)
      b.append(prefix + value)
    },

    fromObject (value) {
      valid(value)
      return value
    },

    toObject (value) {
      if (validation.defaults && value == null) {
        return 'SYMBOL'
      }
      valid(value)
      return value
    }
  }
}

const Asset = (validation, baseTypes, customTypes) => {
  const amountType = baseTypes.int64(validation)
  const symbolType = customTypes.asset_symbol(validation)

  const symbolCache = symbol => ({precision: 4})
  const precision = symbol => symbolCache(symbol).precision

  function toAssetString(value) {
    if(typeof value === 'string') {
      const [amount, symbol] = value.split(' ')
      return `${UDecimalPad(amount, precision(symbol))} ${symbol}`
    }
    if(typeof value === 'object') {
      const {amount, symbol} = value
      return `${UDecimalUnimply(amount, precision(symbol))} ${symbol}`
    }
    return value
  }

  return {
    fromByteBuffer (b) {
      const amount = amountType.fromByteBuffer(b)
      const symbol = symbolType.fromByteBuffer(b)
      return `${UDecimalUnimply(amount, precision(symbol))} ${symbol}`
    },

    appendByteBuffer (b, value) {
      const [amount, symbol] = value.split(' ')
      amountType.appendByteBuffer(b, UDecimalImply(amount, precision(symbol)))
      symbolType.appendByteBuffer(b, symbol)
    },

    fromObject (value) {
      return toAssetString(value)
    },

    toObject (value) {
      if (validation.defaults && value == null) {
        return '0.0001 SYMBOL'
      }
      return toAssetString(value)
    }
  }
}

const authorityOverride = ({
  /** shorthand `EOS6MRyAj..` */
  'authority.fromObject': (value) => {
    if(PublicKey.fromString(value)) {
      return {
        threshold: 1,
        keys: [{key: value, weight: 1}],
        accounts: []
      }
    }
    if(typeof value === 'string') {
      const [account, permission = 'active'] = value.split('@')
      return {
        threshold: 1,
        keys: [],
        accounts: [{
          permission: {
            account,
            permission
          },
          weight: 1
        }]
      }
    }
  }
})

const abiOverride = ({
  'abi.fromObject': (value) => {
    if(typeof value === 'string') {
      return JSON.parse(value)
    }
    if(Buffer.isBuffer(value)) {
      return JSON.parse(value.toString())
    }
  }
})

const wasmCodeOverride = config => ({
  'setcode.code.fromObject': ({object, result}) => {
    const {binaryen} = config
    assert(binaryen != null, 'required: config.binaryen = require("binaryen")')
    try {
      const code = object.code.toString()
      if(/^\s*\(module/.test(code)) {
        console.log('Assembling WASM...')
        const wasm = Buffer.from(binaryen.parseText(code).emitBinary())
        result.code = wasm
      } else {
        result.code = object.code
      }
    } catch(error) {
      console.error(error, object.code)
      throw error
    }
  }
})

/**
  Nested serialized structure.  Nested struct may be in HEX or object format.
*/
const messageDataOverride = (structLookup, forceMessageDataHex) => ({
  'message.data.fromByteBuffer': ({fields, object, b, config}) => {
    const ser = (object.type || '') == '' ? fields.data : structLookup(object.type, object.code)
    if(ser) {
      b.readVarint32() // length prefix (usefull if object.type is unknown)
      object.data = ser.fromByteBuffer(b, config)
    } else {
      // console.log(`Unknown Message.type ${object.type}`)
      const lenPrefix = b.readVarint32()
      const bCopy = b.copy(b.offset, b.offset + lenPrefix)
      b.skip(lenPrefix)
      object.data = Buffer.from(bCopy.toBinary(), 'binary')
    }
  },

  'message.data.appendByteBuffer': ({fields, object, b}) => {
    const ser = (object.type || '') == '' ? fields.data : structLookup(object.type, object.code)
    if(ser) {
      const b2 = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN)
      ser.appendByteBuffer(b2, object.data)
      b.writeVarint32(b2.offset)
      b.append(b2.copy(0, b2.offset), 'binary')
    } else {
      // console.log(`Unknown Message.type ${object.type}`)
      const data = typeof object.data === 'string' ? new Buffer(object.data, 'hex') : object.data
      if(!Buffer.isBuffer(data)) {
        throw new TypeError('Expecting hex string or buffer in message.data')
      }
      b.writeVarint32(data.length)
      b.append(data.toString('binary'), 'binary')
    }
  },

  'message.data.fromObject': ({fields, object, result}) => {
    const {data, type} = object
    const ser = (type || '') == '' ? fields.data : structLookup(type, object.code)
    if(ser) {
      if(typeof data === 'object') {
        result.data = ser.fromObject(data) // resolve shorthand
        return
      } else if(typeof data === 'string') {
        const buf = new Buffer(data, 'hex')
        result.data = Fcbuffer.fromBuffer(ser, buf)
      } else {
        throw new TypeError('Expecting hex string or object in message.data')
      }
    } else {
      // console.log(`Unknown Message.type ${object.type}`)
      result.data = data
    }
  },

  'message.data.toObject': ({fields, object, result, config}) => {
    const {data, type} = object || {}
    const ser = (type || '') == '' ? fields.data : structLookup(type, object.code)
    if(!ser) {
      // Types without an ABI will accept hex
      // const b2 = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN)
      // const buf = !Buffer.isBuffer(data) ? new Buffer(data, 'hex') : data
      // b2.writeVarint32(buf.length)
      // b2.append(buf)
      // result.data = b2.copy(0, b2.offset).toString('hex')
      result.data = Buffer.isBuffer(data) ? data.toString('hex') : data
      return
    }

    if(forceMessageDataHex) {
      const b2 = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN)
      if(data) {
        ser.appendByteBuffer(b2, data)
      }
      result.data = b2.copy(0, b2.offset).toString('hex')

      // console.log('result.data', result.data)
      return
    }

    // Serializable JSON
    result.data = ser.toObject(data, config)
  }
})
