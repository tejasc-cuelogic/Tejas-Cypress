import { action, observable } from 'mobx';
import { isEmpty, find, get, isNull } from 'lodash';
import { bankAccountStore, uiStore, userDetailsStore, userStore } from '../../index';
// import AccCreationHelper from '../../../../modules/private/investor
// accountSetup/containers/accountCreation/helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import { submitinvestorAccount, upsertInvestorAccount, createIndividualGoldStarInvestor } from '../../queries/account';
import { DataFormatter } from '../../../../helper';
import Helper from '../../../../helper/utility';
// import userStore from '../userStore';


class IndividualAccountStore {
  @observable stepToBeRendered = 0;

  @observable submited = false;

  @observable isManualLinkBankSubmitted = false;

  @observable individualAccountId = null;

  @observable showProcessingModal = false;

  @observable isFormSubmitted = false;

  @observable apiCall = false;

  retry = 0;

  retryGoldStar = 0;

  @action
  setIsManualLinkBankSubmitted = (status) => {
    this.isManualLinkBankSubmitted = status;
  }

  @action
  setStepToBeRendered = (step) => {
    this.stepToBeRendered = step;
  }

  createIndividualGoldStarInvestor = (accountId, userId = userStore.currentUser.sub) => new Promise((resolve, reject) => {
    client
      .mutate({
        mutation: createIndividualGoldStarInvestor,
        variables: {
          userId,
          accountId,
        },
      })
      .then(res => resolve(res))
      .catch((err) => {
        reject(err);
      });
  });

  submitAccount = () => {
    const accountDetails = find(userDetailsStore.currentUser.data.user.roles, { name: 'individual' });
    const payLoad = {
      accountId: get(accountDetails, 'details.accountId') || this.individualAccountId,
      accountType: 'INDIVIDUAL',
    };
    return new Promise((resolve, reject) => {
      uiStore.setProgress();
      client
        .mutate({
          mutation: submitinvestorAccount,
          variables: payLoad,
        })
        .then((res1) => {
          if (res1.data.submitInvestorAccount !== 'The account is Processing') {
            this.createGoldstarAccount(payLoad, resolve, reject);
          } else {
            uiStore.setProgress(false);
            this.setFieldValue('showProcessingModal', true);
            bankAccountStore.resetStoreData();
            this.isFormSubmitted = true;
            resolve();
          }
        }).catch((err) => {
          console.log('Error', err);
          reject(err);
          if (Helper.matchRegexWithString(/\bNetwork(?![-])\b/, err.message)) {
            if (this.retry < 1) {
              this.retry += 1;
              this.submitAccount().then(() => uiStore.removeOneFromProgressArray('submitAccountLoader'));
            } else {
              uiStore.resetUIAccountCreationError(DataFormatter.getSimpleErr(err));
            }
          } else {
            uiStore.resetUIAccountCreationError(DataFormatter.getSimpleErr(err));
          }
        });
    });
  }

  @action
  setFieldValue = (field, val) => {
    this[field] = val;
  }

  createGoldstarAccount = (payLoad, resolve, reject) => {
    this.createIndividualGoldStarInvestor(payLoad.accountId).then((res) => {
      uiStore.setProgress(false);
      if (res.data.createIndividualGoldStarInvestor) {
        this.setFieldValue('showProcessingModal', false);
        bankAccountStore.resetStoreData();
        this.isFormSubmitted = true;
      }
      resolve();
    }).catch((err) => {
      console.log('Error', err);
      if (Helper.matchRegexWithString(/\bNetwork(?![-])\b/, err.message)) {
        if (this.retryGoldStar < 1) {
          this.retryGoldStar += 1;
          this.createGoldstarAccount(payLoad, resolve, reject);
        } else {
          resolve();
        }
      } else {
        uiStore.resetUIAccountCreationError(DataFormatter.getSimpleErr(err));
      }
    });
  }

