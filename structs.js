const json = require('eosjs-json')
const Fcbuffer = require('fcbuffer')
const {encodeName, decodeName} = require('./utils/format')

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
      return decodeName(b.readUint64())
    },
    appendByteBuffer (b, value) {
      b.writeUint64(encodeName(value))
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
    object.data = ser.fromByteBuffer(b, config)
  },
  'Message.data.appendByteBuffer': ({fields, object, b}) => {
    const ser = (object.type || '') == '' ? fields.data : structLookup(object.type)
    if(!ser) {
      throw new TypeError(`Unknown Message.type ${object.type}`)
    }
    ser.appendByteBuffer(b, object.data)
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
      throw new TypeError(`Unknown Message.type ${type}`)
    }
    result.data = ser.toObject(data, config)
  }
})
