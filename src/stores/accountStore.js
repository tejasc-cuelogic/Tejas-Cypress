import { observable, action, computed } from 'mobx';
import _ from 'lodash';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';

import {
  INVESTMENT_ACCOUNT_TYPES,
  INDIVIDUAL_ACCOUNT_CREATION,
  IRA_ACCOUNT_CREATION,
  ENTITY_ACCOUNT_CREATION,
  IND_ADD_FUND,
  IND_BANK_ACC_SEARCH,
  IND_LINK_BANK_MANUALLY,
} from '../constants/account';
import { GqlClient as client } from '../services/graphql';
import { getPlaidAccountdata } from '../stores/queries/account';
import userStore from './userStore';
import uiStore from './uiStore';

export class AccountStore {
  @observable accountType = {
    activeIndex: 0,
    type: INVESTMENT_ACCOUNT_TYPES[0],
  }

  @observable individualAccount = { ...INDIVIDUAL_ACCOUNT_CREATION }

  @observable iraAccount = { ...IRA_ACCOUNT_CREATION }

  @observable entityAccount = { ...ENTITY_ACCOUNT_CREATION }

  /**
   * Link BANK Account
   */
  validAccStatus = ['PASS', 'MANUAL_VERIFICATION_PENDING'];

  @observable
  bankListing = undefined;

  @observable
  plaidAccDetails = {};

  @observable
  plaidBankDetails = {};

  @observable
  nsAccId = '';

  @observable bankLinkInterface = 'list';

  @observable
  formLinkBankManually = {
    fields: { ...IND_LINK_BANK_MANUALLY }, meta: { isValid: false, error: '' },
  }

  @observable
  formAddFunds = {
    fields: { ...IND_ADD_FUND }, meta: { isValid: false, error: '' },
  };

  @observable
  formBankSearch = {
    fields: { ...IND_BANK_ACC_SEARCH }, meta: { isValid: false, error: '' },
  };

  @action
  setBankLinkInterface(mode) {
    this.bankLinkInterface = mode;
  }

  @action
  addFundChange = (e, { name, value }) => {
    this.onFieldChange('formAddFunds', name, value);
  };

  @computed
  get isValidAddFunds() {
    return _.isEmpty(this.formAddFunds.fields.value.error);
  }

  @computed
  get isValidLinkBankAccountForm() {
    return _.isEmpty(this.formLinkBankManually.fields.routingNumber.error) &&
    _.isEmpty(this.formLinkBankManually.fields.accountNumber.error);
  }

  @computed
  get isValidLinkBankPlaid() {
    if (_.isEmpty(this.plaidBankDetails)) {
      return false;
    }
    return true;
  }

  @action
  bankSearchChange = (e, { name, value }) => {
    this.onFieldChange('formBankSearch', name, value);
  };

  @action
  linkBankManuallyChange = (e, { name, value }) => {
    this.onFieldChange('formLinkBankManually', name, value);
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
  setAccountError = (form, key, error) => {
    this[form].fields[key].error = error;
  }

  @action
  setBankListing = (bankData) => {
    this.bankListing = bankData;
  }

  @action
  setPlaidAccDetails = (plaidAccDetails) => {
    this.plaidAccDetails = plaidAccDetails;
  }

  @action
  setPlaidBankDetails = (plaidBankDetails) => {
    this.plaidBankDetails = plaidBankDetails;
  }

  @action
  setNsAccId = (nsAccId) => {
    this.nsAccId = nsAccId;
  }

  /**
   * Link BANK Account
   */

  @computed
  get routeOnInvestmentTypeSelection() {
    return `${this.accountType.type}/AccountCreation`;
  }

  @action
  setAccountType(type) {
    this.accountType.activeIndex = type;
    this.accountType.type = INVESTMENT_ACCOUNT_TYPES[type];
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
            accountType: this.accountType.type,
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

  simpleErr = err => ({
    statusCode: err.statusCode,
    code: err.code,
    message: err.message,
  });
}
export default new AccountStore();
