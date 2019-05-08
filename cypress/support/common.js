export const waitForAPIcall = () => {
  cy.server();
  cy.route('POST', '**/**').as('graphql');
  cy.wait('@graphql');
}

export const typeOtpCode = () => {
  cy.get('.react-code-input', { timeout: 10000 }).within(() => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 6; i++) {
      cy.get(`[data-id=${i}]`).type('1');
    }
  });
};

export const enterCodeAndConfirm = () => {
  typeOtpCode();
  cy.get('form').find('button').contains('Confirm').click();
}