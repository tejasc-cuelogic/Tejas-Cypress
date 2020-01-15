import { registerApiCall } from '../common';

export const goToExploreCampaingsScreen = () => {
  registerApiCall('getOfferingList');
  cy.contains('Investment opportunities');
  cy.get('.header-wrap').get('.menu').get('.item ').contains('Investment opportunities')
    .click();
  cy.wait('@getOfferingList');
};

export const OfferingListingFlow = () => {
  goToExploreCampaingsScreen();
};

