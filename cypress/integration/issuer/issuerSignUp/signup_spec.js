import { completeBusinessApplication, preQualificationSuccess, preQualificationFail, prequalFailButLendioPass } from './utility/issuerSignUp.utility';

describe('Issuer Sign Up', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.visit('localhost:3000', { failOnStatusCode: false, timeout: 100000 });
    // cy.applicationUnlock();
    if (cy.get('a').contains('Sign Up')) {
      cy.get('a').contains('Sign Up').click();
    } else {
      cy.get('a').contains('Log In').click();
      cy.get('a').contains('Sign Up').click({ force: true });
    }
  });

  it.skip ('Pre-qualification should be failed', () => {
    preQualificationFail();
  })

  it.skip ('should be able to fill basic details of issuer', () => {
    preQualificationSuccess();
  })

  it.skip ('should able to submit business application and login', () => {
    completeBusinessApplication();
  })
  
  it ('Prequal failed but lendio passed', () => {
    prequalFailButLendioPass();
  })
});