describe('eosjs web test', () => {
  it('loads', () => {
    cy.visit(('./src/tests/web.html'));
  });
  it('runs all tests successfully', () => {
    cy.visit(('./src/tests/web.html'))
    cy.get('div.tests>div>button').each((test) => { // iterate through all the tests
      cy.wrap(test).click(); // click the button to start the test
      cy.wrap(test).contains('Success', { timeout: 5000 });  // wait 5 seconds for success or treat as failure
      cy.wait(500); // allow time for transaction to confirm (prevents duplicate transactions)
    });
  });
})
