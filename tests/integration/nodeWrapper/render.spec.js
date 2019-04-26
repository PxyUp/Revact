describe('Test nodeWrapper render', function () {
    before(() => {
        cy.exec("yarn rollup ./tests/integration/nodeWrapper/index.ts --config ./rollup.config.tests.js")
        cy.visit('/')
    })
    it('Should render directly in body without wrapping', () =>  {
        cy.get('body > div.first').contains('0')
        cy.get('body > div.second').contains('0')
        cy.get('body > p').contains('0')
    })
    it('Should save all listeners and behavior', () =>  {
        cy.get('body > div.first').click()
        cy.get('body > p').contains('1')
        cy.get('body > div.second').click()
        cy.get('body > p').contains('2')
        cy.get('body > div.second').contains('1')
        cy.get('body > div.first').contains('1')
    })
})
