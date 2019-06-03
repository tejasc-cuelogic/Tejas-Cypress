export const loginCredentials = {
  name: 'Valentino',
  email: 'test001@nextseed.com',
  password: 'nextseed01test',
};

export const inValidEmailCredentials = {
  email: 'test001nextseed.com',
  password: 'nextseed01test',
};

export const goToLoginScreen = () => {
  cy.contains('Sign up');
  cy.get('button.compact').click();
  cy.get('a').contains('Log in').click();
};

export const clearLoginForm = () => {
  cy.get('input[type="email"]').clear();
  cy.get('input[type="password"]').clear();
}