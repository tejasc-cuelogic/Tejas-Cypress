import {
  initializeInvestNowFlow,
  proceedInvalidLoginAction,
  proceedInvalidUserLoginAction,
  proceedWithValidUserLoginAction,
} from './utility/investNowFlow.utility';

import { userDetail } from '../common.utility';

describe('Invest now flow', () => {
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

  it.skip('succesfully login as investor with one account', () => {
    proceedWithValidUserLoginAction();
  });

});
