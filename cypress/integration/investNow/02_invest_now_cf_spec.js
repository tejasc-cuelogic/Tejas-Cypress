import {
  initializeInvestNowFlow,
  checkEnteredAmountMultiplesValidation,
  checkAmountGreaterThanMinInvestmentValidation,
  checkForValidAmountAndProceed,
  proceedToGenerateAgreement,
  sumbmitingInvestment,
} from './utility/investNowFlow.utility';
import { openLogingPopupAndAutheticate } from './utility/validInvestorLoginForInvestment.utility';
import { isAbortRemainingTestCases } from '../common.utility';

describe('Invest now CF investment flow', () => {
  let isNeedToSkip = false;
  before(() => {
    initializeInvestNowFlow('CF');
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    if (isAbortRemainingTestCases() === 'true') {
      isNeedToSkip = true;
    }
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  after(() => {
    cy.clearLocalStorageKey('abortRemainingTestCase');
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

  it('Should be login with valid investor and proceed for CF investment', () => {
    if (!isNeedToSkip) {
      openLogingPopupAndAutheticate();
    } else {
      cy.log('Skipped :: due to initial error.');
    }
  });

  it('Should show validation error if investment amount is not in mulitple of 100', () => {
    if (!isNeedToSkip) {
      checkEnteredAmountMultiplesValidation();
    } else {
      cy.log('Skipped :: due to initial error.');
    }
  });

  it('Should show validation error if investment amount is less than minimum investment amount', () => {
    if (!isNeedToSkip) {
      checkAmountGreaterThanMinInvestmentValidation();
    } else {
      cy.log('Skipped :: due to initial error.');
    }
  });

  it.skip('Should enter valid amount and proceed', () => {
    if (!isNeedToSkip) {
      checkForValidAmountAndProceed();
    } else {
      cy.log('Skipped :: due to initial error.');
    }
  });

  it.skip('Should generate agreement and show agreement model popup', () => {
    if (!isNeedToSkip) {
      proceedToGenerateAgreement();
    } else {
      cy.log('Skipped :: due to initial error.');
    }
  });

  it.skip('Should submit investment and redirect to investment portfolio', () => {
    if (!isNeedToSkip) {
      sumbmitingInvestment();
    } else {
      cy.log('Skipped :: due to initial error.');
    }
  });
});
