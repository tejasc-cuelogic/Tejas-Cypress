import { action, observable } from 'mobx';
import { isEmpty, find, get } from 'lodash';
import { bankAccountStore, uiStore, userDetailsStore, individualAccountStore, userStore } from '../../index';
// import AccCreationHelper from '../../../../modules/private/investor
// accountSetup/containers/accountCreation/helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import { submitinvestorAccount, upsertInvestorAccount } from '../../queries/account';
import { DataFormatter } from '../../../../helper';
import Helper from '../../../../helper/utility';
// import userStore from '../userStore';

class IndividualAccountStore {
  @observable stepToBeRendered = 0;
  @observable submited = false;
  @observable isManualLinkBankSubmitted = false;
  @observable individualAccId = null;

  @action
  setIsManualLinkBankSubmitted = (status) => {
    this.isManualLinkBankSubmitted = status;
  }

  @action
  setStepToBeRendered = (step) => {
    this.stepToBeRendered = step;
  }

  submitAccount = () => {
    const accountDetails = find(userDetailsStore.currentUser.data.user.roles, { name: 'individual' });
    const payLoad = {
      accountId: get(accountDetails, 'details.accountId') || this.individualAccId,
      accountType: 'INDIVIDUAL',
    };
    return new Promise((resolve, reject) => {
      bankAccountStore.isValidOpeningDepositAmount(false).then(() => {
        uiStore.setProgress();
        client
          .mutate({
            mutation: submitinvestorAccount,
            variables: payLoad,
          })
          .then(() => {
            uiStore.setProgress(false);
            bankAccountStore.resetLinkBank();
            Helper.toast('Individual account submitted successfully.', 'success');
            resolve();
          })
          .catch((err) => {
            uiStore.setErrors(DataFormatter.getSimpleErr(err));
            uiStore.setProgress(false);
            reject();
          });
      });
    });
  }

  investmentLimitsAttributes = () => {
    const data = {};
    const userdetails = userDetailsStore.userDetails;
    data.limits = {
      income:
      userdetails.investorProfileData.annualIncome[0].income,
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
            if (currentStep) {
              // FormValidator.setIsDirty(bankAccountStore.formAddFunds, false);
              if (!bankAccountStore.depositMoneyNow) {
                Helper.toast(`Link Bank ${actionPerformed} successfully.`, 'success');
              } else {
                Helper.toast(`${currentStep.name} ${actionPerformed} successfully.`, 'success');
              }
            } else {
              Helper.toast(`Link Bank ${actionPerformed} successfully.`, 'success');
            }
            this.setStepToBeRendered(currentStep.stepToBeRendered);
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
    if (!isEmpty(userData) && !this.formStatus) {
      const account = find(userData.roles, { name: 'individual' });
      if (account && account.details) {
        bankAccountStore.formAddFunds.fields.value.value = account.details.initialDepositAmount;
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
        const renderStep = bankAccountStore.isAccountEmpty ? this.stepToBeRendered : 2;
        individualAccountStore.setStepToBeRendered(renderStep);
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
    this.individualAccId = null;
  }
}
export default new IndividualAccountStore();
