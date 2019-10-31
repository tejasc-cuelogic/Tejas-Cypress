import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { isEmpty, map, uniqWith, isEqual, find, get, filter } from 'lodash';
import { FormValidator as Validator, ClientDb, DataFormatter } from '../../../../helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import { accountStore, userDetailsStore, uiStore, userStore, iraAccountStore, individualAccountStore, entityAccountStore } from '../../index';
import { linkBankRequestPlaid, linkBankRequestManual, validateBankAccount, declineBankChangeRequest, getDecryptedRoutingNumber, hasPendingTransfersWithPendingBankChange } from '../../queries/banking';
import Helper from '../../../../helper/utility';
import {
  IND_LINK_BANK_MANUALLY, IND_BANK_ACC_SEARCH, IND_ADD_FUND, FILTER_META, ENTITY_ADD_FUND,
  IRA_ADD_FUND, BANK_REQUEST_VERIFY_DENY_FORM,
} from '../../../../constants/account';
import validationService from '../../../../api/validation';
import { getlistLinkedBankUsers, isValidOpeningDepositAmount, linkBankRequestApprove } from '../../queries/bankAccount';
import { validationActions } from '../../../actions';

export class BankAccountStore {
  @observable bankLinkInterface = 'list';

  @observable plaidAccDetails = {};

  @observable routingNum = null;

  @observable plaidBankDetails = {};

  @observable bankListing = undefined;

  @observable depositMoneyNow = true;

  @observable showAddFunds = false;

  @observable bankSelect = false;

  @observable apiCall = false;

  @observable formBankSearch = Validator.prepareFormObject(IND_BANK_ACC_SEARCH);

  @observable formBankRequestVerifyDeny = Validator.prepareFormObject(BANK_REQUEST_VERIFY_DENY_FORM);

  @observable formAddFunds = Validator.prepareFormObject(IND_ADD_FUND);

  @observable formEntityAddFunds = Validator.prepareFormObject(ENTITY_ADD_FUND);

  @observable formIraAddFunds = Validator.prepareFormObject(IRA_ADD_FUND);

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

  @observable loadingState = false;

  @observable hasPendingRequest = false;

  @observable requestState = {
    skip: 0,
    page: 1,
    perPage: 10,
    displayTillIndex: 10,
    filters: false,
    isLocked: false,
    search: {
    },
  };

  @observable loadingRequestIds = [];

  @action
  addLoadingRequestId = (requestId) => {
    this.loadingRequestIds.push(requestId);
  }

  @action
  removeLoadingRequestId = (requestId, isSuccess = true) => {
    this.loadingRequestIds = filter(this.loadingRequestIds, loadingId => loadingId !== requestId);
    if (isSuccess) {
      this.setDb(filter(this.changeRequests, changeRequest => changeRequest.userId !== requestId));
      const linkedBankList = filter(get(this.data, 'data.listLinkedBankUsers.linkedBankList'), changeRequest => changeRequest.userId !== requestId);
      this.data.data.listLinkedBankUsers.linkedBankList = linkedBankList || [];
    }
  }

  @action
  setDb = (data) => {
    this.db = ClientDb.initiateDb(data, null, null, null, true);
  }

