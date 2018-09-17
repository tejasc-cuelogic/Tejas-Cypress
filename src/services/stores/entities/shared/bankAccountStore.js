import { observable, action, computed } from 'mobx';
import { isEmpty } from 'lodash';
import { FormValidator as Validator } from '../../../../helper';
import {
  IND_LINK_BANK_MANUALLY, IND_BANK_ACC_SEARCH, IND_ADD_FUND,
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
  resetLinkBank = () => {
    Validator.resetFormData(this.formLinkBankManually);
    Validator.resetFormData(this.formAddFunds);
    this.plaidAccDetails = {};
    this.depositMoneyNow = true;
    this.showAddFunds = false;
  }
}

export default new BankAccountStore();

