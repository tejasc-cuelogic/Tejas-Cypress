import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { isArray, get, filter as lodashFilter, findIndex, find } from 'lodash';
import moment from 'moment';
import { GqlClient as client } from '../../../../api/gqlApi';
import { FormValidator as Validator, ClientDb } from '../../../../helper';
import { getCrowdPayUsers, crowdPayAccountProcess, crowdPayAccountReview, crowdPayAccountValidate, createIndividualAccount, getDecryptedGoldstarAccountNumber } from '../../queries/CrowdPay';
import { crowdPayAccountNotifyGs } from '../../queries/account';
import { FILTER_META, CROWDPAY_FILTERS, CONFIRM_CROWDPAY, CROWDPAY_ACCOUNTS_STATUS } from '../../../constants/crowdpayAccounts';
import Helper from '../../../../helper/utility';
import { uiStore, individualAccountStore } from '../../index';

const types = {
  review: null,
  individual: 'INDIVIDUAL',
  ira: 'IRA',
  entity: 'ENTITY',
};

export class CrowdpayStore {
  @observable data = [];

  @observable filters = false;

  @observable isApiHit = false;

  @observable summary = {
    review: 0, individual: 0, ira: 0, entity: 0,
  };

  @observable requestState = {
    skip: 0,
    page: 1,
    perPage: 5,
    limit: 100,
    oldType: null,
    displayTillIndex: 5,
    resultCount: 0,
    requestTriggerPage: 1,
    lastPage: 0,
    search: { accountType: null },
  };

  @observable isLazyLoading = true;

  @observable allCrowdpayData = [];

  @observable FILTER_FRM = Validator.prepareFormObject(FILTER_META);

  @observable CONFIRM_CROWDPAY_FRM = Validator.prepareFormObject(CONFIRM_CROWDPAY);

  @observable db;

  @observable loadingCrowdPayIds = [];

  getMutation = {
    GSPROCESS: crowdPayAccountProcess,
    EMAIL: crowdPayAccountNotifyGs,
    APPROVE: crowdPayAccountReview,
    DECLINE: crowdPayAccountReview,
    VALIDATE: crowdPayAccountValidate,
    CREATEACCOUNT: createIndividualAccount,
  }

  @action
  setData = (key, value) => {
    this[key] = value;
  }

  @action
  addLoadingCrowdPayId = (id) => {
    this.loadingCrowdPayIds.push(id);
  }

  @action
  removeLoadingCrowdPayId = (id, accountStatus) => {
    if (accountStatus && accountStatus !== 'APPROVE') {
      const crowdpayList = get(this.data, 'data.getCrowdPayUsers.crowdPayList');
      const index = findIndex(crowdpayList, crowdPayAccount => crowdPayAccount.accountId === id);
      const crowdPayAccount = find(crowdpayList, account => account.accountId === id);
      crowdPayAccount.accountStatus = accountStatus;
      if (accountStatus === CROWDPAY_ACCOUNTS_STATUS.FROZEN) {
        crowdPayAccount.declined = { by: 'ADMIN' };
      }
      crowdpayList[index] = crowdPayAccount;
      this.data.data.getCrowdPayUsers.crowdPayList = crowdpayList;
      this.setDb(this.getCrowdPayData);
      this.initiateFilters(false);
    } else if (accountStatus === 'APPROVE') {
      const crowdpayList = lodashFilter(get(this.data, 'data.getCrowdPayUsers.crowdPayList'), corwdPayAccount => corwdPayAccount.accountId !== id);
      this.data.data.getCrowdPayUsers.crowdPayList = crowdpayList;
      this.setDb(this.getCrowdPayData);
      this.initiateFilters(false);
    }
    this.loadingCrowdPayIds = lodashFilter(this.loadingCrowdPayIds, crowdPayId => crowdPayId !== id);
  }

