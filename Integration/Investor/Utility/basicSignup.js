export const gotoSignupscreen = () =>  {

cy.fixture('Signup.json') .then((SignUpMeta) => {

  cy.get('input[name="password"]').type(SignUpMeta.password)

  
    cy.get('div.content').get('button.button').contains('Log in').click({ force: true });

cy.wait(5000);

  cy.contains('Sign Up');

  cy.get('.header-wrap').contains('Sign Up').click();


cy.wait(5000);

cy.get('button[data-cy="investor"]').click({force:true });


 });

};


export const fillsignupform = () => {

cy.fixture('Basicdata.json').then ((SignUpMeta) => {

  const investorEmail = `test${Math.floor(((Math.random() + Math.random()) * 1000000) + 1)}@nextseed.com`;

  cy.get('input[name="email"]').type(investorEmail);

  cy.get('input[name="password"]').type(SignUpMeta.password);

  cy.get('button[data-cy="investor-signup"]').click({force:true });

});
}

export const otpcode = () => {
  cy.get('.react-code-input', { timeout: 10000}).within(() => {

    for(let i=0;i<6;i++)    {
       cy.get(`[data-id=${i}]`).type('1');
    }

});

cy.wait(5000);
cy.get('button[data-cy="confirm-code"]').click({force:true});

};

export const identity = (legalDetails = undefined) => {

  cy.fixture('identity.json').then ((legalData) => {
 
   // const withaddress= legalData.withBusinessAddress;

    //const legaldetails= legalData.legalDetailsMeta;

    const { legalDetailsMeta } = legalData;

   // const cipdetails= { ...legalDetailsMeta, ...withBusinessAddress };
    
    const legalDetailObject = legalDetails || legalDetailsMeta;
    
    cy.log('This is cip screen', legalDetailObject)
    //cy.get('div.content > form').within(() => {
      cy.get('[data-cy=cip-form]')
      .within(() => {
      //.find('div.nine.wide.computer.sixteen.wide.mobile.sixteen.wide.tablet.column > form').within(() => {
      //.find('div[data-cy="cip-form"]')


      cy.get('div[name="salutation"]')
      .click()
      
      .get(`div[role="option"]:contains(${legalDetailObject.salutation})`)
      .click();
    
    cy.get('input[name="firstLegalName"]').type(legalDetailObject.firstLegalName);
    cy.get('input[name="lastLegalName"]').type(legalDetailObject.lastLegalName);
    cy.get('input[name="street"]').type(legalDetailObject.residentialStreet);
    cy.get('input[name="city"]').type(lealDetailObject.city);
    cy.get('div[name="state"]')
    .click()
    
    .get(`div[role="option"]:contains(${legalDetailObject.state})`).click()
    cy.get('input[name="zipCode"]').type(legalDetailObject.zipCode);  
    cy.get('input[name="phoneNumber"]').type(legalDataObject.phoneNumber);
    cy.get('input[name="dateOfBirth"]').type(legalDataObject.dateOfBirth);
    cy.get('input[name="ssn"]'),type(legalDataObject.ssn);

    })

    cy.get('form').find('button').contains('Verify my identity').click();

  }
);
}

