import { observable, action, computed } from 'mobx';
import _ from 'lodash';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
import { GqlClient as client } from '../../../../api/gqlApi';
import { getPlaidAccountdata } from './../../queries/account';
import { uiStore, userStore, accountStore } from '../../index';
import {
  IND_LINK_BANK_MANUALLY,
  IND_BANK_ACC_SEARCH,
  IND_ADD_FUND,
} from '../../../../constants/account';

export class BankAccountStore {
  @observable bankLinkInterface = 'list';
  @observable plaidAccDetails = {};
  @observable plaidBankDetails = {};
  @observable bankListing = undefined;
  @observable depositMoneyNow = true;
  @observable formBankSearch = {
    fields: { ...IND_BANK_ACC_SEARCH }, meta: { isValid: false, error: '' },
  };
  @observable formAddFunds = {
    fields: { ...IND_ADD_FUND }, meta: { isValid: false, error: '' },
  };
  @observable formLinkBankManually = {
    fields: { ...IND_LINK_BANK_MANUALLY }, meta: { isValid: false, error: '' },
  }

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
  bankSearchChange = (e, { name, value }) => {
    this.onFieldChange('formBankSearch', name, value);
  };

  @action
  onFieldChange = (currentForm, field, value) => {
    const form = currentForm || 'formAddFunds';
    if (field) {
      if (typeof value !== 'undefined') {
        this[form].fields[field].value = value;
      }
    }
    const validation = new Validator(
      mapValues(this[form].fields, f => f.value),
      mapValues(this[form].fields, f => f.rule),
    );
    this[form].meta.isValid = validation.passes();
    this[form].meta.isDirty = true;
    if (field) {
      if (typeof value !== 'undefined') {
        this[form].fields[field].error = validation.errors.first(field);
      }
    }
  };

  @action
  addFundChange = (e, { name, value }) => {
    this.onFieldChange('formAddFunds', name, value);
  };

  @action
  resetLinkBankForm() {
    Object.keys(this.formLinkBankManually.fields).map((field) => {
      this.formLinkBankManually.fields[field].value = '';
      this.formLinkBankManually.fields[field].error = undefined;
      return true;
    });
    this.formLinkBankManually.meta.isValid = false;
    this.formLinkBankManually.meta.error = '';
  }

  @action
  linkBankManuallyChange = (e, { name, value }) => {
    this.onFieldChange('formLinkBankManually', name, value);
  };

  @action
  setPlaidAccDetails = (plaidAccDetails) => {
    this.plaidAccDetails = plaidAccDetails;
  }

  @action
  setPlaidBankDetails = (plaidBankDetails) => {
    this.plaidBankDetails = plaidBankDetails;
  }

  /* eslint-disable arrow-body-style */
  getPlaidAccountData = () => {
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: getPlaidAccountdata,
          variables: {
            userId: userStore.currentUser.sub,
            plaidPublicToken:
              _.isEmpty(this.plaidAccDetails) ? '' : this.plaidAccDetails.public_token,
            plaidAccountId:
              _.isEmpty(this.plaidAccDetails) ? '' : this.plaidAccDetails.account_id,
            bankName:
              _.isEmpty(this.plaidAccDetails) ? '' : this.plaidAccDetails.institution.name,
            accountType: accountStore.accountType.type,
          },
        })
        .then((result) => {
          this.setPlaidBankDetails(result.data.plaidGetValidatedAccountData);
          resolve();
        })
        .catch(action((err) => {
          uiStore.setErrors(this.simpleErr(err));
          reject();
        }));
    });
  }

  @action
  setAccountError = (form, key, error) => {
    this[form].fields[key].error = error;
  }

  @computed
  get isValidAddFunds() {
    return _.isEmpty(this.formAddFunds.fields.value.error);
  }

  @computed
  get isValidLinkBankAccountForm() {
    return _.isEmpty(this.formLinkBankManually.fields.routingNumber.error) &&
    _.isEmpty(this.formLinkBankManually.fields.accountNumber.error) &&
    !_.isEmpty(this.formLinkBankManually.fields.routingNumber.value) &&
    !_.isEmpty(this.formLinkBankManually.fields.accountNumber.value);
  }

  @computed
  get isValidLinkBankPlaid() {
    if (_.isEmpty(this.plaidBankDetails)) {
      return false;
    }
    return true;
  }

  simpleErr = err => ({
    statusCode: err.statusCode,
    code: err.code,
    message: err.message,
  });
}

export default new BankAccountStore();

