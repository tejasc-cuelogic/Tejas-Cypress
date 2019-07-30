import { completeBusinessApplication, preQualificationSuccess, preQualificationFail } from './utility/issuerSignUp.utility';

describe('Issuer Sign Up', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.visit('/', { failOnStatusCode: false, timeout: 100000 });
    cy.applicationUnlock();
    if (cy.get('a').contains('Sign Up')) {
      cy.get('a').contains('Sign Up').click();
    } else {
      cy.get('a').contains('Log In').click();
      cy.get('a').contains('Sign Up').click({ force: true });
    }
  });

  it ('Pre-qualification should be failed', () => {
    preQualificationFail();
  })

  it ('should be able to fill basic details of issuer', () => {
    preQualificationSuccess();
  })

  it.skip ('should able to submit business application and login', () => {
    completeBusinessApplication();
  })
});