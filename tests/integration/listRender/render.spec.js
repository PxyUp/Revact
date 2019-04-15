describe('Test list render', function () {
    before(() => {
        cy.exec("yarn rollup ./tests/integration/listRender/index.ts --config ./rollup.config.tests.js")
        cy.visit('/')
    })
    it('Should render simple list', () =>  {
        cy.get('div > span').eq(0).contains('1')
        cy.get('div > span').eq(1).contains('2')
        cy.get('div > span').eq(2).contains('3')
        cy.get('div > span').eq(3).contains('4')
        cy.get('div > span').eq(4).contains('5')
        cy.get('div > span').eq(5).contains('6')
        cy.get('div > span').eq(6).contains('7')
    })
})
