import { registerApiCall } from '../../support/common';

export const issuerSignUp = () => {
    cy.get('h4').contains('Business').click();
    cy.get('a').contains('Start application process').click();
}

export const fillBasicDetails = () => {
    cy.get('input[name="firstName"]').type('automation');
    cy.get('input[name="lastName"]').type('test');
    cy.get('input[name="email"]').type('pankaj.cuelogic+issuer@nextseed.com');
    registerApiCall('Continue');
    cy.get('button').contains('Continue').click();
    cy.wait('@Continue');
}

export const fillGeneralInfo = () => {
    const today = new Date();
    const businessName = today.getMonth() + '/' + today.getDate() + '/' + today.getFullYear();
    cy.get('input[name="businessName"]').type(businessName);
    cy.get('input[name="website"]').type('http://localhost:3001/');
    cy.get('input[name="phoneNumber"]').type('1111111111');
    cy.get('input[name="street"]').type('Aesthetic Way');
    cy.get('input[name="city"]').type('Greensburg');
    cy.get('input[name="state"]').type('Pennsylvania');
    cy.get('input[name="zipCode"]').type('15601');
}
  
export const fillExperienceDetails = () => {
    cy.get('input[name="industryExperience"]').type('5');
    cy.get('input[name="estimatedCreditScore"]').type('700');
    cy.get('input[name="totalProjectCost"]').type('1000000');
    cy.get('input[name="amountNeeded"]').type('50000');
}
  
export const fillNextYearProjection = () => {
    cy.get('input[value="RENOVATIONS"]').click();
    cy.get('input[name="nextYearGrossSales"]').type('750000');
    cy.get('input[name="nextYearCogSold"]').type('75000');
    cy.get('input[name="nextYearOperatingExpenses"]').type('150000');
    cy.get('input[name="nextYearNetIncome"]').type('525000');
}

export const fillBusinessDetails = () => {
    cy.get('input[name="fullLegalName"]').type('automation test');
    cy.get('input[name="title"]').type('CEO');
    cy.get('input[name="yearsOfExp"]').type('10');
    cy.get('input[name="companyOwnerShip"]').type('40');
    cy.get('input[name="dateOfService"]').type('10/10/2019');
    cy.get('input[name="ssn"]').type('111111111');
    cy.get('input[name="linkedInUrl"]').type('http://linkedin.com/username');
}