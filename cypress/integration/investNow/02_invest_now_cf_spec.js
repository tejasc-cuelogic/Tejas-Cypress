import {
    initializeInvestNowFlow,
    checkEnteredAmountMultiplesValidation,
    checkAmountGreaterThanMinInvestmentValidation,
    checkForValidAmountAndProceed,
    proceedToGenerateAgreement,
    sumbmitingInvestment,
} from '../../support/investNow/investNowFlow';
import { openLogingPopupAndAutheticate } from '../../support/investNow/validInvestorLoginForInvestment';

describe('Invest now CF investment flow', () => {
    before(() => {
        // initializeInvestNowFlow('CF');
    });

    beforeEach(() => {
        cy.restoreLocalStorage();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it.skip('Should be login with valid investor and proceed for CF investment', () => {
        openLogingPopupAndAutheticate();
    });

    it.skip('Should show validation error if investment amount is not in mulitple of 100', () => {
        checkEnteredAmountMultiplesValidation();
    });

    it.skip('Should show validation error if investment amount is less than minimum investment amount', () => {
        checkAmountGreaterThanMinInvestmentValidation();
    });

    it.skip('Should enter valid amount and proceed', () => {
        checkForValidAmountAndProceed();
    });

    it.skip('Should generate agreement and show agreement model popup', () => {
        proceedToGenerateAgreement();
    });

    it.skip('Should submit investment and redirect to investment portfolio', () => {
        sumbmitingInvestment();
    });
});