  @action
  setAccountTypes = (type, defaultFilter = true) => {
    this.requestState.search.accountType = types[type];
    this.requestState.type = type;
    this.setDb([].concat(...toJS(this.allCrowdpayData)));
    // this.initialFilters(defaultFilter);
    if (!defaultFilter) {
      this.resetPagination();
    }
  }

  @action
  appendCrowdPayData = () => {
    this.allCrowdpayData.push(this.getCrowdPayData);
  }

  @action
  initialFilters = (defaultFilter) => {
    if (defaultFilter) {
      this.requestState.search.accountStatus = CROWDPAY_FILTERS[this.requestState.type.toLowerCase()].initialFilters;
    }
    if (this.requestState.type !== 'review') {
      ClientDb.filterData('accountType', CROWDPAY_FILTERS[this.requestState.type].accountType);
    }
    const filter = defaultFilter ? CROWDPAY_FILTERS[this.requestState.type].initialFilters
      : CROWDPAY_FILTERS[this.requestState.type].initialStatus;
    this.db = ClientDb.filterData('accountStatus', filter, 'like');
    uiStore.setProgress(false);
  }

  @action
  setDb = (data) => {
    this.db = ClientDb.initiateDb(data);
  }

  @action
  initRequest = (type, initialState = false, isFilter = false) => {
    let params = {};
    const accountType = type.toLowerCase();
    if (accountType !== 'review' && initialState) {
      params.accountStatus = CROWDPAY_FILTERS[accountType].initialStatus;
      this.requestState.search.accountStatus = CROWDPAY_FILTERS[accountType].initialStatus;
    }
    if (CROWDPAY_FILTERS[accountType].accountType.length) {
      // eslint-disable-next-line prefer-destructuring
      params.accountType = CROWDPAY_FILTERS[accountType].accountType[0];
    }
    if (!initialState) {
      params = { ...this.requestState.search };
    }
    const { requestTriggerPage, limit } = this.requestState;
    // this.setDb([]);
    this.data = graphql({
      client,
      query: getCrowdPayUsers,
      variables: { ...params, limit, page: requestTriggerPage },
      fetchPolicy: 'network-only',
      onFetch: () => {
        if (!this.data.loading) {
          if (isFilter) {
            this.resetPagination();
            this.allCrowdpayData = [];
          }

          if (!initialState && !this.canTriggerNextPage) {
            this.isLazyLoading = false;
          }
          // this.requestState.page = 1;
          // this.requestState.skip = 0;
          this.requestState.resultCount = get(this.data, 'data.getCrowdPayUsers.resultCount');
          this.appendCrowdPayData();
          this.requestState.search.accountType = accountType;
          // this.setData('isApiHit', true);
          this.setCrowdpayAccountsSummary();
          this.setAccountTypes(type, true);
        }
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
      },
    });
  }

  @action
  initiateSearch = (srchParams) => {
    this.requestState.search = srchParams;
    // this.initiateFilters();
    this.reset();
    this.initRequest(this.requestState.type, false, true);
  }

  @action
  setCrowdpayAccountsSummary = () => {
    Object.keys(this.summary).map((type) => {
      this.setAccountTypes(type);
      this.summary[type] = this.count;
      return false;
    });
    if (this.requestState.oldType) {
      this.setAccountTypes(this.requestState.oldType);
    }
  }

