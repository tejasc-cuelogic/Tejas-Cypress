import {
  initializeInvestNowFlow,
  proceedInvalidLoginAction,
  proceedInvalidUserLoginAction,
  proceedWithValidUserLoginAction,
} from './utility/investNowFlow.utility';

import { isAbortRemainingTestCases } from '../common.utility';

describe('Invest now flow', () => {
  let isNeedToSkip = false;
  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    if (isAbortRemainingTestCases() === 'true') {
      isNeedToSkip = true;
    }
  });

  after(() => {
    cy.clearLocalStorageKey('abortRemainingTestCase');
  });

  it('Should proceed for invest now flow', () => {
    initializeInvestNowFlow();
  });

  it('Should open login popup if click on Invest Now button and not loged in', () => {
    if (!isNeedToSkip) {
      cy.get('.loader', { timeout: 6000 }).should('not.exist');
      cy.get('.public-pages').find('.campaign-banner').find('.banner .container .stackable').find('.six.wide')
        .find('.center-align')
        .contains('Invest Now')
        .click();
    } else {
      cy.log('Skipped :: due to initial error.');
    }
  });

  it('Invalid login credentails action', () => {
    if (!isNeedToSkip) {
      proceedInvalidLoginAction();
    } else {
      cy.log('Skipped :: due to initial error.');
    }
  });

  it('Invalid user type login action', () => {
    if (!isNeedToSkip) {
      proceedInvalidUserLoginAction();
    } else {
      cy.log('Skipped :: due to initial error.');
    }
  });

  it.skip('succesfully login as investor with one account', () => {
    if (!isNeedToSkip) {
      proceedWithValidUserLoginAction();
    } else {
      cy.log('Skipped :: due to initial error.');
    }
  });
});
