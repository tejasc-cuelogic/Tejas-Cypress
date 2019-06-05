import { fillSignUpFormAndProceed } from './signUp';
import { confirmEmailAddressScreen } from './ConfirmEmail';
import { confirmPhoneNumberScreen } from './ConfirmPhoneNumber';
import { fillLegalFormAndProceed } from './identityVerification';
import { enterCodeAndConfirm } from '../common';
import { completeInvestorProfile } from './InvestorProfile';

export const InvestorFlowProcess = () => {
  cy.visit('http://1702-cypress-test-framework-poc.s3-website-us-east-1.amazonaws.com/password-protected', { failOnStatusCode: false });
  cy.wait(10000)
  fillSignUpFormAndProceed();
  enterCodeAndConfirm();
  confirmEmailAddressScreen();
  fillLegalFormAndProceed();
  enterCodeAndConfirm();
  confirmPhoneNumberScreen();
  completeInvestorProfile();
}
