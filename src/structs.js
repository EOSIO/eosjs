const {Signature, PublicKey} = require('eosjs-ecc')
const Fcbuffer = require('fcbuffer')
const ByteBuffer = require('bytebuffer')
const assert = require('assert')

const json = {schema: require('./schema')}

const {
  isName, encodeName, decodeName,
  UDecimalPad, UDecimalImply, UDecimalUnimply,
  joinAssetString, parseExtendedAsset
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
    abiOverride(structLookup),
    wasmCodeOverride(config),
    actionDataOverride(structLookup, forceActionDataHex),
    config.override
  )

  const {assetCache} = config

  const eosTypes = {
    name: ()=> [Name],
    public_key: () => [variant(PublicKeyEcc)],

    symbol: () => [Symbol(assetCache)],
    extended_symbol: () => [ExtendedSymbol(assetCache)],

    asset: () => [Asset(assetCache)], // After Symbol: amount, precision, symbol, contract
    extended_asset: () => [ExtendedAsset(assetCache)], // After Asset: amount, precision, symbol, contract

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
    throw new Error(JSON.stringify(errors, null, 4))
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

/** @private */
function precisionCache(assetCache, value) {
  const symbolInfo = parseExtendedAsset(value)
  const contract = symbolInfo.contract || 'eosio.token'

  let precision

  if(contract) {
    const asset = assetCache.lookup(symbolInfo.symbol, contract)

    if(asset != null) {
      if(symbolInfo.precision != null) {
        assert.equal(asset.precision, symbolInfo.precision,
          `Precision mismatch for asset: ${value}`)
      }
      precision = asset.precision

    } else {
      // Lookup for later (appendByteBuffer)
      assetCache.lookupAsync(symbolInfo.symbol, contract)

      // asset === null is a confirmation that the asset did not exist on the blockchain
      if(asset === null) {
        if(symbolInfo.precision == null && symbolInfo.amount != null) {
          // no blockchain asset, no explicit precision .. derive from amount
          const [, decimalstr = ''] = symbolInfo.amount.split('.')
          precision = decimalstr.length
          // console.log('derivied precision for new asset: ' + precision + ',' + symbolInfo.symbol)
        }
      }
    }
  }

  if(precision == null) {
    precision = symbolInfo.precision
  }

  const pc = Object.assign({}, symbolInfo, {contract})
  if(precision != null) {
    pc.precision = precision
  }
  // console.log('precisionCache', pc)
  return pc
}


/**
  Internal: precision, symbol
  External: symbol
  @example 'SYS'
*/
const Symbol = assetCache => validation => {
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
      assert(precision != null, `Precision unknown for asset: ${value}`)
      const pad = '\0'.repeat(7 - symbol.length)
      b.append(String.fromCharCode(precision) + symbol + pad)
    },

    fromObject (value) {
      assert(value != null, `Symbol is required: ` + value)
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

/**
  Internal: precision, symbol, contract
  External: symbol, contract
  @example 'SYS@contract'
*/
const ExtendedSymbol = assetCache => (validation, baseTypes, customTypes) => {
  const symbolType = customTypes.symbol(validation)
  const contractName = customTypes.name(validation)

  return {
    fromByteBuffer (b) {
      const symbol = symbolType.fromByteBuffer(b)
      const contract = contractName.fromByteBuffer(b)
      return `${symbol}@${contract}`
    },

    appendByteBuffer (b, value) {
      assert.equal(typeof value, 'string', 'Invalid extended symbol: ' + value)

      const [symbol, contract] = value.split('@')
      assert(contract != null, 'Missing @contract suffix in extended symbol: ' + value)

      symbolType.appendByteBuffer(b, symbol)
      contractName.appendByteBuffer(b, contract)
    },

    fromObject (value) {
      return value
    },

    toObject (value) {
      if (validation.defaults && value == null) {
        return '4,SYS@contract'
      }
      return value
    }
  }
}

function toAssetString(value, assetCache, format = '') {
  assert.equal(typeof value, 'string', `expecting asset string, got ` + (typeof value))

  const {precision, symbol, amount, contract} = precisionCache(assetCache, value)

  if(format === 'plain_asset') {
    return `${UDecimalPad(amount, precision)} ${symbol}`
  }

  if(format === 'extended_asset') {
    const contractSuffix = contract ? `@${contract}` : ''
    return `${UDecimalPad(amount, precision)} ${symbol}${contractSuffix}`
  }

  if(format === 'full_asset') {
    const precisionPrefix = precision != null ? `${precision},` : ''
    const full = `${UDecimalPad(amount, precision)} ${precisionPrefix}${symbol}`
    // console.log('full_asset', full)
    return full
  }

  if(format === 'full_extended_asset') {
    const contractSuffix = contract ? `@${contract}` : ''
    const precisionPrefix = precision != null ? `${precision},` : ''
    const full = `${UDecimalPad(amount, precision)} ${precisionPrefix}${symbol}${contractSuffix}`
    // console.log('full_extended_asset', full)
    return full
  }

  assert(false, 'format should be: plain, extended, or full')
}

/**
  Internal: amount, precision, symbol, contract
  @example '1.0000 SYS'
*/
const Asset = assetCache => (validation, baseTypes, customTypes) => {
  const amountType = baseTypes.int64(validation)
  const symbolType = customTypes.symbol(validation)

  return {
    fromByteBuffer (b) {
      const amount = amountType.fromByteBuffer(b)
      const sym = symbolType.fromByteBuffer(b)
      const {precision, symbol} = precisionCache(assetCache, sym)
      return toAssetString(`${UDecimalUnimply(amount, precision)} ${precision},${symbol}`, assetCache, 'full_asset')
    },

    appendByteBuffer (b, value) {
      assert.equal(typeof value, 'string', `expecting asset string, got ` + (typeof value))
      const {amount, precision, symbol} = precisionCache(assetCache, value)
      assert(precision != null, `Precision unknown for asset: ${value}`)
      amountType.appendByteBuffer(b, UDecimalImply(amount, precision))
      symbolType.appendByteBuffer(b, value)
    },

    fromObject (value) {
      return toAssetString(value, assetCache, 'full_asset')
    },

    toObject (value) {
      if (validation.defaults && value == null) {
        return '0.0001 SYS'
      }
      return toAssetString(value, assetCache, 'plain_asset')
    }
  }
}

/**
  @example '1.0000 SYS@contract'
*/
const ExtendedAsset = assetCache => (validation, baseTypes, customTypes) => {
  const assetType = customTypes.asset(validation)
  const contractName = customTypes.name(validation)

  return {
    fromByteBuffer (b) {
      const asset = assetType.fromByteBuffer(b)
      const contract = contractName.fromByteBuffer(b)
      return parseExtendedAsset(`${asset}@${contract}`)
    },

    appendByteBuffer (b, value) {
      assert.equal(typeof value, 'object', 'expecting extended_asset object, got ' + typeof value)

      const asset = joinAssetString(value)

      const [, contract] = asset.split('@')
      assert.equal(typeof contract, 'string', 'Invalid extended asset: ' + value)

      // asset includes contract (assetType needs this)
      assetType.appendByteBuffer(b, asset)
      contractName.appendByteBuffer(b, contract)
    },

    fromObject (value) {
      // like: 1.0000 SYS@contract or 1 SYS@contract
      const asset = {}
      if(typeof value === 'string') {
        Object.assign(asset, parseExtendedAsset(value))
      } else if (typeof value === 'object') {
        Object.assign(asset, value)
      } else {
        assert(false, 'expecting extended_asset<object|string>, got: ' + typeof value)
      }

      const {amount, precision, symbol, contract} = asset

      assert(amount != null, 'missing amount')
      assert(precision == null || typeof precision === 'number',
        'precision is an optional number'
      ) // pending async lookup or still offchain
      assert(symbol != null, 'missing symbol')
      assert(contract != null, 'missing contract')

      return {amount, precision, symbol, contract}
    },

    toObject (value) {
      if (validation.defaults && value == null) {
        return {
          amount: '1.0000',
          precision: 4,
          symbol: 'SYS',
          contract: 'eosio.token'
        }
      }

      assert.equal(typeof value, 'object', 'expecting extended_asset object')
      const {precision, symbol, amount, contract} =
        precisionCache(assetCache, joinAssetString(value))

      return {
        amount: UDecimalPad(amount, precision),
        precision,
        symbol,
        contract
      }
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

const abiOverride = structLookup => ({
  'abi.fromObject': (value) => {
    if(typeof value === 'string') {
      return JSON.parse(value)
    }
    if(Buffer.isBuffer(value)) {
      return JSON.parse(value.toString())
    }
  },
  'setabi.abi.appendByteBuffer': ({fields, object, b}) => {
    const ser = structLookup('abi_def', 'eosio')
    const b2 = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN)
    ser.appendByteBuffer(b2, object.abi)
    b.writeVarint32(b2.offset) // length prefix
    b.append(b2.copy(0, b2.offset), 'binary')
  }
})

const wasmCodeOverride = config => ({
  'setcode.code.fromObject': ({object, result}) => {
    try {
      const code = object.code.toString()
      if(/^\s*\(module/.test(code)) {
        const {binaryen} = config
        assert(binaryen != null, 'required: config.binaryen = require("binaryen")')
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
