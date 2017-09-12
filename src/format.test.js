/* eslint-env mocha */
const assert = require('assert')
const {
  encodeName, decodeName, encodeNameHex, decodeNameHex,
  isName
} = require('./format')

describe('format', () => {
  // valid: 555555555555o, invalid: 555555555555p 'p' overflows the last 4 bits of the name
  describe('name', () => {
    const nameFixture = {
      isname: ['555555555555o', 'isname11111a', 'isname111115', 'a', '1', '5', 'sam5', 'sam', 'adam.apple'],
      noname: ['555555555555p', 'noname1111111', undefined, null, 1, '6', 'a6', ' ']
    }

    it('isName', () => {
      for(let name of nameFixture.isname) {
        assert(isName(name, err => console.log(err)), name)
      }
      for(let name of nameFixture.noname) {
        assert(!isName(name), name)
      }
    })

    it('encode / decode', () => {
      assert.equal(encodeName('eos'), '58923', 'encode')
      assert.equal(encodeNameHex('eos'), 'e62b', 'encode hex')
      assert.equal(decodeName(encodeName('eos')), 'eos', 'decode')

      assert.equal(encodeNameHex('transfer'), 'b298e982a4', 'encode')
      assert.equal(decodeNameHex('b298e982a4'), 'transfer', 'decode')

      for(let name of nameFixture.isname) {
        assert.equal(decodeName(encodeName(name)), name)
        assert.equal(decodeNameHex(encodeNameHex(name)), name)
      }
      for(let name of nameFixture.isname) {
        assert.equal(decodeName(encodeName(name, false), false), name)
      }
      assert(decodeName(1))
      throws(() => decodeName(Number.MAX_SAFE_INTEGER + 1), /overflow/)
      throws(() => decodeName({}), /Long, Number or String/)
    })
  })
})

/* istanbul ignore next */
function throws (fn, match) {
  try {
    fn()
    assert(false, 'Expecting error')
  } catch (error) {
    if (!match.test(error)) {
      error.message = `Error did not match ${match}\n${error.message}`
      throw error
    }
  }
}
