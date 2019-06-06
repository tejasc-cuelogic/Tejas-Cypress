import {
  initializeInvestNowFlow,
  proceedInvalidLoginAction,
  proceedInvalidUserLoginAction,
  // proceedWithIncompleteInvestorCIPAction,
  proceedWithValidUserLoginAction,
  proceedWithValidCFInvestmentAction,
} from '../../support/investNow/investNowFlow';

describe('Invest now flow', () => {
  it('Should proceed for invest now flow', () => {
    initializeInvestNowFlow();
  });
  it('Should open login popup if click on Invest Now button and not loged in', () => {
    cy.get('.loader', { timeout: 6000 }).should('not.exist');
    cy.get('.public-pages').find('.campaign-banner').find('.banner .container .stackable').find('.six.wide')
      .find('.center-align')
      .contains('Invest Now')
      .click();
  });
  it('Invalid login credentails action', () => {
    proceedInvalidLoginAction();
  });
  it('Invalid user type login action', () => {
    proceedInvalidUserLoginAction();
  });
  // it('Investor with incomplete CIP information', () => {
  //   proceedWithIncompleteInvestorCIPAction();
  // });
  it('succesfully login as investor with one account', () => {
    proceedWithValidUserLoginAction();
  });
  it('should successfully CF investment flow', () => {
    proceedWithValidCFInvestmentAction();
  });
});
