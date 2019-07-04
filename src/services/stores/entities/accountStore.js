/* eslint-disable no-param-reassign */
import { observable, action, computed } from 'mobx';
import { find, get, capitalize } from 'lodash';
import { FormValidator } from '../../../helper';
import { bankAccountStore, individualAccountStore, iraAccountStore, entityAccountStore, userDetailsStore } from '../index';
import Helper from '../../../helper/utility';


import {
  INVESTMENT_ACCOUNT_TYPES,
  ACC_TYPE,
} from '../../../constants/account';

export class AccountStore {
  @observable INVESTMENT_ACC_TYPES = FormValidator.prepareFormObject(ACC_TYPE);

  @observable showAccountFrozenModal = false;

  @observable selectedClosedAccount = {};

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

  metaData = {
    data: {
      getInvestorCloseAccounts: [
        {
          userId: '2525a521-5e9a-4567-aa2b-f85be95a7a5f',
          accountId: '05ceee30-892a-11e9-a9f5-476846bbe123',
          accountType: 'INDIVIDUAL',
          accountStatus: 'CLOSED',
          linkedBank: {
            accountNumber: 'XXXXXX0008',
            routingNumber: 'r1/GUX+zgwBytzkIjfzILzxDbioH2+g9aeYzGAuJcWypu+h9Otpprlg6iErtojicdTQQEKxWvjpE4lZFv2QfbXr57gGI7os1g2a6rxeLsJndrDPKWGKQLLuFZ/1P+R44HI4KPRUuT7OE',
            bankName: 'WELLS FARGO BANK NA (ARIZONA)',
          },
          taxStatement: null,
          goldstar: {
            contactId: '167941',
            investorKey: null,
            accountNumber: '182822193',
          },
        },
        {
          userId: '2525a521-5e9a-4567-aa2b-f85be95a7a5f',
          accountId: '19394df0-9c0b-11e9-bbb7-d78dc8e3ace3',
          accountType: 'ENTITY',
          accountStatus: 'CLOSED',
          linkedBank: {
            accountNumber: 'XXXXXXXXXXXX0000',
            routingNumber: 'ChY2djX916OxUmqHLqJr4UlkhJngr06BheU53GmFl0QqnzPg3Tcdu0XanC5aKCoYfVq5h0STYKzvCfb+OQn5LePsltqRkMrYtHD7nozPHOaaWeNE88EbIUZ09hpdT3NOBkNbOTkCsEfI',
            bankName: 'Wells Fargo',
          },
          taxStatement: null,
          goldstar: {
            contactId: '168477',
            investorKey: null,
            accountNumber: '182822434',
          },
        },
        {
          userId: '2525a521-5e9a-4567-aa2b-f85be95a7a5f',
          accountId: '19394df0-9c0b-11e9-bbb7-d78dc8e3ace3',
          accountType: 'INDIVIDUAL',
          accountStatus: 'CLOSED',
          linkedBank: {
            accountNumber: 'XXXXXXXXXXXX0000',
            routingNumber: 'ChY2djX916OxUmqHLqJr4UlkhJngr06BheU53GmFl0QqnzPg3Tcdu0XanC5aKCoYfVq5h0STYKzvCfb+OQn5LePsltqRkMrYtHD7nozPHOaaWeNE88EbIUZ09hpdT3NOBkNbOTkCsEfI',
            bankName: 'Wells Fargo',
          },
          taxStatement: null,
          goldstar: {
            contactId: '168477',
            investorKey: null,
            accountNumber: '182822434',
          },
        },
        {
          userId: '2525a521-5e9a-4567-aa2b-f85be95a7a5f',
          accountId: '19394df0-9c0b-11e9-bbb7-d78dc8e3ace3',
          accountType: 'IRA',
          accountStatus: 'CLOSED',
          linkedBank: {
            accountNumber: 'XXXXXXXXXXXX0000',
            routingNumber: 'ChY2djX916OxUmqHLqJr4UlkhJngr06BheU53GmFl0QqnzPg3Tcdu0XanC5aKCoYfVq5h0STYKzvCfb+OQn5LePsltqRkMrYtHD7nozPHOaaWeNE88EbIUZ09hpdT3NOBkNbOTkCsEfI',
            bankName: 'Wells Fargo',
          },
          taxStatement: null,
          goldstar: {
            contactId: '168477',
            investorKey: null,
            accountNumber: '182822434',
          },
        },
      ],
    },
  }

  @action
  setInvestmentAccType = (e, result) => {
    this.INVESTMENT_ACC_TYPES = FormValidator.onChange(
      this.INVESTMENT_ACC_TYPES,
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

  @computed
  get sortedAccounts() {
    const filteredAccounts = ['individual', 'ira', 'entity'].map((accType) => {
      const closedAccounts = this.metaData.data.getInvestorCloseAccounts.filter(closedAccount => closedAccount.accountType === accType.toUpperCase());
      return closedAccounts.map((closedAccount, index) => (
        { details: {
          ...closedAccount,
          accountType: `${capitalize(closedAccount.accountType)} ${(index + 10).toString(36).toUpperCase()}`,
          to: `${closedAccount.accountType} ${(index + 10).toString(36).toUpperCase()}`.replace(/ +/g, '-').toLowerCase(),
        } }
      ));
    });
    return [].concat(...filteredAccounts);
  }

  @computed
  get sortedNavAccounts() {
    return this.sortedAccounts.map(closedAccount => ({ title: closedAccount.details.accountType, to: closedAccount.details.to }));
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
