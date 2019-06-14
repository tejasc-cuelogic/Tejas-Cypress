// import { proceedWithValidUserLoginAction } from './investNowFlow';
import { clearLoginForm } from '../auth/login';
import { validInvestorHavingOnceAccountCredentials } from './investorsCredentailConstant';

export const openLoginModelPopup = () => {
    cy.get('.loader', { timeout: 6000 }).should('not.exist');
    cy.get('.public-pages').find('.campaign-banner').find('.banner .container .stackable').find('.six.wide')
    .find('.center-align')
    .contains('Invest Now')
    .click();
}

export const validInvestorLoginAction = () => {
    cy.wait(2000);
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

export const openLogingPopupAndAutheticate = () => {
    openLoginModelPopup();
    validInvestorLoginAction();
}