import { investNowFlow } from '../../support/investNow/investNowFlow';
import { loginCredentials, inValidEmailCredentials } from '../../support/investorSignup/login';

describe('Invest now flow', () => {
  it('Should proceed for invest now flow', () => {
    investNowFlow();
  });

  it('Should open login popup if click on Invest Now button and not loged in', () => {
    cy.get('.public-pages').find('.campaign-banner').find('.banner .container .stackable').find('.six.wide')
      .find('.center-align')
      .contains('Invest Now')
      .click();
  });
  it('should check email format', () => {
    cy.get('input[type="email"]').type(inValidEmailCredentials.email);
    cy.get('input[type="email"]').blur();
    cy.wait(500);
    cy.get('input[type="email"]').parentsUntil('.field').get('p').should('have.class', 'field-error');
  });
  it('succesfully performs login action', () => {
    cy.get('input[type="email"]').type(loginCredentials.email);
    cy.get('input[type="password"]').type(loginCredentials.password);
    cy.get('button.button').contains('Log in').click({ force: true });
  });
});
