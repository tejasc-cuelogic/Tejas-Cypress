
export const proceedForAccreditationRequest = () => {
  return new Cypress.Promise((resolve, reject) => {
    cy.get('.multistep').find('form.form').find('.center-align').get('.mt-30 > .ui').click();
    cy.get('.loader', { timeout: 6000 }).should('not.exist');
    cy.get('.multistep').find('h3.ui.center').invoke('text')
    .then(($headerText) => {
      if ($headerText.includes('How are you an accredited investor?')) {

      }
    });
    resolve();
  });
}


export const checkRegulationAndAccreditation = () => {
  return new Cypress.Promise((resolve, reject) => {
    cy.wait(1000);
    cy.get('.multistep').find('h3.ui.center').invoke('text')
      .then(($text1) => {
        if ($text1.includes('This investment is only available to accredited investors.')) {
          proceedForAccreditationRequest()
            .then((resp) => {
              resolve(true);
            });
        } else {
          cy.log('procced for investment ELSE');
          resolve(false);
        }
      });
  });
}