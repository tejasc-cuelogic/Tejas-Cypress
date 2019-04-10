import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { isArray, get, filter as lodashFilter, findIndex, find } from 'lodash';
import moment from 'moment';
import { GqlClient as client } from '../../../../api/gqlApi';
import { FormValidator as Validator, ClientDb, DataFormatter } from '../../../../helper';
import { getCrowdPayUsers, crowdPayAccountProcess, crowdPayAccountReview, crowdPayAccountValidate, createIndividualAccount } from '../../queries/CrowdPay';
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
    perPage: 10,
    oldType: null,
    displayTillIndex: 10,
    search: { accountType: null },
  };
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
    this.setCrowdpayAccountsSummary();
    this.loadingCrowdPayIds =
    lodashFilter(this.loadingCrowdPayIds, crowdPayId => crowdPayId !== id);
  }

  @action
  setAccountTypes = (type, defaultFilter = true) => {
    this.requestState.search.accountType = types[type];
    this.requestState.type = type;
    this.setDb(this.getCrowdPayData);
    this.initialFilters(defaultFilter);
    this.resetPagination();
  }

  @action
  initialFilters = (defaultFilter) => {
    if (defaultFilter) {
      this.requestState.search.accountStatus =
        CROWDPAY_FILTERS[this.requestState.type].initialFilters;
    }
    if (this.requestState.type !== 'review') {
      ClientDb.filterData('accountType', CROWDPAY_FILTERS[this.requestState.type].accountType);
    }
    const filter = defaultFilter ? CROWDPAY_FILTERS[this.requestState.type].initialFilters :
      CROWDPAY_FILTERS[this.requestState.type].initialStatus;
    this.db = ClientDb.filterData('accountStatus', filter, 'like');
    uiStore.setProgress(false);
  }

  @action
  setDb = (data) => {
    this.db = ClientDb.initiateDb(data);
  }

  @action
  initRequest = (type) => {
    const params = {};
    if (type !== 'review') {
      params.accountStatus = CROWDPAY_FILTERS[type].initialStatus;
    }
    if (CROWDPAY_FILTERS[type].accountType.length) {
      // eslint-disable-next-line prefer-destructuring
      params.accountType = CROWDPAY_FILTERS[type].accountType[0];
    }
    this.setDb([]);
    this.data = graphql({
      client,
      query: getCrowdPayUsers,
      variables: { ...params, limit: 1000, page: 1 },
      fetchPolicy: 'network-only',
      onFetch: () => {
        if (!this.data.loading) {
          this.reset();
          this.requestState.page = 1;
          this.requestState.skip = 0;
          // this.setData('isApiHit', true);
          this.setCrowdpayAccountsSummary();
          this.setAccountTypes(type);
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
    this.initiateFilters();
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
  setInitiateSrch = (name, value) => {
    if (name === 'startDate' || name === 'endDate') {
      this.requestState.search[name] = value && moment(value.formattedValue, 'MM-DD-YYYY', true).isValid() ? DataFormatter.getDate(value.formattedValue, false, name, true) : undefined;
      const srchParams = { ...this.requestState.search };
      this.initiateSearch(srchParams);
    } else {
      const srchParams = { ...this.requestState.search };
      if ((isArray(value) && value.length > 0) || (typeof value === 'string' && value !== '')) {
        srchParams[name] = value;
      } else {
        delete srchParams[name];
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
    if (ctaAction === 'APPROVE' || ctaAction === 'DECLINE') {
      variables = {
        ...variables,
        action: ctaAction,
        comment: commentData.justifyDescription,
      };
    } else if (ctaAction === 'CREATEACCOUNT') {
      variables.accountType = types[this.requestState.type];
    }
    const accountStatuses = {
      DECLINE: CROWDPAY_ACCOUNTS_STATUS.DECLINED,
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
    return (this.db && this.db.length &&
      this.db.slice(this.requestState.skip, this.requestState.displayTillIndex)) || [];
  }

  @computed get count() {
    return (this.db && this.db.length) || 0;
  }

  @action
  pageRequest = ({ skip, page }) => {
    this.requestState.displayTillIndex = this.requestState.perPage * page;
    this.requestState.page = page;
    this.requestState.skip = skip;
  }

  @action
  resetPagination = () => {
    this.requestState.skip = 0;
    this.requestState.page = 1;
    this.requestState.perPage = 10;
    this.requestState.displayTillIndex = 10;
  }

  @action
  reset = () => {
    this.resetPagination();
    this.requestState.search = { accountType: null };
    this.FILTER_FRM = Validator.prepareFormObject(FILTER_META);
  }
  @computed get loading() {
    return this.data.loading;
  }
}

export default new CrowdpayStore();
