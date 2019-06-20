import {
  initializeInvestNowFlow,
} from '../../support/investNow/investNowFlow';
import { openLogingPopupAndAutheticate } from '../../support/investNow/validInvestorLoginForInvestment';
import { checkRegulationAndAccreditation } from '../../support/investNow/offeringRegulationChecks';

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

  it('Should proceed for investment', () => {
    cy.log('Investment....');
  });

});