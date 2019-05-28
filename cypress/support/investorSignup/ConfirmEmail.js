
export const confirmEmailAddressScreen = () => {
  cy.wait('@confirm');
  cy.wait('@confirm');
  cy.wait('@confirm');
  cy.contains('Continue').click();
}