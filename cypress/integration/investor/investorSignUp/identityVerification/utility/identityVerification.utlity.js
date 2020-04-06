import { registerApiCall, enterCodeAndConfirm } from '../../../../../support/common';
import { fillSignUpFormAndProceed, confirmEmailAddressScreen } from '../../basicSignUp/utility/basicSignup.utlity';

export const fillLegalDetailsForm = (legalDetails = undefined) => {
  cy.fixture('investor/identityVerification.json').then((legalData) => {
    const legalDetailObject = legalDetails || legalData.legalDetailsMeta;
    cy.get('[data-cy="salutation"]')
        .click()
        .get(`div[role="option"]:contains(${legalDetailObject.salutation})`)
        .click();
      cy.get('[data-cy="firstLegalName"]').type(legalDetailObject.firstLegalName);
      cy.get('[data-cy="lastLegalName"]').type(legalDetailObject.lastLegalName);
      cy.get('[data-cy="street"]').type(legalDetailObject.residentialStreet);
      cy.get('[data-cy="city"]').type(legalDetailObject.city);
      cy.get('[data-cy="state"]')
        .click()
        .get(`div[role="option"]:contains(${legalDetailObject.state})`)
        .click();
      cy.get('[data-cy="zipCode"]').type(legalDetailObject.zipCode);
      cy.get('[data-cy="phoneNumber"]').type(legalDetailObject.phoneNumber);
      cy.get('[data-cy="dateOfBirth"]').type(legalDetailObject.dateOfBirth);
      cy.get('[data-cy="ssn"]').type(legalDetailObject.ssn);
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
