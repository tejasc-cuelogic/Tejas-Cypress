import {
  initializeInvestNowFlow,
  proceedInvalidLoginAction,
  proceedInvalidUserLoginAction,
  // proceedWithIncompleteInvestorCIPAction,
  proceedWithValidUserLoginAction,
} from '../../support/investNow/investNowFlow';

describe('Invest now flow', () => {
  // before(() => {
  //   initializeInvestNowFlow();
  // });
  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it.skip('Should proceed for invest now flow', () => {
    initializeInvestNowFlow();
  });

  it.skip('Should open login popup if click on Invest Now button and not loged in', () => {
    cy.get('.loader', { timeout: 6000 }).should('not.exist');
    cy.get('.public-pages').find('.campaign-banner').find('.banner .container .stackable').find('.six.wide')
      .find('.center-align')
      .contains('Invest Now')
      .click();
  });

  it.skip('Invalid login credentails action', () => {
    proceedInvalidLoginAction();
  });

  it.skip('Invalid user type login action', () => {
    proceedInvalidUserLoginAction();
  });
  // it('Investor with incomplete CIP information', () => {
  //   proceedWithIncompleteInvestorCIPAction();
  // });
  it.skip('succesfully login as investor with one account', () => {
    proceedWithValidUserLoginAction();
  });
});