  @action
  initiateFilters = () => {
    this.setAccountTypes(this.requestState.type, false);
    const selected = this.FILTER_FRM.fields[this.requestState.type].value;
    this.isLazyLoading = Object.keys(this.requestState.search).length > 1;
    if (selected.length) {
      this.initialFilters(!this.requestState.search.accountStatus);
    }
    const {
      keyword, startDate, endDate, accountStatus,
    } = this.requestState.search;
    const accountStatus2 = this.requestState.type === 'review' && !accountStatus ? ['FULL'] : accountStatus;
    if (accountStatus2) {
      if (this.requestState.type === 'review' && accountStatus2.includes(CROWDPAY_ACCOUNTS_STATUS.DECLINED)) {
        ClientDb.filterData('accountStatus', [CROWDPAY_ACCOUNTS_STATUS.FROZEN], 'like');
        ClientDb.filterByObjExist('declined');
      } else {
        ClientDb.filterData('accountStatus', accountStatus2, 'like');
      }
    }
    if (!accountStatus) {
      delete this.requestState.search.accountStatus;
    }
    if (keyword) {
      ClientDb.filterFromNestedObjs(['firstName', 'lastName', 'email'], keyword);
    }
    if (startDate && endDate) {
      ClientDb.filterByDate(startDate, endDate, 'created', 'date');
    }
    this.db = ClientDb.getDatabase();
  }

  @action
  setInitiateSrch = (value, valueObj) => {
    const searchparams = { ...this.requestState.search };
    if (value === 'accountCreateFromDate' || value === 'accountCreateToDate') {
      if (moment(valueObj.formattedValue, 'MM-DD-YYYY', true).isValid()) {
        searchparams[value] = valueObj ? moment(new Date(valueObj.formattedValue)).add(1, 'day').toISOString() : '';
        this.requestState.search = searchparams;
        this.initiateSearch(searchparams);
      }
    } else {
      const srchParams = { ...this.requestState.search };
      if ((isArray(value) && value.length > 0) || (typeof value === 'string' && value !== '')) {
        srchParams[value] = value;
      } else {
        delete srchParams[value];
      }
      this.initiateSearch(srchParams);
    }
  }

  @action
  fChange = (e, result) => {
    this.FILTER_FRM = Validator.onChange(this.FILTER_FRM, Validator.pullValues(e, result));
    const selected = this.FILTER_FRM.fields[this.requestState.type].value;
    const srchParams = { ...this.requestState.search };
    srchParams.accountStatus = selected.length ? selected : null;
    this.initiateSearch(srchParams);
  };

