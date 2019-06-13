import { registerApiCall } from '../common';

export const confirmPhoneNumberScreen = () => {
  registerApiCall('confirmPhone', '/v1/p');
  cy.get('div.content > .center-align > button').contains('Continue').click({ force: true });
  cy.wait('@confirmPhone')
}
