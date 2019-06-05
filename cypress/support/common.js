export const waitForAPIcall = (operationName) => {
  cy.wait(`@${operationName}`);
}

export const registerApiCall = (operationName) => {
  cy.server();
  cy.route('POST', '**/**').as(operationName);
}

export const typeOtpCode = () => {
  cy.get('.react-code-input', { timeout: 100000 }).within(() => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 6; i++) {
      cy.get(`[data-id=${i}]`).type('1');
    }
  });
};

export const ApplicationUnlock = () => {
  cy.get('input[name="password"]').type('fourroses');
  cy.get('div.content').get('button.button').contains('Log in').click({ force: true });
}

export const btnClickAndWait = (operationName) => {
  registerApiCall(operationName);
  cy.get('button.next').click({ force: true });
  cy.wait(`@${operationName}`);
  cy.wait(1000);
};

export const uploadFile = (selector = '') => {
  registerApiCall('fileUpload');
  cy.fixture('images/test-img.png').as('img');
  cy.upload_file('images/test-img.png', 'png', selector || 'input[type=file]');
  cy.wait('@fileUpload');

}  

export const clickRadioAndNext = (selector, radioVal, operationName) => {
  cy.get(selector).check(radioVal, { force: true });
  btnClickAndWait(operationName);
};

export const escapeCharFromSel = myid => `.${myid.replace(/(:|\.|\[|\]|,|=|@)/g, '\\$1')}`;

export const enterCodeAndConfirm = () => {
  typeOtpCode();
  registerApiCall('confirm');
  cy.get('form').find('button').contains('Confirm').click();
  cy.wait('@confirm');
}