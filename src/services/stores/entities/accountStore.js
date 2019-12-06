/* eslint-disable no-param-reassign */
import { observable, action, computed } from 'mobx';
import { find, get, capitalize, orderBy } from 'lodash';
import graphql from 'mobx-apollo';
import moment from 'moment';
import { FormValidator, DataFormatter } from '../../../helper';
import { bankAccountStore, individualAccountStore, iraAccountStore, userStore, entityAccountStore, userDetailsStore, uiStore, identityStore } from '../index';
import { GqlClient as client } from '../../../api/gqlApi';
// eslint-disable-next-line import/named
import { getInvestorCloseAccounts, closeInvestorAccount, updateToAccountProcessing } from '../queries/account';
import Helper from '../../../helper/utility';
import {
  INVESTMENT_ACCOUNT_TYPES,
  ACC_TYPE,
  // eslint-disable-next-line import/named
  CLOSE_INVESTOR_ACCOUNT,
} from '../../../constants/account';

export class AccountStore {
  @observable INVESTMENT_ACC_TYPES = FormValidator.prepareFormObject(ACC_TYPE);

  @observable CLOSE_ACCOUNT_FRM = FormValidator.prepareFormObject(CLOSE_INVESTOR_ACCOUNT);

  @observable showAccountFrozenModal = false;

  @observable selectedClosedAccount = {};

  @observable closedAccounts = {};

  @observable ACC_TYPE_MAPPING = {
    0: {
      store: individualAccountStore,
      location: 1,
      accountId: 'individualAccountId',
      name: 'individual',
      linkbankValue: 0,
    },
    1: {
      store: iraAccountStore, location: 3, accountId: 'iraAccountId', name: 'ira', linkbankValue: 3,

    },
    2: {
      store: entityAccountStore,
      location: 5,
      accountId: 'entityAccountId',
      name: 'entity',
      linkbankValue: 5,
    },
  };

  @action
  setInvestmentAccType = (e, result) => {
    this.INVESTMENT_ACC_TYPES = FormValidator.onChange(
      this.INVESTMENT_ACC_TYPES,
      FormValidator.pullValues(e, result),
    );
  }

  @action
  formChange = (e, result, form) => {
    this[form] = FormValidator.onChange(
      this[form],
      FormValidator.pullValues(e, result),
    );
  }

  @action
  setFieldValue = (field, value) => {
    this[field] = value;
  }

  accountToastMessage = (currentStep, actionName, formName = 'formAddFunds') => {
    const { isValid, isDirty } = bankAccountStore[formName].meta;
    if (isValid && isDirty) {
      const actionPerformed = isValid ? 'submitted' : actionName;
      Helper.toast(`${(isValid && isDirty) ? 'Add Funds' : currentStep.name} ${actionPerformed} successfully.`, 'success');
    } else if (currentStep.name !== 'Link bank') {
      Helper.toast(`${currentStep.name} ${actionName} successfully.`, 'success');
    }
  }

  @action
  getInvestorCloseAccounts = (userId = undefined) => {
    this.closedAccounts = graphql({
      client,
      query: getInvestorCloseAccounts,
      fetchPolicy: 'network-only',
      variables: { userId: userId || userDetailsStore.getDetailsOfUser.id },
    });
  }

