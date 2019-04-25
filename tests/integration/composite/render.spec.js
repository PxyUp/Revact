describe('Test composite render', function () {
    before(() => {
        cy.exec("yarn rollup ./tests/integration/composite/index.ts --config ./rollup.config.tests.js")
        cy.visit('/')
    })
    it('Should render init value', () =>  {
        cy.get('div div.first').contains('0')
        cy.get('div div.second').contains('0')
        cy.get('div p').contains('0')
    })
    it('Should change value on click', () =>  {
        cy.get('div div.first').click()
        cy.get('div p').contains('1')
        cy.get('div div.second').click()
        cy.get('div p').contains('2')
    })
})
