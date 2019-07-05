import { API_ROOT } from '../../src/constants/common';
import Amplify from '@aws-amplify/core';
import AmplifyAuth from '@aws-amplify/auth';
import { isEmpty, forIn } from 'lodash';
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
  return await AmplifyAuth.signIn({ username, password});
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
