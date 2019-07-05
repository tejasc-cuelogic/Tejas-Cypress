import { registerApiCall, getJSONDataFromFixtures } from '../common.utility';

export const goToCFOfferingDetailScreen = () => {
  cy.fixture('investor/offeringForInvestment.json').then((offerings) => {
    cy.get('div.public-pages').find('.campaign-list-wrapper').find('.container').get('svg', { timeout: 6000 })
      .should('not.exist');
    cy.getOffering(offerings.offeringCF.id);
    cy.wait('@getOfferingDetailsBySlug');
  });
};

export const goTo506COfferingDetailScreen = () => {
  cy.fixture('investor/offeringForInvestment.json').then((offerings) => {
    cy.get('div.public-pages').find('.campaign-list-wrapper').find('.container').get('svg', { timeout: 6000 })
      .should('not.exist');
    cy.getOffering(offerings.offering506C.id);
    cy.wait('@getOfferingDetailsBySlug');
  });
};

export const OfferingDetailFlow = () => {
  registerApiCall('getOfferingDetailsBySlug');
  goToCFOfferingDetailScreen();
};

export const Offering506CDetailFlow = () => {
  registerApiCall('getOfferingDetailsBySlug');
  goTo506COfferingDetailScreen();
}
