const handleOverviewStep = () => {
  cy.get('div.multistep > .center-align > button').contains('Continue').click();
};

export const completeInvestorProfile = () => {
  cy.get('.multistep-modal > ol.progtrckr > .progtrckr-doing').invoke('attr', 'value').then((val) => {
    cy.log('Login successful', typeof (val));
    // eslint-disable-next-line default-case
    switch (val) {
      case '0':
        handleOverviewStep();
        break;
    }
  });
};
