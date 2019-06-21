export const waitForAPIcall = (operationName) => {
  cy.wait(`@${operationName}`);
};

export const registerApiCall = (operationName, url = '**/**') => {
  cy.server();
  cy.route('POST', url).as(operationName);
}

export const apiRequest = (requestParams, headers = { "content-type": 'application/json' }) => new Promise((resolve) => {
  cy.request(
    {
      url: requestParams.url,
      method: requestParams.method,
      body: {
        query: requestParams.query,
      },
      failOnStatusCode: false,
      headers,
    }
  ).then((result) => {
    console.log('Successfully send request', result);
    resolve(result);
  });
});

export const typeOtpCode = () => {
  cy.get('.react-code-input', { timeout: 100000 }).within(() => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 6; i++) {
      cy.get(`[data-id=${i}]`).type('1');
    }
  });
};

export const applicationUnlock = () => {
  cy.get('input[name="password"]').type('fourroses');
  cy.get('div.content').get('button.button').contains('Log in').click({ force: true });
};

export const clickonDashboard = () => {
  cy.wait(7000);
  cy.get('.header-wrap').get('button.button').contains('Dashboard').click({ force: true });
};

export const btnClickAndWait = (operationName) => {
  registerApiCall(operationName, '/dev/graphql');
  cy.wait(500)
  cy.get('button.next').click({ force: true });
  cy.wait(`@${operationName}`);
};

export const uploadFile = (selector = '') => {
  registerApiCall('fileUpload');
  cy.fixture('images/test-img.png').as('img');
  cy.upload_file('images/test-img.png', 'png', selector || 'input[type=file]');
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
