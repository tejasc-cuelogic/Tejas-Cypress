import { registerApiCall } from '../../../../common.utility';

export const goToSignUpScreen = () => {
  cy.contains('Sign Up');
  cy.get('.header-wrap').get('.menu-button').contains('Sign Up').click();
  cy.get('[data-cy=investor]').click();
};

export const FillSignUpForm = () => {
  const investorEmail = `test${Math.floor(((Math.random() + Math.random()) * 1000000) + 1)}@nextseed.com`;
  window.localStorage.setItem('investorEmail', investorEmail);
  cy.get('input[name="email"]').type(investorEmail);
  cy.get('input[name="password"]').type(Cypress.env('commonPassword'));
};

export const fillSignUpFormAndProceed = () => {
  registerApiCall('signUpForm', '**/graphql');
  goToSignUpScreen();
  FillSignUpForm();
  cy.get('button.button').contains('Register').click();
  cy.wait('@signUpForm');
};

export const confirmEmailAddressScreen = () => {
  registerApiCall('cognito', '**/**');
  cy.wait('@cognito');
  registerApiCall('userDetails');
  cy.wait('@userDetails');
}

export const confirmPhoneNumberScreen = () => {
  cy.get('div.content > .center-align > button').contains('Continue').click({ force: true });
  cy.wait(200);
}
