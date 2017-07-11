const {Long} = require('bytebuffer')

module.exports = {
  isName,
  encodeName,
  decodeName
}

function isName(str) {
  try {
    encodeName(str)
    return true
  } catch(error) {
    return false
  }
}
// a-z12345.

/** Original Name encode and decode logic is in github.com/eosio/eos  native.hpp */

/**
  For performance reasons, the blockchain uses the numerical encoding of strings
  for very common types like account names.

  @arg {string} name - A string to encode, up to 14 characters long.
  @return {string<UInt64>} - compressed string (from name arg).  A string is
    always used, this may exceed JavaScript's limit)
*/
function encodeName(name) {
  if(typeof name !== 'string')
    throw new TypeError('name parameter is a required string')

  if(name.length > 13)
    throw new TypeError('A name can be up to 13 characters long')

  const charToSymbol = ch => {
    const c = ch.charCodeAt(0)
    const a = 'a'.charCodeAt(0)
    const z = 'z'.charCodeAt(0)
    const one = '1'.charCodeAt(0)
    const five = '5'.charCodeAt(0)

    if(c >= a && c <= z)
      return c - a + 1

    if(c >= one && c <= five)
      return (c - one) + 27

    if(ch !== '.')
      throw new TypeError(`Invalid character: '${ch}'`)

    return '0'.charCodeAt(0)
  }

  let value = Long.ZERO
  for(let i = 0; i < 13 && i < name.length; i++) {
    value = value.shiftLeft(5)
    value = value.or(charToSymbol(name[name.length - 1 - i]))
  }
  if(name.length === 13) {
    value = value.shiftLeft(4)
    const last4bits = Long.fromNumber(0x0f)
    value = value.or(last4bits).and(charToSymbol(name[name.length - 1]))
  }
  return value.toString()
}

/**
  @arg {Long|String|number} value UInt64
*/

function decodeName(value) {
  if(typeof value === 'number') {
    // Some JSON libs use numbers for values under 53 bits or strings for larger.
    // Accomidate but double-check it..
    if(value > Number.MAX_SAFE_INTEGER)
      throw new TypeError('value parameter overflow')

    value = Long.fromString(String(value))
  } else if(typeof value === 'string') {
    value = Long.fromString(value)
  } else if(!Long.isLong(value)) {
    throw new TypeError('value parameter is a requied long or string')
  }

  let tmp = value, str = ''
  const last5bits = Long.fromNumber(0x1f)
  const last4bits = Long.fromNumber(0x0f)
  const charmap = '.abcdefghijklmnopqrstuvwxyz12345'

  for(let i = 0; i < 12; i++) {
    str += charmap[tmp.and(last5bits)]
    tmp = tmp.shiftRight(5)
  }

  str += charmap[tmp.and(last4bits)]
  str = str.replace(/\.+$/, '') // remove trailing dots (all of them)
  return str
}
