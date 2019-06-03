import { registerApiCall } from '../common';

export const goToOfferingDetailScreen = () => {
  cy.get('.campaign-list-wrapper').find('.container').find('.stackable').children()
    .eq(4)
    .click()
  cy.wait('@getOfferingDetailsBySlug');
};

export const OfferingDetailFlow = () => {
  registerApiCall('getOfferingDetailsBySlug');
  goToOfferingDetailScreen();
};

