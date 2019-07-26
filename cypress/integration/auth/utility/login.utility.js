import { checkDeviceResolution } from '../../common.utility';

export const goToLoginScreen = (device) => {
  cy.contains('Sign Up');
  if (device) {
    if (checkDeviceResolution(device) === 'desktop') {
      cy.get('.header-wrap').get('.menu-button').contains('Log In').click({ force: true });
    } else {
      cy.get('div.full-logo').click({ force: true });
      cy.get('div.btn-item').contains('Log In').click({ force: true });
    }
  } else {
    cy.get('.header-wrap').get('.menu-button').contains('Log In').click({ force: true });
  }
};

export const clearLoginForm = () => {
  cy.get('input[type="email"]').clear();
  cy.get('input[type="password"]').clear();
};

