import { registerApiCall, enterCodeAndConfirm } from '../../../../../support/common';
import { fillSignUpFormAndProceed, confirmEmailAddressScreen } from '../../basicSignUp/utility/basicSignup.utlity';

export const fillLegalDetailsForm = async(legalDetails = undefined) => {
  cy.fixture('investor/identityVerification.json').then((legalData) => {
    const legalDetailObject = legalData.legalDetailsMeta || legalDetails;
    cy.log('legalDetailObject', legalDetailObject);
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
  registerApiCall('legal');
  fillLegalDetailsForm(legalDetails);
  cy.get('form').find('button').contains('Verify my identity').click();
  cy.wait('@legal');
};
