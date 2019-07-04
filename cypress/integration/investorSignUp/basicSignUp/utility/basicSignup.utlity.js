import { registerApiCall } from '../../../common.utility';

export const goToSignUpScreen = () => {
  cy.contains('Sign Up');
  cy.get('.header-wrap').get('.menu-button').contains('Sign Up').click();
  cy.get('.user-type').find('h4').contains('Investor').click();
  cy.get('.center-align').find('a').click();
};

export const FillSignUpForm = () => {
  cy.fixture('investor/signUp.json').then((SignUpMeta) => {
    cy.get('form').within(() => {
      cy.get('input[name="givenName"]').type(SignUpMeta.givenName);
      cy.get('input[name="familyName"]').type(SignUpMeta.familyName);
      cy.get('input[name="email"]').type(`testing${Math.floor((Math.random() * 100000) + 1)}@nextseed.com`);
      cy.get('input[name="password"]').type(SignUpMeta.password);
      cy.get('input[name="verify"]').type(SignUpMeta.verify);
    });
  });
};

export const fillSignUpFormAndProceed = () => {
  registerApiCall('signUpForm');
  goToSignUpScreen();
  FillSignUpForm();
  cy.get('button.button').contains('Register').click();
  cy.wait('@signUpForm');
};

export const confirmEmailAddressScreen = () => {
  cy.wait('@confirm');
  cy.wait('@confirm');
  cy.wait('@confirm');
  cy.contains('Continue').click();
}

export const confirmPhoneNumberScreen = () => {
  registerApiCall('confirmPhone', '/v1/p');
  cy.get('div.content > .center-align > button').contains('Continue').click({ force: true });
  cy.wait('@confirmPhone')
}
