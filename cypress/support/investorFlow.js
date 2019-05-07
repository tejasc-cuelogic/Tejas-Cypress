import { fillSignUpFormAndProceed } from './signUp';
import { confirmEmailAddressScreen } from './ConfirmEmail';
import { confirmPhoneNumberScreen } from './ConfirmPhoneNumber';
import { fillLegalFormAndProceed } from './identityVerification';
import { waitForAPIcall, enterCodeAndConfirm } from './common';
import { completeInvestorProfile } from './InvestorProfile'

export const InvestorFlowProcess = () => {
  cy.visit('/');
  fillSignUpFormAndProceed();
  enterCodeAndConfirm();
  waitForAPIcall('confirmEmail');
  confirmEmailAddressScreen();
  fillLegalFormAndProceed();
  waitForAPIcall('LegalDetails');
  enterCodeAndConfirm();
  waitForAPIcall('confirmPhone');
  confirmPhoneNumberScreen();
  completeInvestorProfile();
};
