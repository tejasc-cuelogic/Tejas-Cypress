import { API_ROOT } from '../../src/constants/common';
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add('waitForGraph', (operationName) => {
  cy.route('**/graphql/**').as('graphqlRequest');
  // This will capture every request
  cy.wait('@graphqlRequest').then(({ request }) => {
    // If the captured request doesn't match the operation name of your query
    // it will wait again for the next one until it gets matched.
    if (request.body.operationName !== operationName) {
      return cy.waitForGraph(operationName);
    }
  });
});
