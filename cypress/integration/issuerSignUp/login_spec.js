let businessName = 'test';
describe('Log In', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
    cy.get('a').contains('Sign Up').click();
  });

  it('should be able to go on issuer sign up page', () => {
    issuerSignUp();
  });

  it ('should fill basic details', () => {
    issuerSignUp();
    fillBasicDetails();
  })

  it ('Should Successfully fill pre-qualification form and submit the business application', () => {
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
  })

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
    cy.get('button').contains('Submit').click();
  })
});
const issuerSignUp = () => {
  cy.get('h4').contains('Business').click();
  cy.get('a').contains('Start application process').click();
}
const fillBasicDetails = () => {
  cy.get('input[name="firstName"]').type('automation');
  cy.get('input[name="lastName"]').type('test');
  cy.get('input[name="email"]').type('pankaj.cuelogic@nextseed.com');
  cy.get('button').contains('Continue').click();
};

const fillGeneralInfo = () => {
  const today = new Date();
  businessName = today.getMonth() + '/' + today.getDate() + '/' + today.getFullYear();
  cy.get('input[name="businessName"]').type(businessName);
  cy.get('input[name="website"]').type('http://localhost:3001/');
  cy.get('input[name="phoneNumber"]').type('1111111111');
  cy.get('input[name="street"]').type('Aesthetic Way');
  cy.get('input[name="city"]').type('Greensburg');
  cy.get('input[name="state"]').type('Pennsylvania');
  cy.get('input[name="zipCode"]').type('15601');
}

const fillExperienceDetails = () => {
  cy.get('input[name="industryExperience"]').type('5');
  cy.get('input[name="estimatedCreditScore"]').type('700');
  cy.get('input[name="totalProjectCost"]').type('1000000');
  cy.get('input[name="amountNeeded"]').type('50000');
}

const fillNextYearProjection = () => {
  cy.get('input[value="RENOVATIONS"]').click();
  cy.get('input[name="nextYearGrossSales"]').type('750000');
  cy.get('input[name="nextYearCogSold"]').type('75000');
  cy.get('input[name="nextYearOperatingExpenses"]').type('150000');
  cy.get('input[name="nextYearNetIncome"]').type('525000');
}