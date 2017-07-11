/* eslint-env mocha */

const Eos = require('.')

describe('networks', () => {
  it('testnet', (done) => {
    eos = Eos.Testnet()
    // testnet.getBlock(1, (err, block) => {
    //   if(err) {
    //     throw err
    //   }
    //   done()
    // })
    done()
  })

})

if(process.env['NODE_ENV'] === 'dev') {
  describe('transaction', () => {
    it('transfer', (done) => {
      testnet = Eos.Testnet()
      callback = (err, res) => {err ? console.error(err) : console.log(res)}
      testnet.transaction({
        messages: [
          {
            code: 'eos',
            recipients: [ 'inita', 'initb' ],
            authorization: [],
            type: 'transfer',
            data: {
              from: 'inita',
              to: 'initb',
              amount: { amount: '1', symbol: 'EOS' },
              memo: '爱'
            }
          }
        ],
        sign: ['5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'],
        permissions: [],
      }, (err, result) => {
        if(err) {
          done(JSON.stringify(err, null, 4))
          return
        }
        console.log('success', result)
        done()
      })
    })

  })
}
