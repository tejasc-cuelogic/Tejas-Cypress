import { registerApiCall } from '../common';

export const confirmEmailAddressScreen = () => {
  cy.wait('@confirm');
  cy.wait('@confirm');
  cy.wait('@confirm');
  cy.wait(1000);
  registerApiCall('confirmEmail1', '**/v1/p');
  registerApiCall('confirmEmail2', '**/v1/i');
  cy.contains('Continue').click();
  cy.wait('@confirmEmail1');
  cy.wait('@confirmEmail2');
}
