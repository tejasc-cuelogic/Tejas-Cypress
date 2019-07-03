import { OfferingListingFlow } from '../publicOffering/offeringListing';
import { OfferingDetailFlow, Offering506CDetailFlow } from '../publicOffering/offeringDetails';
import { inValidEmailCredentials, clearLoginForm } from '../auth/login';
import {
  inValidUserCredentials,
  validInvestorHavingOnceAccountCredentials,
  validInvestorWithIncompleteCIPCredentials,
} from './investorsCredentailConstant';
import {
  enteringInvestmentAmount,
  invalidMultipleInvestmentAmount,
  invalidMinInvestmentAmount,
  validInvestmentAmount,
  generateAgreement,
  submitInvestment,
  } from './enteringInvestmentAmount';

export const initializeInvestNowFlow = (investmentType = 'CF') => {
  cy.log('investment type==>',investmentType);
  cy.visit('/', { failOnStatusCode: false , timeout: 100000 });
  cy.applicationUnlock();
  OfferingListingFlow();
  if (investmentType === 'CF') {
    OfferingDetailFlow();
  } else if (investmentType === '506C') {
    cy.log('enter for 506C')
    Offering506CDetailFlow();
  }
};

export const proceedInvalidLoginAction = () => {
  clearLoginForm();
  cy.get('input[type="email"]').type(inValidEmailCredentials.email);
  cy.get('input[type="email"]').blur();
  cy.wait(500);
  cy.get('input[type="email"]').parentsUntil('.field').get('p').should('have.class', 'field-error');
};

export const proceedInvalidUserLoginAction = () => {
  clearLoginForm();
  cy.get('input[type="email"]').type(inValidUserCredentials.email);
  cy.get('input[type="password"]').type(inValidUserCredentials.password);
  cy.get('button.button').contains('Log in').click({ force: true });
  cy.wait(8000);
  cy.get('div.header-wrap').find('.stackable').find('.container').find('.menu-button')
    .get('button')
    .should('contain', 'Dashboard');
  cy.get('.public-pages').find('.campaign-banner').find('.banner .container .stackable').find('.six.wide')
    .find('.center-align')
    .contains('Invest Now')
    .click();
};

export const proceedWithIncompleteInvestorCIPAction = () => {
  cy.wait(2000);
  cy.get('div.modals').find('.transition .content').get('button').contains('Login as an Investor')
    .click();
  clearLoginForm();
  cy.get('input[type="email"]').type(validInvestorWithIncompleteCIPCredentials.email);
  cy.get('input[type="password"]').type(validInvestorWithIncompleteCIPCredentials.password);
  cy.get('button.button').contains('Log in').click({ force: true });
  cy.wait(8000);
  cy.get('.public-pages').find('.campaign-banner').find('.banner .container .stackable').find('.six.wide')
    .find('.center-align')
    .contains('Invest Now')
    .click();
  cy.wait(2000);
  cy.get('div.modals').find('.multistep-modal').find('.multistep.content').get('form.account-type-tab')
    .find('.center-align .mt-30')
    .get('a')
    .contains('Continue')
    .click();
};

export const proceedWithValidUserLoginAction = () => {
  cy.wait(2000);
  cy.get('div.modals').find('.transition .content').get('button').contains('Login as an Investor')
    .click();
  clearLoginForm();
  cy.get('input[type="email"]').type(validInvestorHavingOnceAccountCredentials.email);
  cy.get('input[type="password"]').type(validInvestorHavingOnceAccountCredentials.password);
  cy.get('button.button').contains('Log in').click({ force: true });
  cy.wait(10000);
  cy.get('div.header-wrap').find('.stackable').find('.container').find('.menu-button')
    .get('button')
    .should('contain', 'Dashboard');
  cy.get('.public-pages').find('.campaign-banner').find('.banner .container .stackable').find('.six.wide')
    .find('.center-align')
    .get('small')
    .invoke('text')
    .then((text1) => {
      cy.log('minAmount===>', text1);
      const splitArr = text1.split(' ');
      const amountArr = splitArr[0].split('$');
      const minInvestAmount = amountArr[1];
      cy.log('minAmount12345===>', minInvestAmount);
      localStorage.setItem('minInvestAmount', minInvestAmount);
    });
  cy.wait(2000);
  cy.get('.public-pages').find('.campaign-banner').find('.banner .container .stackable').find('.six.wide')
    .find('.center-align')
    .contains('Invest Now')
    .click();
};

export const proceedWithValidCFInvestmentAction = () => {
  enteringInvestmentAmount();
}

export const checkEnteredAmountMultiplesValidation = () => {
  invalidMultipleInvestmentAmount();
}

export const checkAmountGreaterThanMinInvestmentValidation = () => {
  invalidMinInvestmentAmount();
}

export const checkForValidAmountAndProceed = () => {
  validInvestmentAmount();
}

export const proceedToGenerateAgreement = () => {
  // registerApiCall('investNowGeneratePurchaseAgreement');
  generateAgreement();
}

export const sumbmitingInvestment = () => {
  submitInvestment();
}