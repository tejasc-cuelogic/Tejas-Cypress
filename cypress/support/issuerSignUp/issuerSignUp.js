import { registerApiCall } from '../../support/common';

export const issuerSignUp = () => {
    cy.get('h4').contains('Business').click();
    cy.get('a').contains('Start application process').click();
}

export const fillBasicDetails = (basicDetails) => {
    cy.get('input[name="firstName"]').type(basicDetails.firstName);
    cy.get('input[name="lastName"]').type(basicDetails.lastName);
    cy.get('input[name="email"]').type(basicDetails.email);
    registerApiCall('Continue');
    cy.get('button').contains('Continue').click();
    cy.wait('@Continue');
}

export const fillGeneralInfo = (generalInfo) => {
    cy.get('input[name="businessName"]').type(generalInfo.businessName);
    cy.get('input[name="website"]').type(generalInfo.website);
    cy.get('input[name="phoneNumber"]').type(generalInfo.phoneNumber);
    cy.get('input[name="street"]').type(generalInfo.street);
    cy.get('input[name="city"]').type(generalInfo.city);
    cy.get('input[name="state"]').type(generalInfo.state);
    cy.get('input[name="zipCode"]').type(generalInfo.zipCode);
}
  
export const fillExperienceDetails = (experienceDetails) => {
    cy.get('input[name="industryExperience"]').type(experienceDetails.industryExperience);
    cy.get('input[name="estimatedCreditScore"]').type(experienceDetails.estimatedCreditScore);
    cy.get('input[name="totalProjectCost"]').type(experienceDetails.totalProjectCost);
    cy.get('input[name="amountNeeded"]').type(experienceDetails.amountNeeded);
}

export const fillNextYearProjection = (nextYearProjection) => {
    cy.get('input[value="RENOVATIONS"]').click();
    cy.get('input[name="nextYearGrossSales"]').type(nextYearProjection.nextYearGrossSales);
    cy.get('input[name="nextYearCogSold"]').type(nextYearProjection.nextYearCogSold);
    cy.get('input[name="nextYearOperatingExpenses"]').type(nextYearProjection.nextYearOperatingExpenses);
    cy.get('input[name="nextYearNetIncome"]').type(nextYearProjection.nextYearNetIncome);
}

export const fillBusinessDetails = (businessDetails) => {
  fillExistingDebt(businessDetails.existingDebt)
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

export const fillOwnerInfo = (owner) => {
    cy.get('input[name="fullLegalName"]').type(owner.fullLegalName);
    cy.get('input[name="title"]').type(owner.title);
    cy.get('input[name="yearsOfExp"]').type(owner.yearsOfExp);
    cy.get('input[name="companyOwnerShip"]').type(owner.companyOwnerShip);
    cy.get('input[name="dateOfService"]').type(owner.dateOfService);
    cy.get('input[name="ssn"]').type(owner.ssn);
    cy.get('input[name="linkedInUrl"]').type(owner.linkedInUrl);
}

export const fillExistingDebt = (existingDebt) => {
    cy.get('input[name="amount"]').type(existingDebt.amount);
    cy.get('input[name="interestExpenses"]').type(existingDebt.interestExpenses);
    cy.get('input[name="remainingPrincipal"]').type(existingDebt.remainingPrincipal);
    cy.get('input[name="term"]').type(existingDebt.term);
}