/* eslint-env mocha */
const assert = require('assert')
const {encodeName, decodeName, isName} = require('./format')

describe('format', () => {

  describe('name', () => {
    const nameFixture = {
      isname: ['length1111111', 'sam5', 'sam', 'adam.apple'],
      noname: ['length11111111', undefined, null, 1, 'sam6', ' ']
    }

    it('isName', () => {
      for(let name of nameFixture.isname) {
        assert(isName(name), name)
      }
      for(let name of nameFixture.noname) {
        assert(!isName(name), name)
      }
    })

    it('encode / decode', () => {
      assert.equal(encodeName('sam'), '13363')
      for(let name of nameFixture.isname) {
        assert(decodeName(encodeName(name)), name)
      }
      assert(decodeName(1))
      throws(() => decodeName(Number.MAX_SAFE_INTEGER + 1), /overflow/)
      throws(() => decodeName({}), /long or string/)
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
