import { action, observable } from 'mobx';
import { isEmpty, find } from 'lodash';
import { bankAccountStore, uiStore, userStore, userDetailsStore, investmentLimitStore } from '../../index';
// import AccCreationHelper from '../../../../modules/private/investor
// accountSetup/containers/accountCreation/helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import { submitinvestorAccount, updateAccount } from '../../queries/account';
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

  submitAccount = () => {
    const accountDetails = find(userDetailsStore.currentUser.data.user.roles, { name: 'individual' });
    uiStore.setProgress();
    const payLoad = {
      accountId: accountDetails.details.accountId,
      accountType: 'INDIVIDUAL',
    };
    return new Promise((resolve, reject) => {
      bankAccountStore.isValidOpeningDepositAmount(false).then(() => {
        client
          .mutate({
            mutation: submitinvestorAccount,
            variables: payLoad,
          })
          .then(() => (resolve()))
          .catch(() => {
            uiStore.setProgress(false);
            reject();
          });
      });
    });
  }

  createAccount = (currentStep, formStatus = 'PARTIAL') => {
    if (bankAccountStore.formAddFunds.meta.isFieldValid) {
      uiStore.setProgress();
      let mutation = updateAccount;
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
        bankAccountStore.isValidOpeningDepositAmount(false).then(() => {
          client
            .mutate({
              mutation,
              variables,
            })
            .then(action((result) => {
              if (result.data.upsertInvestorAccount) {
                userDetailsStore.getUser(userStore.currentUser.sub);
                const { linkedBank } = result.data.upsertInvestorAccount;
                bankAccountStore.setPlaidAccDetails(linkedBank);
              }
              if (currentStep) {
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
              uiStore.setProgress(false);
              resolve(result);
            }))
            .catch(action((err) => {
              uiStore.setProgress(false);
              uiStore.setErrors(DataFormatter.getSimpleErr(err));
              reject();
            }));
          // .finally(() => {
          //   uiStore.setProgress(false);
          // });
        })
          .catch(() => {
            uiStore.setProgress(false);
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
        // if (!this.isManualLinkBankSubmitted && (
        //   bankAccountStore.formLinkBankManually.meta.isValid ||
        //   !isEmpty(bankAccountStore.plaidAccDetails))) {
        //   const getIndividualStep = AccCreationHelper.individualSteps();
        //   this.setStepToBeRendered(getIndividualStep.summary);
        //   this.setIsManualLinkBankSubmitted(false);
        // }
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
