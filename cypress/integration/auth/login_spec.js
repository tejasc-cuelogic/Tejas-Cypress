import { goToLoginScreen } from './utility/login.utility';

describe('Log In', () => {
  beforeEach(() => {
    cy.visit('/', { failOnStatusCode: false, timeout: 100000 });
    cy.applicationUnlock();
    goToLoginScreen();
  });

  context('login form', () => {
    beforeEach(() => {
      cy.fixture('investor/user.json').as('users');
    });
    it('succesfully performs login action', () => {
      cy.get('@users').then((userData) => {
        const { investorLoginCredentials } = userData
        cy.log('investorLoginCredentials=>', investorLoginCredentials)
        cy.log('investorLoginCredentials =>', investorLoginCredentials);
        cy.get('input[type="email"]').type(investorLoginCredentials.email);
        cy.get('input[type="password"]').type(investorLoginCredentials.password);
        cy.get('button.button').contains('Log in').click({ force: true });
      });
    });

    it('should check email format', () => {
      cy.get('@users').then((userData) => {
        const { inValidEmailCredentials } = userData;
        cy.clearFormField(inValidEmailCredentials, 'loginForm');
        cy.formFill(inValidEmailCredentials, 'loginForm');
      });
    });
  });

  it('should be able to go on forgot password', () => {
    cy.get('form').within(() => {
      cy.get('a').contains('Forgot password?')
        .invoke('attr', 'href')
        .then((href) => {
          cy.log('href', href)
          cy.visit(href, { failOnStatusCode: false });
          cy.url().should('contain', '/forgot-password');
        });
    });
  });

  it('should be able to go on sign up', () => {
    goToLoginScreen();
    cy.get('.signup-actions').get('a').contains('Sign up')
      .invoke('attr', 'href')
      .then((href) => {
        cy.log('href', href)
        cy.visit(href, { failOnStatusCode: false });
        cy.url().should('contain', '/register');
      });
  });
});
