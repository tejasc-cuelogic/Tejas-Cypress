
export const proceedForAccreditationRequest = () => {
    cy.log('Proceed for accreditation...');
}


export const checkRegulationAndAccreditation = () => {
    cy.wait(1000);
    cy.get('.multistep').find('h3.ui.center').invoke('text')
    .then(($text1) => {
        cy.log('text1===>', $text1);
        const modelText = cy.wrap($text1).should('eq', 'This investment is only available to accredited investors.');
        cy.log('modelText===>', modelText);
    });
    // .should('eq', 'This investment is only available to accredited investors.');
    // cy.log('modelText===>', modelText);

    // if (modelText) {
    //     proceedForAccreditationRequest();
    // } else {
    //     cy.log('procced for investment');
    // }
    // .then((text1) => {
    //     cy.log('text1 text1==>', text1);
    //     const modelHeadingText = expect(text1).to.have.text('This investment is only available to accredited investors.');
    //     cy.log('modelHeadingText==>', modelHeadingText);
    //     if (modelHeadingText) {
    //         proceedForAccreditationRequest();
    //     } else {
    //         cy.log('procced for investment');
    //     }
    // });
}