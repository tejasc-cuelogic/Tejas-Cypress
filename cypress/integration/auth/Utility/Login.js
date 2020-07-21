export const gotoLandingPage = () =>  {

    cy.fixture('Signup.json') .then((SignUpMeta) => {
    
        cy.get('input[name="password"]').type(SignUpMeta.password)
      
        
          cy.get('div.content').get('button.button').contains('Log in').click({ force: true });
      
      cy.wait(5000);


})

}



export const gotoLoginscreen = () =>  {

    cy.fixture('Login.json'). then((SignUpMeta) => {

    cy.get('input[name="email"]').type(SignUpMeta.Email);

    cy.get('input[name="password"]').type(SignUpMeta.Password);

    cy.get('.item.ui.primary.button').contains('Dashboard').click({force: true});
  
    })

     };
