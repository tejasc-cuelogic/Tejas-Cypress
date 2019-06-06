import { registerApiCall } from '../common';
export const confirmEmailAddressScreen = () => {
  cy.wait('@confirm');
  cy.wait('@confirm');
  cy.wait('@confirm');
  cy.wait('@confirm');
  cy.wait(1000)
  registerApiCall('confirmEmail');
  cy.contains('Continue').click();
  cy.wait('@confirmEmail');
  cy.wait('@confirmEmail');
}