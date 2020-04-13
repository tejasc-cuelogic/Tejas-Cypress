import {
  investorFlowProcess,
  individualManualLinkbankProcess,
  individualPlaidProcess,
  addFunds,
  iraAccountCreation,
  entityAccountCreation
} from './utility/investorAccount.utlity';

import { registerApiCall } from '../../../common.utility';

describe('Account Creation', () => {
  before(() => {
    investorFlowProcess();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    registerApiCall('upsertInvestorAccount', '/dev/graphql');
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  after(() => {
    cy.restoreLocalStorage();
    cy.cleanUpUser();
  });

  it('should successfully link bank with plaid process', () => {
    cy.get('[data-cy=0]').click()
    individualPlaidProcess('1');
  });

  it.skip('should successfully link bank with manual process', () => {
    individualManualLinkbankProcess();
  });

  it('should create individual account successfully', () => {
    cy.get('.dimmer-visible').should('not.be.visible');
    addFunds('15000');
    registerApiCall('submitAccount', '/dev/graphql');
    cy.get('.dimmer-visible').should('not.be.visible')
    cy.get('[data-cy=ind-summary]').dblclick();
    cy.wait('@submitAccount');
    cy.wait('@submitAccount');
    cy.get('.close').dblclick();
  });

  it('should create IRA account successfully', () => {
    cy.get('.btn-item').contains('Add New Account').click({ force: true });
    cy.get('[data-cy=1]').click()
    cy.get('[data-cy=about-ira]').click()
    iraAccountCreation();
    cy.get('.close').dblclick();
  });

  it.skip('should create Entity account successfully', () => {
    cy.get('.btn-item').contains('Add New Account').click({ force: true });
    cy.get('input[name="accType"]').check('2', { force: true });
    cy.get('button.next').click();
    entityAccountCreation();
  });
});
