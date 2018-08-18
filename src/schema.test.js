/* eslint-env mocha */

const assert = require('assert')
const Fcbuffer = require('fcbuffer')

const schema = require('./schema')

describe('schema', () => {
  it('parses', () => {
    const fcbuffer = Fcbuffer(schema)
    const errors = JSON.stringify(fcbuffer.errors, null, 4)
    assert.equal(errors, '[]')
  })

})
