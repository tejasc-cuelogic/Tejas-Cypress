export const legalDetailsMeta = {
  salutation: 'Mr',
  firstLegalName: 'John',
  lastLegalName: 'Smith',
  residentalStreet: '2207 Del Monte Dr',
  city: 'Houston',
  state: 'Texas',
  zipCode: '77019',
  phoneNumber: '1111111111',
  dateOfBirth: ' 02-28-1975',
  ssn: '112223333',
};
export const fillLegalDetailsForm = () => {
  cy.get('form').within(() => {
    cy.get('div[name="title"]').get('.text').text(legalDetailsMeta.salutation);
    cy.get('input[name="firstLegalName"]').type(legalDetailsMeta.firstLegalName);
    cy.get('input[name="lastLegalName"]').type(legalDetailsMeta.lastLegalName);
    cy.get('input[name="residentalStreet"]').type(legalDetailsMeta.residentalStreet);
    cy.get('input[name="city"]').type(legalDetailsMeta.city);
    cy.get('input[name="phoneNumber"]').type(legalDetailsMeta.phoneNumber);
    cy.get('input[name="dateOfBirth"]').type(legalDetailsMeta.dateOfBirth);
    cy.get('input[name="ssn"]').type(legalDetailsMeta.ssn);
  });
};

export const fillLegalFormAndProceed = () => {
  fillLegalDetailsForm();
  cy.get('form').find('button').contains('Verify my identity').click();
}