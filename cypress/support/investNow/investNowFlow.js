import { OfferingListingFlow } from '../publicOffering/offeringListing';
import { OfferingDetailFlow } from '../publicOffering/offeringDetails';
import { inValidEmailCredentials, clearLoginForm } from '../investorSignup/login';

export const inValidUserCredentials = {
  email: 'v2+admin@nextseed.com',
  password: 'nextseedTest',
};

export const validInvestorHavingOnceAccountCredentials = {
  email: 'jackdemerse2017+15@gmail.com',
  password: 'Jack@12345',
};

export const initializeInvestNowFlow = () => {
  cy.visit('/');
  OfferingListingFlow();
  OfferingDetailFlow();
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
  cy.wait(6000);
  cy.get('.public-pages').find('.campaign-banner').find('.banner .container .stackable').find('.six.wide')
    .find('.center-align')
    .contains('Invest Now')
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
  cy.wait(6000);
  cy.get('.public-pages').find('.campaign-banner').find('.banner .container .stackable').find('.six.wide')
    .find('.center-align')
    .contains('Invest Now')
    .click();
};
