import {
  initializeInvestNowFlow,
  proceedInvalidLoginAction,
  proceedInvalidUserLoginAction,
  proceedWithValidUserLoginAction,
} from './utility/investNowFlow.utility';

import { isAbortTestCases, clearStorage } from '../common.utility';

describe('Invest now flow', () => {
  const whenFailed = () => {
    this.skip();
  }
  beforeEach(() => {
    cy.restoreLocalStorage();
    // if (isAbortTestCases() === 'true') {
    //   this.skip();
    // }
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

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

  it('succesfully login as investor with one account', () => {
    proceedWithValidUserLoginAction();
  });
});
