describe('eosjs web test', () => {
  it('loads', () => {
    cy.visit(('./src/tests/web.html'));
  });
  it('runs all tests successfully', () => {
    cy.visit(('./src/tests/web.html'))
    cy.get('div.tests>div>button').each((test) => {
      cy.wrap(test).click();
      cy.contains('Success', { timeout: 5000 })
    });
  });
})