  investmentLimitsAttributes = () => {
    const data = {};
    const userdetails = userDetailsStore.userDetails;
    data.limits = {
      income: userdetails.investorProfileData.annualIncome[0].income,
      netWorth: userDetailsStore.userDetails.investorProfileData.netWorth,
      otherContributions: 0,
    };
    return data;
  }

  @action
  createAccount = currentStep => new Promise((resolve, reject) => {
    uiStore.setProgress();
    if (!this.apiCall) {
      this.setFieldValue('apiCall', true);
      const mutation = upsertInvestorAccount;
      const variables = {
        accountAttributes: {
          ...bankAccountStore.accountAttributes,
          ...this.investmentLimitsAttributes(),
        },
        accountType: 'INDIVIDUAL',
      };
      if (userDetailsStore.currentUser.data) {
        const accountDetails = find(userDetailsStore.currentUser.data.user.roles, { name: 'individual' });
        if (accountDetails || this.individualAccountId) {
          variables.accountId = get(accountDetails, 'details.accountId') || this.individualAccountId;
        }
      }
      bankAccountStore.isValidOpeningDepositAmount(false).then(() => {
        client
          .mutate({
            mutation,
            variables,
          })
          .then(action((result) => {
            if (result.data.upsertInvestorAccount) {
              this.individualAccountId = result.data.upsertInvestorAccount.accountId;
              const { linkedBank } = result.data.upsertInvestorAccount;
              bankAccountStore.setPlaidAccDetails(linkedBank);
              this.setFieldValue('apiCall', false);
            }
            uiStore.setErrors(null);
            uiStore.setProgress(false);
            resolve(result);
          }))
          .catch(action((err) => {
            this.setFieldValue('apiCall', false);
            if (currentStep.name === 'Link bank') {
              bankAccountStore.setPlaidAccDetails({});
            }
            uiStore.setErrors(DataFormatter.getSimpleErr(err));
            uiStore.setProgress(false);
            reject();
          }));
      })
        .catch(() => {
          uiStore.setProgress(false);
          reject();
        });
    }
  });

  @action
  populateData = (userData) => {
    if (Helper.matchRegexWithUrl([/\bindividual(?![-])\b/])) {
      if (!isEmpty(userData)) {
        const account = find(userData.roles, { name: 'individual' });
        if (account && account.details) {
          if (!isEmpty(account.details.initialDepositAmount)) {
            bankAccountStore.formAddFunds.fields.value.value = account.details.initialDepositAmount;
          }
          if (account.details.linkedBank && isEmpty(bankAccountStore.plaidAccDetails)) {
            const plaidAccDetails = account.details.linkedBank;
            if (!bankAccountStore.isAccountPresent) {
              bankAccountStore.setPlaidAccDetails(plaidAccDetails);
            }
          } else {
            Object.keys(bankAccountStore.formLinkBankManually.fields).map((f) => {
              const { details } = account;
              if (details.linkedBank && details.linkedBank[f] !== '') {
                bankAccountStore.formLinkBankManually.fields[f].value = details.linkedBank[f];
                return bankAccountStore.formLinkBankManually.fields[f];
              }
              return null;
            });
            bankAccountStore.linkBankFormChange();
          }
          bankAccountStore.validateAddFunds();
          bankAccountStore.validateAddfundsAmount();
          if (!bankAccountStore.isAccountPresent) {
            this.setStepToBeRendered(0);
          } else if (isNull(account.details.initialDepositAmount)) {
            this.setStepToBeRendered(1);
          } else {
            this.setStepToBeRendered(2);
          }
        }
      }
    }
    uiStore.setProgress(false);
  }

  @action
  resetStoreData = () => {
    this.stepToBeRendered = 0;
    this.submited = false;
    this.individualAccountId = null;
    this.retry = 0;
    this.retryGoldStar = 0;
    this.isFormSubmitted = false;
    this.apiCall = false;
  }
}
export default new IndividualAccountStore();
