describe('Test render button with Counter', function () {
    before(() => {
        cy.exec("yarn rollup ./tests/integration/listeners/index.ts --config ./rollup.config.tests.js")
        cy.visit('/')
    })
    it('Should increase counter on click', () =>  {
        cy.get('div span').contains('0')
        cy.get('div').click().get('span').contains("1")
    })
})
