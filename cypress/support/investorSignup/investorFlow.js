import { fillSignUpFormAndProceed } from './signUp';
import { confirmEmailAddressScreen } from './ConfirmEmail';
import { confirmPhoneNumberScreen } from './ConfirmPhoneNumber';
import { fillLegalFormAndProceed } from './identityVerification';
import { enterCodeAndConfirm, ApplicationUnlock } from '../common';
import { completeInvestorProfile } from './InvestorProfile';

export const InvestorFlowProcess = () => {
  cy.visit('/', { failOnStatusCode: false });
  cy.wait(5000)
  ApplicationUnlock();
  fillSignUpFormAndProceed();
  enterCodeAndConfirm();
  confirmEmailAddressScreen();
  fillLegalFormAndProceed();
  enterCodeAndConfirm();
  confirmPhoneNumberScreen();
  completeInvestorProfile();
}
