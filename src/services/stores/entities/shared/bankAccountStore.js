import { observable, action, computed } from 'mobx';
import graphql from 'mobx-apollo';
import { isEmpty, isArray, map, find } from 'lodash';
import { FormValidator as Validator, ClientDb } from '../../../../helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import { accountStore, userDetailsStore, uiStore, userStore } from '../../index';
import { changeLinkedBank, changeBankManually, cancelBankRequest } from '../../queries/banking';
import Helper from '../../../../helper/utility';
import {
  IND_LINK_BANK_MANUALLY, IND_BANK_ACC_SEARCH, IND_ADD_FUND, FILTER_META,
} from '../../../../constants/account';
import validationService from '../../../../api/validation';
import { getlistLinkedBankUsers } from '../../queries/bankAccount';

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
  @observable CurrentAccountId;
  @observable isPlaidBankVerified = false;
  @observable newPlaidAccDetails = {};
  @observable isLinkedBankCancelRequest = false;
  @observable activeBankPladLogo = null;
  @observable pendingBankPladLogo = null;
  @observable db;
  @observable requestState = {
    skip: 0,
    page: 1,
    perPage: 10,
    displayTillIndex: 10,
    filters: false,
    search: {
    },
  };

  @action
  setDb = (data) => {
    this.db = ClientDb.initiateDb(data);
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
  setCurrentAccount = (accountType) => {
    if (!isEmpty(userDetailsStore.userDetails)) {
      const { roles } = userDetailsStore.userDetails;
      const accountData = find(roles, { name: accountType });
      this.plaidAccDetails = accountData.details && accountData.details.linkedBank ?
        accountData.details.linkedBank : {};
      this.CurrentAccountId = accountData.details && accountData.details.accountId;
    }
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
  setNewPlaidBankDetails = (objVal) => {
    this.newPlaidAccDetails = objVal;
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
      accountAttributes.initialDepositAmount = this.formAddFunds.fields.value.value;
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
      const variables = { page: 1, limit: 100 };
      this.data = graphql({
        client,
        query: getlistLinkedBankUsers,
        variables,
        onFetch: (res) => {
          this.setDb(res.listLinkedBankUsers.linkedBankList);
        },
      });
    }

  @action
  initiateSearch = (srchParams) => {
    this.requestState.search = srchParams;
    this.initRequest();
  }
  @action
  setInitiateSrch = (name, value) => {
    const srchParams = { ...this.requestState.search };
    if ((isArray(value) && value.length > 0) || (typeof value === 'string' && value !== '')) {
      srchParams[name] = value;
    } else {
      delete srchParams[name];
    }
    this.initiateSearch(srchParams);
  }
  @action
  toggleSearch = () => {
    this.filters = !this.filters;
  }

  @computed get loading() {
    return this.data.loading;
  }
  @computed get changeRequests() {
    return (this.db && this.db.length &&
      this.db.slice(this.requestState.skip, this.requestState.displayTillIndex)) || [];
  }

  @action
  resetFormData(form) {
    const resettedForm = Validator.resetFormData(this[form]);
    this[form] = resettedForm;
  }

  @action
  pageRequest = ({ skip, page }) => {
    this.requestState.displayTillIndex = this.requestState.perPage * page;
    this.requestState.page = page;
    this.requestState.skip = skip;
  }

  @action
  validateAddFunds = () => {
    map(this.formAddFunds.fields, (value) => {
      const { key } = value;
      const { errors } = validationService.validate(value);
      Validator.setFormError(
        this.formAddFunds,
        key,
        errors && errors[key][0],
      );
    });
  }

  @computed get count() {
    return (this.changeRequests && this.changeRequests.length) || 0;
  }

  @action
  changeBankPlaid = (pladiAccountDetails) => {
    // const data = Validator.ExtractValues(this.formLinkBankManually.fields);
    const data = {
      plaidPublicToken: pladiAccountDetails.public_token,
      plaidAccountId: pladiAccountDetails.account_id,
      accountId: this.CurrentAccountId,
    };
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: changeLinkedBank,
          variables: data,
        })
        .then(() => {
          Helper.toast('Request for Change linked Bank initiated.', 'success');
          this.resetFormData('formLinkBankManually');
          userDetailsStore.getUser(userStore.currentUser.sub);
          resolve();
        })
        .catch((error) => {
          uiStore.setErrors(error.message);
          Helper.toast(error.message, 'error');
          reject(error.message);
        });
      // .catch (() => Helper.toast('Error', 'error'));
    });
  }

  @action
  changeBankManually = () => {
    const data = Validator.ExtractValues(this.formLinkBankManually.fields);
    const updatedData = {
      bankRoutingNumber: data.routingNumber,
      bankAccountNumber: data.accountNumber,
      accountId: this.CurrentAccountId,
    };
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: changeBankManually,
          variables: updatedData,
        })
        .then(() => {
          Helper.toast('Request for Change linked Bank initiated.', 'success');
          this.resetFormData('formLinkBankManually');
          userDetailsStore.getUser(userStore.currentUser.sub);
          resolve();
        })
        .catch((error) => {
          uiStore.setErrors(error.message);
          Helper.toast(error.message, 'error');
          reject(error.message);
        });
      // .catch((error) => Helper.toast('Error', 'error'));
    });
  }

  @action
  cancelBankChangeRequest = () => {
    const canceldData = {
      accountId: this.CurrentAccountId,
    };
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: cancelBankRequest,
          variables: canceldData,
        })
        .then(() => {
          userDetailsStore.getUser(userStore.currentUser.sub);
          resolve();
        })
        .catch((error) => {
          uiStore.setErrors(error.message);
          Helper.toast(error.message, 'error');
          reject(error.message);
        })
        .finally(() => {
          this.setLinkedBankCancelRequestStatus(false);
        });
    });
  }

  @action
  resetStoreData = () => {
    this.resetFormData('formBankSearch');
    this.resetFormData('formAddFunds');
    this.resetFormData('formLinkBankManually');
    this.bankLinkInterface = 'list';
    this.plaidAccDetails = {};
    this.plaidBankDetails = {};
    this.newPlaidAccDetails = {};
    this.bankListing = undefined;
    this.depositMoneyNow = true;
    this.showAddFunds = false;
  }
  @action
  setPlaidBankVerificationStatus = (booleanValue) => {
    this.isPlaidBankVerified = booleanValue;
  }
  @action
  setLinkedBankCancelRequestStatus = (booleanValue) => {
    this.isLinkedBankCancelRequest = booleanValue;
  }
  @action
  setActiveBankPlaidLogo = (logo) => {
    this.activeBankPladLogo = logo;
  }
  @action
  setPendingeBankPlaidLogo = (logo) => {
    this.pendingBankPladLogo = logo;
  }
}

export default new BankAccountStore();

