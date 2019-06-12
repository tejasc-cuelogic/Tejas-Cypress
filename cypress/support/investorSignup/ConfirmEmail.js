import { registerApiCall } from '../common';

export const confirmEmailAddressScreen = () => {
  cy.wait('@confirm');
  cy.wait('@confirm');
  cy.wait(1000);
  registerApiCall('confirmEmailAddress');
  cy.contains('Continue').click();
  cy.wait('@confirmEmailAddress');
  cy.wait('@confirmEmailAddress');
};
