const {Long} = require('bytebuffer')

module.exports = {
  ULong,
  isName,
  encodeName, // encode human readable name to uint64 (number string)
  decodeName, // decode from uint64 to human readable
  encodeNameHex: name => Long.fromString(encodeName(name), true).toString(16),
  decodeNameHex: (hex, littleEndian = true) =>
    decodeName(Long.fromString(hex, true, 16).toString(), littleEndian),
  abiToFcSchema
}

function ULong(value, unsigned = true, radix = 10) {
  if(typeof value === 'number') {
    // Some JSON libs use numbers for values under 53 bits or strings for larger.
    // Accomidate but double-check it..
    if(value > Number.MAX_SAFE_INTEGER)
      throw new TypeError('value parameter overflow')

    value = Long.fromString(String(value), unsigned, radix)
  } else if(typeof value === 'string') {
    value = Long.fromString(value, unsigned, radix)
  } else if(!Long.isLong(value)) {
    throw new TypeError('value parameter is a requied Long, Number or String')
  }
  return value
}

function isName(str, err) {
  try {
    encodeName(str)
    return true
  } catch(error) {
    if(err) {
      err(error)
    }
    return false
  }
}

const charmap = '.12345abcdefghijklmnopqrstuvwxyz'
const charidx = ch => {
  const idx = charmap.indexOf(ch)
  if(idx === -1)
    throw new TypeError(`Invalid character: '${ch}'`)

  return idx
}

/** Original Name encode and decode logic is in github.com/eosio/eos  native.hpp */

/**
  Encode a name (a base32 string) to a number.

  For performance reasons, the blockchain uses the numerical encoding of strings
  for very common types like account names.

  @see types.hpp string_to_name

  @arg {string} name - A string to encode, up to 12 characters long.
  @return {string<UInt64>} - compressed string (from name arg).  A string is
    always used because a number could exceed JavaScript's 52 bit limit.
*/
function encodeName(name, littleEndian = true) {
  if(typeof name !== 'string')
    throw new TypeError('name parameter is a required string')

  if(name.length > 13)
    throw new TypeError('A name can be up to 13 characters long')

  let bitstr = ''
  for(let i = 0; i <= 12; i++) { // process all 64 bits (even if name is short)
    const c = i < name.length ? charidx(name[i]) : 0
    const bitlen = i < 12 ? 5 : 4
    let bits = Number(c).toString(2)
    if(bits.length > bitlen) {
      throw new TypeError('Invalid name ' + name)
    }
    bits = '0'.repeat(bitlen - bits.length) + bits
    bitstr += bits
  }

  const value = Long.fromString(bitstr, true, 2)

  // convert to LITTLE_ENDIAN
  let leHex = ''
  const bytes = littleEndian ? value.toBytesLE() : value.toBytesBE()
  for(const b of bytes) {
    const n = Number(b).toString(16)
    leHex += (n.length === 1 ? '0' : '') + n
  }

  const ulName = Long.fromString(leHex, true, 16).toString()

  // console.log('encodeName', name, value.toString(), ulName.toString(), JSON.stringify(bitstr.split(/(.....)/).slice(1)))

  return ulName.toString()
}

/**
  @arg {Long|String|number} value UInt64
  @return {string}
*/
function decodeName(value, littleEndian = true) {
  value = ULong(value)

  // convert from LITTLE_ENDIAN
  let beHex = ''
  const bytes = littleEndian ? value.toBytesLE() : value.toBytesBE()
  for(const b of bytes) {
    const n = Number(b).toString(16)
    beHex += (n.length === 1 ? '0' : '') + n
  }
  beHex += '0'.repeat(16 - beHex.length)

  const fiveBits = Long.fromNumber(0x1f, true)
  const fourBits = Long.fromNumber(0x0f, true)
  const beValue = Long.fromString(beHex, true, 16)

  let str = ''
  let tmp = beValue

  for(let i = 0; i <= 12; i++) {
    const c = charmap[tmp.and(i === 0 ? fourBits : fiveBits)]
    str = c + str
    tmp = tmp.shiftRight(i === 0 ? 4 : 5)
  }
  str = str.replace(/\.+$/, '') // remove trailing dots (all of them)

  // console.log('decodeName', str, beValue.toString(), value.toString(), JSON.stringify(beValue.toString(2).split(/(.....)/).slice(1)))

  return str
}

function abiToFcSchema(abi) {
  // customTypes
  // For FcBuffer
  const abiSchema = {}

  // convert abi types to Fcbuffer schema
  if(abi.types) {
    abi.types.forEach(e => {
      abiSchema[e.newTypeName] = e.type
    })
  }

  if(abi.structs) {
    abi.structs.forEach(e => {
      const {base, fields} = e
      abiSchema[e.name] = {base, fields}
      if(base === '') {
        delete abiSchema[e.name].base
      }
    })
  }

  return abiSchema
}
