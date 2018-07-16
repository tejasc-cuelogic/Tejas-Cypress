import { observable, action, computed } from 'mobx';
import isEmpty from 'lodash/isEmpty';
import { FormValidator as Validator } from '../../../../helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import { getPlaidAccountdata } from './../../queries/account';
import { uiStore, userStore, accountStore } from '../../index';
import {
  IND_LINK_BANK_MANUALLY, IND_BANK_ACC_SEARCH, IND_ADD_FUND,
} from '../../../../constants/account';

export class BankAccountStore {
  @observable bankLinkInterface = 'list';
  @observable plaidAccDetails = {};
  @observable plaidBankDetails = {};
  @observable bankListing = undefined;
  @observable depositMoneyNow = true;
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
  linkBankManuallyChange = (e, result) => {
    this.formLinkBankManually = Validator.onChange(
      this.formLinkBankManually,
      Validator.pullValues(e, result),
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

  getPlaidAccountData = () => new Promise((resolve, reject) => {
    client
      .mutate({
        mutation: getPlaidAccountdata,
        variables: {
          userId: userStore.currentUser.sub,
          plaidPublicToken: this.plaidAccDetails.public_token,
          plaidAccountId: this.plaidAccDetails.account_id,
          bankName: this.plaidAccDetails.institution.name,
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

  @action
  setAccountError = (form, key, error) => {
    this[form].fields[key].error = error;
  }

  @computed
  get isValidLinkBank() {
    return !isEmpty(this.plaidBankDetails);
  }

  @computed
  get isValidAddFunds() {
    const { error } = this.formAddFunds.fields.value;
    return isEmpty(error);
  }

  simpleErr = err => ({
    statusCode: err.statusCode,
    code: err.code,
    message: err.message,
  });
}

export default new BankAccountStore();

