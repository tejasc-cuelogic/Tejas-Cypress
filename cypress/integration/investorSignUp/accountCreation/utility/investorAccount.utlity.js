import { fillSignUpFormAndProceed, confirmEmailAddressScreen, confirmPhoneNumberScreen } from '../../basicSignUp/utility/basicSignup.utlity';
import { fillLegalFormAndProceed } from '../../identityVerification/utility/identityVerification.utlity';
import { completeInvestorProfile } from '../../InvestorProfile/utlity/investorProfile.utlity';
import { registerApiCall, clickRadioAndNext, btnClickAndWait, uploadFile, enterCodeAndConfirm } from '../../../common.utility';

export const investorFlowProcess = () => {
  cy.visit('/', { failOnStatusCode: false, timeout: 100000 });
  cy.wait(3000);
  cy.applicationUnlock();
  cy.wait(1000);
  fillSignUpFormAndProceed();
  enterCodeAndConfirm();
  confirmEmailAddressScreen();
  fillLegalFormAndProceed();
  enterCodeAndConfirm();
  confirmPhoneNumberScreen();
  completeInvestorProfile();
};

export const individualManualLinkbankProcess = () => {
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

export const addFunds = (amount) => {
  cy.get('form').within(() => {
    registerApiCall('addFunds', '**/graphql');
    cy.get('input[name="value"]').type(amount);
    cy.get('button').contains('Confirm').click();
    cy.wait('@addFunds');
  });
}

export const entityGeneralStep = () => {
  cy.fixture('investor/entityAccount.json').then((data) => {
    const { generalInfoMeta } = data;
    cy.get('input[name="name"]').type(generalInfoMeta.name);
    cy.get('input[name="taxId"]').type(`${generalInfoMeta.taxId}${Math.floor((Math.random() * 100000000) + 1)}`);
    cy.get('div[name="entityType"]')
      .click()
      .get(`div[role="option"]:contains(${generalInfoMeta.entityType})`)
      .click();
    cy.get('input[name="street"]').type(generalInfoMeta.residentalStreet);
    cy.get('input[name="city"]').type(generalInfoMeta.city);
    cy.get('div[name="state"]')
      .click()
      .get(`div[role="option"]:contains(${generalInfoMeta.state})`)
      .click();
    cy.get('input[name="city"]').type(generalInfoMeta.city);
    cy.get('input[name="zipCode"]').type(generalInfoMeta.zipCode);
    btnClickAndWait('upsertInvestorAccount');
    cy.wait('@upsertInvestorAccount');
  });
}

export const entityAccountCreation = () => {
  cy.get('.dimmer-visible').should('not.be.visible')
  cy.wait(200);
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
      entityGeneralStep();
      entityAccountCreation();
      break;
    case 'Trust Status':
      clickRadioAndNext('input[name="isTrust"]', 'false', 'upsertInvestorAccount');
      entityAccountCreation();
      break;
    case 'Personal info':
      cy.get('input[name="title"]').type('CTO');
      uploadFile('input[name="legalDocUrl"]', '/dev/graphql');
      cy.wait('@fileUpload');
      entityAccountCreation();
      break;
    case 'Formation doc':
      entityFormationDocStep();
      entityAccountCreation();
      break;
    case 'Link bank':
      individualPlaidProcess('.progtrckr-doing', '1');
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
      cy.get('.modal', { timeout: 5000 }).then(($el) => {
        const element = cy.wrap($el)
        element.get('button.button').contains('Continue').click({ force: true });
      });
      break;
    }
  });
};

export const iraAccountCreation = () => {
  cy.get('.dimmer-visible').should('not.be.visible')
  cy.wait(200);
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
        individualPlaidProcess('.progtrckr-doing', '2');
        addFunds('5010');
        iraAccountCreation();
        break;
      case 'Identity':
        uploadFile('div.test > input[type="file"]', '/dev/graphql');
        cy.wait('@fileUpload');
        iraAccountCreation();
        break;
      case 'Summary':
        registerApiCall('submitAccount', '/dev/graphql');
        cy.get('div.content').get('button.button').contains('Submit for review').click({ force: true });
        cy.wait('@submitAccount');
        cy.wait('@submitAccount');
        cy.get('.modal', { timeout: 10000 }).then(($el) => {
          const element = cy.wrap($el);
          element.get('button.button').contains('Continue').click({ force: true });
        });
        break;
    }
  });
};

export const entityFormationDocStep = () => {
  cy.get('.dimmer-visible').should('not.be.visible')
  uploadFile('input[name="formationDoc"]', '/dev/graphql');
  cy.get('.dimmer-visible').should('not.be.visible')
  uploadFile('input[name="operatingAgreementDoc"]', '/dev/graphql');
  cy.get('.dimmer-visible').should('not.be.visible')
  uploadFile('input[name="einVerificationDoc"]', '/dev/graphql');
  cy.get('.dimmer-visible').should('not.be.visible')
  btnClickAndWait('upsertInvestorAccount');
  registerApiCall('upsertInvestorAccount');
}

export const individualPlaidProcess = (progressStep, count) => {
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
