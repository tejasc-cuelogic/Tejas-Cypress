import { registerApiCall } from '../common';

export const confirmEmailAddressScreen = () => {
  cy.wait(8000)
  // registerApiCall('confirmEmail1', '**/v1/p');
  // registerApiCall('confirmEmail2', '**/v1/i');
  cy.contains('Continue').click();
  cy.wait(2000)
  // cy.wait('@confirmEmail1');
  // cy.wait('@confirmEmail2');
}
