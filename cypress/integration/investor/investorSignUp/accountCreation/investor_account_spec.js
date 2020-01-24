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
    individualPlaidProcess('.progtrckr-doing', '1');
    cy.get('input[name="value"]').then(() => {
      cy.get(`.multistep-modal > ol.progtrckr > .progtrckr-doing`).click({ force: true }).invoke('text').then((step) => {
        cy.log('step value', step);
        assert.equal(step, 'Add funds', 'Should be on add funds modal')	
      });
    });
  });

  it('should successfully link bank with manual process', () => {
    cy.get(`.multistep-modal > ol.progtrckr > .progtrckr-done`).click({ force: true }).invoke('text').then((step) => {
      cy.log('step value', step);
      individualManualLinkbankProcess();
    });
  });

  it('should create individual account successfully', () => {
    cy.get('.dimmer-visible').should('not.be.visible');
    addFunds('15000');
    registerApiCall('submitAccount', '/dev/graphql');
    cy.get('.dimmer-visible').should('not.be.visible')
    cy.get('button').contains('Create your account').click({ force: true });
    cy.wait('@submitAccount');
    cy.wait('@submitAccount');
  });

  it.skip('should create IRA account successfully', () => {
    cy.get('.btn-item').contains('Open New Account').click({ force: true });
    cy.get('input[name="accType"]').check('1', { force: true });
    cy.get('button.next').click();
    iraAccountCreation();
  });

  it.skip('should create Entity account successfully', () => {
    cy.get('.btn-item').contains('Open New Account').click({ force: true });
    cy.get('input[name="accType"]').check('2', { force: true });
    cy.get('button.next').click();
    entityAccountCreation();
  });
});
