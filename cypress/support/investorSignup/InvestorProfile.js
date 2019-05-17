import { registerApiCall } from '../common';

const handleOverviewStep = () => {
  cy.get('div.multistep > .center-align > button').contains('Continue').click();
};
const btnClickAndWait = () => {
  cy.get('button.next').click();
  cy.wait('@upsertProfile');
  cy.wait(2000);
};

const clickRadioAndNext = (selector, radioVal) => {
  cy.get(selector).check(radioVal, { force: true });
  btnClickAndWait();
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
        clickRadioAndNext('input[name="status"]', 'SELF_EMPLOYED');
        completeInvestorProfile();
        break;
      case 'Brokerage Employment':
        clickRadioAndNext('input[name="brokerageEmployment"]', 'no');
        completeInvestorProfile();
        break;
      case 'Public Company Relations':
        clickRadioAndNext('input[name="publicCompanyRel"]', 'no');
        completeInvestorProfile();
        break;
      case 'Financial Information':
        cy.get('input[name="investorProfileType"]').check('JOINT', { force: true });
        cy.get('input[name="netWorth"]').type('123456789');
        cy.get('input[name="annualIncomeCurrentYear"]').type('123456789');
        btnClickAndWait();
        completeInvestorProfile();
        break;
      case 'Investment Experience':
        cy.get('input[name="experienceLevel"]').check('GOOD', { force: true });
        cy.get('div[role="listitem"]').get('[type="checkbox"]').parent()
          .click({ multiple: true });
        cy.wait(3000);
        cy.get('.center-align > button').contains('Continue to Account').click({ force: true });
        cy.wait('@upsertProfile');
        cy.wait(3000);
        break;
    }
  });
};

