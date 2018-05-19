const {Signature, PublicKey} = require('eosjs-ecc')
const Fcbuffer = require('fcbuffer')
const ByteBuffer = require('bytebuffer')
const assert = require('assert')

const json = {schema: require('./schema')}

const {
  isName, encodeName, decodeName,
  UDecimalPad, UDecimalImply, UDecimalUnimply,
  parseAssetSymbol
} = require('./format')

/** Configures Fcbuffer for EOS specific structs and types. */
module.exports = (config = {}, extendedSchema) => {
  const structLookup = (lookupName, account) => {
    const cachedCode = new Set(['eosio', 'eosio.token'])
    if(cachedCode.has(account)) {
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

  const {assetCache} = config

  const eosTypes = {
    name: ()=> [Name],
    public_key: () => [variant(PublicKeyEcc)],
    symbol: () => [AssetSymbol(assetCache)],
    asset: () => [Asset(assetCache)], // must come after AssetSymbol
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

/** Current action within a transaction. */
let currentAccount

/** @private */
function precisionCache(assetCache, sym) {
  const assetSymbol = parseAssetSymbol(sym)
  let precision = assetSymbol.precision

  if(currentAccount) {
    const asset = assetCache.lookup(assetSymbol.symbol, currentAccount)
    if(asset) {
      if(precision == null) {
        precision = asset.precision
      } else {
        assert.equal(asset.precision, precision,
          `Precision mismatch for asset: ${sym}@${currentAccount}`)
      }
    } else {
      // Lookup data for later (appendByteBuffer needs it)
      assetCache.lookupAsync(assetSymbol.symbol, currentAccount)
    }
  }
  return {symbol: assetSymbol.symbol, precision}
}

const AssetSymbol = assetCache => validation => {
  return {
    fromByteBuffer (b) {
      const bcopy = b.copy(b.offset, b.offset + 8)
      b.skip(8)

      const precision = bcopy.readUint8()
      const bin = bcopy.toBinary()

      let symbol = ''
      for(const code of bin)  {
        if(code == '\0') {
          break
        }
        symbol += code
      }
      precisionCache(assetCache, `${precision},${symbol}`) // validate
      return `${precision},${symbol}`
    },

    appendByteBuffer (b, value) {
      const {symbol, precision} = precisionCache(assetCache, value)
      assert(precision != null, `Precision unknown for asset: ${symbol}@${currentAccount}`)
      const pad = '\0'.repeat(7 - symbol.length)
      b.append(String.fromCharCode(precision) + symbol + pad)
    },

    fromObject (value) {
      const {symbol, precision} = precisionCache(assetCache, value)
      if(precision == null) {
        return symbol
      } else {
        // Internal object, this can have the precision prefix
        return `${precision},${symbol}`
      }
    },

    toObject (value) {
      if (validation.defaults && value == null) {
        return 'SYS'
      }
      // symbol only (without precision prefix)
      return precisionCache(assetCache, value).symbol
    }
  }
}

/** @example '0.0001 CUR' */
const Asset = assetCache => (validation, baseTypes, customTypes) => {
  const amountType = baseTypes.int64(validation)
  const symbolType = customTypes.symbol(validation)

  function toAssetString(value) {
    if(typeof value === 'string') {
      const [amount, sym] = value.split(' ')
      const {precision, symbol} = precisionCache(assetCache, sym)
      if(precision == null) {
        return value
      }
      return `${UDecimalPad(amount, precision)} ${symbol}`
    }
    if(typeof value === 'object') {
      const {precision, symbol} = precisionCache(assetCache, value.symbol)
      assert(precision != null, `Precision unknown for asset: ${symbol}@${currentAccount}`)
      return `${UDecimalUnimply(value.amount, precision)} ${symbol}`
    }
    return value
  }

  return {
    fromByteBuffer (b) {
      const amount = amountType.fromByteBuffer(b)
      const sym = symbolType.fromByteBuffer(b)
      const {precision} = precisionCache(assetCache, sym)
      return `${UDecimalUnimply(amount, precision)} ${sym}`
    },

    appendByteBuffer (b, value) {
      assert.equal(typeof value, 'string', `expecting string, got ` + (typeof value))
      const [amount, sym] = value.split(' ')
      const {precision} = precisionCache(assetCache, sym)
      assert(precision != null, `Precision unknown for asset: ${sym}@${currentAccount}`)
      amountType.appendByteBuffer(b, UDecimalImply(amount, precision))
      symbolType.appendByteBuffer(b, sym)
    },

    fromObject (value) {
      return toAssetString(value)
    },

    toObject (value) {
      if (validation.defaults && value == null) {
        return '0.0001 SYS'
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
    currentAccount = contract
    return `${assetType.fromObject(asset)}@${contract}`
  }

  return {
    fromByteBuffer (b) {
      const asset = assetType.fromByteBuffer(b)
      const contract = contractName.fromByteBuffer(b)
      currentAccount = contract
      return `${asset}@${contract}`
    },

    appendByteBuffer (b, value) {
      assert.equal(typeof value, 'string', 'value')
      const [asset, contract] = value.split('@')
      currentAccount = contract
      assetType.appendByteBuffer(b, asset)
      contractName.appendByteBuffer(b, contract)
    },

    fromObject (value) {
      return toString(value)
    },

    toObject (value) {
      if (validation.defaults && value == null) {
        return '0.0001 SYS@eosio'
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
    currentAccount = object.account
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
    currentAccount = object.account
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
    currentAccount = object.account

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
    const {data, name, account} = object || {}
    currentAccount = object.account

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
