import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { isEmpty, map, uniqWith, isEqual, find, get } from 'lodash';
import { FormValidator as Validator, ClientDb, DataFormatter } from '../../../../helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import { accountStore, userDetailsStore, uiStore, userStore, iraAccountStore, individualAccountStore, entityAccountStore } from '../../index';
import { linkBankRequestPlaid, linkBankRequestManual, linkBankRequestCancel, getDecryptedRoutingNumber } from '../../queries/banking';
import Helper from '../../../../helper/utility';
import {
  IND_LINK_BANK_MANUALLY, IND_BANK_ACC_SEARCH, IND_ADD_FUND, FILTER_META, ENTITY_ADD_FUND,
} from '../../../../constants/account';
import validationService from '../../../../api/validation';
import { getlistLinkedBankUsers, isValidOpeningDepositAmount, linkBankRequestApprove, linkBankRequestDeny } from '../../queries/bankAccount';
import { validationActions } from '../../../../services/actions';

export class BankAccountStore {
  @observable bankLinkInterface = 'list';
  @observable plaidAccDetails = {};
  @observable plaidBankDetails = {};
  @observable bankListing = undefined;
  @observable depositMoneyNow = true;
  @observable showAddFunds = false;
  @observable formBankSearch = Validator.prepareFormObject(IND_BANK_ACC_SEARCH);
  @observable formAddFunds = Validator.prepareFormObject(IND_ADD_FUND);
  @observable formEntityAddFunds = Validator.prepareFormObject(ENTITY_ADD_FUND);
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
  @observable shouldValidateAmount = false;
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
  setShouldValidateAmount = (val = false) => {
    this.shouldValidateAmount = val;
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
  addFundChange = (values, field, accType = '') => {
    if (accType === 'entity') {
      this.formEntityAddFunds =
      Validator.onChange(this.formEntityAddFunds, { name: field, value: values.floatValue });
    } else {
      this.formAddFunds =
        Validator.onChange(this.formAddFunds, { name: field, value: values.floatValue });
    }
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

  @action
  resetEntityAddFundsForm() {
    Validator.resetFormData(this.formEntityAddFunds);
  }

  @action
  validateAddfundsAmount = () => {
    if (Helper.matchRegexWithUrl([/\bentity(?![-])\b/])) {
      if (parseFloat(this.formEntityAddFunds.fields.value.value, 0) === -1) {
        this.shouldValidateAmount = true;
        this.resetEntityAddFundsForm();
      }
    } else if (parseFloat(
      this.formAddFunds.fields.value.value
      , 0,
    ) === -1) {
      this.shouldValidateAmount = true;
      this.resetAddFundsForm();
    }
  }

  changeLinkbank = () => {
    this.setBankLinkInterface('list');
    this.setLinkBankSummary(false);
    this.resetShowAddFunds();
    uiStore.clearErrors();
  }
  stepbankSummary = step => step.bankSummary;

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
    const { value } = Helper.matchRegexWithUrl([/\bentity(?![-])\b/]) ? this.formEntityAddFunds.fields.value : this.formAddFunds.fields.value;
    const { isValid } = Helper.matchRegexWithUrl([/\bentity(?![-])\b/]) ? this.formEntityAddFunds.meta : this.formAddFunds.meta;
    accountAttributes.initialDepositAmount = this.depositMoneyNow && isValid ?
      value : !isValid ? '' : -1;
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

  @computed
  get isEntityPlaidDirty() {
    return (this.isAccountPresent &&
    this.formLinkBankManually.meta.isDirty &&
    this.formEntityAddFunds.meta.isDirty &&
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
    return !isEmpty(get(this.plaidAccDetails, 'accountNumber')) ||
      !isEmpty(get(this.plaidAccDetails, 'public_token'));
  }

  @action
  resetPlaidAccData = () => {
    this.plaidAccDetails = {};
  }

  @action
  resetLinkBank = () => {
    Validator.resetFormData(this.formLinkBankManually);
    Validator.resetFormData(this.formAddFunds);
    Validator.resetFormData(this.formEntityAddFunds);
    if (accountStore.investmentAccType !== 'ira') {
      this.plaidAccDetails = {};
    } else if (Helper.matchRegexWithUrl([/\bira(?![-])\b/]) && iraAccountStore.stepToBeRendered < 3) {
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
    if (!Helper.matchRegexWithUrl([/\bentity(?![-])\b/])) {
      // TODO optiimize map function in if and else
      map(this.formAddFunds.fields, (value) => {
        const { key } = value;
        const fundValue = value;
        fundValue.value = parseFloat(value.value, 0) === -1 || value.value === '' ||
         // eslint-disable-next-line no-restricted-globals
         isNaN(parseFloat(value.value, 0)) ? '' : parseFloat(value.value, 0);
        const { errors } = validationService.validate(fundValue);
        Validator.setFormError(
          this.formAddFunds,
          key,
          errors && errors[key][0],
        );
      });
      this.validateForm('formAddFunds');
    } else {
      map(this.formEntityAddFunds.fields, (value) => {
        const { key } = value;
        const fundValue = value;
        fundValue.value = parseFloat(value.value, 0) === -1 || value.value === '' ||
          // eslint-disable-next-line no-restricted-globals
          isNaN(parseFloat(value.value, 0)) ? '' : parseFloat(value.value, 0);
        const { errors } = validationService.validate(value);
        Validator.setFormError(
          this.formEntityAddFunds,
          key,
          errors && errors[key][0],
        );
      });
      this.validateForm('formEntityAddFunds');
    }
  }

  @action
  validateForm = (form) => {
    Validator.validateForm(this[form], false);
  }

  @computed get count() {
    return (this.changeRequests && this.changeRequests.length) || 0;
  }
  @computed get isLinkbankInComplete() {
    return this.manualLinkBankSubmitted ||
    this.formAddFunds.meta.isDirty ||
    this.formLinkBankManually.meta.isDirty ||
    this.linkbankSummary ||
    !this.isAccountPresent ||
    this.formEntityAddFunds.meta.isDirty ||
    this.showAddFunds;
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
      accountType: data.accountType,
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
    this.resetFormData('formEntityAddFunds');
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
    this.shouldValidateAmount = false;
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
  setLoaderForAccountBlank = () => {
    uiStore.setProgress(!this.isAccountPresent);
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
      console.log('this.depositMoneyNow :', this.depositMoneyNow);
      console.log('this.shouldValidateAmount :', this.shouldValidateAmount);
      if (!this.depositMoneyNow || !this.shouldValidateAmount) {
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
              uiStore.setProgress(isLoader);
            }
            resolve();
          },
          onError: (err) => {
            uiStore.setProgress(isLoader);
            uiStore.setErrors(DataFormatter.getSimpleErr(err));
            reject();
          },
        });
      }
    });
  }

  @action
  bankSummarySubmit = () => {
    const { investmentAccType } = accountStore;
    const accTypeStore = investmentAccType === 'individual' ? individualAccountStore : investmentAccType === 'entity' ? entityAccountStore : investmentAccType === 'ira' ? iraAccountStore : individualAccountStore;
    const currentStep = investmentAccType === 'entity' ? { name: 'Link bank', validate: validationActions.validateLinkBankForm, stepToBeRendered: 5 } : investmentAccType === 'ira' ? { name: 'Link bank', validate: validationActions.validateLinkBankForm, stepToBeRendered: 3 } : { name: 'Link bank', validate: validationActions.validateLinkBankForm, stepToBeRendered: 1 };
    // this.props.bankAccountStore.resetAddFundsForm();
    accTypeStore.setStepToBeRendered(currentStep.stepToBeRendered);
    if (investmentAccType !== 'individual') {
      this.setLinkBankSummary(false);
      this.setIsManualLinkBankSubmitted(false);
      this.setShowAddFunds();
    }
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

