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
  addFundChange = (e, result) => {
    this.formAddFunds = Validator.onChange(this.formAddFunds, Validator.pullValues(e, result));
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
    return !isEmpty(this.plaidBankDetails);
  }
}

export default new BankAccountStore();

