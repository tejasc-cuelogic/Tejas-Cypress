import { InvestorFlowProcess } from '../../../support/investorSignup/investorFlow';
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
    cy.wait(2000);
    cy.get('input[name="accType"]').check('0', { force: true });
    cy.get('button.next').click();
    cy.wait(2000);
    cy.get('div.content').get('div.center-align > button.link-button').contains('Or enter it manually').click();
    cy.get('input[name="accountNumber"]').type('0000000008');
    cy.get('input[name="routingNumber"]').type('122105278');
    cy.get('input[name="accountType"]').check('SAVINGS', { force: true });
    cy.get('button.button').contains('Confirm').click();
    cy.wait('@upsertInvestorAccount');
    cy.wait(5000);
  };
  const plaidProcess = (progressStep, count) => {
    cy.wait(2000);
    cy.get(`.multistep-modal > ol.progtrckr > ${progressStep}`).click({ force: true }).invoke('text').then((step) => {
      cy.log('bank step', step.toUpperCase());
      if (step.toUpperCase() === 'LINK BANK') {
        cy.get('.bank-link:first').click({ force: true });
        cy.wait(5000);
        cy.get(`#plaid-link-iframe-${count}`).then(($iframe) => {
          const $body = $iframe.contents().find('body');
          cy.log('body', $iframe.contents().find('body'));
          cy.wait(500);
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
          cy.wait('@upsertInvestorAccount');
        });
      }
    });
  };

  const addFunds = (amount) => {
    cy.get('form').within(() => {
      cy.get('input[name="value"]').type(amount);
      cy.get('button').contains('Confirm').click();
      cy.wait('@upsertInvestorAccount');
    });
  };

  const iraAccountCreation = () => {
    cy.wait(3000);
    registerApiCall('upsertInvestorAccount', '/dev/graphql');
    cy.get('.multistep-modal > ol.progtrckr > .progtrckr-doing').invoke('text').then((text) => {
      cy.log('step value', text);
      // eslint-disable-next-line default-case
      switch (text) {
        case 'Financial info':
          cy.get('input[name="netWorth"]').type('123456789');
          cy.get('input[name="income"]').type('123456789');
          btnClickAndWait('upsertInvestorAccount');
          cy.wait(2000);
          iraAccountCreation();
          break;
        case 'Account type':
          clickRadioAndNext('input[name="iraAccountType"]', '1', 'upsertInvestorAccount');
          cy.wait(2000);
          iraAccountCreation();
          break;
        case 'Funding':
          clickRadioAndNext('input[name="fundingType"]', '0', 'upsertInvestorAccount');
          cy.wait(2000);
          iraAccountCreation();
          break;
        case 'Link bank':
          plaidProcess('.progtrckr-doing', '2');
          cy.wait(1000);
          addFunds('5010');
          cy.wait('@upsertInvestorAccount');
          cy.wait(2000);
          iraAccountCreation();
          break;
        case 'Identity':
          uploadFile();
          cy.wait('@fileUpload');
          cy.wait(1000);
          iraAccountCreation();
          break;
        case 'Summary':
          registerApiCall('submitAccount');
          cy.get('div.content').get('button.button').contains('Submit for review').click({ force: true });
          cy.wait('@submitAccount');
          cy.wait(5000)
          cy.wait('@submitAccount');
          cy.wait(1000);
          cy.get('.modal', { timeout: 10000 }).then(($el) => {
            const element = cy.wrap($el);
            element.get('button.button').contains('Continue').click({ force: true });
          });
          cy.wait(10000);
          break;
      }
    });
  };

  const entityAccountCreation = () => {
    cy.wait(3000);
    registerApiCall('upsertInvestorAccount', '/dev/graphql');
    cy.get('.multistep-modal > ol.progtrckr > .progtrckr-doing').invoke('text').then((text) => {
    cy.log('step value', text);
    // eslint-disable-next-line default-case
    switch (text) {
      case 'Financial info':
        cy.get('input[name="netAssets"]').type('123456789');
        cy.get('input[name="annualIncome"]').type('123456789');
        btnClickAndWait('upsertInvestorAccount');
        cy.wait(3000);
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
        cy.wait(3000);
        entityAccountCreation();
        break;
      case 'Trust Status':
        clickRadioAndNext('input[name="isTrust"]', 'false', 'upsertInvestorAccount');
        cy.wait(2000);
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
        cy.wait(1000);
        addFunds('7000');
        cy.wait('@upsertInvestorAccount');
        cy.wait('@upsertInvestorAccount');
        cy.wait(2000);
        entityAccountCreation();
        break;
      case 'Summary':
        registerApiCall('submitAccount')
        cy.get('div.content').get('button.button').contains('Submit for review').click({ force: true });
        cy.wait('@submitAccount');
        cy.wait(5000)
        cy.wait('@submitAccount');
        cy.wait(1000)
        cy.get('.modal', { timeout: 10000 }).then(($el) => {
          const element = cy.wrap($el)
          element.get('button.button').contains('Continue').click({ force: true });
        });
        cy.wait(10000);
        break;
      }
    });
  };

  it('should successfully link bank with manual process', () => {
    manualLinkbankProcess();
  });

  it('should successfully link bank with plaid process', () => {
    plaidProcess('.progtrckr-done', '1');
  });

  it('should create individual account successfully', () => {
    cy.wait(2000);
    addFunds('15000');
    cy.wait(5000);
    cy.wait(2000);
    registerApiCall('submitAccount');
    cy.get('div.content').get('button.button').contains('Create your account').click({ force: true });
    // cy.wait('@submitAccount');
    // cy.wait('@submitAccount');
    // cy.get('body').then(($body) => {
    //   if ($body.get('.modal').length > 0) {
    //     cy.get('.modal').get('button.button').contains('Continue').click({ force: true });
    //   }
    // });
    cy.wait(20000);
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
