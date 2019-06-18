import { registerApiCall } from '../common';

export const goToOfferingDetailScreen = () => {
  // cy.get('div.public-pages').find('.campaign-list-wrapper').find('.container').find('.stackable')
  //   .should('have.length', 1);
  cy.get('div.public-pages').find('.campaign-list-wrapper').find('.container').get('svg', { timeout: 6000 })
    .should('not.exist');
  cy.get('.campaign-list-wrapper').find('.container').find('.stackable').children()
    .eq(5)
    .click();
  cy.wait('@getOfferingDetailsBySlug');
};

export const OfferingDetailFlow = () => {
  registerApiCall('getOfferingDetailsBySlug');
  goToOfferingDetailScreen();
};
