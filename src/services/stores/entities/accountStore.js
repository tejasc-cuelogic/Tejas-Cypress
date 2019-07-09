/* eslint-disable no-param-reassign */
import { observable, action, computed } from 'mobx';
import { find, get, capitalize } from 'lodash';
import graphql from 'mobx-apollo';
import { FormValidator } from '../../../helper';
import { bankAccountStore, individualAccountStore, iraAccountStore, entityAccountStore, userDetailsStore } from '../index';
import { GqlClient as client } from '../../../api/gqlApi';
import { getInvestorCloseAccounts } from '../queries/account';
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
      accountId: 'individualAccId',
      name: 'individual',
    },
    1: {
      store: iraAccountStore, location: 3, accountId: 'iraAccountId', name: 'ira',
    },
    2: {
      store: entityAccountStore,
      location: 5,
      accountId: 'entityAccountId',
      name: 'entity',
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

  @computed
  get sortedAccounts() {
    const filteredAccounts = ['individual', 'ira', 'entity'].map((accType) => {
      if (get(this.closedAccounts, 'data.getInvestorCloseAccounts')) {
        const closedAccounts = this.closedAccounts.data.getInvestorCloseAccounts.filter(closedAccount => closedAccount.accountType === accType.toUpperCase());
        return closedAccounts.map((closedAccount, index) => (
          { details: {
            ...closedAccount,
            title: `${capitalize(closedAccount.accountType)} ${(index + 10).toString(36).toUpperCase()}`,
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
}
export default new AccountStore();
