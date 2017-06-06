[![Build Status](https://travis-ci.org/eosjs/eosjs.svg?branch=master)](https://travis-ci.org/eosjs/eosjs)
[![Coverage Status](https://coveralls.io/repos/github/eosjs/eosjs/badge.svg?branch=master)](https://coveralls.io/github/eosjs/eosjs?branch=master)

# eosjs

General purpose library for the EOS blockchain.

This will combine other libraries into a larger package to allow for easy programming of blockchain read and write operations.

* [api](https://github.com/eosjs/api) - application programming interface to EOS blockchain nodes
* [json](https://github.com/eosjs/json) - blockchain definitions (api method names, blockchain operations, etc)
* [fcbuffer](https://github.com/jcalfee/fcbuffer) - binary serialization used by the blockchain

## Usage

```javascript
const assert = require('assert')
const Eos = require('.') // npm => eosjs

const eos = Eos()

const callback = (err, res) => {err ? console.error(err) : console.log(res)}

eos.transaction({
  messages: [
    {
      from: '',
      to: '',
      type: '',
      data: ''
    }
  ],
  sign: [key1],
  broadcast: true
}, callback)

```

## Testnet

```javascript
const Testnet = require('eosapi/testnet')
const api = Testnet()
const eos = Eos({api})
```

## Environment

Node 8+ and browser (browserify, webpack, etc)
