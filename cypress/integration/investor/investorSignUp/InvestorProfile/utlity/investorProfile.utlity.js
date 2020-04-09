import { registerApiCall, btnClickAndWait, clickRadioAndNext } from '../../../../../support/common';

const handleFinancialInfo = () => {
  cy.get('input[name="taxFilingAs"]').check('JOINT', { force: true });
  cy.get('[data-cy=netWorth]').type('123456789');
  cy.get('[data-cy=annualIncomeCurrentYear]').type('123456789');
  btnClickAndWait('[data-cy=inv-profile-finance]', 'upsertProfile');
}

const handleInvestmentExp = () => {
  cy.get('[data-cy=SOME]').click();
  cy.get('input[name="isRiskTaker"]').click();
  cy.get('input[name="isComfortable"]').click();
  cy.get('[data-cy=inv-profile-exp]').click();
  cy.wait('@upsertProfile');
}

export const completeInvestorProfile = () => {
  registerApiCall('upsertProfile', 'dev/graphql');
  cy.get('[data-cy=inv-profile-overview]').click();
  btnClickAndWait('[data-cy=SELF_EMPLOYED]', 'upsertProfile');
  btnClickAndWait('[data-cy=no-brokerage]', 'upsertProfile');
  btnClickAndWait('[data-cy=no-pr]', 'upsertProfile');
  handleFinancialInfo();
  handleInvestmentExp();
};