  @action
  closeInvestorAccount = (userId, accountId, accountType, reason) => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: closeInvestorAccount,
          variables: {
            userId,
            accountId,
            accountType,
            reason,
          },
          refetchQueries: [{ query: getInvestorCloseAccounts, variables: { userId } }],
        })
        .then((res) => {
          if (get(res, 'data.closeInvestorAccount.errorMessage')) {
            Helper.toast(get(res, 'data.closeInvestorAccount.errorMessage'), 'error');
          } else {
            Helper.toast(`${accountType === 'IRA' ? accountType : accountType.toLowerCase()} account closed successfully.`, 'success');
          }
          resolve(res);
        })
        .catch(() => { reject(); Helper.toast('Error while closing account', 'error'); uiStore.setProgress(false); });
    });
  }

  @action
  accountProcessingWrapper = async (accountType, match) => {
    const accountDetails = find(userDetailsStore.currentUser.data.user.roles, { name: accountType });
    const accountvalue = accountType === 'individual' ? 0 : accountType === 'ira' ? 1 : 2;
    const { store } = this.ACC_TYPE_MAPPING[accountvalue];
    const accountId = get(accountDetails, 'details.accountId') || store[`${accountType}AccountId`];
    await this.updateToAccountProcessing(accountId, accountvalue);
    window.sessionStorage.removeItem('cipErrorMessage');
    const url = store.showProcessingModal ? `${match.url}/${accountType}/processing` : '/dashboard/summary';
    store.setFieldValue('showProcessingModal', false);
    return url;
  }

  @action
  updateToAccountProcessing = async (accountId, accountType) => {
    try {
      identityStore.setFieldValue('signUpLoading', true);
      await client
        .mutate({
          mutation: updateToAccountProcessing,
          variables: {
            accountId,
            error: window.sessionStorage.getItem('cipErrorMessage'),
          },
        });
      this.ACC_TYPE_MAPPING[accountType].store.setFieldValue('showProcessingModal', true);
      await userDetailsStore.getUser(userStore.currentUser.sub);
      bankAccountStore.resetStoreData();
      this.ACC_TYPE_MAPPING[accountType].store.isFormSubmitted = true;
      Helper.toast(`${capitalize(this.ACC_TYPE_MAPPING[accountType].name)} account submitted successfully.`, 'success');
      identityStore.setFieldValue('signUpLoading', false);
      uiStore.removeOneFromProgressArray('submitAccountLoader');
    } catch (err) {
      Helper.toast('Unable to submit Account', 'error');
      identityStore.setFieldValue('signUpLoading', false);
      uiStore.resetUIAccountCreationError(DataFormatter.getSimpleErr(err));
      uiStore.removeOneFromProgressArray('submitAccountLoader');
    }
  }

  @computed
  get sortedAccounts() {
    const filteredAccounts = ['individual', 'ira', 'entity'].map((accType) => {
      if (get(this.closedAccounts, 'data.getInvestorCloseAccounts')) {
        const closedAccounts = this.closedAccounts.data.getInvestorCloseAccounts.filter(closedAccount => closedAccount.accountType === accType.toUpperCase());
        const sortAccBydate = orderBy(closedAccounts, o => (o.closed.date ? moment(new Date(o.closed.date)).unix() : ''), ['desc']);
        return sortAccBydate.map((closedAccount, index) => (
          { details: {
            ...closedAccount,
            title: `${closedAccount.accountType === 'IRA' ? closedAccount.accountType : capitalize(closedAccount.accountType)} ${(index + 10).toString(36).toUpperCase()}`,
            to: `${closedAccount.accountType} ${(index + 10).toString(36).toUpperCase()}`.replace(/ +/g, '-').toLowerCase(),
          } }
        ));
      }
      return [];
    });
    return [].concat(...filteredAccounts);
  }

  @computed
  get sortedNavAccounts() {
    return this.sortedAccounts.map(closedAccount => ({ title: closedAccount.details.title, to: closedAccount.details.to }));
  }

  getStepValue = currentStep => (bankAccountStore.isAccountPresent ? currentStep.stepToBeRendered : currentStep.linkBankStepValue)

  @action setSelectedClosedAccount = (accountType) => {
    this.selectedClosedAccount = this.sortedAccounts.find(account => (account.details.to === accountType));
  }

  getAccountIdByType = () => {
    const accountValue = this.INVESTMENT_ACC_TYPES.fields.accType.value;
    const accountDetails = find(
      get(userDetailsStore, 'currentUser.data.user.roles'),
      { name: this.ACC_TYPE_MAPPING[accountValue].name },
    );
    const { accountId } = this.ACC_TYPE_MAPPING[accountValue];
    return this.ACC_TYPE_MAPPING[accountValue].store[accountId]
      || get(accountDetails, 'details.accountId');
  }

  @action
  setAccTypeChange = (value) => {
    this.INVESTMENT_ACC_TYPES = FormValidator.onChange(
      this.INVESTMENT_ACC_TYPES,
      { name: 'accType', value },
    );
  }

  @action
  setInvestmentAccTypeValues = (values) => {
    this.INVESTMENT_ACC_TYPES.fields.accType.values = values;
  }

  @computed
  get investmentAccType() {
    const type = this.INVESTMENT_ACC_TYPES.fields.accType.value;
    return INVESTMENT_ACCOUNT_TYPES[type];
  }

  @action
  resetStoreData = () => {
    this.INVESTMENT_ACC_TYPES.fields.accType.values = ACC_TYPE.accType.values;
    this.INVESTMENT_ACC_TYPES.fields.accType.value = 0;
  }

  @action
  closeAccountForm = () => {
    this.CLOSE_ACCOUNT_FRM = FormValidator.prepareFormObject(CLOSE_INVESTOR_ACCOUNT);
  }

  isAccFrozen = status => ['HARD_FREEZE', 'SOFT_FREEZE'].includes(status)

  isAccHardFrozen = status => ['HARD_FREEZE'].includes(status)

  isAccSoftFrozen = status => ['SOFT_FREEZE'].includes(status)
}
export default new AccountStore();
