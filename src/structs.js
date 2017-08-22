const json = require('eosjs-json')
const Fcbuffer = require('fcbuffer')
const ByteBuffer = require('bytebuffer')

const {encodeName, decodeName} = require('./format')

/** Configures Fcbuffer for EOS specific structs and types. */
module.exports = (config = {}) => {

  const customTypes = Object.assign({Name: ()=> [Name]}, config.customTypes)

  const structLookup = name => structs[name]
  const override = Object.assign(messageDataOverride(structLookup), config.override)

  config = Object.assign({override}, {customTypes}, config)

  const {structs, errors} = Fcbuffer(json.schema, config)
  if(errors.length !== 0) {
    throw new Error(JSON.stringify(errors, null, 4))
  }

  return structs
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
