import {
  initializeInvestNowFlow,
  checkEnteredAmountMultiplesValidation,
  checkAmountGreaterThanMinInvestmentValidation,
  checkForValidAmountAndProceed,
  proceedToGenerateAgreement,
  sumbmitingInvestment,
} from './utility/investNowFlow.utility';
import { openLogingPopupAndAutheticate } from './utility/validInvestorLoginForInvestment.utility';

describe('Invest now CF investment flow', () => {
  before(() => {
    initializeInvestNowFlow('CF');
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

  it('Should be login with valid investor and proceed for CF investment', () => {
    openLogingPopupAndAutheticate();
  });

  it('Should show validation error if investment amount is not in mulitple of 100', () => {
    checkEnteredAmountMultiplesValidation();
  });

  it('Should show validation error if investment amount is less than minimum investment amount', () => {
    checkAmountGreaterThanMinInvestmentValidation();
  });

  it('Should enter valid amount and proceed', () => {
    checkForValidAmountAndProceed();
  });

  it('Should generate agreement and show agreement model popup', () => {
    proceedToGenerateAgreement();
  });

  it('Should submit investment and redirect to investment portfolio', () => {
    sumbmitingInvestment();
  });
});
