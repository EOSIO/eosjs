[![Build Status](https://travis-ci.org/eosjs/eosjs.svg?branch=master)](https://travis-ci.org/eosjs/eosjs)
[![NPM](https://img.shields.io/npm/v/eosjs.svg)](https://www.npmjs.org/package/eosjs)

Status: Alpha (this is for eosjs library developers)

# Eos Js

General purpose library for the EOS blockchain.

## Usage

```javascript
Eos = require('eosjs') // Or Eos = require('.')
callback = (err, res) => {err ? console.error(err) : console.log(res)}

// API, note: testnet uses eosd at localhost (until there is a testnet)
Testnet = require('eosjs-api/testnet')

testnet = Testnet()
testnet.getBlock(1, callback) // More at https://github.com/eosjs/api

eos = Eos({network: testnet})

// Transaction
eos.transaction({
  messages: [
    {
      from: '',
      to: '',
      cc: [],
      type: '',
      data: ''
    }
  ],
  sign: ['5KYZdUEo39z3FPrtuX2QbbwGnNP5zTd7yyr2SC1j299sBCnWjss'],
  permissions: [],
}, callback)

// Exported libraries (see Related Libraries)
let {ecc} = eos.modules
let {json} = eos.modules
let {fcbuffer} = eos.modules
```

# Related Libraries

This library breaks down into more specific purpose libraries:

* [api](https://github.com/eosjs/api) - application programming interface to EOS blockchain nodes
* [json](https://github.com/eosjs/json) - blockchain definitions (api method names, blockchain operations, etc)
* [fcbuffer](https://github.com/jcalfee/fcbuffer) - binary serialization used by the blockchain

## Environment

Node 6+ and browser (browserify, webpack, etc)