  @action
  crowdPayCtaHandler = (userId, accountId, ctaAction, sMsg) => {
    const commentData = Validator.evaluateFormData(this.CONFIRM_CROWDPAY_FRM.fields);
    const mutation = this.getMutation[ctaAction];
    if (!mutation) {
      return false;
    }
    this.addLoadingCrowdPayId(accountId);
    let variables = {
      userId,
      accountId,
    };
    if (ctaAction === 'APPROVE' || ctaAction === 'DECLINE' || ctaAction === 'GSPROCESS') {
      const commentkey = ctaAction === 'GSPROCESS' ? 'reason' : 'comment';
      variables = {
        ...variables,
        action: ctaAction,
        [commentkey]: commentData.justifyDescription,
      };
    } else if (ctaAction === 'CREATEACCOUNT') {
      variables.accountType = types[this.requestState.type];
    }
    const accountStatuses = {
      DECLINE: CROWDPAY_ACCOUNTS_STATUS.FROZEN,
      GSPROCESS: CROWDPAY_ACCOUNTS_STATUS.GS_PROCESSING,
      CREATEACCOUNT: CROWDPAY_ACCOUNTS_STATUS.NS_PROCESSING,
      VALIDATE: CROWDPAY_ACCOUNTS_STATUS.FULL,
    };
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation,
          variables,
        })
        .then(action((data) => {
          if (!get(data, 'data.crowdPayAccountValidate') && ctaAction === 'VALIDATE') {
            this.requestState.oldType = this.requestState.type;
            Helper.toast('CIP is not satisfied.', 'error');
            this.removeLoadingCrowdPayId(accountId);
          } else if (ctaAction === 'CREATEACCOUNT' && this.requestState.type === 'individual' && data.data.submitInvestorAccount !== 'The account is Processing') {
            individualAccountStore.createIndividualGoldStarInvestor(accountId, userId)
              .then((res) => {
                this.requestState.oldType = this.requestState.type;
                if (res.data.createIndividualGoldStarInvestor) {
                  Helper.toast(res.data.createIndividualGoldStarInvestor, 'error');
                  this.removeLoadingCrowdPayId(
                    accountId,
                    CROWDPAY_ACCOUNTS_STATUS.ACCOUNT_PROCESSING,
                  );
                } else {
                  Helper.toast(sMsg, 'success');
                  this.removeLoadingCrowdPayId(accountId, CROWDPAY_ACCOUNTS_STATUS.FULL);
                }
                resolve();
              })
              .catch(() => {
                Helper.toast('Something went wrong, please try again later.', 'error');
                this.removeLoadingCrowdPayId(accountId);
                reject();
              });
          } else if (ctaAction === 'CREATEACCOUNT' && data.data.submitInvestorAccount) {
            this.requestState.oldType = this.requestState.type;
            Helper.toast(data.data.submitInvestorAccount, 'success');
            this.removeLoadingCrowdPayId(accountId, CROWDPAY_ACCOUNTS_STATUS.ACCOUNT_PROCESSING);
            resolve();
          } else {
            this.requestState.oldType = this.requestState.type;
            Helper.toast(sMsg, 'success');
            this.removeLoadingCrowdPayId(accountId, accountStatuses[ctaAction] || 'APPROVE');
            resolve();
          }
        }))
        .catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
          this.removeLoadingCrowdPayId(accountId);
          reject();
        });
    });
  }

  @action
  formChange = (e, result, form) => {
    this[form] = Validator.onChange(
      this[form],
      Validator.pullValues(e, result),
    );
  }

  @action
  resetModalForm = () => {
    this.CONFIRM_CROWDPAY_FRM = Validator.prepareFormObject(CONFIRM_CROWDPAY);
  }

  @action
  toggleSearch = () => {
    this.filters = !this.filters;
  }

  @computed get getCrowdPayData() {
    return (this.data.data && toJS(this.data.data.getCrowdPayUsers
      && this.data.data.getCrowdPayUsers.crowdPayList)) || [];
  }

  @computed get accounts() {
    return (this.db && this.db.length
      && this.db.slice(this.requestState.skip, this.requestState.displayTillIndex)) || [];
  }

  @computed get count() {
    return (this.db && this.db.length) || 0;
  }

  @computed get allRecordsCount() {
    return get(this.requestState, 'resultCount') || 0;
  }

  @action
  pageRequest = ({ skip, page }) => {
    if (this.tiggerNextPageData) {
      this.requestState.requestTriggerPage += 1;
      this.initRequest(this.requestState.type);
    }
    this.requestState.displayTillIndex = this.requestState.perPage * page;
    this.requestState.page = page;
    this.requestState.skip = skip;
  }

  @computed get tiggerNextPageData() {
    const { requestTriggerPage, limit, displayTillIndex } = this.requestState;
    return ((((limit * requestTriggerPage) - displayTillIndex) === 80) && this.canTriggerNextPage);
  }

  @computed get canTriggerNextPage() {
    const { requestTriggerPage, limit } = this.requestState;
    return requestTriggerPage < Math.ceil(this.allRecordsCount / limit);
  }

  @action
  resetPagination = () => {
    this.requestState.skip = 0;
    this.requestState.page = 1;
    this.requestState.perPage = 5;
    this.requestState.displayTillIndex = 5;
  }

  @action
  reset = () => {
    this.resetPagination();
    this.requestState.requestTriggerPage = 1;
    this.allCrowdpayData = [];
  }

  @computed get loading() {
    return this.data.loading;
  }

  @action
  getDecryptedRoutingNum = (accountId, userId) => new Promise((resolve, reject) => {
    client
      .mutate({
        mutation: getDecryptedGoldstarAccountNumber,
        variables: {
          userId,
          accountId,
        },
      })
      .then(res => resolve(res.data.getDecryptedGoldstarAccountNumber))
      .catch(() => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        reject();
      });
  });
}

export default new CrowdpayStore();
