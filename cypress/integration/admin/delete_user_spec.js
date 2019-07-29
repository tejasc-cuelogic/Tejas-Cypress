import { registerApiCall } from '../common.utility';

describe('Delete user spec', () => {
  it('login with admin user', () => {
    const investorEmail = window.localStorage.getItem('investorEmail');
    // cy.get('ns-scrollbar').find('span').contains('Logout').click();
    cy.visit('/');
    cy.applicationUnlock();
    
    cy.get('.header-wrap').get('.menu-button').contains('Log In').click({ force: true });

    cy.fixture('admin/user').then((data) => {
      cy.get('form').within(() => {
        const adminCredentials = data.adminCredentialsV2;
        console.log('adminCredentials=====', adminCredentials);
        cy.get('input[name="email"]').type(adminCredentials.email);
        cy.get('input[name="password"]').type(adminCredentials.password);
        cy.get('button.button').contains('Log in').click({ force: true });
        registerApiCall('getUserDetails');
        cy.wait('@getUserDetails');

        cy.get('.header-wrap').get('button.button').contains('Dashboard').click({ force: true });

        // cy.get('ns-scrollbar').find('span').contains('Manage Users').click();
        // Visibility('/app/users');
        // cy.get('div').get('.search-filters').find('input[placeholder="Search by name"]').type(investorEmail).type('{enter}');
      });
    });
  })
});