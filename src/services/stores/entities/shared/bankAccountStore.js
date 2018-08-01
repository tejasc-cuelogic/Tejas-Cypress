import { observable, action, computed } from 'mobx';
import { omit, isEmpty } from 'lodash';
import { FormValidator as Validator, DataFormatter } from '../../../../helper';
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

  @computed
  get accountAttributes() {
    let accountAttributes = {};
    if (this.bankLinkInterface === 'list' && !isEmpty(this.plaidBankDetails)) {
      const plaidBankDetails = omit(this.plaidBankDetails, '__typename');
      accountAttributes = { ...plaidBankDetails };
    } else {
      const { accountNumber, routingNumber } = this.formLinkBankManually.fields;
      accountAttributes.accountNumber = accountNumber.value;
      accountAttributes.routingNumber = routingNumber.value;
    }
    return accountAttributes;
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
          accountType: accountStore.investmentAccType,
        },
      })
      .then((result) => {
        this.setPlaidBankDetails(result.data.plaidGetValidatedAccountData);
        resolve();
      })
      .catch(action((err) => {
        uiStore.setErrors(DataFormatter.getSimpleErr(err));
        reject();
      }));
  });

  @computed
  get isValidLinkBank() {
    return !isEmpty(this.plaidAccDetails) || !isEmpty(this.plaidBankDetails);
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
    this.plaidBankDetails = {};
    this.depositMoneyNow = true;
    this.showAddFunds = false;
  }
}

export default new BankAccountStore();

