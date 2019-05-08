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
export const fillLegalDetailsForm = () => {
  cy.get('form').within(() => {
    cy.get('div[name="title"]')
      .click()
      .get(`div[role="option"]:contains(${legalDetailsMeta.salutation})`)
      .click();
    // cy.get('div[name="title"]').find('div.text').type(legalDetailsMeta.salutation);
    cy.get('input[name="firstLegalName"]').type(legalDetailsMeta.firstLegalName);
    cy.get('input[name="lastLegalName"]').type(legalDetailsMeta.lastLegalName);
    cy.get('input[name="residentalStreet"]').type(legalDetailsMeta.residentalStreet);
    cy.get('input[name="city"]').type(legalDetailsMeta.city);
    cy.get('div[name="state"]')
      .click()
      .get(`div[role="option"]:contains(${legalDetailsMeta.state})`)
      .click();
    cy.get('input[name="zipCode"]').type(legalDetailsMeta.zipCode);
    cy.get('input[name="phoneNumber"]').type(legalDetailsMeta.phoneNumber);
    cy.get('input[name="dateOfBirth"]').type(legalDetailsMeta.dateOfBirth);
    cy.get('input[name="ssn"]').type(legalDetailsMeta.ssn);
  });
};

export const fillLegalFormAndProceed = () => {
  fillLegalDetailsForm();
  cy.get('form').find('button').contains('Verify my identity').click();
};
