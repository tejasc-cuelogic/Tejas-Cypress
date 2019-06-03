import { registerApiCall } from '../common';

export const goToOfferingDetailScreen = () => {
  registerApiCall('getOfferingDetailsBySlug');
  cy.get('.campaign-list-wrapper').get('.stackable>div').eq(2).click({ force: true });
  cy.wait('@getOfferingDetailsBySlug');
};

export const OfferingDetailFlow = () => {
  goToOfferingDetailScreen();
};

