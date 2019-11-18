import { registerApiCall, getJSONDataFromFixtures, clearFormInput } from '../../common.utility';

export const validInvestorLoginAction = async () => {
  const validInvestorHavingOnceAccountCredentials = await getJSONDataFromFixtures('investor/user.json', 'validInvestorHavingOnceAccountCredentials');
  registerApiCall('investNowHealthCheck');
  cy.clearFormField(validInvestorHavingOnceAccountCredentials, 'loginForm');
  cy.formFill(validInvestorHavingOnceAccountCredentials, 'loginForm');
  cy.get('button.button').contains('Log in').click({ force: true });
  cy.wait(10000);
  cy.get('div.header-wrap').find('.stackable').find('.container').find('.menu-button')
    .get('button')
    .should('contain', 'Dashboard');
  cy.get('.public-pages').find('.campaign-banner').find('.banner .container .stackable').find('.six.wide')
    .find('.center-align').find('.mt-10')
    // .get('small')
    .invoke('text')
    .then((text1) => {
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
  cy.wait('@investNowHealthCheck');
};

export const openLogingPopupAndAutheticate = () => {
  validInvestorLoginAction();
}