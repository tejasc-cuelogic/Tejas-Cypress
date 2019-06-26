import { registerApiCall, btnClickAndWait, clickRadioAndNext } from '../../../../support/common';

const handleOverviewStep = () => {
  cy.get('div.multistep > .center-align > button').contains('Continue').click({ force: true });
};

export const completeInvestorProfile = () => {
  cy.get('.dimmer-visible').should('not.be.visible')
  cy.get('.multistep-modal > ol.progtrckr > .progtrckr-doing').invoke('text').then((text) => {
    cy.log('step value', text);
    // eslint-disable-next-line default-case
    switch (text) {
      case 'Overview':
        handleOverviewStep();
        completeInvestorProfile();
        break;
      case 'Employment Status':
        clickRadioAndNext('input[name="status"]', 'SELF_EMPLOYED', 'upsertProfile');
        completeInvestorProfile();
        break;
      case 'Brokerage Employment':
        clickRadioAndNext('input[name="brokerageEmployment"]', 'no', 'upsertProfile');
        completeInvestorProfile();
        break;
      case 'Public Company Relations':
        clickRadioAndNext('input[name="publicCompanyRel"]', 'no', 'upsertProfile');
        completeInvestorProfile();
        break;
      case 'Financial Information':
        cy.get('input[name="investorProfileType"]').check('JOINT', { force: true });
        cy.get('input[name="netWorth"]').type('123456789');
        cy.get('input[name="annualIncomeCurrentYear"]').type('123456789');
        btnClickAndWait('upsertProfile');
        completeInvestorProfile();
        break;
      case 'Investment Experience':
        cy.get('input[name="experienceLevel"]').check('GOOD', { force: true });
        cy.get('div[role="listitem"]').get('[type="checkbox"]').parent()
          .click({ multiple: true });
        cy.wait(500);
        registerApiCall('upsertProfile');
        cy.get('.center-align > button').contains('Continue to Account').click({ force: true });
        cy.wait('@upsertProfile');
        break;
    }
  });
};

