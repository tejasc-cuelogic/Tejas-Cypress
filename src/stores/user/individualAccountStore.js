import { action, observable } from 'mobx';
import _ from 'lodash';
import userDetailsStore from './userDetailsStore';
import accountStore from '../accountStore';
import userStore from '../userStore';
import uiStore from '../uiStore';
import { GqlClient as client } from '../../services/graphql';
import { createAccount, updateAccount } from '../queries/account';
import Helper from '../../helper/utility';

class IndividualAccountStore {
  @observable
  stepToBeRendered = '';

  @action
  setStepToBeRendered(step) {
    this.stepToBeRendered = step;
  }

  @observable
  investorAccId = '';

  @action
  setInvestorAccId(id) {
    this.investorAccId = id;
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
    uiStore.setProgress();
    userDetailsStore.getUser(userStore.currentUser.sub);
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
          }
          if (formStatus === 'submit') {
            Helper.toast('Entity account created successfully.', 'success');
          } else {
            Helper.toast(`${currentStep.name} ${actionPerformed} successfully.`, 'success');
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
          const plaidAccDetails = {};
          plaidAccDetails.account_id = account.accountDetails.accountNumber;
          accountStore.setPlaidAccDetails(plaidAccDetails);
        } else {
          Object.keys(accountStore.formLinkBankManually.fields).map((f) => {
            accountStore.formLinkBankManually.fields[f].value = account.accountDetails[f];
            return accountStore.formLinkBankManually.fields[f];
          });
          accountStore.onFieldChange('formLinkBankManually');
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
