import money from 'money-math';
import { registerApiCall } from '../../support/common';

export const clearEnteredAmount = () => {
  cy.get('input[name="investmentAmount"]').clear();
};

export const invalidInvestmentAmount = () => {
  clearEnteredAmount();
  const minInvestmentAmount = localStorage.getItem('minInvestAmount');
  const enterdMinValidAmount = '100';
  const comapirdWithMinInvetment = money.cmp(enterdMinValidAmount, minInvestmentAmount).toString();
  cy.log('minInvestmentAmount==>', minInvestmentAmount);
  cy.get('input[name="investmentAmount"]').type('101');
  cy.get('input[name="investmentAmount"]').blur();
  cy.wait(500);
  cy.get('input[name="investmentAmount"]').parentsUntil('.field').get('p').should('have.class', 'field-error');
  clearEnteredAmount();
  cy.get('input[name="investmentAmount"]').type(enterdMinValidAmount);
  cy.get('input[name="investmentAmount"]').type('{enter}');
  cy.wait(500);
  if (money.isNegative(comapirdWithMinInvetment)) {
    cy.get('input[name="investmentAmount"]').parentsUntil('.field').get('p').should('have.class', 'field-error');
  }
};

export const validInvestmentAmount = () => {
  registerApiCall('investNowGeneratePurchaseAgreement');
  const enterdMaxValidAmount = '1000';
  cy.wait(300);
  clearEnteredAmount();
  cy.get('input[name="investmentAmount"]').type(enterdMaxValidAmount);
  cy.get('input[name="investmentAmount"]').type('{enter}');
  cy.wait('@investNowGeneratePurchaseAgreement');
  cy.wait('@investNowGeneratePurchaseAgreement');
};

export const ConfirmTransferRequest = () => {
  cy.wait('@investNowGeneratePurchaseAgreement');
  // cy.wait(2000);
    // cy.get('div.multistep-modal').find('div.multistep.content').find('div.center-align').get('h3').invoke('text')
    cy.get('.modal').then(($el) => {
      // const element = cy.wrap($el);
      const text1 = $el.get('.multistep.content');
      cy.log('text1===> ', text1);
      debugger;
    if (text1) {
      cy.log('Enter into If block ==>', text1);
      cy.get('.multistep-modal').find('.multistep.content').find('.two.buttons').contains('Confirm')
        .click();
    } else {
      cy.log('Enter into Else block');
      return true;
    }
  });
};

export const generateAgreement = () => {
  // cy.wait('@investNowGeneratePurchaseAgreement');
  cy.wait(3000);
  cy.get('.confirm-investment').should('have.length', 1);
  cy.get('.signup-content').find('div:visible').find('.ui.form').find('.ui.stackable.grid')
    .find('.row')
    .get('.eight.wide.column').first()
    .children()
    .children()
    .children()
    .get('input[name="checkboxesLeft"]')
    .parent()
    .click({ force: true, multiple: true });
  cy.get('.signup-content').find('div:visible').find('.ui.form').find('.ui.stackable.grid')
    .find('.row')
    .get('.eight.wide.column').eq(1)
    .children()
    .children()
    .children()
    .get('input[name="checkboxesRight"]')
    .parent()
    .click({ force: true, multiple: true });
};

export const submitInvestment = () => {
  registerApiCall('investNowFinalSubmit')
  cy.get('.signup-content').find('div:visible').find('.ui.form').find('.center-align').find('.buttons').contains('Invest')
    .click();
  cy.wait('@investNowFinalSubmit');
  cy.wait(300);
  cy.get('.modals.dimmer').find('.modal.transition.visible').find('.signup-header').contains('Congratulations!').should('be.visible');
  cy.get('.modals.dimmer').find('.modal.transition.visible').find('.signup-content').find('.center-align').contains('View Portfolio')
    .click();
}

export const enteringInvestmentAmount = () => {
  registerApiCall('investNowGeneratePurchaseAgreement');
  invalidInvestmentAmount();
  validInvestmentAmount();
  // ConfirmTransferRequest();
  generateAgreement();
  submitInvestment();
};

export const invalidMultipleInvestmentAmount = () => {
  clearEnteredAmount();
  cy.get('input[name="investmentAmount"]').type('101');
  cy.get('input[name="investmentAmount"]').blur();
  cy.wait(500);
  cy.get('input[name="investmentAmount"]').parentsUntil('.field').get('p').should('have.class', 'field-error');
}

export const invalidMinInvestmentAmount = () => {
  registerApiCall('investNowGeneratePurchaseAgreement');
  clearEnteredAmount();
  const minInvestmentAmount = localStorage.getItem('minInvestAmount');
  const enterdMinValidAmount = '100';
  const comapirdWithMinInvetment = money.cmp(enterdMinValidAmount, minInvestmentAmount).toString();
  cy.get('input[name="investmentAmount"]').type(enterdMinValidAmount);
  cy.get('input[name="investmentAmount"]').type('{enter}');
  cy.wait(500);
  if (money.isNegative(comapirdWithMinInvetment)) {
    cy.get('input[name="investmentAmount"]').parentsUntil('.field').get('p').should('have.class', 'field-error');
  }
}