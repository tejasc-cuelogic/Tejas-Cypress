import {
  initializeInvestNowFlow,
} from './utility/investNowFlow.utility';
import { openLogingPopupAndAutheticate } from './utility/validInvestorLoginForInvestment.utility';
import { checkRegulationAndAccreditation } from './utility/offeringRegulationChecks.utility';
import { isAbortRemainingTestCases } from '../common.utility';

describe.skip('Invest now 506C investment flow', () => {
  let isNeedToSkip = false;
  before(() => {
    initializeInvestNowFlow('506C');
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

  it('Should be login with valid investor and proceed for 506C investment', () => {
    if (!isNeedToSkip) {
      openLogingPopupAndAutheticate();
    } else {
      cy.log('Skipped :: due to initial error.');
    }
  });

  it('Should check and proceed for accreditation', () => {
    if (!isNeedToSkip) {
      checkRegulationAndAccreditation()
        .then((res) => {
          if (res === false) {
            cy.log('goint to skip it....');
            this.skip();
          } else {
            cy.log('promise res==>', res);
          }
        });
    } else {
      cy.log('Skipped :: due to initial error.');
    }
  });

  it.skip('Should proceed for investment', () => {
    cy.log('Investment....');
  });

});