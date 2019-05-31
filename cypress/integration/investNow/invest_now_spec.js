import { investNowFlow } from '../../support/investNow/investNowFlow';

describe('My First Test', () => {
  it('visits home page', () => {
    cy.visit('/');
    investNowFlow();
  });
});
