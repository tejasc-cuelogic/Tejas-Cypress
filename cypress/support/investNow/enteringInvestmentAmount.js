export const clearEnteredAmount = () => {
  cy.get('input[name="investmentAmount"]').clear();
};

export const invalidInvestmentAmount = () => {
  clearEnteredAmount();
  cy.get('input[name="investmentAmount"]').type('101');
  cy.get('input[name="investmentAmount"]').blur();
  cy.wait(500);
  cy.get('input[name="investmentAmount"]').parentsUntil('.field').get('p').should('have.class', 'field-error');
};

export const enteringInvestmentAmount = () => {
  invalidInvestmentAmount();
};
