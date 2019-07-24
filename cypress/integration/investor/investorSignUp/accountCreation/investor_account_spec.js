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

  it('should successfully link bank with manual process', () => {
    individualManualLinkbankProcess();
    cy.get('input[name="value"]').then(() => {
      cy.get(`.multistep-modal > ol.progtrckr > .progtrckr-doing`).click({ force: true }).invoke('text').then((step) => {
        cy.log('step value', step);
        assert.equal(step, 'Add funds', 'Should be on add funds modal')	
      });
    });
  });

  it('should successfully link bank with plaid process', () => {
    individualPlaidProcess('.progtrckr-done', '1');
    cy.get('input[name="value"]').then(() => {
      cy.get(`.multistep-modal > ol.progtrckr > .progtrckr-doing`).click({ force: true }).invoke('text').then((step) => {
        cy.log('step value', step);
        assert.equal(step, 'Add funds', 'Should be on add funds modal')	
      });
    });
  });

  it.skip('should create individual account successfully', () => {
    addFunds('15000');
      cy.wait('@addFunds');
      cy.wait('@addFunds');
    registerApiCall('submitAccount', '/dev/graphql');
    cy.get('.dimmer-visible').should('not.be.visible')
    cy.get('div.content').get('button.button').contains('Create your account').click({ force: true });
    cy.wait('@submitAccount');
    cy.wait('@submitAccount');
  });

  it('should create IRA account successfully', () => {
    cy.get('.btn-item').contains('Open New Account').click({ force: true });
    cy.get('input[name="accType"]').check('1', { force: true });
    cy.get('button.next').click();
    iraAccountCreation();
  });

  it('should create Entity account successfully', () => {
    cy.get('.btn-item').contains('Open New Account').click({ force: true });
    cy.get('input[name="accType"]').check('2', { force: true });
    cy.get('button.next').click();
    entityAccountCreation();
  });
});
