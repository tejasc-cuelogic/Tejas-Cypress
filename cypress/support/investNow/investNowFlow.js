import { OfferingListingFlow } from '../publicOffering/offeringListing';
import { OfferingDetailFlow } from '../publicOffering/offeringDetails';

export const investNowFlow = () => {
  cy.visit('/');
  OfferingListingFlow();
  OfferingDetailFlow();
};

