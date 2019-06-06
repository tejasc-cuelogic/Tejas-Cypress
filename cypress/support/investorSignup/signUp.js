import { registerApiCall } from '../common';

export const SignUpMeta = {
  givenName: 'Nextseed',
  familyName: 'Test',
  email: 'testuser001@nextseed.com',
  password: 'nextseed01test',
  verify: 'nextseed01test',
};

export const goToSignUpScreen = () => {
  cy.contains('Sign Up');
  cy.get('.header-wrap').get('.menu-button').contains('Sign Up').click();
  cy.get('.user-type').find('h4').contains('Investor').click();
  cy.get('.center-align').find('a').click();
};

export const FillSignUpForm = () => {
  cy.get('form').within(() => {
    cy.get('input[name="givenName"]').type(SignUpMeta.givenName);
    cy.get('input[name="familyName"]').type(SignUpMeta.familyName);
    cy.get('input[name="email"]').type(`testing${Math.floor((Math.random() * 10000) + 1)}@nextseed.com`);
    cy.get('input[name="password"]').type(SignUpMeta.password);
    cy.get('input[name="verify"]').type(SignUpMeta.verify);
  });
};

export const fillSignUpFormAndProceed = () => {
  registerApiCall('signUpForm');
  goToSignUpScreen();
  FillSignUpForm();
  cy.get('button.button').contains('Register').click();
  cy.wait('@signUpForm');
};
