import {
    initializeInvestNowFlow,
} from '../../support/investNow/investNowFlow';
import { openLogingPopupAndAutheticate } from '../../support/investNow/validInvestorLoginForInvestment';
import { checkRegulationAndAccreditation } from '../../support/investNow/offeringRegulationChecks';

describe('Invest now 506C investment flow', () => {
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

    it.skip('Should open the model popup as per accreditation status', () => {
        checkRegulationAndAccreditation();
    });

});