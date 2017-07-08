/* eslint-env mocha */

const Eos = require('.')

testnet = Eos.Testnet()

describe('networks', () => {

  it('testnet', (done) => {
    eos = Eos({network: testnet})
    // testnet.getBlock(1, (err, block) => {
    //   if(err) {
    //     throw err
    //   }
    //   done()
    // })
    done()
  })

})

// describe('transaction', () => {
//
//   it('create', (done) => {
//     eos = Eos({network: testnet})
//     eos.transaction({
//       messages: [
//         {
//           from: '',
//           to: '',
//           cc: [],
//           type: '',
//           data: ''
//         }
//       ],
//       sign: ['5KYZdUEo39z3FPrtuX2QbbwGnNP5zTd7yyr2SC1j299sBCnWjss'],
//       permissions: [],
//     }, (err, tx) => {
//       if(err) {
//         throw err
//       }
//       done()
//     })
//   })
//
// })
