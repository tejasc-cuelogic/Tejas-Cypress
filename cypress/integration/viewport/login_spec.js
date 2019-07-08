import { goToLoginScreen } from '../auth/utility/login.utility';
import { prepareTestsForDevices } from '../../support/common';
import { devices } from '../../fixtures/common/devices';

prepareTestsForDevices("/", devices, (deviceDetails) => {
  describe(`Log In for device width-${deviceDetails.width} height-${deviceDetails.height}`, () => {
    beforeEach(() => {
      cy.applicationUnlock();
      goToLoginScreen(deviceDetails);
    });

    context('login form', () => {
      beforeEach(() => {
        cy.fixture('investor/user.json').as('users');
      });
      it('succesfully performs login action', () => {
        cy.get('@users').then((userData) => {
          const { investorLoginCredentials } = userData;
          cy.log('investorLoginCredentials=>', investorLoginCredentials)
          cy.log('investorLoginCredentials =>', investorLoginCredentials);
          cy.get('input[type="email"]').type(investorLoginCredentials.email);
          cy.get('input[type="password"]').type(investorLoginCredentials.password);
          cy.get('button.button').contains('Log in').click({ force: true });
        });
      });
    });
  });
});



