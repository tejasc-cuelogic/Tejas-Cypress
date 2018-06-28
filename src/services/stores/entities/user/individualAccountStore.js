import { action, observable } from 'mobx';
import _ from 'lodash';
import { accountStore, uiStore, userStore, userDetailsStore } from '../../index';
import { GqlClient as client } from '../../../../api/graphql';
import { createAccount, updateAccount } from '../../queries/account';
import Helper from '../../../../helper/utility';

class IndividualAccountStore {
  @observable
  stepToBeRendered = '';

  @action
  setStepToBeRendered(step) {
    this.stepToBeRendered = step;
  }

  @observable
  investorAccId = '';

  @observable
  depositMoneyNow = true;

  @observable
  formStatus = 'draft';

  @action
  setDepositMoneyNow(status) {
    this.depositMoneyNow = status;
  }

  @action
  setInvestorAccId(id) {
    this.investorAccId = id;
  }

  @action
  setFormStatus(formStatus) {
    this.formStatus = formStatus;
  }

  /* eslint-disable class-methods-use-this */
  accountAttributes() {
    const accountAttributes = {};
    if (accountStore.bankLinkInterface === 'list' && !_.isEmpty(accountStore.plaidBankDetails)) {
      accountAttributes.plaidAccessToken = accountStore.plaidBankDetails.plaidAccessToken;
      accountAttributes.plaidAccountId = accountStore.plaidBankDetails.plaidAccountId;
      accountAttributes.bankName = accountStore.plaidBankDetails.bankName;
      accountAttributes.accountNumber = accountStore.plaidBankDetails.accountNumber;
      accountAttributes.routingNumber = accountStore.plaidBankDetails.routingNumber;
      accountAttributes.plaidItemId = accountStore.plaidBankDetails.plaidItemId;
    } else {
      const { accountNumber, routingNumber } = accountStore.formLinkBankManually.fields;
      accountAttributes.accountNumber = accountNumber.value;
      accountAttributes.routingNumber = routingNumber.value;
    }
    return accountAttributes;
  }

  /* eslint-disable arrow-body-style */
  createAccount = (currentStep, formStatus = 'draft') => {
    if (formStatus === 'submit') {
      this.setFormStatus('submit');
    }
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
      const accountDetails = _.find(
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
            accountStore.setAccountTypeCreated(result.data.createInvestorAccount.accountType);
          } else {
            accountStore.setAccountTypeCreated(result.data.updateInvestorAccount.accountType);
          }
          if (formStatus === 'submit') {
            userDetailsStore.getUser(userStore.currentUser.sub);
            Helper.toast('Individual account created successfully.', 'success');
            uiStore.setDashboardWizardStep();
          } else if (currentStep) {
            Helper.toast(`${currentStep.name} ${actionPerformed} successfully.`, 'success');
          } else {
            Helper.toast(`Link Bank ${actionPerformed} successfully.`, 'success');
          }
          resolve(result);
        })
        .catch(action((err) => {
          uiStore.setErrors(this.simpleErr(err));
          reject();
        }))
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @action
  populateData = (userData) => {
    if (!_.isEmpty(userData)) {
      const account = _.find(
        userData.accounts,
        { accountType: 'individual' },
      );
      if (account) {
        if (account.accountDetails.plaidItemId) {
          const plaidAccDetails = account.accountDetails;
          accountStore.setPlaidAccDetails(plaidAccDetails);
        } else {
          Object.keys(accountStore.formLinkBankManually.fields).map((f) => {
            accountStore.formLinkBankManually.fields[f].value = account.accountDetails[f];
            return accountStore.formLinkBankManually.fields[f];
          });
          accountStore.onFieldChange('formLinkBankManually');
        }
        if (accountStore.formLinkBankManually.meta.isValid ||
          !_.isEmpty(accountStore.plaidAccDetails)) {
          this.setStepToBeRendered(2);
        }
      }
    }
  }

  simpleErr = err => ({
    statusCode: err.statusCode,
    code: err.code,
    message: err.message,
  });
}
export default new IndividualAccountStore();
