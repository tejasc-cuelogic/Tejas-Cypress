import { registerApiCall } from '../common.utility';
import { issuerPreQualDetails } from '../../fixtures/issuer/issuerPreQual';
import { issuerBusinessDetails } from '../../fixtures/issuer/issuerBusinessDetails';
import { completeBusinessApplication, fillBasicDetails, fillGeneralInfo, fillExperienceDetails, fillNextYearProjection, fillBusinessDetails, loginToApplication } from './utility/issuerSignUp';

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

  it.skip ('should be able to fill basic details of issuer', () => {
    fillBasicDetails();
  })

  it ('should able to submit business application and login', () => {
    completeBusinessApplication();
  })
});