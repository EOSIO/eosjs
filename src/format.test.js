/* eslint-env mocha */
const assert = require('assert')
const {
  encodeName, decodeName, encodeNameHex, decodeNameHex,
  isName, DecimalPad, DecimalUnimply,
  parseAsset
} = require('./format')

describe('format', () => {
  // In isname111111k, 'k' overflows the last 4 bits of the name
  describe('name', () => {
    const nameFixture = {
      isname: ['isname111111', 'a', '1', '5', 'sam5', 'sam', 'adam.applejj'],
      noname: ['isname111111j', undefined, null, 1, '6', 'a6', ' ']
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

  it('DecimalPad', () => {
    assert.throws(() => DecimalPad(), /value is required/)
    assert.throws(() => DecimalPad('$10', 0), /invalid decimal/)
    assert.throws(() => DecimalPad('1.1.', 0), /invalid decimal/)
    assert.throws(() => DecimalPad('1.1,1', 0), /invalid decimal/)
    assert.throws(() => DecimalPad('1.11', 1), /exceeds precision/)

    const decFixtures = [
      {value: -1, precision: null, answer: '-1'},
      {value: 1, precision: null, answer: '1'},

      {value: 1, precision: 0, answer: '1'},
      {value: '1', precision: 0, answer: '1'},
      {value: '1.', precision: 0, answer: '1'},
      {value: '1.0', precision: 0, answer: '1'},
      {value: '1456.0', precision: 0, answer: '1456'},
      {value: '1,456.0', precision: 0, answer: '1,456'},

      // does not validate commas
      {value: '1,4,5,6', precision: 0, answer: '1,4,5,6'},
      {value: '1,4,5,6.0', precision: 0, answer: '1,4,5,6'},

      {value: 1, precision: 1, answer: '1.0'},
      {value: '1', precision: 1, answer: '1.0'},
      {value: '1.', precision: 1, answer: '1.0'},
      {value: '1.0', precision: 1, answer: '1.0'},
      {value: '1.10', precision: 1, answer: '1.1'},

      {value: '1.1', precision: 2, answer: '1.10'},
      {value: '1.10', precision: 2, answer: '1.10'},
      {value: '1.01', precision: 2, answer: '1.01'},

      {value: '1', precision: 3, answer: '1.000'},

    ]
    for(const test of decFixtures) {
      const {answer, value, precision} = test
      assert.equal(DecimalPad(value, precision), answer, JSON.stringify(test))
    }
  })

  it('DecimalUnimply', () => {
    assert.throws(() => DecimalUnimply('1.', 1), /invalid whole number/)
    assert.throws(() => DecimalUnimply('.1', 1), /invalid whole number/)
    assert.throws(() => DecimalUnimply('1.1', 1), /invalid whole number/)

    const decFixtures = [
      {value: -1, precision: 0, answer: '-1'},
      {value: 1, precision: 0, answer: '1'},
      {value: '1', precision: 0, answer: '1'},
      {value: '10', precision: 0, answer: '10'},

      {value: 1, precision: 1, answer: '0.1'},
      {value: '10', precision: 1, answer: '1.0'},

      {value: '11', precision: 2, answer: '0.11'},
      {value: '110', precision: 2, answer: '1.10'},
      {value: '101', precision: 2, answer: '1.01'},
      {value: '0101', precision: 2, answer: '1.01'},
      {value: '1', precision: 5, answer: '0.00001'},
    ]
    for(const test of decFixtures) {
      const {answer, value, precision} = test
      assert.equal(DecimalUnimply(value, precision), answer, JSON.stringify(test))
    }
  })

  it('parseAsset', () => {
    const parseExtendedAssets = [
      ['SYM', null, null, 'SYM', null],
      ['SYM@contract', null, null, 'SYM', 'contract'],
      ['4,SYM', null, 4, 'SYM', null],
      ['4,SYM@contract', null, 4, 'SYM', 'contract'],
      ['1 SYM', '1', 0, 'SYM', null],
      ['-1 SYM', '-1', 0, 'SYM', null],
      ['1.0 SYM', '1.0', 1, 'SYM', null],
      ['1.0000 SYM@contract', '1.0000', 4, 'SYM', 'contract'],
      ['1.0000 SYM@tract.token', '1.0000', 4, 'SYM', 'tract.token'],
      ['1.0000 SYM@tr.act.token', '1.0000', 4, 'SYM', 'tr.act.token'],
      ['1.0000 SYM', '1.0000', 4, 'SYM', null],
    ]
    for(const [str, amount, precision, symbol, contract] of parseExtendedAssets) {
      assert.deepEqual(
        parseAsset(str),
        {amount, precision, symbol, contract},
        JSON.stringify([str, amount, precision, symbol, contract])
      )
    }
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
