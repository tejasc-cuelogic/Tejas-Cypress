import { action, observable } from 'mobx';
import { isEmpty, find } from 'lodash';
import { bankAccountStore, uiStore, userStore, userDetailsStore } from '../../index';
import { GqlClient as client } from '../../../../api/gqlApi';
import { createAccount, updateAccount } from '../../queries/account';
import { DataFormatter } from '../../../../helper';
import Helper from '../../../../helper/utility';

class IndividualAccountStore {
  @observable stepToBeRendered = '';
  @observable investorAccId = '';

  @action
  setStepToBeRendered(step) {
    this.stepToBeRendered = step;
  }

  @action
  setInvestorAccId(id) {
    this.investorAccId = id;
  }

  /* eslint-disable class-methods-use-this */
  accountAttributes() {
    const accountAttributes = {};
    if (bankAccountStore.bankLinkInterface === 'list' && !isEmpty(bankAccountStore.plaidBankDetails)) {
      accountAttributes.plaidAccessToken = bankAccountStore.plaidBankDetails.plaidAccessToken;
      accountAttributes.plaidAccountId = bankAccountStore.plaidBankDetails.plaidAccountId;
      accountAttributes.bankName = bankAccountStore.plaidBankDetails.bankName;
      accountAttributes.accountNumber = bankAccountStore.plaidBankDetails.accountNumber;
      accountAttributes.routingNumber = bankAccountStore.plaidBankDetails.routingNumber;
      accountAttributes.plaidItemId = bankAccountStore.plaidBankDetails.plaidItemId;
    } else {
      const { accountNumber, routingNumber } = bankAccountStore.formLinkBankManually.fields;
      accountAttributes.accountNumber = accountNumber.value;
      accountAttributes.routingNumber = routingNumber.value;
    }
    return accountAttributes;
  }

  /* eslint-disable arrow-body-style */
  createAccount = (currentStep, formStatus = 'draft') => {
    uiStore.setProgress();
    let mutation = createAccount;
    let variables = {
      userId: userStore.currentUser.sub,
      accountAttributes: this.accountAttributes(),
      status: formStatus,
      accountType: 'individual',
    };
    let actionPerformed = 'submitted';
    if (userDetailsStore.currentUser.data) {
      const accountDetails = find(
        userDetailsStore.currentUser.data.user.accounts,
        { accountType: 'individual' },
      );
      if (accountDetails) {
        mutation = updateAccount;
        variables = {
          userId: userStore.currentUser.sub,
          accountId: accountDetails.accountId,
          accountAttributes: this.accountAttributes(),
          status: formStatus,
          accountType: 'individual',
        };
        actionPerformed = 'updated';
      }
    }
    if (this.investorAccId) {
      mutation = updateAccount;
      variables = {
        userId: userStore.currentUser.sub,
        accountId: this.investorAccId,
        accountAttributes: this.accountAttributes(),
        status: formStatus,
        accountType: 'individual',
      };
      actionPerformed = 'updated';
    }
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation,
          variables,
        })
        .then((result) => {
          if (result.data.createInvestorAccount) {
            this.setInvestorAccId(result.data.createInvestorAccount.accountId);
          }
          if (formStatus === 'submit') {
            userDetailsStore.getUser(userStore.currentUser.sub);
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
