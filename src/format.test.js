/* eslint-env mocha */
const assert = require('assert')
const {
  encodeName, decodeName, encodeNameHex, decodeNameHex,
  isName
} = require('./format')

describe('format', () => {
  // In isname111111k, 'k' overflows the last 4 bits of the name
  describe('name', () => {
    const nameFixture = {
      isname: ['isname111111j', 'a', '1', '5', 'sam5', 'sam', 'adam.applejjj'],
      noname: ['isname111111k', undefined, null, 1, '6', 'a6', ' ']
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
      assert.equal('12373', encodeName('eos'), 'encode')
      assert.equal('3055', encodeNameHex('eos'), 'encode hex')
      assert.equal(decodeName(encodeName('eos')), 'eos', 'decode')

      assert.equal('572d3ccdcd', encodeNameHex('transfer'), 'encode')
      assert.equal(decodeNameHex('572d3ccdcd'), 'transfer', 'decode')

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
