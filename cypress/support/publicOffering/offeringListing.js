export const goToExploreCampaingsScreen = () => {
  cy.contains('Explore Campaigns');
  cy.get('.header-wrap').get('.menu').get('.item ').contains('Explore Campaigns')
    .click();
};

export const OfferingListingFlow = () => {
  goToExploreCampaingsScreen();
};

