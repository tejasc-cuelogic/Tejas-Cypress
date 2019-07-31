import { registerApiCall } from '../common.utility';

describe.skip('Delete user spec', () => {
  it('login with admin user', () => {
    const userType = 'Investor';
    const investorEmail = 'testing835699@nextseed.com'; //window.localStorage.getItem('investorEmail');
    // cy.get('ns-scrollbar').find('span').contains('Logout').click();
    cy.visit('/');
    cy.applicationUnlock();
    cy.get('.header-wrap').get('.menu-button').contains('Log In').click({ force: true });

    cy.fixture('admin/user').then((data) => {
      cy.get('form').within(() => {
        const adminCredentials = data.adminCredentialsV2;
        cy.get('input[name="email"]').type(adminCredentials.email);
        cy.get('input[name="password"]').type(adminCredentials.password);
        cy.get('button.button').contains('Log in').click({ force: true });
        registerApiCall('getUserDetails', '/dev/graphql');
        cy.wait('@getUserDetails');
      });

      // cy.get('.header-wrap').get('.menu-button').contains('Dashboard').click({ force: true });
      cy.visit('/app/users');
      registerApiCall('listUsers', '/dev/graphql');
      cy.wait('@listUsers');
      
      console.log('investorEmail===', investorEmail);
      
      cy.get('form').within(() => {
        cy.get('input[placeholder="Search by name"]').type(investorEmail).type('{enter}');
      });
      registerApiCall('listUsers', '/dev/graphql');
      cy.wait('@listUsers');
      cy.get('span.user-name').within(() => {
        cy.get('a').click({ force: true });
      });
      cy.get('div.floated.buttons').get('button.button').contains('Soft Delete Profile').click({ force: true });
      cy.get('div.modal.deletion').get('div.actions').get('button.button').contains('OK').click({ force: true })

      registerApiCall('adminDeleteInvestorOrIssuerUser', '/dev/graphql');
      cy.wait('@adminDeleteInvestorOrIssuerUser');
      registerApiCall('listUsers', '/dev/graphql');
      cy.wait('@listUsers');

      const splitEmail = investorEmail.split('@');
      const deletedEmail = `DeletedAccounts+${userType}-${splitEmail[0]}ATnextseedDOTcom@${splitEmail[1]}`;

      cy.get('form').within(() => {
        cy.get('button.link-button').click();
      });
      cy.get('div.more.search-filters ').within(() => {
        cy.get('input[type="checkbox"]').check({ force: true });
      });
      cy.get('input[placeholder="Search by name"]').type(deletedEmail).type('{enter}');

      cy.get('span.user-name').within(() => {
        cy.get('a').click({ force: true });
      })
      registerApiCall('getUserDetails', '/dev/graphql');
      cy.wait('@getUserDetails');
      cy.get('div.floated.buttons').get('button.button').contains('Hard Delete Profile').click({ force: true });
      cy.get('div.modal.deletion').get('div.actions').get('button.button').contains('OK').click({ force: true });

      registerApiCall('adminHardDeleteUser', '/dev/graphql');
      cy.wait('@adminHardDeleteUser');
    });
  })
});