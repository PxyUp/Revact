describe('Test conditional render', function () {
    before(() => {
        cy.exec("yarn rollup ./tests/integration/conditionalRender/index.ts --config ./rollup.config.tests.js")
        cy.visit('/')
    })
    it('Should show when btn click', () =>  {
        cy.get('div span').should('not.exist');
        cy.get('div').click().get('span').contains("You see me")
        cy.get('div').click().get('span').should('not.exist');
    })
})
