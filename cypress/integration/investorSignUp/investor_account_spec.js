import { InvestorFlowProcess } from '../../support/investorSignup/investorFlow';
import { registerApiCall } from '../../support/common';

describe('Account Creation', () => {
  before(() => {
    InvestorFlowProcess();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  const manualLinkbankProcess = () => {
    registerApiCall('upsertInvestorAccount');
    cy.get('input[name="accType"]').check('0', { force: true });
    cy.get('button.next').click();
    cy.get('button.link-button').contains('Or enter it manually').click();
    cy.get('input[name="accountNumber"]').type('0000000008');
    cy.get('input[name="routingNumber"]').type('122105278');
    cy.get('input[name="accountType"]').check('SAVINGS', { force: true });
    cy.get('button.button').contains('Confirm').click();
    cy.wait('@upsertInvestorAccount');
  };

  const plaidProcess = () => {
    registerApiCall('upsertInvestorAccount');
    cy.get('.multistep-modal > ol.progtrckr > .progtrckr-done').click().invoke('text').then((step) => {
      cy.log('step value', step);
      if (step === 'Link Bank') {
        cy.get('button.link-button').contains('Or link account directly').click();
        cy.get('.bank-link:first').click({ force: true });
        cy.wait(3000);
        cy.get('iframe').then(($iframe) => {
          const $body = $iframe.contents().find('body');
          let stripe = cy.wrap($body);
          stripe.find('.Pane__actions > button').click({ force: true });
          stripe = cy.wrap($body);
          stripe.find('input[name="username"]').type('user_good');
          stripe = cy.wrap($body);
          stripe.find('input[name="password"]').type('pass_good');
          stripe = cy.wrap($body);
          stripe.find('button[type="submit"]').click();
          cy.wait(5000);
          stripe = cy.wrap($body);
          stripe.find('div.SelectAccountPane__account-list:first').click();
          stripe = cy.wrap($body);
          stripe.find('button').contains('Continue').click();
          cy.wait('@upsertInvestorAccount');
        });
      }
    });
  };

  it('should successfully link bank with manual process', () => {
    manualLinkbankProcess();
  });

  it('should successfully link bank with plaid process', () => {
    plaidProcess();
  });

  it('should create individual account successfully', () => {
    registerApiCall('upsertInvestorAccount');
    cy.get('form').within(() => {
      cy.get('input[name="value"]').type('15000');
      cy.get('button').contains('Confirm').click();
    });
    cy.wait('@upsertInvestorAccount');
    cy.wait(3000);
    cy.get('.multistep').within(() => {
      cy.get('.center-align > .button').contains('Create your account').click({ force: true });
    });
  });
});
