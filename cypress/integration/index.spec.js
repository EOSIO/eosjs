import { skipOn } from '@cypress/skip-test';

describe('eosjs web test', () => {
    it('loads', () => {
        cy.visit(('./src/tests/web.html'));
    });

    it('test Transact With Config Blocks Behind', () => {
        cy.visit(('./src/tests/web.html'));
        cy.wait(500);
        cy.get('#testTransactWithConfigBlocksBehind').click();
        cy.get('#testTransactWithConfigBlocksBehind').contains('Success', { timeout: 5000 });
    });

    it('test Transact With Config Use Last Irreversible', () => {
        cy.visit(('./src/tests/web.html'));
        cy.wait(500);
        cy.get('#testTransactWithConfigUseLastIrreversible').click();
        cy.get('#testTransactWithConfigUseLastIrreversible').contains('Success', { timeout: 5000 });
    });

    it('test Transact Without Config', () => {
        if (Cypress.env('NODEOS_VER')) skipOn(Cypress.env('NODEOS_VER') === 'release/2.0.x');
        cy.visit(('./src/tests/web.html'));
        cy.wait(500);
        cy.get('#testTransactWithoutConfig').click();
        cy.get('#testTransactWithoutConfig').contains('Success', { timeout: 5000 });
    });

    it('test Transact With Compression', () => {
        cy.visit(('./src/tests/web.html'));
        cy.wait(500);
        cy.get('#testTransactWithCompression').click();
        cy.get('#testTransactWithCompression').contains('Success', { timeout: 5000 });
    });

    it('test Transact With Context Free Action', () => {
        cy.visit(('./src/tests/web.html'));
        cy.wait(500);
        cy.get('#testTransactWithContextFreeAction').click();
        cy.get('#testTransactWithContextFreeAction').contains('Success', { timeout: 5000 });
    });

    it('test Transact With Context Free Data', () => {
        cy.visit(('./src/tests/web.html'));
        cy.wait(500);
        cy.get('#testTransactWithContextFreeData').click();
        cy.get('#testTransactWithContextFreeData').contains('Success', { timeout: 5000 });
    });

    it('test Transact Without Broadcast', () => {
        cy.visit(('./src/tests/web.html'));
        cy.wait(500);
        cy.get('#testTransactWithoutBroadcast').click();
        cy.get('#testTransactWithoutBroadcast').contains('Success', { timeout: 5000 });
    });

    it('test Broadcast Result', () => {
        cy.visit(('./src/tests/web.html'));
        cy.wait(500);
        cy.get('#testBroadcastResult').click();
        cy.get('#testBroadcastResult').contains('Success', { timeout: 5000 });
    });

    it('test Shorthand With Api Json', () => {
        cy.visit(('./src/tests/web.html'));
        cy.wait(500);
        cy.get('#testShorthandWithApiJson').click();
        cy.get('#testShorthandWithApiJson').contains('Success', { timeout: 5000 });
    });

    it('test Shorthand With Tx Json', () => {
        cy.visit(('./src/tests/web.html'));
        cy.wait(500);
        cy.get('#testShorthandWithTxJson').click();
        cy.get('#testShorthandWithTxJson').contains('Success', { timeout: 5000 });
    });

    it('test Shorthand With Tx Json Context Free Action', () => {
        cy.visit(('./src/tests/web.html'));
        cy.wait(500);
        cy.get('#testShorthandWithTxJsonContextFreeAction').click();
        cy.get('#testShorthandWithTxJsonContextFreeAction').contains('Success', { timeout: 5000 });
    });

    it('test Shorthand With Tx Json Context Free Data', () => {
        cy.visit(('./src/tests/web.html'));
        cy.wait(500);
        cy.get('#testShorthandWithTxJsonContextFreeData').click();
        cy.get('#testShorthandWithTxJsonContextFreeData').contains('Success', { timeout: 5000 });
    });

    it('test With P256 Elliptic Curve', () => {
        cy.visit(('./src/tests/web.html'));
        cy.wait(500);
        cy.get('#testWithP256EllipticCurve').click();
        cy.get('#testWithP256EllipticCurve').contains('Success', { timeout: 5000 });
    });

    it('test With Return Value Tx', () => {
        if (Cypress.env('NODEOS_VER')) skipOn(Cypress.env('NODEOS_VER') === 'release/2.0.x');
        cy.visit(('./src/tests/web.html'));
        cy.wait(500);
        cy.get('#testWithReturnValueTx').click();
        cy.get('#testWithReturnValueTx').contains('Success', { timeout: 5000 });
    });

    it('test With Resource Payer Tx', () => {
        if (Cypress.env('NODEOS_VER')) skipOn(Cypress.env('NODEOS_VER') === 'release/2.0.x' || Cypress.env('NODEOS_VER') === 'release/2.1.x');
        cy.visit(('./src/tests/web.html'));
        cy.wait(500);
        cy.get('#testWithResourcePayerTx').click();
        cy.get('#testWithResourcePayerTx').contains('Success', { timeout: 5000 });
    });

    it('test With Read Only Query', () => {
        if (Cypress.env('NODEOS_VER')) skipOn(Cypress.env('NODEOS_VER') === 'release/2.0.x' || Cypress.env('NODEOS_VER') === 'release/2.1.x');
        cy.visit(('./src/tests/web.html'));
        cy.wait(500);
        cy.get('#testWithReadOnlyQuery').click();
        cy.get('#testWithReadOnlyQuery').contains('Success', { timeout: 5000 });
    });

    it('test With Read Only Failure Trace', () => {
        if (Cypress.env('NODEOS_VER')) skipOn(Cypress.env('NODEOS_VER') === 'release/2.0.x' || Cypress.env('NODEOS_VER') === 'release/2.1.x');
        cy.visit(('./src/tests/web.html'));
        cy.wait(500);
        cy.get('#testWithReadOnlyFailureTrace').click();
        cy.get('#testWithReadOnlyFailureTrace').contains('Success', { timeout: 5000 });
    });

    it('test Transact Should Fail', () => {
        cy.visit(('./src/tests/web.html'));
        cy.wait(500);
        cy.get('#testTransactShouldFail').click();
        cy.get('#testTransactShouldFail').contains('Success', { timeout: 5000 });
    });

    it('test Rpc Should Fail', () => {
        cy.visit(('./src/tests/web.html'));
        cy.wait(500);
        cy.get('#testRpcShouldFail').click();
        cy.get('#testRpcShouldFail').contains('Success', { timeout: 5000 });
    });
});
