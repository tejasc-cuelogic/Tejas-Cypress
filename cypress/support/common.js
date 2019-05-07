export const waitForAPIcall = () => {
  cy.server();
  cy.route('POST', '**/graphql').as('graphqlRequest');
  cy.wait('@graphqlRequest');
}