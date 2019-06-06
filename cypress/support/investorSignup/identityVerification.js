import { registerApiCall } from '../common';

export const legalDetailsMeta = {
  salutation: 'Mr.',
  firstLegalName: 'John',
  lastLegalName: 'Smith',
  residentalStreet: '222333 Peachtree Place',
  city: 'Atlanta',
  state: 'GEORGIA',
  zipCode: '30318',
  phoneNumber: '1111111111',
  dateOfBirth: ' 02-28-1975',
  ssn: '112223333',
};
export const fillLegalDetailsForm = (legalDetails = undefined) => {
  const legalDetailObject = legalDetails || legalDetailsMeta;
  cy.wait(3000);
  cy.get('div.content > form').within(() => {
    cy.get('div[name="title"]')
      .click()
      .get(`div[role="option"]:contains(${legalDetailObject.salutation})`)
      .click();
    // cy.get('div[name="title"]').find('div.text').type(legalDetailObject.salutation);
    cy.get('input[name="firstLegalName"]').type(legalDetailObject.firstLegalName);
    cy.get('input[name="lastLegalName"]').type(legalDetailObject.lastLegalName);
    cy.get('input[name="residentalStreet"]').type(legalDetailObject.residentalStreet);
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
};

export const fillLegalFormAndProceed = () => {
  registerApiCall('legal');
  fillLegalDetailsForm();
  cy.get('form').find('button').contains('Verify my identity').click();
  cy.wait('@legal');
  cy.wait('@legal');
  cy.wait('@legal');
};
