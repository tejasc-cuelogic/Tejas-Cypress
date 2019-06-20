
export const proceedForAccreditationRequest = () => {
  return new Cypress.Promise((resolve, reject) => {
    cy.get('.multistep').find('form.form').find('.center-align').get('.mt-30 > .ui').click();
    cy.get('.loader', { timeout: 6000 }).should('not.exist');
    cy.get('.multistep').find('h3.ui.center').invoke('text')
      .then(($headerText) => {
        cy.log('headerText==>', $headerText);
        if ($headerText.includes('How are you an accredited investor?')) {
          applyForAccreditation();
          resolve();
        } else if ($headerText.includes('NetWorth')) {
          applyForAccreditation();
          resolve();
        }
      });
    resolve();
  });
}

export const applyForAccreditation = () => {
  cy.get('.multistep-modal').find('.progtrckr').get('li').its('length')
    .then((size) => {
      cy.log('SIZE OBTAINED IS==>', size);
      if (size === 3) {
        cy.log('Networth flow...');
      } else if (size === 2) {
        cy.get('.multistep').find('h3.ui.center').invoke('text')
          .then(($headerText) => {
            if ($headerText.includes('Income')) {
              cy.get('.multistep').find('form.ui.form').find('.ui.one').find('.column').eq(1).click();
              cy.get('.multistep').get('button[type="submit"].next.active').click();
            }
          });
      } else {
        cy.log('Initial starting flow');
      }
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