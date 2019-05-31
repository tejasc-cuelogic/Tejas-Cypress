import { OfferingListingFlow } from '../publicOffering/offeringListing';

export const investNowFlow = () => {
  cy.visit('/');
  OfferingListingFlow();
};

