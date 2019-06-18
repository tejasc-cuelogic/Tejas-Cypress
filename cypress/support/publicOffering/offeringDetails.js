import { registerApiCall } from '../common';

export const goToCFOfferingDetailScreen = () => {
  cy.get('div.public-pages').find('.campaign-list-wrapper').find('.container').get('svg', { timeout: 6000 })
    .should('not.exist');
  cy.get('.campaign-list-wrapper').find('.container').find('.stackable').children()
    .eq(2)
    .click();
  cy.wait('@getOfferingDetailsBySlug');
};

export const goTo506COfferingDetailScreen = () => {
  cy.get('div.public-pages').find('.campaign-list-wrapper').find('.container').get('svg', { timeout: 6000 })
    .should('not.exist');
  cy.get('.campaign-list-wrapper').find('.container').find('.stackable').children()
    .eq(3)
    .click();
  cy.wait('@getOfferingDetailsBySlug');
};

export const OfferingDetailFlow = () => {
  registerApiCall('getOfferingDetailsBySlug');
  goToCFOfferingDetailScreen();
};

export const Offering506CDetailFlow = ()=> {
  registerApiCall('getOfferingDetailsBySlug');
  goTo506COfferingDetailScreen();
}
