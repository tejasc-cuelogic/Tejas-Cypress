import { loginCredentials, inValidEmailCredentials, goToLoginScreen } from '../../support/investorSignup/login';
import { applicationUnlock } from '../../support/common'
describe('Log In', () => {
  beforeEach(() => {
    cy.visit('/', { failOnStatusCode: false });
    applicationUnlock();
    goToLoginScreen();
  });

  it('succesfully performs login action', () => {
    cy.get('input[type="email"]').type(loginCredentials.email);
    cy.get('input[type="password"]').type(loginCredentials.password);
    cy.get('button.button').contains('Log in').click({ force: true });
  });

  it('should check email format', () => {
    cy.get('input[type="email"]').type(inValidEmailCredentials.email);
    cy.get('input[type="email"]').blur();
    cy.wait(500);
    cy.get('input[type="email"]').parentsUntil('.field').get('p').should('have.class', 'field-error');
  });

  it('should be able to go on forgot password', () => {
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
