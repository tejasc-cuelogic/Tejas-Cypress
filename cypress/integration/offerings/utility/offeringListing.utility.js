import { registerApiCall } from '../../common.utility';

export const goToExploreCampaingsScreen = () => {
  registerApiCall('getOfferingList');
  cy.contains('Explore Campaigns');
  cy.get('.header-wrap').get('.menu').get('.item ').contains('Explore Campaigns')
    .click();
  cy.wait('@getOfferingList');
};

export const OfferingListingFlow = () => {
  goToExploreCampaingsScreen();
};
