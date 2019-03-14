import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { isEmpty, map, uniqWith, isEqual, find, get } from 'lodash';
import { FormValidator as Validator, ClientDb, DataFormatter } from '../../../../helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import { accountStore, userDetailsStore, uiStore, userStore, iraAccountStore } from '../../index';
import { linkBankRequestPlaid, linkBankRequestManual, linkBankRequestCancel, getDecryptedRoutingNumber } from '../../queries/banking';
import Helper from '../../../../helper/utility';
import {
  IND_LINK_BANK_MANUALLY, IND_BANK_ACC_SEARCH, IND_ADD_FUND, FILTER_META,
} from '../../../../constants/account';
import validationService from '../../../../api/validation';
import { getlistLinkedBankUsers, isValidOpeningDepositAmount, linkBankRequestApprove, linkBankRequestDeny } from '../../queries/bankAccount';
import individualAccountStore from '../user/individualAccountStore';

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
  @observable manualLinkBankSubmitted = false;
  @observable activeBankPladLogo = null;
  @observable pendingBankPladLogo = null;
  @observable db;
  @observable linkbankSummary = false;
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
    this.db = ClientDb.initiateDb(data, null, null, null, true);
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
  setIsManualLinkBankSubmitted = (submitted = true) => {
    this.manualLinkBankSubmitted = submitted;
  }

  @action
  formChange = (e, result, form) => {
    this[form] = Validator.onChange(
      this[form],
      Validator.pullValues(e, result),
    );
  }

  @action
  setBankLinkInterface(mode) {
    this.resetLinkBankForm();
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
    this.setIsManualLinkBankSubmitted();
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
  resetAddFundsForm() {
    Validator.resetFormData(this.formAddFunds);
  }

  changeLinkbank = () => {
    this.setBankLinkInterface('list');
    this.setLinkBankSummary(false);
    this.resetShowAddFunds();
    uiStore.clearErrors();
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
        accountType,
        account,
      } = this.plaidAccDetails;
      if (account_id && public_token) {
        plaidBankDetails.linkedBank = {
          plaidPublicToken: public_token,
          plaidAccountId: account_id,
          accountType: account.subtype.toUpperCase(),
        };
      } else {
        plaidBankDetails.linkedBank = {
          accountNumber,
          routingNumber,
          accountType: accountType.toUpperCase(),
        };
      }
      accountAttributes = { ...plaidBankDetails };
    } else {
      const { accountNumber, routingNumber, accountType } = this.formLinkBankManually.fields;
      plaidBankDetails.linkedBank = {
        accountNumber: accountNumber.value,
        routingNumber: routingNumber.value,
        accountType: accountType.value.toUpperCase(),
      };
      accountAttributes = { ...plaidBankDetails };
    }
    const { value } = this.formAddFunds.fields.value;
    accountAttributes.initialDepositAmount = this.depositMoneyNow && value !== '' ?
      value : -1;
    return accountAttributes;
  }

  @computed
  get isValidLinkBank() {
    return !isEmpty(this.plaidAccDetails);
  }

  @computed
  get isPlaidDirty() {
    return (this.isAccountPresent &&
    this.formLinkBankManually.meta.isDirty &&
    this.formAddFunds.meta.isDirty &&
    !this.linkbankSummary) ||
    this.showAddFunds;
  }

  @action
  accountTypeChange = (e, result) => {
    this.formChange(e, result, 'formLinkBankManually');
  }

  @action
  setShowAddFunds = (funds = true) => {
    this.showAddFunds = funds;
  }

  @action
  setLinkBankSummary = (showbank = true) => {
    this.linkbankSummary = showbank;
  }

  @action
  resetShowAddFunds = () => {
    this.showAddFunds = false;
  }

  @computed get isAccountPresent() {
    return !isEmpty(this.plaidAccDetails.accountNumber) ||
      !isEmpty(this.plaidAccDetails.public_token);
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
    } else if (accountStore.investmentAccType === 'ira' && iraAccountStore.stepToBeRendered < 3) {
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
          if (res && !this.data.loading) {
            this.setDb(res.listLinkedBankUsers.linkedBankList);
          }
        },
      });
    }

  @action
  setInitiateSrch = (name, value) => {
    this.requestState.search[name] = value;
    this.initiateFilters();
  }
  @action
  initiateFilters = () => {
    const { keyword } = this.requestState.search;
    let resultArray = [];
    if (keyword) {
      this.setDb(get(this.data, 'data.listLinkedBankUsers.linkedBankList') || []);
      ClientDb.filterFromNestedObjs(['firstName', 'lastName'], keyword);
      resultArray = ClientDb.getDatabase();
      this.setDb(uniqWith(resultArray, isEqual));
      this.requestState.page = 1;
      this.requestState.skip = 0;
    } else {
      this.setDb(get(this.data, 'data.listLinkedBankUsers.linkedBankList') || []);
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
    return (this.db && this.db.length &&
      toJS(this.db.slice(this.requestState.skip, this.requestState.displayTillIndex))) || [];
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

  @action
  validateForm = (form) => {
    Validator.validateForm(this[form], false);
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
          mutation: linkBankRequestPlaid,
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
        }).finally(() => {
          this.setLinkedBankCancelRequestStatus(false);
          uiStore.setProgress(false);
        });
      // .catch (() => Helper.toast('Error', 'error'));
    });
  }

  @action
  linkBankRequestManual = () => {
    const data = Validator.ExtractValues(this.formLinkBankManually.fields);
    const updatedData = {
      bankRoutingNumber: data.routingNumber,
      bankAccountNumber: data.accountNumber,
      accountId: this.CurrentAccountId,
    };
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: linkBankRequestManual,
          variables: updatedData,
        })
        .then(() => {
          Helper.toast('Request for Change linked Bank initiated.', 'success');
          this.resetFormData('formLinkBankManually');
          userDetailsStore.getUser(userStore.currentUser.sub);
          resolve();
          uiStore.setProgress(false);
        })
        .catch((error) => {
          uiStore.setProgress(false);
          uiStore.setErrors(error.message);
          Helper.toast(error.message, 'error');
          reject(error.message);
        }).finally(() => {
          this.setLinkedBankCancelRequestStatus(false);
        });
      // .catch((error) => Helper.toast('Error', 'error'));
    });
  }

  @action
  linkBankRequestCancel = () => {
    const canceldData = {
      accountId: this.CurrentAccountId,
    };
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: linkBankRequestCancel,
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
          uiStore.setProgress(false);
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
    this.isManualLinkBankSubmitted = false;
    this.linkbankSummary = false;
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
  isEncrypted = (n, ref) => {
    if (n) {
      return ((ref === 'routingNo' && n.length > 9) ||
        n.includes('X'));
    }
    return false;
  }

  @action
  isValidOpeningDepositAmount = (resetProgress = true) => {
    uiStore.setProgress();
    const variables = {
      accountType: accountStore.investmentAccType.toUpperCase(),
      accountAttributes: this.accountAttributes,
    };
    if (userDetailsStore.currentUser.data) {
      const accountDetails = find(
        userDetailsStore.currentUser.data.user.roles,
        { name: accountStore.investmentAccType },
      );
      if (get(accountDetails, 'details.accountId')) {
        variables.accountId = accountDetails.details.accountId;
      }
    }
    return new Promise((resolve, reject) => {
      if (!this.depositMoneyNow) {
        resolve();
      } else {
        const isLoader = individualAccountStore.stepToBeRendered === 1 || this.showAddFunds
          || this.manualLinkBankSubmitted;
        graphql({
          client,
          query: isValidOpeningDepositAmount,
          variables,
          fetchPolicy: 'network-only',
          onFetch: () => {
            if (resetProgress) {
              uiStore.setProgress(isLoader || false);
            }
            resolve();
          },
          onError: (err) => {
            uiStore.setProgress(isLoader || false);
            uiStore.setErrors(DataFormatter.getSimpleErr(err));
            reject();
          },
        });
      }
    });
  }

  @action
  updateAccountChangeAction = (accountId, userId, isDeny = false) => {
    uiStore.setProgress(`${accountId}_${isDeny ? 'deny' : 'approve'}`);
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: isDeny ? linkBankRequestDeny : linkBankRequestApprove,
          variables: {
            accountId,
            userId,
          },
          refetchQueries: [{ query: getlistLinkedBankUsers, variables: { page: 1, limit: 100 } }],
        })
        .then((res) => {
          uiStore.setProgress(false);
          Helper.toast(isDeny ? (res.data.linkBankRequestDeny ? 'Link bank requested is denied successfully.' : 'Something went wrong, please try again later.') : res.data.linkBankRequestApprove.message, (isDeny && !res.data.linkBankRequestDeny) ? 'error' : 'success');
          resolve();
        })
        .catch((error) => {
          if (error) {
            Helper.toast(error.message, 'error');
            uiStore.setErrors(error.message);
            reject();
            uiStore.setProgress(false);
          }
        });
    });
  }

  @action
  getDecryptedRoutingNum = (accountId, userId) => new Promise((resolve, reject) => {
    client
      .mutate({
        mutation: getDecryptedRoutingNumber,
        variables: {
          userId,
          accountId,
          requestType: 'CHANGE_REQUEST',
        },
      })
      .then(res => resolve(res.data.getDecryptedRoutingNumber))
      .catch(() => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        reject();
      });
  });
}

export default new BankAccountStore();

