/**
 * pre-execution: python3 ./bios-boot-tutorial.py -k -w -b -s -c -t
 *
 * @type {Eos}
 */
const Eos = require('../src')
const keyProvider = ["5K463ynhZoCDDa4RDcr63cUwWLTnKqmdcoTKTHBjqoKfv4u5V7p",
    Eos.modules.ecc.seedPrivate('test-tps')
]
const nameRule = ".12345abcdefghijklmnopqrstuvwxyz"
const config = {
    accountCreate: false,
    push_interval: 1,
    trx_pool_size: 1,
    opts: {expireInSeconds: 1000, broadcast: true},
    ok: true,
    no: false
}
const eos = Eos({
    httpEndpoint: 'http://39.107.152.239:8000',
    chainId: '1c6ae7719a2a3b4ecb19584a30ff510ba1b6ded86e1fd8b8fc22f1179c622a32',
    keyProvider: keyProvider,
    expireInSeconds: 60,
    broadcast: false,
    verbose: false
})

function createAccount(account, publicKey, callback) {
    eos.transaction(tr => {
        tr.newaccount({
            creator: 'eosio',
            name: account,
            owner: publicKey,
            active: publicKey
        })

        tr.buyrambytes({
            payer: 'eosio',
            receiver: account,
            bytes: 4096
        })

        tr.delegatebw({
            from: 'eosio',
            receiver: account,
            stake_net_quantity: '0.0002 SYS',
            stake_cpu_quantity: '0.0002 SYS',
            transfer: 0
        })
    }).then(callback)
}

//----------------- init-----------------------------
if (config.accountCreate) {
    for (i = 0; i < 32; i++) {
        let accountname = "eosiotest" + nameRule.charAt(i) + "a"
        console.log("create test account: ", accountname)
        createAccount(accountname, Eos.modules.ecc.privateToPublic(keyProvider[1]), asset => {
            eos.transfer("eosio", accountname, "40.0000 SYS", "initial distribution", config.opts).then(balance => {
                eos.getCurrencyBalance("eosio.token", accountname, "SYS").then(tx => {
                    console.log(accountname + " balance: " + tx[0])
                })
            })
        })
    }
}

var txPools = new Array();

function sendTxAPI(src, dest, quality, memo) {
    eos.transaction({
        actions: [
            {
                account: "eosio.token",
                name: 'transfer',
                authorization: [{
                    actor: src,
                    permission: 'active'
                }],
                data: {
                    "from": src,
                    "to": dest,
                    "quantity": quality,
                    "memo": memo
                },
            }]
    }).then((tx) => {
        txPools.push(tx.transaction)
        if (txPools.length == config.push_interval) {
            let txs_str = JSON.stringify(txPools)
            console.log(txs_str)
            txPools = new Array();
            console.log("packed push " + config.push_interval)
            eos.pushTransactions(txs_str).then(txs => {
                console.log(txs)
            })
        }
    })
}

for (i = 0; i < config.trx_pool_size; i++) {
    let index = i % 31
    let src = "eosiotest" + nameRule.charAt(index) + "a"
    let dest = "eosiotest" + nameRule.charAt(index + 1) + "a"
    console.log(i + " --- " + src, dest, "0.0001 SYS", "packing test")
    sendTxAPI(src, dest, "0.0001 SYS", "packing test")
    sendTxAPI(dest, src, "0.0001 SYS", "packing test")
}
