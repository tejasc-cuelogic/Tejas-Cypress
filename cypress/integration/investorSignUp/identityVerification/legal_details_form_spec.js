import { legalDetailsProcess } from '../../../support/investorSignup/identityVerification';
describe('Legal Details Form', () => {
    before(() => {
      legalDetailsProcess();
    });

    it('should verify residential address', () => {
      
    });

    it('should deny business address', () => {
      
    });

    it('should bypass business address', () => {
    
    });
});