import { forEach } from 'lodash';

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

export const clickonDashboard = () => {
  cy.wait(7000)
  cy.get('.header-wrap').get('button.button').contains('Dashboard').click({ force: true });
}

export const getJSONDataFromFixtures = async (path = '', props = undefined) => {
  const extractedData = await cy.fixture(path);
  return props ? extractedData[props] : extractedData ? extractedData : null;
};

export const typeOtpCode = () => {
  cy.get('.react-code-input', { timeout: 100000 }).within(() => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 6; i++) {
      cy.get(`[data-id=${i}]`).type('1');
    }
  });
};

export const enterCodeAndConfirm = () => {
  cy.wait(500);
  registerApiCall('confirm');
  typeOtpCode();
  cy.wait(100);
  cy.get('form').find('button').contains('Confirm').click();
  cy.wait('@confirm');
  cy.wait(500);
};

export const clickRadioAndNext = (selector, radioVal, operationName) => {
  cy.get(selector).check(radioVal, { force: true });
  btnClickAndWait(operationName);
};

export const btnClickAndWait = (operationName) => {
  registerApiCall(operationName, '/dev/graphql');
  cy.get('button.next').click({ force: true });
  cy.wait(`@${operationName}`);
};

export const clearFormInput = (inputArr = []) => {
  if (inputArr.length > 0) {
    forEach(inputArr, (props) => {
      cy.get(`input[${props.key.replace(/["']/g, "")}=${props.value}]`).clear();
    });
  }
  // cy.get('input[type="email"]').clear();
  // cy.get('input[type="password"]').clear();
};

