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
        initializeInvestNowFlow();
    });

    beforeEach(() => {
        cy.restoreLocalStorage();
    });

    afterEach(() => {
        cy.saveLocalStorage();
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

    // it('should successfully CF investment flow', () => {
    //     proceedWithValidCFInvestmentAction();
    // });
});
