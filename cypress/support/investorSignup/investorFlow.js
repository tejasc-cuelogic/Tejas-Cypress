import { fillSignUpFormAndProceed } from './signUp';
import { confirmEmailAddressScreen } from './ConfirmEmail';
import { confirmPhoneNumberScreen } from './ConfirmPhoneNumber';
import { fillLegalFormAndProceed } from './identityVerification';
import { enterCodeAndConfirm } from '../common';
import { completeInvestorProfile } from './InvestorProfile';

export const InvestorFlowProcess = () => {
  Cypress.on('window:before:load', (win) => {
    delete win.fetch
  });
  cy.visit('/');
  fillSignUpFormAndProceed();
  enterCodeAndConfirm();
  confirmEmailAddressScreen();
  fillLegalFormAndProceed();
  enterCodeAndConfirm();
  confirmPhoneNumberScreen();
  completeInvestorProfile();
};
