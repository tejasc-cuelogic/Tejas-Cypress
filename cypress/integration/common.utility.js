import { forEach } from 'lodash';

export const applicationUnlock = () => {
  cy.get('input[name="password"]').type('fourroses');
  cy.get('div.content').get('button.button').contains('Log in').click({ force: true });
};

export const registerApiCall = (operationName, url = '**/**') => {
  cy.server();
  cy.route('POST', url).as(operationName);
}

export const uploadFile = (selector = '') => {
  registerApiCall('fileUpload');
  cy.fixture('images/test-img.png').as('img');
  cy.upload_file('images/test-img.png', 'png', selector || 'input[type=file]');
  cy.wait('@fileUpload');
  cy.wait(1000);
};

export const getJSONDataFromFixtures = async (path = '', props = undefined) => {
  const extractedData = await cy.fixture(path);
  return props ? extractedData[props] : null;
};

export const clearFormInput = (inputArr = []) => {
  // if (inputArr.length > 0) {
  //   forEach(inputArr, (props) => {
  //     cy.get(`input[${props.key}=${props.value}]`).clear();
  //   });
  // }
  cy.get('input[type="email"]').clear();
  cy.get('input[type="password"]').clear();
};

