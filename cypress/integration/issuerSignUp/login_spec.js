import { registerApiCall, uploadFile, applicationUnlock } from '../../support/common';
import { issuerDetails } from '../../support/issuerSignUp/issuerDetails';
import { issuerSignUp, fillBasicDetails, fillGeneralInfo, fillExperienceDetails, fillNextYearProjection, fillBusinessDetails, loginToApplication } from '../../support/issuerSignUp/issuerSignUp';

describe('Log In', () => {
  beforeEach(() => {
    cy.visit('/');
    applicationUnlock();
    if (cy.get('a').contains('Sign Up')) {
      cy.get('a').contains('Sign Up').click();
    } else {
      cy.get('a').contains('Log In').click();
      cy.get('a').contains('Sign Up').click({ force: true });
    }
  });

  it('should be able to go on issuer sign up page', () => {
    issuerSignUp();
  });

  it ('should fill basic details', () => {
    issuerSignUp();
    fillBasicDetails(issuerDetails.basicDetails);
  })

  it ('Should Successfully fill pre-qualification form and submit the business application', () => {
    issuerSignUp();
    fillBasicDetails(issuerDetails.basicDetails);
    cy.get('input[value="B2C"]').click();
    fillGeneralInfo(issuerDetails.generalInfo);
    cy.get('input[name="industryTypes"]').click({ force: true, multiple: true });
    cy.get('input[value="BRAND_NEW"]').click();
    fillExperienceDetails(issuerDetails.experienceDetails);
    fillNextYearProjection(issuerDetails.nextYearProjection);
    cy.get('input[value="LLC"]').click();
    cy.get('input[name="legalConfirmation"]').parent().click({ force: true, multiple: true });
  })

  it ('should able to submit business application and login', () => {
    issuerSignUp();
    fillBasicDetails(issuerDetails.basicDetails);
    cy.get('input[value="B2C"]').click();
    fillGeneralInfo(issuerDetails.generalInfo);
    cy.get('input[name="industryTypes"]').click({ force: true, multiple: true });
    cy.get('input[value="BRAND_NEW"]').click();
    fillExperienceDetails(issuerDetails.experienceDetails);
    fillNextYearProjection(issuerDetails.nextYearProjection);
    cy.get('input[value="LLC"]').click();
    cy.get('input[name="legalConfirmation"]').parent().click({ force: true, multiple: true });
    registerApiCall('Submit');
    cy.get('button').contains('Submit').click();
    cy.wait('@Submit');
    loginToApplication();
    registerApiCall('Proceed');
    cy.get('button').contains('Proceed').click();
    cy.wait('@Proceed');
    registerApiCall('getUserDetails');
    cy.wait('@getUserDetails');
    registerApiCall('getOfferings');
    cy.wait('@getOfferings');
    registerApiCall('getBusinessApplicationById');
    cy.wait('@getBusinessApplicationById');
    registerApiCall('userDetails');
    cy.wait('@userDetails');
    registerApiCall('cognitoUser');
    cy.wait('@cognitoUser');
    registerApiCall('getBusinessApplicationDetails');
    cy.wait('@getBusinessApplicationDetails');
    registerApiCall('getBusinessApplicationPerfomance');
    cy.wait('@getBusinessApplicationPerfomance');
    registerApiCall('getBusinessApplicationById');
    cy.wait('@getBusinessApplicationById');
    fillBusinessDetails(issuerDetails.businessDetails);
    registerApiCall('perfomance');
    cy.get('div[class="pull-right"]').children().click({ force: true });
    cy.wait('@perfomance');
    cy.wait(3000);
    uploadFile('input[name="fiveYearProjection"]');
    cy.wait(5000);
    uploadFile('input[name="sourcesAndUses"]');
    cy.wait(5000);
    cy.get('div[class="pull-right"]').children().click({ force: true });
    uploadFile('input[name="leaseAgreementsOrLOIs"]');
    cy.wait(5000);
    uploadFile('input[name="personalTaxReturn"]');
    cy.wait(5000);
    // cy.get('a').contains('Performance').click();
    // cy.get('a').contains('Documentation').click();
    cy.get('input[name="blanketLien"]').check('false', { force: true });
    cy.get('input[name="personalGuarantee"]').check('false', { force: true });
    if (cy.get('button').contains('Submit')) {
      cy.get('button').contains('Submit').click();
    } else {
      cy.get('button').contains('Save').click();
    }
  })
});