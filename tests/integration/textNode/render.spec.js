describe('Test render textNode', function () {
    before(() => {
        cy.exec("yarn rollup ./tests/integration/textNode/index.ts --config ./rollup.config.tests.js")
        cy.visit('/')
    })
    it('Should render textNode', () =>  {
        cy.get('body').contains('Test')
    })
})