  @action
  setFieldValue = (field, value) => {
    this[field] = value;
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
  fChange = (e, result) => {
    this.FILTER_FRM = Validator.onChange(this.FILTER_FRM, Validator.pullValues(e, result));
    this.requestState.isLocked = this.FILTER_FRM.fields.locked.value[0] || false;
    this.requestState = { ...this.requestState };
  };

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
    this[this.addFundsByAccType] = Validator.onChange(this.addFundsByAccType, { name: field, value: values.floatValue });
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
  resetRoutingNum() {
    this.routingNum = null;
  }

  @action
  resetAddFundsForm() {
    Validator.resetFormData(this.addFundsByAccType);
  }

  @action
  resetEntityAddFundsForm() {
    Validator.resetFormData(this.formEntityAddFunds);
  }

  @action
  validateAddfundsAmount = () => {
    if (parseFloat(this.addFundsByAccType.fields.value.value, 0) === -1) {
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
      this.plaidAccDetails = accountData.details && accountData.details.linkedBank
        ? accountData.details.linkedBank : {};
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

  @action
  resetPlaidBankSearch = () => {
    if (this.showAddFunds
      || this.bankLinkInterface === 'form'
      || this.linkbankSummary) {
      this.setBankListing();
      this.resetFormData('formBankSearch');
    }
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
        plaidAccountId,
      } = this.plaidAccDetails;
      if ((account_id && public_token) || plaidAccountId) {
        plaidBankDetails.linkedBank = {
          plaidPublicToken: public_token,
          plaidAccountId: plaidAccountId || account_id,
          accountType: (accountType && accountType.toUpperCase()) || account.subtype.toUpperCase(),
        };
      } else {
        plaidBankDetails.linkedBank = {
          accountNumber,
          routingNumber,
          accountType: accountType && accountType.toUpperCase(),
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
    const { value } = this.addFundsByAccType.fields.value;
    const { isValid } = this.addFundsByAccType.meta;
    accountAttributes.initialDepositAmount = this.depositMoneyNow && isValid
      ? value : this.depositMoneyNow ? '' : -1;
    return accountAttributes;
  }

  @computed
  get isValidLinkBank() {
    return !isEmpty(this.plaidAccDetails);
  }

  @computed
  get isPlaidDirty() {
    return (this.isAccountPresent
    && this.formLinkBankManually.meta.isDirty
    && this.addFundsByAccType.meta.isDirty
    && !this.linkbankSummary)
    || this.showAddFunds;
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
  hasPendingTransfersWithPendingBankChange = () => {
    const data = {
      userId: userDetailsStore.userDetails.id,
      accountId: this.CurrentAccountId,
    };
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: hasPendingTransfersWithPendingBankChange,
          variables: { ...data },
        })
        .then((res) => {
          this.setFieldValue('hasPendingRequest', get(res, 'data.hasPendingTransfersWithPendingBankChange'));
          resolve();
        })
        .catch((error) => {
          uiStore.setErrors(error.message);
          Helper.toast(error.message, 'error');
          reject(error.message);
        }).finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @action
  setLinkBankSummary = (showbank = true) => {
    if (showbank) {
      this.resetShowAddFunds();
      this.setIsManualLinkBankSubmitted(false);
    }
    this.linkbankSummary = showbank;
  }

  @action
  resetShowAddFunds = () => {
    this.showAddFunds = false;
  }

  @computed get isAccountPresent() {
    const { accountNumber, routingNumber, bankName } = this.plaidAccDetails;
    return !isEmpty(accountNumber) && !isEmpty(routingNumber) && !isEmpty(bankName);
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
          this.setFieldValue('apiCall', true);
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
    if (!this.requestState.isLocked) {
      return (this.db && this.db.length
        && toJS(filter(
          this.db.slice(this.requestState.skip, this.requestState.displayTillIndex),
          changeRequest => get(changeRequest, 'userInfo.locked.lock') !== 'LOCKED',
        ))) || [];
    }
    return (this.db && this.db.length
      && toJS(this.db.slice(this.requestState.skip, this.requestState.displayTillIndex))) || [];
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

  @computed get addFundsByAccType() {
    return (Helper.matchRegexWithUrl([/\bentity(?![-])\b/]) ? this.formEntityAddFunds : Helper.matchRegexWithUrl([/\bira(?![-])\b/]) ? this.formIraAddFunds : this.formAddFunds);
  }

  @action
  validateAddFunds = () => {
    map(this.addFundsByAccType.fields, (value) => {
      const { key } = value;
      const fundValue = value;
      fundValue.value = parseFloat(value.value, 0) === -1 || value.value === ''
        // eslint-disable-next-line no-restricted-globals
        || isNaN(parseFloat(value.value, 0)) ? '' : parseFloat(value.value, 0);
      const { errors } = validationService.validate(value);
      Validator.setFormError(
        this.addFundsByAccType,
        key,
        errors && errors[key][0],
      );
    });
    this.validateForm(this.addFundsByAccType);
  }

  @action
  validateForm = (form) => {
    Validator.validateForm(form, false);
  }

  // @computed get count() {
  //   return (get(this.data, 'data.listLinkedBankUsers.resultCount')) || 0;
  // }

  @computed get count() {
    if (!this.requestState.isLocked) {
      return (this.db && this.db.length
        && toJS(filter(
          this.db,
          changeRequest => get(changeRequest, 'userInfo.locked.lock') !== 'LOCKED',
        ).length)) || 0;
    }
    return (this.db && this.db.length) || 0;
  }

  @computed get isLinkbankInComplete() {
    const isAddFundsDirty = this.addFundsByAccType.meta.isDirty;
    return this.manualLinkBankSubmitted
    || isAddFundsDirty
    || this.formLinkBankManually.meta.isDirty
    || this.linkbankSummary
    || !this.isAccountPresent
    || this.showAddFunds;
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
  validateManualAccount = (accountType) => {
    // const data = Validator.ExtractValues(this.formLinkBankManually.fields);
    const { accountNumber, routingNumber } = this.formLinkBankManually.fields;
    const accountDetails = find(
      userDetailsStore.currentUser.data.user.roles,
      { name: accountType },
    );
    return new Promise((resolve) => {
      client
        .mutate({
          mutation: validateBankAccount,
          variables: {
            accountNumber: accountNumber.value,
            routingNumber: routingNumber.value,
            accountId: get(accountDetails, 'details.accountId'),
            accountType: accountType.toUpperCase(),
          },
        })
        .then(() => {
          uiStore.setProgress(false);
          resolve();
        })
        .catch((error) => {
          uiStore.setErrors(DataFormatter.getSimpleErr(error));
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
  declineBankChangeRequest = () => {
    const canceldData = {
      accountId: this.CurrentAccountId,
    };
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: declineBankChangeRequest,
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
    this.formLinkBankManually = Validator.prepareFormObject(IND_LINK_BANK_MANUALLY);
    this.resetRoutingNum();
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
    this.bankSelect = false;
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
      return ((ref === 'routingNo' && n.length > 9)
        || n.includes('X'));
    }
    return false;
  }

  @action
  setLoaderForAccountBlank = () => {
    uiStore.setProgress(!get(this.plaidAccDetails, 'accountNumber') || isEmpty(this.routingNum));
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
  updateAccountChangeAction = (accountId, userId, justification, isDeny = false) => {
    uiStore.setProgress();
    this.addLoadingRequestId(userId);
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: isDeny ? declineBankChangeRequest : linkBankRequestApprove,
          variables: {
            accountId,
            userId,
            justification,
          },
        })
        .then((res) => {
          this.removeLoadingRequestId(userId);
          Helper.toast(isDeny ? (res.data.declineBankChangeRequest ? 'Link bank requested is denied successfully.' : 'Something went wrong, please try again later.') : res.data.linkBankRequestApprove.message, (isDeny && !res.data.declineBankChangeRequest) ? 'error' : 'success');
          uiStore.setProgress(false);
          resolve();
        })
        .catch((error) => {
          if (error) {
            Helper.toast(error.message, 'error');
            uiStore.setErrors(error.message);
            uiStore.setProgress(false);
            this.removeLoadingRequestId(userId, false);
            reject();
          }
        });
    });
  }

  @action
  fetchRoutingNumber = (requestType = 'LINKED_BANK') => {
    const { getAccountIdByType } = accountStore;
    const { currentUserId } = userDetailsStore;
    const accountId = getAccountIdByType();
    if (currentUserId && accountId && get(this.plaidAccDetails, 'accountNumber')) {
      uiStore.setProgress();
      this.getDecryptedRoutingNum(accountId, currentUserId, requestType)
        .then(action((res) => {
          if (this.routingNum !== res) {
            this.routingNum = res;
          }
          uiStore.setProgress(!isEmpty(uiStore.createAccountMessage));
        }));
    }
  }

  @action
  getDecryptedRoutingNum = (accountId, userId, requestType = 'CHANGE_REQUEST') => new Promise((resolve, reject) => {
    client
      .mutate({
        mutation: getDecryptedRoutingNumber,
        variables: {
          userId,
          accountId,
          requestType,
        },
      })
      .then(res => resolve(res.data.getDecryptedRoutingNumber))
      .catch(() => {
        if (requestType === 'CHANGE_REQUEST') {
          Helper.toast('Something went wrong, please try again later.', 'error');
        }
        uiStore.setProgress(false);
        reject();
      });
  });
}

export default new BankAccountStore();
