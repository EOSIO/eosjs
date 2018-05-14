const {Signature, PublicKey} = require('eosjs-ecc')
const Fcbuffer = require('fcbuffer')
const ByteBuffer = require('bytebuffer')
const assert = require('assert')

const json = {schema: require('./schema')}

const {isName, encodeName, decodeName,
  UDecimalPad, UDecimalImply, UDecimalUnimply} = require('./format')

/** Configures Fcbuffer for EOS specific structs and types. */
module.exports = (config = {}, extendedSchema) => {
  const structLookup = (lookupName, account) => {
    if(account === 'eosio.token') {
      return structs[lookupName]
    }
    const abi = config.abiCache.abi(account)
    const struct = abi.structs[lookupName]
    if(struct != null) {
      return struct
    }
    // TODO: move up (before `const struct = abi.structs[lookupName]`)
    for(const action of abi.abi.actions) {
      const {name, type} = action
      if(name === lookupName) {
        const struct = abi.structs[type]
        if(struct != null) {
          return struct
        }
      }
    }
    throw new Error(`Missing ABI struct or action: ${lookupName}`)
  }

  // If nodeos does not have an ABI setup for a certain action.type, it will throw
  // an error: `Invalid cast from object_type to string` .. forceActionDataHex
  // may be used to until native ABI is added or fixed.
  const forceActionDataHex = config.forceActionDataHex != null ?
    config.forceActionDataHex : true

  const override = Object.assign({},
    authorityOverride,
    abiOverride,
    wasmCodeOverride(config),
    actionDataOverride(structLookup, forceActionDataHex),
    config.override
  )

  // eosTypes reconciled with:
  //   eos::abi_serializer.cpp

  const eosTypes = {
    name: ()=> [Name],
    public_key: () => [variant(PublicKeyEcc)],
    symbol: () => [AssetSymbol],
    asset: () => [Asset], // must come after AssetSymbol
    extended_asset: () => [ExtendedAsset], // after Asset
    signature: () => [variant(SignatureType)]
  }

  const customTypes = Object.assign({}, eosTypes, config.customTypes)
  config = Object.assign({override}, {customTypes}, config)

  // Do not sort transaction actions
  config.sort = Object.assign({}, config.sort)
  config.sort['action.authorization'] = true
  config.sort['signed_transaction.signature'] = true
  config.sort['authority.accounts'] = true
  config.sort['authority.keys'] = true

  const schema = Object.assign({}, json.schema, extendedSchema)

  const {structs, types, errors, fromBuffer, toBuffer} = Fcbuffer(schema, config)
  if(errors.length !== 0) {
    throw new Error(JSON.stringify(errors, null, 4) + '\nin\n' +
      JSON.stringify(schema, null, 4))
  }

  return {structs, types, fromBuffer, toBuffer}
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

/**
  A variant is like having a version of an object.  A varint comes
  first and identifies which type of object this is.

  @arg {Array} variantArray array of types
*/
const variant = (...variantArray) => (validation, baseTypes, customTypes) => {
  const variants = variantArray.map(Type => Type(validation, baseTypes, customTypes))
  const staticVariant = baseTypes.static_variant(variants)

  return {
    fromByteBuffer (b) {
      return staticVariant.fromByteBuffer(b)
    },
    appendByteBuffer (b, value) {
      if(!Array.isArray(value)) {
        value = [0, value]
      }
      staticVariant.appendByteBuffer(b, value)
    },
    fromObject (value) {
      if(!Array.isArray(value)) {
        value = [0, value]
      }
      return staticVariant.fromObject(value)[1]
    },
    toObject (value) {
      if(!Array.isArray(value)) {
        value = [0, value]
      }
      return staticVariant.toObject(value)[1]
    }
  }
}

const PublicKeyEcc = (validation) => {
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

  const prefix = '\u0004' // 4 decimals in EOS

  return {
    fromByteBuffer (b) {
      const bcopy = b.copy(b.offset, b.offset + 8)
      b.skip(8)

      // TODO
      // const precision = bcopy.readUint8()
      // console.log('precision', precision)

      const bin = bcopy.toBinary()
      if(bin.slice(0, 1) !== prefix) {
        throw new TypeError(`Asset precision does not match: ${bin.slice(0, 1)}`)
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

/** @example '0.0001 CUR' */
const Asset = (validation, baseTypes, customTypes) => {
  const amountType = baseTypes.int64(validation)
  const symbolType = customTypes.symbol(validation)

  const symbolCache = sym => ({precision: 4})
  const precision = sym => symbolCache(sym).precision

  function toAssetString(value) {
    if(typeof value === 'string') {
      const [amount, sym] = value.split(' ')
      return `${UDecimalPad(amount, precision(sym))} ${sym}`
    }
    if(typeof value === 'object') {
      const {amount, sym} = value
      return `${UDecimalUnimply(amount, precision(sym))} ${sym}`
    }
    return value
  }

  return {
    fromByteBuffer (b) {
      const amount = amountType.fromByteBuffer(b)
      const sym = symbolType.fromByteBuffer(b)
      return `${UDecimalUnimply(amount, precision(sym))} ${sym}`
    },

    appendByteBuffer (b, value) {
      assert.equal(typeof value, 'string', 'value')
      const [amount, sym] = value.split(' ')
      amountType.appendByteBuffer(b, UDecimalImply(amount, precision(sym)))
      symbolType.appendByteBuffer(b, sym)
    },

    fromObject (value) {
      return toAssetString(value)
    },

    toObject (value) {
      if (validation.defaults && value == null) {
        return '0.0001 SYM'
      }
      return toAssetString(value)
    }
  }
}

const ExtendedAsset = (validation, baseTypes, customTypes) => {
  const assetType = customTypes.asset(validation)
  const contractName = customTypes.name(validation)

  function toString(value) {
    assert.equal(typeof value, 'string', 'extended_asset is expecting a string like: 9.9999 SBL@contract')
    const [asset, contract = 'eosio.token'] = value.split('@')
    return `${assetType.fromObject(asset)}@${contract}`
  }

  return {
    fromByteBuffer (b) {
      const asset = assetType.fromByteBuffer(b)
      const contract = contractName.fromByteBuffer(b)
      return `${asset}@${contract}`
    },

    appendByteBuffer (b, value) {
      assert.equal(typeof value, 'string', 'value')
      const [asset, contract] = value.split('@')
      assetType.appendByteBuffer(b, asset)
      contractName.appendByteBuffer(b, contract)
    },

    fromObject (value) {
      return toString(value)
    },

    toObject (value) {
      if (validation.defaults && value == null) {
        return '0.0001 SYMBOL@contract'
      }
      return toString(value)
    }
  }
}

const SignatureType = (validation, baseTypes) => {
  const signatureType = baseTypes.fixed_bytes65(validation)
  return {
    fromByteBuffer (b) {
      const signatureBuffer = signatureType.fromByteBuffer(b)
      const signature = Signature.from(signatureBuffer)
      return signature.toString()
    },

    appendByteBuffer (b, value) {
      const signature = Signature.from(value)
      signatureType.appendByteBuffer(b, signature.toBuffer())
    },

    fromObject (value) {
      const signature = Signature.from(value)
      return signature.toString()
    },

    toObject (value) {
      if (validation.defaults && value == null) {
        return 'SIG_K1_bas58signature..'
      }
      const signature = Signature.from(value)
      return signature.toString()
    }
  }
}

const authorityOverride = ({
  /** shorthand `EOS6MRyAj..` */
  'authority.fromObject': (value) => {
    if(PublicKey.fromString(value)) {
      return {
        threshold: 1,
        keys: [{key: value, weight: 1}]
      }
    }
    if(typeof value === 'string') {
      const [account, permission = 'active'] = value.split('@')
      return {
        threshold: 1,
        accounts: [{
          permission: {
            actor: account,
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
        if(config.debug) {
          console.log('Assembling WASM..')
        }
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
const actionDataOverride = (structLookup, forceActionDataHex) => ({
  'action.data.fromByteBuffer': ({fields, object, b, config}) => {
    const ser = (object.name || '') == '' ? fields.data : structLookup(object.name, object.account)
    if(ser) {
      b.readVarint32() // length prefix (usefull if object.name is unknown)
      object.data = ser.fromByteBuffer(b, config)
    } else {
      // console.log(`Unknown Action.name ${object.name}`)
      const lenPrefix = b.readVarint32()
      const bCopy = b.copy(b.offset, b.offset + lenPrefix)
      b.skip(lenPrefix)
      object.data = Buffer.from(bCopy.toBinary(), 'binary')
    }
  },

  'action.data.appendByteBuffer': ({fields, object, b}) => {
    const ser = (object.name || '') == '' ? fields.data : structLookup(object.name, object.account)
    if(ser) {
      const b2 = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN)
      ser.appendByteBuffer(b2, object.data)
      b.writeVarint32(b2.offset)
      b.append(b2.copy(0, b2.offset), 'binary')
    } else {
      // console.log(`Unknown Action.name ${object.name}`)
      const data = typeof object.data === 'string' ? new Buffer(object.data, 'hex') : object.data
      if(!Buffer.isBuffer(data)) {
        throw new TypeError(`Unknown struct '${object.name}' for contract '${object.account}', locate this struct or provide serialized action.data`)
      }
      b.writeVarint32(data.length)
      b.append(data.toString('binary'), 'binary')
    }
  },

  'action.data.fromObject': ({fields, object, result}) => {
    const {data, name} = object
    const ser = (name || '') == '' ? fields.data : structLookup(name, object.account)
    if(ser) {
      if(typeof data === 'object') {
        result.data = ser.fromObject(data) // resolve shorthand
        return
      } else if(typeof data === 'string') {
        const buf = new Buffer(data, 'hex')
        result.data = Fcbuffer.fromBuffer(ser, buf)
      } else {
        throw new TypeError('Expecting hex string or object in action.data')
      }
    } else {
      // console.log(`Unknown Action.name ${object.name}`)
      result.data = data
    }
  },

  'action.data.toObject': ({fields, object, result, config}) => {
    const {data, name} = object || {}
    const ser = (name || '') == '' ? fields.data : structLookup(name, object.account)
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

    if(forceActionDataHex) {
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
