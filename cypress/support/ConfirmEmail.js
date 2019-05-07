export const typeOtpCode = () => {
  cy.get('.react-code-input').within(() => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 6; i++) {
      cy.get(`[data-id=${i}]`).type('1');
    }
  });
};

export const enterCodeAndConfirmEmail = () => {
  typeOtpCode();
  cy.get('form').find('button').contains('Confirm').click();
}

export const confirmEmailAddressScreen = () => {
  cy.get('.content').find('button').contains('Continue').click();
}