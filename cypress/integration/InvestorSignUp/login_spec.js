import { loginCredentials, inValidEmailCredentials, goToLoginScreen } from '../../support/login';

describe('Log In', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('succesfully performs login action', () => {
    goToLoginScreen();
    cy.get('input[type="email"]').type(loginCredentials.email);
    cy.get('input[type="password"]').type(loginCredentials.password);
    cy.get('button.button').contains('Log in').click({ force: true });
  });

  it('should check email format', () => {
    goToLoginScreen();
    cy.get('input[type="email"]').type(inValidEmailCredentials.email);
    cy.get('input[type="email"]').blur();
    cy.wait(500);
    cy.get('input[type="email"]').parentsUntil('.field').get('p').should('have.class', 'field-error');
  });

  it('should be able to go on forgot password', () => {
    goToLoginScreen();
    cy.get('form').within(() => {
      cy.get('a').contains('Forgot password?')
        .invoke('attr', 'href')
        .then((href) => {
          cy.visit(href);
        });
    });
  });

  it('should be able to go on sign up', () => {
    goToLoginScreen();
    cy.get('.signup-actions').get('a').contains('Sign up')
      .invoke('attr', 'href')
      .then((href) => {
        cy.visit(href);
      });
  });
});
