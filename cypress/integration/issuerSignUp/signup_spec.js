import { registerApiCall, uploadFile, applicationUnlock } from '../../support/common';
import { issuerPreQualDetails } from '../../fixtures/issuer/issuerPreQual';
import { issuerBusinessDetails } from '../../fixtures/issuer/issuerBusinessDetails';
import { issuerSignUp, fillBasicDetails, fillGeneralInfo, fillExperienceDetails, fillNextYearProjection, fillBusinessDetails, loginToApplication } from '../../support/issuerSignUp/issuerSignUp';

describe('Issuer Sign Up', () => {
  beforeEach(() => {
    cy.visit('/', { failOnStatusCode: false, timeout: 100000 });
    applicationUnlock();
    if (cy.get('a').contains('Sign Up')) {
      cy.get('a').contains('Sign Up').click();
    } else {
      cy.get('a').contains('Log In').click();
      cy.get('a').contains('Sign Up').click({ force: true });
    }
  });

  it.skip ('should be able to fill basis details of issuer', () => {
    issuerSignUp();
    fillBasicDetails(issuerPreQualDetails.basicDetails);
  })

  it ('should able to submit business application and login', () => {
    issuerSignUp();
    fillBasicDetails(issuerPreQualDetails.basicDetails);
    cy.get('input[value="B2C"]').click();
    fillGeneralInfo(issuerPreQualDetails.generalInfo);
    cy.get('input[name="industryTypes"]').click({ force: true, multiple: true });
    cy.get('input[value="BRAND_NEW"]').click();
    fillExperienceDetails(issuerPreQualDetails.experienceDetails);
    fillNextYearProjection(issuerPreQualDetails.nextYearProjection);
    cy.get('input[value="LLC"]').click();
    cy.get('input[name="legalConfirmation"]').click({ force: true, multiple: true });
    cy.get('button').contains('Submit').click();
    cy.get('.loader', { timeout: 6000 }).should('not.exist');
    loginToApplication();
    registerApiCall('Proceed');
    cy.get('button').contains('Proceed').click();
    cy.wait('@Proceed');
    cy.get('<div.ui.large.text.loader>', { timeout: 6000 }).should('not.exist');
    fillBusinessDetails(issuerBusinessDetails.businessDetails);
    registerApiCall('perfomance');
    cy.get('div[class="pull-right"]').children().click({ force: true });
    cy.wait('@perfomance');
    cy.get('<div.ui.large.text.loader>', { timeout: 6000 }).should('not.exist');
    uploadFile('input[name="fiveYearProjection"]');
    cy.get('<div.ui.loader>', { timeout: 6000 }).should('not.exist');
    uploadFile('input[name="sourcesAndUses"]');
    cy.wait(5000);
    cy.get('div[class="pull-right"]').children().click({ force: true });
    uploadFile('input[name="leaseAgreementsOrLOIs"]');
    cy.wait(5000);
    uploadFile('input[name="personalTaxReturn"]');
    cy.wait(5000);
    cy.get('<div.ui.large.text.loader>', { timeout: 6000 }).should('not.exist');
    uploadFile('input[name="leaseAgreementsOrLOIs"]');
    cy.get('<div.ui.loader>', { timeout: 6000 }).should('not.exist');
    uploadFile('input[name="personalTaxReturn"]');
    cy.get('<div.ui.loader>', { timeout: 6000 }).should('not.exist');
    cy.get('a').contains('Performance').click();
    cy.get('a').contains('Documentation').click();
    cy.get('input[name="blanketLien"]').check('false', { force: true });
    cy.get('input[name="personalGuarantee"]').check('false', { force: true });
    if (cy.get('button').contains('Submit')) {
      cy.get('button').contains('Submit').click();
    } else {
      cy.get('button').contains('Save').click();
    }
  })
});