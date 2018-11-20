import { observable, action, computed } from 'mobx';
import { isEmpty, isArray } from 'lodash';
import { FormValidator as Validator } from '../../../../helper';
import { accountStore } from '../../index';
import {
  IND_LINK_BANK_MANUALLY, IND_BANK_ACC_SEARCH, IND_ADD_FUND, FILTER_META,
} from '../../../../constants/account';

export class BankAccountStore {
  @observable bankLinkInterface = 'list';
  @observable plaidAccDetails = {};
  @observable plaidBankDetails = {};
  @observable bankListing = undefined;
  @observable depositMoneyNow = true;
  @observable showAddFunds = false;
  @observable formBankSearch = Validator.prepareFormObject(IND_BANK_ACC_SEARCH);
  @observable formAddFunds = Validator.prepareFormObject(IND_ADD_FUND);
  @observable formLinkBankManually = Validator.prepareFormObject(IND_LINK_BANK_MANUALLY);
  @observable FILTER_FRM = Validator.prepareFormObject(FILTER_META);
  @observable filters = false;
  @observable requestState = {
    filters: false,
    search: {
    },
  };

  @action
  setDepositMoneyNow(status) {
    this.depositMoneyNow = status;
  }

  @action
  setBankListing = (bankData) => {
    this.bankListing = bankData;
  }

  @action
  setBankLinkInterface(mode) {
    this.bankLinkInterface = mode;
  }

  @action
  bankSearchChange = (e, result) => {
    this.formBankSearch = Validator.onChange(this.formBankSearch, Validator.pullValues(e, result));
  };

  @action
  addFundChange = (values, field) => {
    this.formAddFunds =
    Validator.onChange(this.formAddFunds, { name: field, value: values.floatValue });
  };

  @action
  linkBankManuallyChange = (values, field) => {
    this.formLinkBankManually = Validator.onChange(
      this.formLinkBankManually,
      { name: field, value: values.value },
    );
  };

  @action
  linkBankFormChange = () => {
    this.formLinkBankManually = Validator.onChange(this.formLinkBankManually);
  };

  @action
  resetLinkBankForm() {
    Validator.resetFormData(this.formLinkBankManually);
  }

  @action
  setPlaidAccDetails = (plaidAccDetails) => {
    this.plaidAccDetails = plaidAccDetails;
  }

  @action
  setPlaidBankDetails = (plaidBankDetails) => {
    this.plaidBankDetails = plaidBankDetails;
  }

  /* eslint-disable camelcase */
  @computed
  get accountAttributes() {
    let accountAttributes = {};
    const plaidBankDetails = {};
    if (this.bankLinkInterface === 'list' && !isEmpty(this.plaidAccDetails)) {
      const {
        account_id,
        public_token,
        accountNumber,
        routingNumber,
      } = this.plaidAccDetails;
      if (account_id && public_token) {
        plaidBankDetails.linkedBank = {
          plaidPublicToken: public_token,
          plaidAccountId: account_id,
        };
      } else {
        plaidBankDetails.linkedBank = {
          accountNumber,
          routingNumber,
        };
      }
      accountAttributes = { ...plaidBankDetails };
    } else {
      const { accountNumber, routingNumber } = this.formLinkBankManually.fields;
      plaidBankDetails.linkedBank = {
        accountNumber: accountNumber.value,
        routingNumber: routingNumber.value,
      };
      accountAttributes = { ...plaidBankDetails };
    }
    const isValidAddFunds = this.formAddFunds.meta.isValid;
    if (isValidAddFunds) {
      accountAttributes.initialDepositAmount = this.formAddFunds.value.value;
    }
    return accountAttributes;
  }

  @computed
  get isValidLinkBank() {
    return !isEmpty(this.plaidAccDetails);
  }

  @action
  setShowAddFunds = () => {
    this.showAddFunds = true;
  }

  @action
  resetShowAddFunds = () => {
    this.showAddFunds = false;
  }

  @action
  resetPlaidAccData = () => {
    this.plaidAccDetails = {};
  }

  @action
  resetLinkBank = () => {
    Validator.resetFormData(this.formLinkBankManually);
    Validator.resetFormData(this.formAddFunds);
    if (accountStore.investmentAccType !== 'ira') {
      this.plaidAccDetails = {};
    }
    this.depositMoneyNow = true;
    this.showAddFunds = false;
  }

  @action
  initRequest = () => {
    this.data = [
      {
        id: 1,
        name: 'Alexandra Smith',
        createdAt: '7/12/2018',
        type: 'Plaid',
        transaction: '2424024249',
      },
      {
        id: 2,
        name: 'Johny Kaka',
        createdAt: '7/12/2018',
        type: 'Manual',
        transaction: '2534535435',
      },
    ];
  }

  @action
  initiateSearch = (srchParams) => {
    this.requestState.search = srchParams;
    this.initRequest();
  }
  @action
  setInitiateSrch = (name, value) => {
    if (name === 'startDate' || name === 'endDate') {
      this.requestState.search[name] = value;
      if (this.requestState.search.startDate !== '' && this.requestState.search.endDate !== '') {
        const srchParams = { ...this.requestState.search };
        this.initiateSearch(srchParams);
      }
    } else {
      const srchParams = { ...this.requestState.search };
      if ((isArray(value) && value.length > 0) || (typeof value === 'string' && value !== '')) {
        srchParams[name] = value;
      } else {
        delete srchParams[name];
      }
      this.initiateSearch(srchParams);
    }
  }
  @action
  toggleSearch = () => {
    this.filters = !this.filters;
  }

  @computed get loading() {
    return this.data.loading;
  }
  @computed get changeRequests() {
    return (this.data) || [];
  }

  @action
  resetFormData(form) {
    const resettedForm = Validator.resetFormData(this[form]);
    this[form] = resettedForm;
  }

  @action
  resetStoreData = () => {
    this.resetFormData('formBankSearch');
    this.resetFormData('formAddFunds');
    this.resetFormData('formLinkBankManually');
    this.bankLinkInterface = 'list';
    this.plaidAccDetails = {};
    this.plaidBankDetails = {};
    this.bankListing = undefined;
    this.depositMoneyNow = true;
    this.showAddFunds = false;
  }
}

export default new BankAccountStore();

