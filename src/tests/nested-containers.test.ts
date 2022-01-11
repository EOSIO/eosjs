import fetch from 'node-fetch';
const { TextEncoder, TextDecoder } = require('util');

// Code for gathering coverage for src/ not dist/, otherwise tests should test the built files in dist/
let eosjs;
let eosjs_jssig;
if (process.env.COVERAGE_TESTING === 'true') {
    eosjs = require('../');
    eosjs_jssig = require('../eosjs-jssig');
} else {
    eosjs = require('../../dist');
    eosjs_jssig = require('../../dist/eosjs-jssig');
}

const { JsonRpc, Api } = eosjs;
const { JsSignatureProvider } = eosjs_jssig;

const privateKey = '5JuH9fCXmU3xbj8nRmhPZaVrxxXrdPaRmZLW1cznNTmTQR2Kg5Z';

const rpc = new JsonRpc('http://localhost:8888', { fetch });
const signatureProvider = new JsSignatureProvider([privateKey]);
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

describe('eosjs-nested-container', () => {

    it('should test Multi Index nested containers', async () => {
        jest.setTimeout(30000);

        await api.getAbi('nestcontnmi');

        // Test action for set< set< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setstst('alice', [[10, 10], [3], [400, 500, 600]]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for set< vector< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setstv('alice', [[16, 26], [36], [36], [46, 506, 606]]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for set< optional< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setsto('alice', [null, null, 500]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for set< map< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setstm('alice', [[{'key':30,'value':300},{'key':30,'value':300}],[{'key':60,'value':600},{'key':60,'value':600}]]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for set< pair< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setstp('alice', [{'first': 69, 'second': 129}, {'first': 69, 'second': 129}]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for set< tuple< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setstt('alice', [[1,2],[36,46], [56,66]]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for vector< set< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setvst('alice', [[10, 10], [3], [400, 500, 600]]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for vector< vector< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setvv('alice', [[16, 26], [36], [36], [46, 506, 606]]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for vector< optional< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setvo('alice',[null, null, 500]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for vector< map< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setvm('alice', [[{'key': 30, 'value': 300}, {'key': 30, 'value': 300}], [{'key': 60, 'value': 600}, {'key': 60, 'value': 600}]]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for vector< pair< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setvp('alice', [{'first': 69, 'second': 129}, {'first': 69, 'second': 129}]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for vector< tuple< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setvt('alice', [[10,20],[30,40], [50,60]]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for optional< set< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setost('alice', [10, 10, 3]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });
        await api.transact({
            actions: [ api.with('nestcontnmi').as('bob').setost('bob', null) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for optional< vector< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setov('alice', [46, 506, 606]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });
        await api.transact({
            actions: [ api.with('nestcontnmi').as('bob').setov('bob', null) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for optional< optional< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setoo('alice', 500) ]
        }, { blocksBehind: 3, expireSeconds: 30 });
        await api.transact({
            actions: [ api.with('nestcontnmi').as('bob').setoo('bob', null) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for optional< map< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setom('alice', [{'key': 10, 'value': 1000}, {'key': 11,'value': 1001}]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });
        await api.transact({
            actions: [ api.with('nestcontnmi').as('bob').setom('bob', null) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for optional< pair< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setop('alice', {'first': 60, 'second': 61}) ]
        }, { blocksBehind: 3, expireSeconds: 30 });
        await api.transact({
            actions: [ api.with('nestcontnmi').as('bob').setop('bob', null) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for optional< tuple< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setot('alice', [1001,2001]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });
        await api.transact({
            actions: [ api.with('nestcontnmi').as('bob').setot('bob', null) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for map< set< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setmst('alice', [{'key': 1,'value': [10, 10, 12, 16]},  {'key': 2, 'value': [200, 300]} ]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for map< vector< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setmv('alice', [{'key': 1, 'value': [10, 10, 12, 16]},  {'key': 2, 'value': [200, 300]} ]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for map< optional< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setmo('alice', [{'key': 10, 'value': 1000}, {'key': 11, 'value': null}]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for map< map< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setmm('alice', [{'key': 10, 'value': [{'key': 200, 'value': 2000}, {'key': 201, 'value': 2001}] }, {'key': 11, 'value': [{'key': 300, 'value': 3000}, {'key': 301, 'value': 3001}] } ]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for map< pair< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setmp('alice', [{'key': 36, 'value': {'first': 300, 'second': 301}}, {'key': 37, 'value': {'first': 600, 'second': 601}} ]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for map< tuple< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setmt('alice', [{'key':1,'value':[10,11]},  {'key':2,'value':[200,300]} ]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for pair< set< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setpst('alice', {'first': 20, 'second': [200, 200, 202]}) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for pair< vector< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setpv('alice', {'first': 10, 'second': [100, 100, 102]}) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for pair< optional< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setpo('alice', {'first': 70, 'second': 71}) ]
        }, { blocksBehind: 3, expireSeconds: 30 });
        await api.transact({
            actions: [ api.with('nestcontnmi').as('bob').setpo('bob', {'first': 70, 'second': null}) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for pair< map< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setpm('alice', {'first': 6, 'second': [{'key': 20, 'value': 300}, {'key': 21,'value': 301}] }) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for pair< pair< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setpp('alice', {'first': 30, 'second': {'first': 301, 'second': 302} }) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for pair< tuple< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setpt('alice', {'first':10, 'second':[100,101]}) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for tuple< uint16_t, set< uint16_t >, set< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').settst('alice', [10,[21,31], [41,51,61]]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for tuple< uint16_t, vector< uint16_t >, vector< uint16_t >
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').settv('alice', [16,[26,36], [46,506,606]]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for tuple< optional< uint16_t >, optional< uint16_t >, optional< uint16_t > , optional< uint16_t >, optional< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setto('alice', [100, null, 200, null, 300]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });
        await api.transact({
            actions: [ api.with('nestcontnmi').as('bob').setto('bob', [null, null, 10, null, 20]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for tuple< map< uint16_t, uint16_t >, map< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').settm('alice', [126, [{'key':10,'value':100},{'key':11,'value':101}], [{'key':80,'value':800},{'key':81,'value':9009}] ]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for tuple< uint16_t, pair< uint16_t, uint16_t >, pair< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').settp('alice', [127, {'first':18, 'second':28}, {'first':19, 'second':29}]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for tuple< tuple< uint16_t, uint16_t >, tuple< uint16_t, uint16_t >, tuple< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').settt('alice', [[1,2],[30,40], [50,60]]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for vector<optional<mystruct>>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setvos('alice', [{'_count': 18, '_strID': 'dumstr'}, null, {'_count': 19, '_strID': 'dumstr'}]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for pair<uint16_t, vector<optional<uint16_t>>>
        await api.transact({
            actions: [ api.with('nestcontnmi').as('alice').setpvo('alice',{'first': 183, 'second':[100, null, 200]}) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        const transaction = await rpc.get_table_rows({
            code: 'nestcontnmi',
            scope: 'nestcontnmi',
            table: 'people2',
            json: true
        });

        expect(transaction.rows[0].stst).toEqual([[3], [10], [400, 500, 600]]);

        expect(transaction.rows[0].stv).toEqual([[16, 26], [36], [46, 506, 606]]);

        expect(transaction.rows[0].sto).toEqual([null, 500]);

        expect(transaction.rows[0].stm).toEqual([[{'key': 30, 'value': 300}], [{'key': 60, 'value': 600}]]);

        expect(transaction.rows[0].stp).toEqual([{'first': 69, 'second': 129}]);

        expect(transaction.rows[0].stt).toEqual([{'field_0': 1, 'field_1': 2}, {'field_0': 36, 'field_1': 46}, {'field_0': 56, 'field_1': 66}]);

        expect(transaction.rows[0].vst).toEqual([[10], [3], [400, 500, 600]]);

        expect(transaction.rows[0].vv).toEqual([[16, 26], [36], [36], [46, 506, 606]]);

        expect(transaction.rows[0].vo).toEqual([null, null, 500]);

        expect(transaction.rows[0].vm).toEqual([[{'key': 30, 'value': 300}], [{'key': 60, 'value': 600}]]);

        expect(transaction.rows[0].vp).toEqual([{'first': 69, 'second': 129}, {'first': 69, 'second': 129}]);

        expect(transaction.rows[0].vt).toEqual([{'field_0': 10, 'field_1': 20}, {'field_0': 30, 'field_1': 40}, {'field_0': 50, 'field_1': 60}]);

        expect(transaction.rows[0].ost).toEqual([3, 10]);
        expect(transaction.rows[1].ost).toEqual(null);

        expect(transaction.rows[0].ov).toEqual([46, 506, 606]);
        expect(transaction.rows[1].ov).toEqual(null);

        expect(transaction.rows[0].oo).toEqual(500);
        expect(transaction.rows[1].oo).toEqual(null);

        expect(transaction.rows[0].om).toEqual([{'key': 10, 'value': 1000}, {'key': 11, 'value': 1001}]);
        expect(transaction.rows[1].om).toEqual(null);

        expect(transaction.rows[0].op).toEqual({'first': 60, 'second': 61});
        expect(transaction.rows[1].op).toEqual(null);

        expect(transaction.rows[0].ot).toEqual({'field_0': 1001, 'field_1': 2001});
        expect(transaction.rows[1].ot).toEqual(null);

        expect(transaction.rows[0].mst).toEqual([{'key': 1, 'value': [10, 12, 16]}, {'key': 2, 'value': [200, 300]}]);

        expect(transaction.rows[0].mv).toEqual([{'key': 1, 'value': [10, 10, 12, 16]}, {'key': 2, 'value': [200, 300]}]);

        expect(transaction.rows[0].mo).toEqual([{'key': 10, 'value': 1000}, {'key': 11, 'value': null}]);

        expect(transaction.rows[0].mm).toEqual([{'key': 10, 'value': [{'key': 200, 'value': 2000}, {'key': 201, 'value': 2001}]}, {'key': 11, 'value': [{'key': 300, 'value': 3000}, {'key': 301, 'value': 3001}]}]);

        expect(transaction.rows[0].mp).toEqual([{'key': 36, 'value': {'first': 300, 'second': 301}}, {'key': 37, 'value': {'first': 600, 'second': 601}}]);

        expect(transaction.rows[0].mt).toEqual([{'key': 1, 'value': {'field_0': 10, 'field_1': 11}}, {'key': 2, 'value': {'field_0': 200, 'field_1': 300}}]);

        expect(transaction.rows[0].pst).toEqual({'first': 20, 'second': [200, 202]});

        expect(transaction.rows[0].pv).toEqual({'first': 10, 'second': [100, 100, 102]});

        expect(transaction.rows[0].po).toEqual({'first': 70, 'second': 71});
        expect(transaction.rows[1].po).toEqual({'first': 70, 'second': null});

        expect(transaction.rows[0].pm).toEqual({'first': 6, 'second': [{'key': 20, 'value': 300}, {'key': 21, 'value': 301}]});

        expect(transaction.rows[0].pp).toEqual({'first': 30, 'second': {'first': 301, 'second': 302}});

        expect(transaction.rows[0].pt).toEqual({'first': 10, 'second': {'field_0': 100, 'field_1': 101}});

        expect(transaction.rows[0].tst).toEqual({'field_0': 10, 'field_1': [21, 31], 'field_2': [41, 51, 61]});

        expect(transaction.rows[0].tv).toEqual({'field_0': 16, 'field_1': [26, 36], 'field_2': [46, 506, 606]});

        expect(transaction.rows[0].to).toEqual({'field_0': 100, 'field_1': null, 'field_2': 200, 'field_3': null, 'field_4': 300});
        expect(transaction.rows[1].to).toEqual({'field_0': null, 'field_1': null, 'field_2': 10, 'field_3': null, 'field_4': 20});

        expect(transaction.rows[0].tm).toEqual({'field_0': 126, 'field_1': [{'key': 10, 'value': 100}, {'key': 11, 'value': 101}], 'field_2': [{'key': 80, 'value': 800}, {'key': 81, 'value': 9009}]});

        expect(transaction.rows[0].tp).toEqual({'field_0': 127, 'field_1': {'first': 18, 'second': 28}, 'field_2': {'first': 19, 'second': 29}});

        expect(transaction.rows[0].tt).toEqual({'field_0': {'field_0': 1, 'field_1': 2}, 'field_1': {'field_0': 30, 'field_1': 40}, 'field_2': {'field_0': 50, 'field_1': 60}});

        expect(transaction.rows[0].vos).toEqual([{'_count': 18, '_strID': 'dumstr'}, null, {'_count': 19, '_strID': 'dumstr'}]);

        expect(transaction.rows[0].pvo).toEqual({'first': 183, 'second': [100, null, 200]});
    });

    it('should test Key-Value nested containers', async () => {
        jest.setTimeout(30000);

        await api.getAbi('nestcontn2kv');

        // Test action for set< set< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setstst(1, [[10, 10], [3], [400, 500, 600]]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for set< vector< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setstv(1, [[16, 26], [36], [36], [46, 506, 606]]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for set< optional< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setsto(1, [null, null, 500]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for set< map< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setstm(1, [[{'key':30,'value':300},{'key':30,'value':300}],[{'key':60,'value':600},{'key':60,'value':600}]]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for set< pair< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setstp(1, [{'first': 69, 'second': 129}, {'first': 69, 'second': 129}]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for set< tuple< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setstt(1, [[1,2],[36,46], [56,66]]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for vector< set< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setvst(1, [[10, 10], [3], [400, 500, 600]]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for vector< vector< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setvv(1, [[16, 26], [36], [36], [46, 506, 606]]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for vector< optional< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setvo(1, [null, null, 500]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for vector< map< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setvm(1, [[{'key': 30, 'value': 300}, {'key': 30, 'value': 300}], [{'key': 60, 'value': 600}, {'key': 60, 'value': 600}]]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for vector< pair< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setvp(1, [{'first': 69, 'second': 129}, {'first': 69, 'second': 129}]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for vector< tuple< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setvt(1, [[10,20],[30,40], [50,60]]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for optional< set< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setost(1, [10, 10, 3]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('bob').setost(2, null) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for optional< vector< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setov(1, [46, 506, 606]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('bob').setov(2, null) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for optional< optional< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setoo(1, 500) ]
        }, { blocksBehind: 3, expireSeconds: 30 });
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('bob').setoo(2, null) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for optional< map< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setom(1, [{'key': 10, 'value': 1000}, {'key': 11,'value': 1001}]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('bob').setom(2, null) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for optional< pair< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setop(1, {'first': 60, 'second': 61}) ]
        }, { blocksBehind: 3, expireSeconds: 30 });
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('bob').setop(2, null) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for optional< tuple< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setot(1, [1001,2001]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('bob').setot(2, null) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for map< set< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setmst(1, [{'key': 1,'value': [10, 10, 12, 16]},  {'key': 2, 'value': [200, 300]} ]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for map< vector< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setmv(1, [{'key': 1, 'value': [10, 10, 12, 16]},  {'key': 2, 'value': [200, 300]} ]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for map< optional< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setmo(1, [{'key': 10, 'value': 1000}, {'key': 11, 'value': null}]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for map< map< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setmm(1, [{'key': 10, 'value': [{'key': 200, 'value': 2000}, {'key': 201, 'value': 2001}] }, {'key': 11, 'value': [{'key': 300, 'value': 3000}, {'key': 301, 'value': 3001}] } ]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for map< pair< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setmp(1, [{'key': 36, 'value': {'first': 300, 'second': 301}}, {'key': 37, 'value': {'first': 600, 'second': 601}} ]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for map< tuple< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setmt(1, [{'key':1,'value':[10,11]},  {'key':2,'value':[200,300]} ]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for pair< set< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setpst(1, {'first': 20, 'second': [200, 200, 202]}) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for pair< vector< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setpv(1, {'first': 10, 'second': [100, 100, 102]}) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for pair< optional< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setpo(1, {'first': 70, 'second': 71}) ]
        }, { blocksBehind: 3, expireSeconds: 30 });
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('bob').setpo(2, {'first': 70, 'second': null}) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for pair< map< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setpm(1, {'first': 6, 'second': [{'key': 20, 'value': 300}, {'key': 21,'value': 301}] }) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for pair< pair< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setpp(1, {'first': 30, 'second': {'first': 301, 'second': 302} }) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for pair< tuple< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setpt(1, {'first':10, 'second':[100,101]}) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for tuple< uint16_t, set< uint16_t >, set< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').settst(1, [10,[21,31], [41,51,61]]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for tuple< uint16_t, vector< uint16_t >, vector< uint16_t >
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').settv(1, [16,[26,36], [46,506,606]]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for tuple< optional< uint16_t >, optional< uint16_t >, optional< uint16_t > , optional< uint16_t >, optional< uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setto(1, [100, null, 200, null, 300]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('bob').setto(2, [null, null, 10, null, 20]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for tuple< map< uint16_t, uint16_t >, map< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').settm(1, [126, [{'key':10,'value':100},{'key':11,'value':101}], [{'key':80,'value':800},{'key':81,'value':9009}] ]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for tuple< uint16_t, pair< uint16_t, uint16_t >, pair< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').settp(1, [127, {'first':18, 'second':28}, {'first':19, 'second':29}]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for tuple< tuple< uint16_t, uint16_t >, tuple< uint16_t, uint16_t >, tuple< uint16_t, uint16_t >>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').settt(1, [[1,2],[30,40], [50,60]]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for vector<optional<mystruct>>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setvos(1, [{'_count': 18, '_strID': 'dumstr'}, null, {'_count': 19, '_strID': 'dumstr'}]) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        // Test action for pair<uint16_t, vector<optional<uint16_t>>>
        await api.transact({
            actions: [ api.with('nestcontn2kv').as('alice').setpvo(1,{'first': 183, 'second':[100, null, 200]}) ]
        }, { blocksBehind: 3, expireSeconds: 30 });

        await new Promise(r => setTimeout(r, 1000));

        const transaction = await rpc.get_kv_table_rows({
            code: 'nestcontn2kv',
            table: 'people2kv',
            index_name: 'map.index',
            json: true
        });

        expect(transaction.rows[0].stst).toEqual([[3], [10], [400, 500, 600]]);

        expect(transaction.rows[0].stv).toEqual([[16, 26], [36], [46, 506, 606]]);

        expect(transaction.rows[0].sto).toEqual([null, 500]);

        expect(transaction.rows[0].stm).toEqual([[{'key': 30, 'value': 300}], [{'key': 60, 'value': 600}]]);

        expect(transaction.rows[0].stp).toEqual([{'first': 69, 'second': 129}]);

        expect(transaction.rows[0].stt).toEqual([{'field_0': 1, 'field_1': 2}, {'field_0': 36, 'field_1': 46}, {'field_0': 56, 'field_1': 66}]);

        expect(transaction.rows[0].vst).toEqual([[10], [3], [400, 500, 600]]);

        expect(transaction.rows[0].vv).toEqual([[16, 26], [36], [36], [46, 506, 606]]);

        expect(transaction.rows[0].vo).toEqual([null, null, 500]);

        expect(transaction.rows[0].vm).toEqual([[{'key': 30, 'value': 300}], [{'key': 60, 'value': 600}]]);

        expect(transaction.rows[0].vp).toEqual([{'first': 69, 'second': 129}, {'first': 69, 'second': 129}]);

        expect(transaction.rows[0].vt).toEqual([{'field_0': 10, 'field_1': 20}, {'field_0': 30, 'field_1': 40}, {'field_0': 50, 'field_1': 60}]);

        expect(transaction.rows[0].ost).toEqual([3, 10]);
        expect(transaction.rows[1].ost).toEqual(null);

        expect(transaction.rows[0].ov).toEqual([46, 506, 606]);
        expect(transaction.rows[1].ov).toEqual(null);

        expect(transaction.rows[0].oo).toEqual(500);
        expect(transaction.rows[1].oo).toEqual(null);

        expect(transaction.rows[0].om).toEqual([{'key': 10, 'value': 1000}, {'key': 11, 'value': 1001}]);
        expect(transaction.rows[1].om).toEqual(null);

        expect(transaction.rows[0].op).toEqual({'first': 60, 'second': 61});
        expect(transaction.rows[1].op).toEqual(null);

        expect(transaction.rows[0].ot).toEqual({'field_0': 1001, 'field_1': 2001});
        expect(transaction.rows[1].ot).toEqual(null);

        expect(transaction.rows[0].mst).toEqual([{'key': 1, 'value': [10, 12, 16]}, {'key': 2, 'value': [200, 300]}]);

        expect(transaction.rows[0].mv).toEqual([{'key': 1, 'value': [10, 10, 12, 16]}, {'key': 2, 'value': [200, 300]}]);

        expect(transaction.rows[0].mo).toEqual([{'key': 10, 'value': 1000}, {'key': 11, 'value': null}]);

        expect(transaction.rows[0].mm).toEqual([{'key': 10, 'value': [{'key': 200, 'value': 2000}, {'key': 201, 'value': 2001}]}, {'key': 11, 'value': [{'key': 300, 'value': 3000}, {'key': 301, 'value': 3001}]}]);

        expect(transaction.rows[0].mp).toEqual([{'key': 36, 'value': {'first': 300, 'second': 301}}, {'key': 37, 'value': {'first': 600, 'second': 601}}]);

        expect(transaction.rows[0].mt).toEqual([{'key': 1, 'value': {'field_0': 10, 'field_1': 11}}, {'key': 2, 'value': {'field_0': 200, 'field_1': 300}}]);

        expect(transaction.rows[0].pst).toEqual({'first': 20, 'second': [200, 202]});

        expect(transaction.rows[0].pv).toEqual({'first': 10, 'second': [100, 100, 102]});

        expect(transaction.rows[0].po).toEqual({'first': 70, 'second': 71});
        expect(transaction.rows[1].po).toEqual({'first': 70, 'second': null});

        expect(transaction.rows[0].pm).toEqual({'first': 6, 'second': [{'key': 20, 'value': 300}, {'key': 21, 'value': 301}]});

        expect(transaction.rows[0].pp).toEqual({'first': 30, 'second': {'first': 301, 'second': 302}});

        expect(transaction.rows[0].pt).toEqual({'first': 10, 'second': {'field_0': 100, 'field_1': 101}});

        expect(transaction.rows[0].tst).toEqual({'field_0': 10, 'field_1': [21, 31], 'field_2': [41, 51, 61]});

        expect(transaction.rows[0].tv).toEqual({'field_0': 16, 'field_1': [26, 36], 'field_2': [46, 506, 606]});

        expect(transaction.rows[0].to).toEqual({'field_0': 100, 'field_1': null, 'field_2': 200, 'field_3': null, 'field_4': 300});

        expect(transaction.rows[1].to).toEqual({'field_0': null, 'field_1': null, 'field_2': 10, 'field_3': null, 'field_4': 20});

        expect(transaction.rows[0].tm).toEqual({'field_0': 126, 'field_1': [{'key': 10, 'value': 100}, {'key': 11, 'value': 101}], 'field_2': [{'key': 80, 'value': 800}, {'key': 81, 'value': 9009}]});

        expect(transaction.rows[0].tp).toEqual({'field_0': 127, 'field_1': {'first': 18, 'second': 28}, 'field_2': {'first': 19, 'second': 29}});

        expect(transaction.rows[0].tt).toEqual({'field_0': {'field_0': 1, 'field_1': 2}, 'field_1': {'field_0': 30, 'field_1': 40}, 'field_2': {'field_0': 50, 'field_1': 60}});

        expect(transaction.rows[0].vos).toEqual([{'_count': 18, '_strID': 'dumstr'}, null, {'_count': 19, '_strID': 'dumstr'}]);

        expect(transaction.rows[0].pvo).toEqual({'first': 183, 'second': [100, null, 200]});
    });
});
