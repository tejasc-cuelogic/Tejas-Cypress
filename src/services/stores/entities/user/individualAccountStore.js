import { action, observable } from 'mobx';
import { isEmpty, find, get } from 'lodash';
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
  @observable individualAccId = null;
  @observable showProcessingModal = false;
  @observable isFormSubmitted = false;

  @action
  setIsManualLinkBankSubmitted = (status) => {
    this.isManualLinkBankSubmitted = status;
  }

  @action
  setStepToBeRendered = (step) => {
    this.stepToBeRendered = step;
  }

  createIndividualGoldStarInvestor = (accountId, userId = userStore.currentUser.sub) =>
    new Promise((resolve, reject) => {
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
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          reject(err);
        });
    });

  submitAccount = () => {
    const accountDetails = find(userDetailsStore.currentUser.data.user.roles, { name: 'individual' });
    const payLoad = {
      accountId: get(accountDetails, 'details.accountId') || this.individualAccId,
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
            this.createIndividualGoldStarInvestor(payLoad.accountId).then((res) => {
              uiStore.setProgress(false);
              if (!res.data.createIndividualGoldStarInvestor) {
                this.setFieldValue('showProcessingModal', true);
                Helper.toast('Individual account submitted successfully.', 'success');
              } else {
                Helper.toast('Individual account created successfully.', 'success');
              }
              bankAccountStore.resetStoreData();
              this.isFormSubmitted = true;
              resolve();
            }).catch((err) => {
              uiStore.setErrors(DataFormatter.getSimpleErr(err));
              if (Helper.matchRegexWithString(/\bNetwork(?![-])\b/, DataFormatter.getSimpleErr(err).message)) {
                this.setFieldValue('showProcessingModal', true);
              }
              uiStore.setProgress(false);
              reject();
            });
          } else {
            uiStore.setProgress(false);
            this.setFieldValue('showProcessingModal', true);
            bankAccountStore.resetStoreData();
            this.isFormSubmitted = true;
            Helper.toast('Individual account submitted successfully.', 'success');
            resolve();
          }
        }).catch((err) => {
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          console.log('Error', err);
          uiStore.resetcreateAccountMessage();
          uiStore.setProgress(false);
          reject();
        });
    });
  }
  @action
  setFieldValue = (field, val) => {
    this[field] = val;
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
  createAccount = (currentStep) => {
    uiStore.setProgress();
    const mutation = upsertInvestorAccount;
    const variables = {
      accountAttributes: {
        ...bankAccountStore.accountAttributes,
        ...this.investmentLimitsAttributes(),
      },
      accountType: 'INDIVIDUAL',
    };
    const actionPerformed = 'submitted';
    if (userDetailsStore.currentUser.data) {
      const accountDetails = find(userDetailsStore.currentUser.data.user.roles, { name: 'individual' });
      if (accountDetails || this.individualAccId) {
        variables.accountId = get(accountDetails, 'details.accountId') || this.individualAccId;
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
            userDetailsStore.getUser(userStore.currentUser.sub);
            if (result.data.upsertInvestorAccount) {
              this.individualAccId = result.data.upsertInvestorAccount.accountId;
              const { linkedBank } = result.data.upsertInvestorAccount;
              bankAccountStore.setPlaidAccDetails(linkedBank);
            }
            const { isValid } = bankAccountStore.formAddFunds.meta;
            if (currentStep) {
              // FormValidator.setIsDirty(bankAccountStore.formAddFunds, false);
              if (!bankAccountStore.depositMoneyNow) {
                // Helper.toast(`Link Bank ${actionPerformed} successfully.`, 'success');
              } else if (currentStep.name === 'Add funds' && isValid) {
                Helper.toast(`${currentStep.name} ${actionPerformed} successfully.`, 'success');
              }
            } else {
              // Helper.toast(`Link Bank ${actionPerformed} successfully.`, 'success');
            }
            // this.setStepToBeRendered(currentStep.stepToBeRendered);
            uiStore.setErrors(null);
            uiStore.setProgress(false);
            resolve(result);
          }))
          .catch(action((err) => {
            uiStore.setErrors(DataFormatter.getSimpleErr(err));
            uiStore.setProgress(false);
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

  @action
  populateData = (userData) => {
    if (Helper.matchRegexWithUrl([/\baccount-creation(?![-])\b/])) {
      if (!isEmpty(userData) && !this.formStatus) {
        const account = find(userData.roles, { name: 'individual' });
        const { isValid } = bankAccountStore.formEntityAddFunds.meta;
        if (account && account.details) {
          if (isValid) {
            bankAccountStore.formEntityAddFunds.fields.value.value =
            account.details.initialDepositAmount;
          }
          if (account.details.linkedBank) {
            const plaidAccDetails = account.details.linkedBank;
            bankAccountStore.setPlaidAccDetails(plaidAccDetails);
          } else {
            Object.keys(bankAccountStore.formLinkBankManually.fields).map((f) => {
              bankAccountStore.formLinkBankManually.fields[f].value = account.details.linkedBank[f];
              return bankAccountStore.formLinkBankManually.fields[f];
            });
            bankAccountStore.linkBankFormChange();
          }
          bankAccountStore.validateAddFunds();
          bankAccountStore.validateAddfundsAmount();
          const renderStep = (bankAccountStore.isAccountPresent && this.stepToBeRendered === 0)
            ? 2 : this.stepToBeRendered;
          this.setStepToBeRendered(renderStep);
          // uiStore.setProgress(false);
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
    uiStore.setProgress(false);
  }

  @action
  resetStoreData = () => {
    this.stepToBeRendered = 0;
    this.submited = false;
    this.individualAccId = null;
  }
}
export default new IndividualAccountStore();
