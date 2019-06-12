export const confirmPhoneNumberScreen = () => {
  cy.get('div.content > .center-align > button').contains('Continue').click({ force: true });
  cy.wait('@confirm');
  cy.wait('@confirm');
};
