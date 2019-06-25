import { InvestorFlowProcess } from './utility/investorAccount.utlity';
import { registerApiCall, clickRadioAndNext, btnClickAndWait, uploadFile } from '../../../support/common';

export const GeneralInfoMeta = {
  name: 'John Smith',
  taxId: '12',
  entityType: 'LLC',
  residentalStreet: '222333 Peachtree Place',
  city: 'Atlanta',
  state: 'GEORGIA',
  zipCode: '30318',
};

describe('Account Creation', () => {
  before(() => {
    InvestorFlowProcess();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    registerApiCall('upsertInvestorAccount', '/dev/graphql');
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  const manualLinkbankProcess = () => {
    registerApiCall('manualAccount', '/dev/graphql');
    cy.get('input[name="accType"]').check('0', { force: true });
    cy.get('button.next').click();
    cy.wait(2000);
    cy.get('div.content').get('div.center-align > button.link-button').contains('Or enter it manually').click();
    cy.get('input[name="accountNumber"]').type('0000000008');
    cy.get('input[name="routingNumber"]').type('122105278');
    cy.get('input[name="accountType"]').check('SAVINGS', { force: true });
    cy.get('button.button').contains('Confirm').click();
    cy.wait('@manualAccount');
  };
  const plaidProcess = (progressStep, count) => {
    cy.get('.dimmer-visible').should('not.be.visible')
    cy.get(`.multistep-modal > ol.progtrckr > ${progressStep}`).click({ force: true }).invoke('text').then((step) => {
      cy.log('bank step', step.toUpperCase());
      if (step.toUpperCase() === 'LINK BANK') {
        cy.get('.bank-link:first').click({ force: true });
        cy.wait(5000);
        registerApiCall('plaidAccount', '/dev/graphql');
        cy.get(`#plaid-link-iframe-${count}`).then(($iframe) => {
          const $body = $iframe.contents().find('body');
          cy.log('body', $iframe.contents().find('body'));
          let stripe = cy.wrap($body);
          stripe.find('button').contains('Continue').click({ force: true });
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
          cy.wait('@plaidAccount');
        });
      }
    });
  };

  const addFunds = (amount) => {
    cy.get('form').within(() => {
      registerApiCall('addFunds', '**/graphql');
      cy.get('input[name="value"]').type(amount);
      cy.get('button').contains('Confirm').click();
      cy.wait('@addFunds');
    });
  }

  const iraAccountCreation = () => {
    cy.get('.dimmer-visible').should('not.be.visible')
    registerApiCall('upsertInvestorAccount', '/dev/graphql');
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
          plaidProcess('.progtrckr-doing', '2');
          addFunds('5010');
          iraAccountCreation();
          break;
        case 'Identity':
          uploadFile();
          cy.wait('@fileUpload');
          cy.wait(1000);
          iraAccountCreation();
          break;
        case 'Summary':
          registerApiCall('submitAccount', '/dev/graphql');
          cy.get('div.content').get('button.button').contains('Submit for review').click({ force: true });
          cy.wait('@submitAccount');
          cy.wait('@submitAccount');
          cy.wait(1000);
          cy.get('.modal', { timeout: 10000 }).then(($el) => {
            const element = cy.wrap($el);
            element.get('button.button').contains('Continue').click({ force: true });
          });
          cy.wait(5000);
          break;
      }
    });
  };

  const entityAccountCreation = () => {
    cy.get('.dimmer-visible').should('not.be.visible')
    registerApiCall('upsertInvestorAccount', '/dev/graphql');
    cy.get('.multistep-modal > ol.progtrckr > .progtrckr-doing').invoke('text').then((text) => {
    cy.log('step value', text);
    // eslint-disable-next-line default-case
    switch (text) {
      case 'Financial info':
        cy.get('input[name="netAssets"]').type('123456789');
        cy.get('input[name="annualIncome"]').type('123456789');
        btnClickAndWait('upsertInvestorAccount');
        entityAccountCreation();
        break;
      case 'General':
        cy.get('input[name="name"]').type(GeneralInfoMeta.name);
        cy.get('input[name="taxId"]').type(`${GeneralInfoMeta.taxId}${Math.floor((Math.random() * 100000000) + 1)}`);
        cy.get('div[name="entityType"]')
          .click()
          .get(`div[role="option"]:contains(${GeneralInfoMeta.entityType})`)
          .click();
        cy.get('input[name="street"]').type(GeneralInfoMeta.residentalStreet);
        cy.get('input[name="city"]').type(GeneralInfoMeta.city);
        cy.get('div[name="state"]')
          .click()
          .get(`div[role="option"]:contains(${GeneralInfoMeta.state})`)
          .click();
        cy.get('input[name="city"]').type(GeneralInfoMeta.city);
        cy.get('input[name="zipCode"]').type(GeneralInfoMeta.zipCode);
        btnClickAndWait('upsertInvestorAccount');
        cy.wait('@upsertInvestorAccount');
        entityAccountCreation();
        break;
      case 'Trust Status':
        clickRadioAndNext('input[name="isTrust"]', 'false', 'upsertInvestorAccount');
        entityAccountCreation();
        break;
      case 'Personal info':
        cy.get('input[name="title"]').type('CTO');
        uploadFile('input[name="legalDocUrl"]');
        cy.wait('@fileUpload');
        entityAccountCreation();
        break;
      case 'Formation doc':
        uploadFile('input[name="formationDoc"]');
        uploadFile('input[name="operatingAgreementDoc"]');
        uploadFile('input[name="einVerificationDoc"]');
        btnClickAndWait('upsertInvestorAccount');
        registerApiCall('upsertInvestorAccount');
        cy.wait(2000);
        entityAccountCreation();
        break;
      case 'Link bank':
        plaidProcess('.progtrckr-doing', '3');
        addFunds('7000');
        cy.wait('@addFunds');
        cy.wait('@addFunds');
        entityAccountCreation();
        break;
      case 'Summary':
        registerApiCall('submitAccount', '/dev/graphql');
        cy.get('div.content').get('button.button').contains('Submit for review').click({ force: true });
        cy.wait('@submitAccount');
        cy.wait('@submitAccount');
        cy.wait(1000)
        cy.get('.modal', { timeout: 5000 }).then(($el) => {
          const element = cy.wrap($el)
          element.get('button.button').contains('Continue').click({ force: true });
        });
        cy.wait(5000);
        break;
      }
    });
  };

  it('should successfully link bank with manual process', () => {
    manualLinkbankProcess();
    cy.get('input[name="value"]').then(() => {
      cy.get(`.multistep-modal > ol.progtrckr > .progtrckr-doing`).click({ force: true }).invoke('text').then((step) => {
        cy.log('step value', step);
        assert.equal(step, 'Add funds', 'Should be on add funds modal')	
      });
    });
  });

  it('should successfully link bank with plaid process', () => {
    plaidProcess('.progtrckr-done', '1');
    cy.get('input[name="value"]').then(() => {
      cy.get(`.multistep-modal > ol.progtrckr > .progtrckr-doing`).click({ force: true }).invoke('text').then((step) => {
        cy.log('step value', step);
        assert.equal(step, 'Add funds', 'Should be on add funds modal')	
      });
    });
  });

  it('should create individual account successfully', () => {
    addFunds('15000');
      cy.wait('@addFunds');
      cy.wait('@addFunds');
    registerApiCall('submitAccount', '/dev/graphql');
    cy.get('div.content').get('button.button').contains('Create your account').click({ force: true });
    cy.wait('@submitAccount');
    cy.wait('@submitAccount');
    cy.wait(5000);
  });

  it('should create IRA account successfully', () => {
    cy.get('.btn-item').contains('Open New Account').click({ force: true });
    cy.get('input[name="accType"]').check('1', { force: true });
    cy.get('button.next').click();
    cy.wait(1000);
    iraAccountCreation();
  });

  it('should create Entity account successfully', () => {
    cy.get('.btn-item').contains('Open New Account').click({ force: true });
    cy.get('input[name="accType"]').check('2', { force: true });
    cy.get('button.next').click();
    entityAccountCreation();
  });
});
