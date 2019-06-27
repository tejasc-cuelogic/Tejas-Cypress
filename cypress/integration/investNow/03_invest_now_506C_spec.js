import {
  initializeInvestNowFlow,
} from './utility/investNowFlow.utility';
import { openLogingPopupAndAutheticate } from './utility/validInvestorLoginForInvestment.utility';
import { checkRegulationAndAccreditation } from './utility/offeringRegulationChecks.utility';

describe('Invest now 506C investment flow', () => {
  let isAccreditationStep = false;
  before(() => {
    initializeInvestNowFlow('506C');
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('Should open login popup if click on Invest Now button and not loged in', () => {
    cy.get('.loader', { timeout: 6000 }).should('not.exist');
    cy.get('.public-pages').find('.campaign-banner').find('.banner .container .stackable').find('.six.wide')
      .find('.center-align')
      .contains('Invest Now')
      .click();
  });

  it('Should be login with valid investor and proceed for 506C investment', () => {
    openLogingPopupAndAutheticate();
  });

  it('Should check and proceed for accreditation', () => {
    checkRegulationAndAccreditation()
      .then((res) => {
        if (res === false) {
          cy.log('goint to skip it....');
          this.skip();
        } else {
          cy.log('promise res==>', res);
        }
      });
  });

  it.skip('Should proceed for investment', () => {
    cy.log('Investment....');
  });

});