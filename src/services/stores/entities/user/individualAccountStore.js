import { action, observable } from 'mobx';
import { isEmpty, find } from 'lodash';
import { bankAccountStore, uiStore, userStore, userDetailsStore } from '../../index';
import { GqlClient as client } from '../../../../api/gqlApi';
import { createAccount, updateAccount } from '../../queries/account';
import { DataFormatter } from '../../../../helper';
import Helper from '../../../../helper/utility';

class IndividualAccountStore {
  @observable stepToBeRendered = '';

  @action
  setStepToBeRendered(step) {
    this.stepToBeRendered = step;
  }

  createAccount = (currentStep, formStatus = 'draft') => {
    uiStore.setProgress();
    let mutation = createAccount;
    const variables = {
      userId: userStore.currentUser.sub,
      accountAttributes: bankAccountStore.accountAttributes,
      status: formStatus,
      accountType: 'individual',
    };
    let actionPerformed = 'submitted';
    if (userDetailsStore.currentUser.data) {
      const accountDetails = find(userDetailsStore.currentUser.data.user.accounts, { accountType: 'individual' });
      if (accountDetails) {
        mutation = updateAccount;
        variables.accountId = accountDetails.accountId;
        actionPerformed = 'updated';
      }
    }
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation,
          variables,
        })
        .then((result) => {
          if (result.data.createInvestorAccount || formStatus === 'submit') {
            userDetailsStore.getUser(userStore.currentUser.sub);
          }
          if (formStatus === 'submit') {
            Helper.toast('Individual account created successfully.', 'success');
          } else if (currentStep) {
            Helper.toast(`${currentStep.name} ${actionPerformed} successfully.`, 'success');
          } else {
            Helper.toast(`Link Bank ${actionPerformed} successfully.`, 'success');
          }
          resolve(result);
        })
        .catch(action((err) => {
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          reject();
        }))
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @action
  populateData = (userData) => {
    if (!isEmpty(userData)) {
      const account = find(userData.accounts, { accountType: 'individual' });
      if (account) {
        if (account.accountDetails.plaidItemId) {
          const plaidAccDetails = account.accountDetails;
          bankAccountStore.setPlaidAccDetails(plaidAccDetails);
        } else {
          Object.keys(bankAccountStore.formLinkBankManually.fields).map((f) => {
            bankAccountStore.formLinkBankManually.fields[f].value = account.accountDetails[f];
            return bankAccountStore.formLinkBankManually.fields[f];
          });
          bankAccountStore.linkBankFormChange();
        }
        if (bankAccountStore.formLinkBankManually.meta.isValid ||
          !isEmpty(bankAccountStore.plaidAccDetails)) {
          this.setStepToBeRendered(2);
        }
      }
    }
  }
}
export default new IndividualAccountStore();
