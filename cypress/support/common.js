
export const registerApiCall = (operationName) => {
  cy.server();
  cy.route('POST', '**/**').as(operationName);
}

export const typeOtpCode = () => {
  cy.get('.react-code-input', { timeout: 100000 }).within(() => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 6; i++) {
      cy.get(`[data-id=${i}]`).type('1');
    }
  });
};

export const enterCodeAndConfirm = () => {
  typeOtpCode();
  registerApiCall('confirm');
  cy.get('form').find('button').contains('Confirm').click();
  cy.wait('@confirm');
}