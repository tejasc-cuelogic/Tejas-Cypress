import { registerApiCall, enterCodeAndConfirm } from '../../../../../support/common';
import { fillSignUpFormAndProceed, confirmEmailAddressScreen } from '../../basicSignUp/utility/basicSignup.utlity';

export const fillLegalDetailsForm = (legalDetails = undefined) => {
  cy.fixture('investor/identityVerification.json').then((legalData) => {
    const legalDetailObject = legalDetails || legalData.legalDetailsMeta;
    cy.formFill(legalDetailObject, 'cip-form');
  });
};

export const legalDetailsProcess = () => {
  cy.visit('/', { failOnStatusCode: false, timeout: 100000 });
  cy.applicationUnlock();
  fillSignUpFormAndProceed();
  enterCodeAndConfirm('confirmPhone');
  confirmEmailAddressScreen();
}

export const fillLegalFormAndProceed = (legalDetails = undefined) => {
  registerApiCall('legal', '/dev/graphql');
  fillLegalDetailsForm(legalDetails);
  cy.get('form').find('button').contains('Verify my identity').click();
  cy.wait('@legal');
};
