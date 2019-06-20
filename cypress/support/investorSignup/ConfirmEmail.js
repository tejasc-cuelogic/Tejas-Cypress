
export const confirmEmailAddressScreen = () => {
  cy.wait(12000)
  cy.contains('Continue').click();
  cy.wait(2000)
}
