import { legalDetailsProcess, legalDetailsMeta, fillLegalDetailsForm } from '../../../support/investorSignup/identityVerification';
const NS_SITE_EMAIL_SUPPORT = 'support@nextseed.com';

describe('Legal Details Form', () => {
    it('should verify residential address', () => {
      // legalDetailsProcess();
    });

    it('should deny business address', () => {
      let legalData = { ...legalDetailsMeta }
      legalData.residentalStreet = '3 Greenway Plaza Houston, TX 77046'
      legalData.city = 'Houston'
      legalData.state = 'TEXAS'
      legalDetailsProcess();
      fillLegalDetailsForm(legalData)
      cy.get('form').find('button').contains('Verify my identity').click();
      cy.get('div.error').should('have.length', 1)
      // const errorMsg = `There was an issue with the information you submitted.
      // Please enter a valid residential address. If you have any questions please contact <a target="_blank" rel="noopener noreferrer" href="mailto:${NS_SITE_EMAIL_SUPPORT}">${NS_SITE_EMAIL_SUPPORT}</a>`
      // expect(cy.get('div.error').find('span').first(), 'first item').to.contain(errorMsg)
    });

    it('should bypass business address', () => {
    
    });
});