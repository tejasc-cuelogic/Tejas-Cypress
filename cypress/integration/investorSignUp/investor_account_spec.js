import { InvestorFlowProcess } from '../../support/investorSignup/investorFlow';
import { registerApiCall } from '../../support/common';

describe('Account Creation', () => {
  beforeEach(() => {
    InvestorFlowProcess();
  });

  // it('should successfully create individual account with manual link bank process', () => {
  //   registerApiCall('upsertInvestorAccount');
  //   cy.get('input[name="accType"]').check('0', { force: true });
  //   cy.get('button.next').click();
  //   // cy.get('.bank-link:first').click({ force: true });
  //   // cy.wait(10000);
  //   // cy.get('.PrivacyInterstitialPane').find('button').contains('Continue').click();
  //   // cy.get('.Pane__content').within(() => {
  //   //   cy.get('input[name="username"]').type('user_good');
  //   //   cy.get('input[name="password"]').type('pass_good');
  //   //   cy.get('button[type="submit"]').click();
  //   // });
  //   // cy.get('.SelectAccountPane__account-list:first').click();
  //   // cy.get('button').contains('Continue').click();
  //   cy.get('button.link-button').contains('Or enter it manually').click();
  //   cy.get('input[name="accountNumber"]').type('0000000008');
  //   cy.get('input[name="routingNumber"]').type('122105278');
  //   cy.get('input[name="accountType"]').check('SAVINGS', { force: true });
  //   cy.get('button.button').contains('Confirm').click();
  //   cy.wait('@upsertInvestorAccount');
  //   cy.get('form').within(() => {
  //     cy.get('input[name="value"]').type('15000');
  //     cy.get('button').contains('Confirm').click();
  //     cy.wait('@upsertInvestorAccount');
  //   });
  //   cy.wait(3000);
  //   cy.get('.multistep').within(() => {
  //     cy.get('button').contains('Create your account').click({ force: true });
  //   });
  // });

  it('should successfully create individual account with plaid link bank process', () => {
    registerApiCall('upsertInvestorAccount');
    cy.get('input[name="accType"]').check('0', { force: true });
    cy.get('button.next').click();
    cy.get('.bank-link:first').click({ force: true });
    cy.wait(10000);
    cy.get('iframe').then(($iframe) => {
      const $body = $iframe.contents().find('body');
      let stripe = cy.wrap($body);
      stripe.find('.Pane__actions > button').click({ force: true });
      stripe = cy.wrap($body);
      stripe.find('input[name="username"]').type('user_good');
      stripe.find('input[name="password"]').type('pass_good');
      stripe.find('button[type="submit"]').click();
    });
    cy.get('.SelectAccountPane__account-list:first').click();
    cy.get('button').contains('Continue').click();
    cy.wait('@upsertInvestorAccount');
    cy.get('form').within(() => {
      cy.get('input[name="value"]').type('15000');
      cy.get('button').contains('Confirm').click();
      cy.wait('@upsertInvestorAccount');
    });
    cy.wait(3000);
    cy.get('.multistep').within(() => {
      cy.get('button').contains('Create your account').click({ force: true });
    });
  });
});
