describe('Log In', () => {
  it('succesfully performs login action', () => {
    // visit 'baseUrl'
    cy.visit('http://localhost:3000');
    cy.pause();
    cy.contains('Sign up');
    cy.get('button.compact').click();
    cy.get('a').contains('Log in').click();
    cy.get('input[type="email"]').type('test@email.com');
    cy.get('input[type="password"]').type('password');
    cy.get('button.button').contains('Log in').click();
  });
});
