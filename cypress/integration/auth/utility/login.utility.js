
  export const goToLoginScreen = () => {
    cy.contains('Sign Up');
    cy.get('.header-wrap').get('.menu-button').contains('Log In').click({ force: true });
  };

  export const clearLoginForm = () => {
    cy.get('input[type="email"]').clear();
    cy.get('input[type="password"]').clear();
  };

