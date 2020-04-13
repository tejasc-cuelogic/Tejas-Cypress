import { fillSignUpFormAndProceed, confirmEmailAddressScreen } from '../../basicSignUp/utility/basicSignup.utlity';
import { fillLegalFormAndProceed } from '../../identityVerification/utility/identityVerification.utlity';
import { completeInvestorProfile } from '../../InvestorProfile/utlity/investorProfile.utlity';
import { registerApiCall, clickRadioAndNext, btnClickAndWait, uploadFile, enterCodeAndConfirm } from '../../../../common.utility';

export const investorFlowProcess = () => {
  cy.visit('/', { failOnStatusCode: false, timeout: 100000 });
  cy.applicationUnlock();
  fillSignUpFormAndProceed();
  enterCodeAndConfirm('confirmEmail', '**/graphql');
  confirmEmailAddressScreen();
  fillLegalFormAndProceed();
  enterCodeAndConfirm('confirmPhone', 'dev/graphql');
  completeInvestorProfile();
};

export const individualManualLinkbankProcess = () => {
  registerApiCall('manualAccount', '/dev/graphql');
  cy.get('.dimmer-visible').should('not.be.visible');
  cy.get('[data-cy=multistep-back]').dblclick();
  cy.get('[data-cy=change-link-bank]').click();
  cy.get('[data-cy=link-bank-manually]').click();
  cy.get('input[name="accountNumber"]').type('0000000008');
  cy.get('input[name="routingNumber"]').type('122105278');
  cy.get('input[name="accountType"]').check('SAVINGS', { force: true });
  cy.get('input[name="bankName"]').type('test bank');
  cy.get('button.button').contains('Confirm').click();
  cy.wait('@manualAccount');
};

export const addFunds = (amount) => {
  cy.get('.dimmer-visible').should('not.be.visible')
  registerApiCall('addFunds', '/dev/graphql');
  if (amount) {
    cy.get('form').within(() => {
      cy.get('input[name="value"]').type(amount);
      cy.get('[data-cy=deposit-add-funds]').click();
    });
  } else {
    cy.get('[data-cy=no-deposit-add-funds]').click();
  }
  cy.wait('@addFunds');
  cy.wait('@addFunds');
}

export const entityGeneralStep = () => {
  cy.fixture('investor/entityAccount.json').then((data) => {
    const { generalInfoMeta } = data;
    cy.get('input[name="name"]').type(generalInfoMeta.name);
    cy.get('input[name="taxId"]').type(`${generalInfoMeta.taxId}${Math.floor(((Math.random() + Math.random()) * 1000000) + 1)}`);
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
        cy.get('input[name="netAssets"]').addtype('123456789');
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
        individualPlaidProcess('.progtrckr-doing', '3');
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
        cy.get('.modal').then(($el) => {
          const element = cy.wrap($el)
          element.get('button.button').contains('Continue').click({ force: true });
        });
        break;
    }
  });
};

const handleFinInfoIra = () => {
  cy.get('[data-cy=netWorth]').type('123456789');
  cy.get('[data-cy=income]').type('123456789');
  btnClickAndWait('[data-cy=fin-info-ira-submit]', 'upsertInvestorAccount');
}

const handleSummary = () => {
  registerApiCall('submitAccount', '/dev/graphql');
  cy.get('[data-cy=ira-summary]').click();
  cy.wait('@submitAccount');
  cy.wait('@submitAccount');
  cy.get('[data-cy=explore-campaigns]');
}
export const iraAccountCreation = () => {
  cy.get('.dimmer-visible').should('not.be.visible')
  registerApiCall('upsertInvestorAccount', '/dev/graphql');
  handleFinInfoIra();
  btnClickAndWait('[data-cy=1]', 'upsertInvestorAccount');
  btnClickAndWait('[data-cy=0]', 'upsertInvestorAccount');
  individualPlaidProcess('2');
  addFunds('5010');
  cy.get('.dimmer-visible').should('not.be.visible')
  cy.uploadFile('input[type="file"]', '/dev/graphql');
  handleSummary();
};

export const entityFormationDocStep = () => {
  ['formationDoc', 'operatingAgreementDoc', 'einVerificationDoc'].forEach(inpName => {
    cy.get('.dimmer-visible').should('not.be.visible')
    uploadFile(`input[name="${inpName}"]`, '/dev/graphql');
  })
  btnClickAndWait('[data-cy=formation-doc]', 'upsertInvestorAccount');
}


export const individualPlaidProcess = (count) => {
  cy.get('.dimmer-visible').should('not.be.visible')
  cy.get('.bank-link:first').click({ force: true });
  cy.wait(5000);
  registerApiCall('plaidAccount', '/dev/graphql');
  cy.get(`#plaid-link-iframe-${count}`).then(($iframe) => {
    const $body = $iframe.contents().find('body');
    cy.log('body', $iframe.contents().find('body'));
    let stripe = cy.wrap($body);
    stripe.find('button[type="button"]').contains('Continue').click({ force: true });
    stripe = cy.wrap($body);
    stripe.find('input[name="username"]').type('user_good');
    stripe = cy.wrap($body);
    stripe.find('input[name="password"]').type('pass_good', { force: true });
    stripe = cy.wrap($body);
    stripe.find('button[type="submit"]').click();
    stripe = cy.wrap($body);
    stripe.find('div.AccountItem:first').click({ force: true });
    stripe = cy.wrap($body);
    stripe.find('button').contains('Continue').click({ force: true });
    cy.wait('@plaidAccount');
  });
};
