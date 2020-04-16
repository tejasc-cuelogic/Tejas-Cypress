import {
  investorFlowProcess,
  individualManualLinkbankProcess,
  individualPlaidProcess,
  addFunds,
  handleSummary,
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
    registerApiCall('upsertInvestorAccount');
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

  it('should successfully link bank with manual process', () => {
    individualManualLinkbankProcess();
  });

  it('should create individual account successfully', () => {
    cy.get('.dimmer-visible').should('not.be.visible');
    addFunds('15000');
    handleSummary('ind-summary')
  });

  it('should create IRA account successfully', () => {
    cy.get('.btn-item').contains('Add New Account').click({ force: true });
    cy.get('[data-cy=1]').click()
    cy.get('[data-cy=about-ira]').click()
    iraAccountCreation();
  });

  it('should create Entity account successfully', () => {
    cy.get('.btn-item').contains('Add New Account').click({ force: true });
    cy.log('click->',"add accountr")
    cy.get('[data-cy=2]').click();
    cy.log('click->',"add account type")
    entityAccountCreation();
  });
});
