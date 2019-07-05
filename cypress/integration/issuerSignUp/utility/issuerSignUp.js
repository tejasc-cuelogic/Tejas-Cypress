import { registerApiCall, uploadFile, getJSONDataFromFixtures, btnClickAndWaitByButtonName } from '../../common.utility';

export const issuerSignUp = () => {
  cy.get('h4').contains('Business').click();
  cy.get('a').contains('Start application process').click();
}

export const fillBasicDetails = async (basicDetails) => {
  issuerSignUp();
  cy.clearFormField(basicDetails);
  cy.formFill(basicDetails);
  btnClickAndWaitByButtonName('Continue');
};

export const fillGeneralInfo = async (generalInfo) => {
  cy.clearFormField(generalInfo);
  cy.formFill(generalInfo);
}
  
export const fillExperienceDetails = async (experienceDetails) => {
  cy.clearFormField(experienceDetails);
  cy.formFill(experienceDetails);
}

export const fillNextYearProjection = (nextYearProjection) => {
  cy.get('input[value="RENOVATIONS"]').click();
  cy.clearFormField(nextYearProjection);
  cy.formFill(nextYearProjection);
}

export const fillBusinessDetails = async (businessDetails) => {
  cy.uploadFile('/issuer/test-img.png', 'png', 'input[name="businessPlan"]', '/dev/graphql');
  cy.get('.file-uploader > .active', { timeout: 6000 }).should('not.exist');
  fillExistingDebt(businessDetails.existingDebt);
  fillOwnerInfo(businessDetails.owner);
}

export const loginToApplication = () => {
  cy.get('input[name="password"]').type('nextseedTest');
  cy.get('form').should('have.class', 'form')
    .children()
    .children()
    .children()
    .then(($field) => {
    if ($field.length > 2) {
      cy.get('input[name="verify"]').type('nextseedTest');
    }
    })
}

export const fillExistingDebt = (existingDebt) => {
  cy.clearFormField(existingDebt);
  cy.formFill(existingDebt);
}

export const fillOwnerInfo = (owner) => {
  cy.clearFormField(owner);
  cy.formFill(owner);
  cy.uploadFile('/issuer/test-img.png', 'png', 'input[name="resume"]', '/dev/graphql');
  cy.get('.file-uploader > .active', { timeout: 6000 }).should('not.exist');
}

export const fillPreQaulificationDetails = (issuerPreQual) => {
  fillBasicDetails(issuerPreQual.basicDetails);
  cy.get('input[value="B2C"]').click();
  fillGeneralInfo(issuerPreQual.generalInfo);
  cy.get('input[name="industryTypes"]').click({ force: true, multiple: true });
  cy.get('input[value="BRAND_NEW"]').click();
  fillExperienceDetails(issuerPreQual.experienceDetails);
  fillNextYearProjection(issuerPreQual.nextYearProjection);
  cy.get('input[value="LLC"]').click();
  cy.get('input[name="legalConfirmation"]').click({ force: true, multiple: true });
  cy.get('button').contains('Submit').click();
  cy.get('.loader', { timeout: 6000 }).should('not.exist');
}

export const preQualificationSuccess = async () => {
  const issuerPreQual = await getJSONDataFromFixtures('issuer/issuerPreQual.json');
  fillPreQaulificationDetails(issuerPreQual);
}

export const preQualificationFail = async () => {
  const issuerPreQual = await getJSONDataFromFixtures('issuer/issuerPreQualFail.json');
  fillPreQaulificationDetails(issuerPreQual);
  cy.wait(5000);
}

export const completeBusinessApplication = async () => {
  const issuerPreQual = await getJSONDataFromFixtures('issuer/issuerPreQual.json');
  fillPreQaulificationDetails(issuerPreQual);
  loginToApplication();
  registerApiCall('Proceed');
  cy.get('button').contains('Proceed').click();
  cy.wait('@Proceed');
  cy.get('<div.ui.large.text.loader>', { timeout: 6000 }).should('not.exist');
  fillBusinessDetails(issuerPreQual.businessDetails);
  registerApiCall('perfomance');
  cy.get('div[class="pull-right"]').children().click({ force: true });
  cy.wait('@perfomance');
  cy.get('<div.ui.large.text.loader>', { timeout: 6000 }).should('not.exist');
  registerApiCall('perfomance');
  cy.uploadFile('/issuer/test-img.png', 'png', 'input[name="fiveYearProjection"]', '/dev/graphql');
  cy.get('.file-uploader > .active', { timeout: 6000 }).should('not.exist');
  cy.uploadFile('/issuer/test-img.png', 'png', 'input[name="sourcesAndUses"]', '/dev/graphql');
  cy.get('.file-uploader > .active', { timeout: 6000 }).should('not.exist');
  cy.get('div[class="pull-right"]').children().click({ force: true });
  cy.get('<div.ui.large.text.loader>', { timeout: 6000 }).should('not.exist');
  cy.uploadFile('/issuer/test-img.png', 'png', 'input[name="leaseAgreementsOrLOIs"]', '/dev/graphql');
  cy.get('.file-uploader > .active', { timeout: 6000 }).should('not.exist');
  cy.uploadFile('/issuer/test-img.png', 'png', 'input[name="personalTaxReturn"]', '/dev/graphql');
  cy.get('.file-uploader > .active', { timeout: 6000 }).should('not.exist');
  cy.get('input[name="blanketLien"]').check('false', { force: true });
  cy.get('input[name="personalGuarantee"]').check('false', { force: true });
  if (cy.get('button').contains('Submit')) {
    cy.get('button').contains('Submit').click();
  } else {
    cy.get('button').contains('Save').click();
  }
}