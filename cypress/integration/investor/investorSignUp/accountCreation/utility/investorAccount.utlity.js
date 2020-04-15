import { fillSignUpFormAndProceed, confirmEmailAddressScreen } from '../../basicSignUp/utility/basicSignup.utlity';
import { fillLegalFormAndProceed } from '../../identityVerification/utility/identityVerification.utlity';
import { completeInvestorProfile } from '../../InvestorProfile/utlity/investorProfile.utlity';
import { registerApiCall, btnClickAndWait, uploadFile, enterCodeAndConfirm, getJSONDataFromFixtures } from '../../../../common.utility';

export const investorFlowProcess = () => {
  cy.visit('/', { failOnStatusCode: false });
  cy.applicationUnlock();
  fillSignUpFormAndProceed();
  enterCodeAndConfirm('confirmEmail', '**/graphql');
  confirmEmailAddressScreen();
  fillLegalFormAndProceed();
  enterCodeAndConfirm('confirmPhone', 'dev/graphql');
  completeInvestorProfile();
};

export const individualManualLinkbankProcess = async () => {
  registerApiCall('manualAccount', '/dev/graphql');
  manualFormData = await getJSONDataFromFixtures('investor/linkBank.json', 'manualForm');
  cy.get('.dimmer-visible').should('not.be.visible');
  cy.get('[data-cy=multistep-back]').dblclick();
  cy.get('[data-cy=change-link-bank]').click();
  cy.get('[data-cy=link-bank-manually]').click();
  cy.formFill(manualFormData, 'manual-form');
  cy.get('[data-cy=manual-confirm').click();
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
  cy.itterativeWait('addFunds', 2);
}

const entityGeneralStep = async () => {
  cy.fixture('investor/entityAccount.json').then(({ generalInfoMeta }) => {
    cy.log('generalInfo', generalInfoMeta)
    generalInfoMeta.taxId.value = `123${Math.floor(((Math.random() + Math.random()) * 1000000) + 1)}`
    cy.log(generalInfoMeta.taxId.value);
    cy.formFill(generalInfoMeta, 'entity-general');
    btnClickAndWait('[data-cy=general-entity-confirm]', 'upsertInvestorAccount');
  });
}

const handleFinInfo = (fields, sel) => {
  fields.forEach((field) => cy.get(`[data-cy=${field}]`).type('123456789'))
  btnClickAndWait(`[data-cy=${sel}]`, 'upsertInvestorAccount');
}

const entityFormationDocStep = () => {
  cy.get('.dimmer-visible').should('not.be.visible')
  const formationDocArr = ['formationDoc', 'operatingAgreementDoc', 'einVerificationDoc'];
  formationDocArr.forEach(inpName => {
    cy.uploadFile(`input[name="${inpName}"]`, '/dev/graphql');
  })
  btnClickAndWait('[data-cy=formation-doc]', 'upsertInvestorAccount');
}

export const entityAccountCreation = () => {
  registerApiCall('upsertInvestorAccount', '/dev/graphql');
  handleFinInfo(['netAssets', 'annualIncome'], 'fin-info-entity-submit');
  entityGeneralStep();
  btnClickAndWait('[data-cy=false]', 'upsertInvestorAccount');
  cy.get('input[name="title"]').type('CTO');
  cy.uploadFile('input[name="legalDocUrl"]', '/dev/graphql');
  entityFormationDocStep();
  individualPlaidProcess('3');
  addFunds('7000');
  handleSummary('entity-summary');
};

export const handleSummary = (sel) => {
  registerApiCall('submitAccount', '/dev/graphql');
  cy.get('.dimmer-visible').should('not.be.visible')
  cy.get(`[data-cy=${sel}]`).click();
  cy.itterativeWait('submitAccount', 2);
  cy.get('.dimmer-visible').should('not.be.visible')
  // cy.get('.close').dblclick();
}
export const iraAccountCreation = () => {
  cy.get('.dimmer-visible').should('not.be.visible')
  registerApiCall('upsertInvestorAccount', '/dev/graphql');
  handleFinInfo(['netWorth', 'income'], 'fin-info-ira-submit');
  btnClickAndWait('[data-cy=1]', 'upsertInvestorAccount');
  btnClickAndWait('[data-cy=0]', 'upsertInvestorAccount');
  individualPlaidProcess('2');
  addFunds('5010');
  cy.get('.dimmer-visible').should('not.be.visible')
  cy.uploadFile('input[name="identityDoc"]', '/dev/graphql');
  handleSummary('ira-summary');
};

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
