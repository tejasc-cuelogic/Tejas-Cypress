import { rejects } from "assert";

export const waitForAPIcall = (operationName) => {
  cy.wait(`@${operationName}`);
}

export const registerApiCall = (operationName, url = '**/**') => {
  cy.server();
  cy.route('POST', url).as(operationName);
}

export const typeOtpCode = () => {
  cy.get('.react-code-input', { timeout: 100000 }).within(() => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 6; i++) {
      cy.get(`[data-id=${i}]`).type('1');
    }
  });
};

export const clickonDashboard = () => {
  cy.wait(7000)
  cy.get('.header-wrap').get('button.button').contains('Dashboard').click({ force: true });
}

export const btnClickAndWait = (operationName) => {
  registerApiCall(operationName, '/dev/graphql');
  cy.wait(500)
  cy.get('button.next').click({ force: true });
  cy.wait(`@${operationName}`);
};

export const uploadFile = (selector, url = '**/**') => {
  registerApiCall('fileUpload', url);
  cy.fixture('images/test-img.png').as('img');
  cy.upload_file('images/test-img.png', 'png', selector);
  cy.wait('@fileUpload');
  cy.wait(1000);
}

export const clickRadioAndNext = (selector, radioVal, operationName) => {
  cy.get(selector).check(radioVal, { force: true });
  btnClickAndWait(operationName);
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
