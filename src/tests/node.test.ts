const tests = require('./node');

describe('Node JS environment', () => {
    let transactionResponse: any;
    let transactionSignatures: any;
    let failedAsPlanned: boolean;

    it('transacts with configuration object containing blocksBehind', async () => {
        transactionResponse = await tests.transactWithConfig({
            blocksBehind: 3,
            expireSeconds: 30
        }, 'transactWithBlocksBehind');
        expect(Object.keys(transactionResponse)).toContain('transaction_id');
    });

    it('transacts with configuration object containing useLastIrreversible', async () => {
        transactionResponse = await tests.transactWithConfig({
            useLastIrreversible: true,
            expireSeconds: 30
        }, 'transactWithUseLastIrreversible');
        expect(Object.keys(transactionResponse)).toContain('transaction_id');
    });

    it('transacts with manually configured TAPOS fields', async () => {
        transactionResponse = await tests.transactWithoutConfig();
        expect(Object.keys(transactionResponse)).toContain('transaction_id');
    }, 10000);

    it('transacts with compressed transaction', async () => {
        transactionResponse = await tests.transactWithConfig({
            blocksBehind: 3,
            expireSeconds: 30,
            compression: true
        }, 'transactWithCompression');
        expect(Object.keys(transactionResponse)).toContain('transaction_id');
    });

    it('transacts without broadcasting, returning signatures and packed transaction', async () => {
        transactionSignatures = await tests.transactWithConfig({
            broadcast: false,
            blocksBehind: 3,
            expireSeconds: 30
        }, 'transactWithoutBroadcast');
        expect(Object.keys(transactionSignatures)).toContain('signatures');
        expect(Object.keys(transactionSignatures)).toContain('serializedTransaction');
    });

    it('broadcasts packed transaction, given valid signatures', async () => {
        transactionSignatures = await tests.transactWithConfig({
            broadcast: false,
            blocksBehind: 3,
            expireSeconds: 30
        }, 'transactWithoutBroadcast2');
        transactionResponse = await tests.broadcastResult(transactionSignatures);
        expect(Object.keys(transactionResponse)).toContain('transaction_id');
    });

    describe('Json Abi with Shorthand Design', () => {
        it('transacts with shorthand structure using api', async () => {
            transactionResponse = await tests.transactWithShorthandApiJson();
            expect(Object.keys(transactionResponse)).toContain('transaction_id');
        });

        it('transacts with shorthand structure using tx', async () => {
            transactionResponse = await tests.transactWithShorthandTxJson();
            expect(Object.keys(transactionResponse)).toContain('transaction_id');
        });
    });

    describe('Wasm Abi with Shorthand Design', () => {
        it('transacts with shorthand structure using api', async () => {
            transactionResponse = await tests.transactWithShorthandApiWasm();
            expect(Object.keys(transactionResponse)).toContain('transaction_id');
        });

        it('transacts with shorthand structure using tx', async () => {
            transactionResponse = await tests.transactWithShorthandTxWasm();
            expect(Object.keys(transactionResponse)).toContain('transaction_id');
        });
    });

    it('throws appropriate error message without configuration object or TAPOS in place', async () => {
        try {
            failedAsPlanned = true;
            await tests.transactShouldFail();
            failedAsPlanned = false;
        } catch (e) {
            if (e.message !== 'Required configuration or TAPOS fields are not present') {
                failedAsPlanned = false;
            }
        }
        expect(failedAsPlanned).toEqual(true);
    });

    it('throws an an error with RpcError structure for invalid RPC calls', async () => {
        try {
            failedAsPlanned = true;
            await tests.rpcShouldFail();
            failedAsPlanned = false;
        } catch (e) {
            if (!e.json || !e.json.error || !(e.json.error.hasOwnProperty('details'))) {
                failedAsPlanned = false;
            }
        }
        expect(failedAsPlanned).toEqual(true);
    });
});
