describe('eosjs web test', () => {
  it('loads', () => {
    cy.visit(('./src/tests/web.html'))
  });
})
