import { InvestorFlowProcess } from '../../support/investorSignup/investorFlow';
import { registerApiCall, clickRadioAndNext, btnClickAndWait } from '../../support/common';

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
  const plaidProcess = (progressStep) => {
    registerApiCall('upsertInvestorAccount');
    cy.get(`.multistep-modal > ol.progtrckr > ${progressStep}`).click().invoke('text').then((step) => {
      cy.log('bank step', step.toUpperCase());
      if (step.toUpperCase() === 'LINK BANK') {
        cy.get('button.link-button').contains('Or link account directly').click();
        cy.get('.bank-link:first').click({ force: true });
        cy.wait(5000);
        cy.get('iframe').then(($iframe) => {
          const $body = $iframe.contents().find('body');
          cy.log('body', $iframe.contents());
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

  const iraAccountCreation = () => {
    registerApiCall('upsertInvestorAccount');
    cy.get('.multistep-modal > ol.progtrckr > .progtrckr-doing').invoke('text').then((text) => {
      cy.log('step value', text);
      // eslint-disable-next-line default-case
      switch (text) {
        case 'Financial info':
          cy.get('input[name="netWorth"]').type('123456789');
          cy.get('input[name="income"]').type('123456789');
          btnClickAndWait('upsertInvestorAccount');
          iraAccountCreation();
          break;
        case 'Account type':
          clickRadioAndNext('input[name="iraAccountType"]', '1', 'upsertInvestorAccount');
          iraAccountCreation();
          break;
        case 'Funding':
          clickRadioAndNext('input[name="fundingType"]', '0', 'upsertInvestorAccount');
          iraAccountCreation();
          break;
        case 'Link bank':
          plaidProcess('.progtrckr-doing');
          iraAccountCreation();
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

  it('should successfully link bank with manual process', () => {
    manualLinkbankProcess();
  });

  it('should successfully link bank with plaid process', () => {
    plaidProcess('.progtrckr-done');
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
      cy.get('div.center-align').find('button').contains('Create your account').click({ force: true });
    });
    cy.wait('@upsertInvestorAccount');
  });

  it('should create IRA account successfully', () => {
    registerApiCall('upsertInvestorAccount');
    cy.get('.btn-item').contains('Open New Account').click({ force: true });
    cy.get('input[name="accType"]').check('1', { force: true });
    cy.get('button.next').click();
    iraAccountCreation();
  });
});
