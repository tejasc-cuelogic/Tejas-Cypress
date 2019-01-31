import { action, observable } from 'mobx';
import { isEmpty, find } from 'lodash';
import { bankAccountStore, uiStore, userStore, userDetailsStore, investmentLimitStore, referralsStore } from '../../index';
import AccCreationHelper from '../../../../modules/private/investor/accountSetup/containers/accountCreation/helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import { createIndividual, updateAccount, crowdPayAccountNotifyGs } from '../../queries/account';
import { DataFormatter } from '../../../../helper';
import Helper from '../../../../helper/utility';

class IndividualAccountStore {
  @observable stepToBeRendered = 0;
  @observable submited = false;
  @observable isManualLinkBankSubmitted = false;

  @action
  setIsManualLinkBankSubmitted = (status) => {
    this.isManualLinkBankSubmitted = status;
  }

  @action
  setStepToBeRendered(step) {
    this.stepToBeRendered = step;
  }

  createAccount = (currentStep, formStatus = 'PARTIAL') => {
    if (bankAccountStore.formAddFunds.meta.isFieldValid) {
      uiStore.setProgress();
      let mutation = createIndividual;
      const variables = {
        accountAttributes: bankAccountStore.accountAttributes,
        accountStatus: formStatus,
        accountType: 'INDIVIDUAL',
      };
      let actionPerformed = 'submitted';
      if (userDetailsStore.currentUser.data) {
        const accountDetails = find(userDetailsStore.currentUser.data.user.roles, { name: 'individual' });
        if (accountDetails) {
          mutation = updateAccount;
          variables.accountId = accountDetails.details.accountId;
          actionPerformed = 'updated';
        }
      }
      return new Promise((resolve, reject) => {
        bankAccountStore.checkOpeningDepositAmount().then(() => {
          client
            .mutate({
              mutation,
              variables,
            })
            .then(action((result) => {
              if (result.data.createInvestorAccount || formStatus === 'FULL') {
                userDetailsStore.getUser(userStore.currentUser.sub);
              }
              if (formStatus !== 'FULL') {
                const accountId = result.data.createInvestorAccount ?
                  result.data.createInvestorAccount.accountId :
                  result.data.updateInvestorAccount ?
                    result.data.updateInvestorAccount.accountId : null;
                if (accountId) {
                  const data = {
                    annualIncome:
                      userDetailsStore.userDetails.investorProfileData.annualIncome[0].income,
                    netWorth: userDetailsStore.userDetails.investorProfileData.netWorth,
                    otherRegCfInvestments: 0,
                  };
                  investmentLimitStore.updateInvestmentLimits(data, accountId);
                }
              }
              if (result.data.createInvestorAccount) {
                const { linkedBank } = result.data.createInvestorAccount;
                bankAccountStore.setPlaidAccDetails(linkedBank);
              } else {
                const { linkedBank } = result.data.updateInvestorAccount;
                bankAccountStore.setPlaidAccDetails(linkedBank);
              }
              if (formStatus === 'FULL') {
                Helper.toast('Individual account created successfully.', 'success');
                referralsStore.userPartialFullSignupWithReferralCode(userStore.currentUser.sub, 'FULL');
                this.submited = true;
                if (userDetailsStore.userDetails && userDetailsStore.userDetails.cip &&
                  userDetailsStore.userDetails.cip.failType &&
                  userDetailsStore.userDetails.cip.failType !== null) {
                  client.mutate({
                    mutation: crowdPayAccountNotifyGs,
                    variables: {
                      userId: userStore.currentUser.sub,
                      accountId: result.data.createInvestorAccount ?
                        result.data.createInvestorAccount.accountId :
                        result.data.updateInvestorAccount.accountId,
                    },
                  })
                    .then(() => {})
                    .catch(action((err) => {
                      uiStore.setErrors(DataFormatter.getSimpleErr(err));
                      reject();
                    }));
                }
              } else if (currentStep) {
                this.setStepToBeRendered(currentStep.stepToBeRendered);
                if (!bankAccountStore.depositMoneyNow) {
                  Helper.toast(`Link Bank ${actionPerformed} successfully.`, 'success');
                } else {
                  Helper.toast(`${currentStep.name} ${actionPerformed} successfully.`, 'success');
                }
              } else {
                Helper.toast(`Link Bank ${actionPerformed} successfully.`, 'success');
              }
              uiStore.setErrors(null);
              resolve(result);
            }))
            .catch(action((err) => {
              uiStore.setErrors(DataFormatter.getSimpleErr(err));
              reject();
            }))
            .finally(() => {
              uiStore.setProgress(false);
            });
        })
          .catch(() => {
            reject();
          });
      });
    }
    return null;
  }

  @action
  populateData = (userData) => {
    if (!isEmpty(userData) && !this.formStatus) {
      const account = find(userData.roles, { name: 'individual' });
      if (account && account.details) {
        bankAccountStore.formAddFunds.fields.value.value = account.details.initialDepositAmount;
        if (account.details.linkedBank.plaidItemId) {
          const plaidAccDetails = account.details.linkedBank;
          bankAccountStore.setPlaidAccDetails(plaidAccDetails);
        } else {
          Object.keys(bankAccountStore.formLinkBankManually.fields).map((f) => {
            bankAccountStore.formLinkBankManually.fields[f].value = account.details.linkedBank[f];
            return bankAccountStore.formLinkBankManually.fields[f];
          });
          bankAccountStore.linkBankFormChange();
        }
        if (!this.isManualLinkBankSubmitted && (
          bankAccountStore.formLinkBankManually.meta.isValid ||
          !isEmpty(bankAccountStore.plaidAccDetails))) {
          const getIndividualStep = AccCreationHelper.individualSteps();
          this.setStepToBeRendered(getIndividualStep.summary);
          this.setIsManualLinkBankSubmitted(false);
        }
      }
    }
  }

  @action
  resetStoreData = () => {
    this.stepToBeRendered = 0;
    this.submited = false;
    this.isManualLinkBankSubmitted = false;
  }
}
export default new IndividualAccountStore();
