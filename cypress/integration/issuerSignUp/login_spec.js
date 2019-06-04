import { registerApiCall } from '../../support/common';
import { issuerSignUp, fillBasicDetails, fillGeneralInfo, fillExperienceDetails, fillNextYearProjection, fillBusinessDetails } from '../../support/issuerSignUp/issuerSignUp';

describe('Log In', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
    cy.get('a').contains('Sign Up').click();
  });

  // it('should be able to go on issuer sign up page', () => {
  //   issuerSignUp();
  // });

  // it ('should fill basic details', () => {
  //   issuerSignUp();
  //   fillBasicDetails();
  // })

  // it ('Should Successfully fill pre-qualification form and submit the business application', () => {
  //   issuerSignUp();
  //   fillBasicDetails();
  //   cy.get('input[value="B2C"]').click();
  //   fillGeneralInfo();
  //   cy.get('input[name="industryTypes"]').click({ force: true, multiple: true });
  //   cy.get('input[value="BRAND_NEW"]').click();
  //   fillExperienceDetails();
  //   fillNextYearProjection();
  //   cy.get('input[value="LLC"]').click();
  //   cy.get('input[name="legalConfirmation"]').parent().click({ force: true, multiple: true });
  // })

  it ('should able to submit business application and login', () => {
    issuerSignUp();
    fillBasicDetails();
    cy.get('input[value="B2C"]').click();
    fillGeneralInfo();
    cy.get('input[name="industryTypes"]').click({ force: true, multiple: true });
    cy.get('input[value="BRAND_NEW"]').click();
    fillExperienceDetails();
    fillNextYearProjection();
    cy.get('input[value="LLC"]').click();
    cy.get('input[name="legalConfirmation"]').parent().click({ force: true, multiple: true });
    registerApiCall('Submit');
    cy.get('button').contains('Submit').click();
    cy.wait('@Submit');
    cy.get('input[name="password"]').type('nextseedTest');
    registerApiCall('Proceed');
    cy.get('button').contains('Proceed').click();
    cy.wait('@Proceed');
    registerApiCall('getUserDetails');
    cy.wait('@getUserDetails');
    registerApiCall('getOfferings');
    cy.wait('@getOfferings');
    registerApiCall('getBusinessApplicationById');
    cy.wait('@getBusinessApplicationById');
    registerApiCall('getBusinessApplicationById');
    cy.wait('@getBusinessApplicationById');
    cy.wait(5000);
    fillBusinessDetails();
    cy.get('button[type="button"]').contains('multistep__btn').click();
  })
});