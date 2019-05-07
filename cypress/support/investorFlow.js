import { fillSignUpFormAndProceed } from './signUp';
import { enterCodeAndConfirmEmail, confirmEmailAddressScreen } from './ConfirmEmail';
import { fillLegalFormAndProceed } from './identityVerification';
import { waitForAPIcall } from './common';

export const InvestorFlowProcess = () => {
  cy.visit('/');
  fillSignUpFormAndProceed();
  enterCodeAndConfirmEmail();
  cy.server();
  cy.route('POST', '**/graphql').as('graphql');
  cy.wait('@graphql');
  confirmEmailAddressScreen();
  fillLegalFormAndProceed();
  waitForAPIcall();
};