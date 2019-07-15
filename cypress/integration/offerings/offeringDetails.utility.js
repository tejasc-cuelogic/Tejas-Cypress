import { registerApiCall, isAbortRemainingTestCases } from '../common.utility';

export const goToCFOfferingDetailScreen = () => {
  cy.fixture('investor/offeringForInvestment.json').then((offerings) => {
    cy.get('div.public-pages').find('.campaign-list-wrapper').find('.container').get('svg')
      .should('not.exist');
    cy.getOffering(offerings.offeringCF.id);
    cy.wait('@getOfferingDetailsBySlug');
  });
};

export const goTo506COfferingDetailScreen = () => {
  cy.fixture('investor/offeringForInvestment.json').then((offerings) => {
    cy.get('div.public-pages').find('.campaign-list-wrapper').find('.container').get('svg')
      .should('not.exist');
    cy.getOffering(offerings.offering506C.id);
    cy.wait('@getOfferingDetailsBySlug');
  });
};

export const OfferingDetailFlow = () => {
  try {
    registerApiCall('getOfferingDetailsBySlug');
    goToCFOfferingDetailScreen();
  } catch (err) {
    cy.addWindowLocalStorageKey('abortRemainingTestCase', true);
  }
};

export const Offering506CDetailFlow = () => {
  try {
    if (isAbortRemainingTestCases() !== 'true') {
      registerApiCall('getOfferingDetailsBySlug');
      goTo506COfferingDetailScreen();
    }
  } catch (err) {
    cy.addWindowLocalStorageKey('abortRemainingTestCase', true);
  }
}
