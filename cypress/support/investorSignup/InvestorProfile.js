import { waitForAPIcall, registerApiCall } from '../common';

const handleOverviewStep = () => {
  cy.get('div.multistep > .center-align > button').contains('Continue').click();
};

export const completeInvestorProfile = () => {
  registerApiCall('upsertProfile');
  cy.get('.multistep-modal > ol.progtrckr > .progtrckr-doing').invoke('text').then((text) => {
    cy.log('step value', text);
    // eslint-disable-next-line default-case
    switch (text) {
      case 'Overview':
        handleOverviewStep();
        completeInvestorProfile();
        break;
      case 'Employment Status':
        cy.get('input[name="status"]').check('SELF_EMPLOYED', { force: true });
        cy.get('button.next').click();
        waitForAPIcall('upsertProfile');
        cy.wait(2000);
        completeInvestorProfile();
        break;
      case 'Brokerage Employment':
        cy.get('input[name="brokerageEmployment"]').check('no', { force: true });
        cy.get('button.next').click();
        waitForAPIcall('upsertProfile');
        cy.wait(2000);
        completeInvestorProfile();
        break;
      case 'Public Company Relations':
        cy.get('input[name="publicCompanyRel"]').check('no', { force: true });
        cy.get('button.next').click();
        waitForAPIcall('upsertProfile');
        cy.wait(2000);
        completeInvestorProfile();
        break;
      case 'Financial Information':
        cy.get('input[name="investorProfileType"]').check('JOINT', { force: true });
        cy.get('input[name="netWorth"]').type('123456789');
        cy.get('input[name="annualIncomeCurrentYear"]').type('123456789');
        cy.get('button.next').click();
        waitForAPIcall('upsertProfile');
        cy.wait(3000);
        completeInvestorProfile();
        break;
      case 'Investment Experience':
        cy.get('input[name="experienceLevel"]').check('GOOD', { force: true });
        cy.get('div[role="listitem"]').get('[type="checkbox"]').parent()
          .click({ multiple: true });
        cy.wait(3000);
        cy.get('.center-align > button').contains('Continue to Account').click({ force: true });
        waitForAPIcall('upsertProfile');
        cy.wait(3000);
        break;
    }
  });
};
