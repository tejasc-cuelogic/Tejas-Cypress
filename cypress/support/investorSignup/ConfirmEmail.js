import { registerApiCall } from '../common';
export const confirmEmailAddressScreen = () => {
  cy.wait('@confirm');
  cy.wait('@confirm');
  cy.wait('@confirm');
  cy.wait('@confirm');
  registerApiCall('confirmEmail');
  cy.contains('Continue').click();
  cy.wait('@confirmEmail');
  cy.wait(1000)
}