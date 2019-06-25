import { fillSignUpFormAndProceed, confirmEmailAddressScreen, confirmPhoneNumberScreen } from '../../basicSignUp/utility/basicSignup.utlity';
import { fillLegalFormAndProceed } from '../../identityVerification/utility/identityVerification.utlity';
import { enterCodeAndConfirm, applicationUnlock } from '../../../../support/common';
import { completeInvestorProfile } from '../../InvestorProfile/utlity/investorProfile.utlity';

export const InvestorFlowProcess = () => {
  cy.visit('/', { failOnStatusCode: false, timeout: 100000 });
  cy.wait(3000);
  applicationUnlock();
  cy.wait(1000);
  fillSignUpFormAndProceed();
  enterCodeAndConfirm();
  confirmEmailAddressScreen();
  fillLegalFormAndProceed();
  enterCodeAndConfirm();
  confirmPhoneNumberScreen();
  completeInvestorProfile();
};
