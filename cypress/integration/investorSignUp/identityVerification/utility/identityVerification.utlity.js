import { registerApiCall, enterCodeAndConfirm } from '../../../../support/common';
import { fillSignUpFormAndProceed, confirmEmailAddressScreen } from '../../basicSignUp/utility/basicSignup.utlity';

export const fillLegalDetailsForm = (legalDetails = undefined) => {
  cy.fixture('investor/identityVerification.json').then((legalData) => {
    const legalDetailObject = legalDetails || legalData.legalDetailsMeta;
    cy.get('div.content > form').within(() => {
      cy.get('div[name="title"]')
        .click()
        .get(`div[role="option"]:contains(${legalDetailObject.salutation})`)
        .click();
      // cy.get('div[name="title"]').find('div.text').type(legalDetailObject.salutation);
      cy.get('input[name="firstLegalName"]').type(legalDetailObject.firstLegalName);
      cy.get('input[name="lastLegalName"]').type(legalDetailObject.lastLegalName);
      cy.get('input[name="residentalStreet"]').type(legalDetailObject.residentialStreet);
      cy.get('input[name="city"]').type(legalDetailObject.city);
      cy.get('div[name="state"]')
        .click()
        .get(`div[role="option"]:contains(${legalDetailObject.state})`)
        .click();
      cy.get('input[name="zipCode"]').type(legalDetailObject.zipCode);
      cy.get('input[name="phoneNumber"]').type(legalDetailObject.phoneNumber);
      cy.get('input[name="dateOfBirth"]').type(legalDetailObject.dateOfBirth);
      cy.get('input[name="ssn"]').type(legalDetailObject.ssn);
    });
  });
};

export const legalDetailsProcess = () => {
  cy.visit('/', { failOnStatusCode: false, timeout: 100000 });
  cy.applicationUnlock();
  fillSignUpFormAndProceed();
  enterCodeAndConfirm();
  confirmEmailAddressScreen();
}

export const fillLegalFormAndProceed = (legalDetails = undefined) => {
  registerApiCall('legal', '/dev/graphql');
  fillLegalDetailsForm(legalDetails);
  cy.get('form').find('button').contains('Verify my identity').click();
  cy.wait('@legal');
  cy.wait('@legal');
  cy.wait('@legal');
  cy.wait('@legal');
  cy.wait('@legal');
};
