import { API_ROOT } from '../../src/constants/common';
import Amplify from '@aws-amplify/core';
import AmplifyAuth from '@aws-amplify/auth';
import { isEmpty, forIn } from 'lodash';
import { registerApiCall } from '../integration/common.utility';
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


Cypress.on('window:before:load', (win) => {
  delete win.fetch;
});

const LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add('saveLocalStorage', () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add('restoreLocalStorage', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});

function hexStringToByte(str) {
  if (!str) {
    return new Uint8Array();
  }

  let a = [];
  for (let i = 0, len = str.length; i < len; i += 2) {
    a.push(parseInt(str.substr(i, 2), 16));
  }

  return new Uint8Array(a);
}

Cypress.Commands.add('uploadFile', (fileName, fileType, selector, url = '**/**') => {
  cy.server();
  cy.route('POST', url).as('fileUpload');
  cy.fixture(fileName).as('img');
  cy.upload_file(fileName, fileType, selector);
  cy.wait('@fileUpload');
});

Cypress.Commands.add('upload_file', (fileName, fileType, selector) => {
  cy.get(selector).then((subject) => {
    cy.fixture(fileName, 'hex').then((fileHex) => {
      const fileBytes = hexStringToByte(fileHex);
      const testFile = new File([fileBytes], fileName, {
        type: fileType,
      });
      const dataTransfer = new DataTransfer();
      const el = subject[0];

      dataTransfer.items.add(testFile);
      el.files = dataTransfer.files;
    });
  });
});

const amplifyLogin = async (username, password) => {
  Amplify.configure({
    Auth: {
      identityPoolId: Cypress.env('identityPoolId'),
      region: Cypress.env('region'),
      userPoolId: Cypress.env('userPoolId'),
      userPoolWebClientId: Cypress.env('userPoolWebClientId'),
    },
  });
  return await AmplifyAuth.signIn({ username, password });
};

Cypress.Commands.add('login', amplifyLogin);

// UTILS

Cypress.Commands.add('applicationUnlock', () => {
  cy.get('input[name="password"]').type(Cypress.env('appPassword'));
    cy.get('div.content').get('button.button').contains('Log in').click({ force: true });
});
// Cypress.Commands.add('itterativeWait', (itteration, alias) => {
//   for (let i = 0; i < itteration; i++) {
//     cy.wait(`@${alias}`)
//   }
// });

Cypress.Commands.add('formFill', (dataSet, parentSelector) => {
  if (!isEmpty(dataSet)) {
    forIn(dataSet, (val, key) => {
      const selector = dataSet[key].selector || 'name';
      let cySelector = '';
      if (parentSelector) {
        cySelector = cy.get(`[data-cy=${parentSelector}]`).find(`input[${selector.replace(/["']/g, "")}="${key}"]`);
      } else {
        cySelector = cy.get(`input[${selector.replace(/["']/g, "")}="${key}"]`);
      }

      if (!dataSet[key].skip) {
        cySelector.type(dataSet[key].value);
      }
      if (!dataSet[key].skip && dataSet[key].isEnterEvent) {
        cySelector.type('{enter}');
      }
      if (!dataSet[key].skip && dataSet[key].showError) {
        cySelector.blur();
        cySelector.parentsUntil('.field').get('p').should('have.class', 'field-error');
      }

    });
  }
});

Cypress.Commands.add('clearFormField', (dataSet, parentSelector = false) => {
  if (!isEmpty(dataSet)) {
    forIn(dataSet, (val, key) => {
      const selector = dataSet[key].selector || 'name';
      if (parentSelector) {
        cy.get(`[data-cy=${parentSelector}]`).find(`input[${selector.replace(/["']/g, "")}="${key}"]`).clear();
      } else {
        cy.get(`input[${selector.replace(/["']/g, "")}="${key}"]`).clear();
      }
    });
  }
});

Cypress.Commands.add('getOffering', (offeirId) => {
  let retries = -1
  function searchForOffering() {
    retries++;
    cy.get('.campaign-list-wrapper').find('.container').find('.stackable')
      .then(($parent) => {
        try {
          if ($parent.find(`div[data-cy=${offeirId}]`).length) {
            cy.log('Find offering...');
            cy.wrap($parent.find(`div[data-cy=${offeirId}]`)).click();
          } else {
            cy.log('Move for Read More...');
            cy.get('body').then(($body) => {
              if ($body.find('div[data-cy=activeToDisplay]').length) {
                cy.get('div[data-cy=activeToDisplay]').find('button').contains('Load More')
                  .click();
                return searchForOffering();
              } else {
                if (retries > 2) {
                  cy.log('ERROR :: offeirng not found');
                  cy.addWindowLocalStorageKey('abortRemainingTestCase', true);
                }
              }
            });
          }
        } catch (err) {
          if (retries > 2) {
            cy.log('ERROR :: offeirng not found');
            cy.addWindowLocalStorageKey('abortRemainingTestCase', true);
          }
        }
      });
  }
  return searchForOffering();
});

Cypress.Commands.add('clearLocalStorageKey', (KEY_NAME) => {
  localStorage.removeItem(KEY_NAME);
});

Cypress.Commands.add('addWindowLocalStorageKey', (KEY_NAME, VALUE= false) => {
  window.localStorage.setItem(KEY_NAME, VALUE);
});

Cypress.Commands.add('Logout', () => {
  cy.visit('/app/dashboard');
  cy.get('div.menu').get('div.ns-scrollbar').find('span').contains('Logout').click();
});

Cypress.Commands.add('deleteUser', (userType='Investor') => {
  const investorEmail = window.localStorage.getItem('investorEmail');
  cy.Logout();
  console.log('investorEmail====', investorEmail);
  cy.visit('/');
  // cy.applicationUnlock();
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

    cy.visit('/app/users');
    registerApiCall('listUsers', '/dev/graphql');
    cy.wait('@listUsers');

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
    cy.Logout();
  });
})