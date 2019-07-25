import { legalDetailsProcess, fillLegalDetailsForm } from './utility/identityVerification.utlity';
// const NS_SITE_EMAIL_SUPPORT = 'support@nextseed.com';

describe('Legal Details', () => {
  beforeEach(() => {
    legalDetailsProcess();
  });

  it('should verify residential address', () => {
  });

  it.skip('should deny business address', () => {
    cy.fixture('investor/identityVerification.json').then((legalData) => {
      const { withBusinessAddress, legalDetailsMeta } = legalData;
      fillLegalDetailsForm({ ...legalDetailsMeta, ...withBusinessAddress })
      cy.get('form').find('button').contains('Verify my identity').click();
      cy.get('div.error').should('have.length', 1)
    });
  });

  it.skip('should bypass business address', () => {
  
  });
});