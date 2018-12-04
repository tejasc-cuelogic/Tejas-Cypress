import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { uniqWith, isEqual, isArray, map } from 'lodash';
import moment from 'moment';
import { GqlClient as client } from '../../../../api/gqlApi';
import { FormValidator as Validator, ClientDb } from '../../../../helper';
import { listCrowdPayUsers, crowdPayAccountProcess, crowdPayAccountReview } from '../../queries/CrowdPay';
import { crowdPayAccountNotifyGs } from '../../queries/account';
import { FILTER_META, ACCOUNT_STATUS_VALUES, ACCOUNT_STATUS_FILTER_VALUES } from '../../../constants/crowdpayAccounts';
import Helper from '../../../../helper/utility';
import { uiStore } from '../../index';

const types = {
  review: null,
  cip: 'INDIVIDUAL',
  ira: 'IRA',
  entity: 'ENTITY',
};

export class CrowdpayStore {
  @observable data = [];
  @observable filters = false;
  @observable summary = {
    review: 0, cip: 0, ira: 12, entity: 3,
  };
  @observable requestState = {
    skip: 0,
    page: 1,
    perPage: 10,
    displayTillIndex: 10,
    search: { accountType: null },
  };
  @observable FILTER_FRM = Validator.prepareFormObject(FILTER_META);
  @observable db;

  @action
  setAccountTypes = (type) => {
    this.requestState.search.accountType = types[type];
    this.requestState.type = type;
  }

  @action
  setDb = (data) => {
    const updatedData = map(data, d => (
      {
        ...d,
        created: d.created ? { ...d.created, date: parseInt(d.created.date, 10) }
          : d.created,
      }));
    this.db = ClientDb.initiateDb(updatedData);
  }

  @action
  initRequest = () => {
    const {
      accountType,
    } = this.requestState.search;
    const params = {
      page: 1,
      accountType,
      limit: 100,
      accountStatus: ACCOUNT_STATUS_VALUES[this.requestState.type],
    };
    this.data = graphql({
      client,
      query: listCrowdPayUsers,
      variables: params,
      fetchPolicy: 'network-only',
      onFetch: (res) => {
        this.setDb(res.listCrowdPayUsers.crowdPayList);
        this.initiateFilters(ACCOUNT_STATUS_FILTER_VALUES[this.requestState.type]);
      },
    });
  }

  @action
  initiateSearch = (srchParams) => {
    this.requestState.search = srchParams;
    this.initiateFilters();
  }

  @action
  initiateFilters = (accStatus = null) => {
    const {
      keyword, startDate, endDate, accountStatus,
    } = this.requestState.search;
    let resultArray = [];
    if (startDate && endDate) {
      resultArray = [...resultArray, ...ClientDb.filterData('created', startDate, 'gt', 'date'),
        ...ClientDb.filterData('created', endDate, 'lt', 'date')];
    }
    const accountStatus2 = this.requestState.type === 'review' && !accountStatus ? ['FULL'] : accountStatus;
    if (accountStatus2 || accStatus) {
      resultArray = [...resultArray, ...ClientDb.filterData('accountStatus', accountStatus2 || accStatus, 'like')];
    }
    if (keyword) {
      resultArray = [...resultArray, ...ClientDb.filterData('email', keyword, 'like'),
        ...ClientDb.filterData('firstName', keyword, 'like'),
        ...ClientDb.filterData('lastName', keyword, 'like')];
    }
    this.db = uniqWith(resultArray, isEqual);
  }

  @action
  setInitiateSrch = (name, value) => {
    if (name === 'startDate' || name === 'endDate') {
      this.requestState.search[name] = moment(value.formattedValue, 'MM-DD-YYYY').utc().unix();
      if (this.requestState.search.startDate !== '' && this.requestState.search.startDate !== undefined && this.requestState.search.endDate !== '' && this.requestState.search.endDate !== undefined) {
        const srchParams = { ...this.requestState.search };
        this.initiateSearch(srchParams);
      }
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
  fChange = (e, result) => { // this is only for checkboxes
    this.FILTER_FRM = Validator.onChange(this.FILTER_FRM, Validator.pullValues(e, result));
    const selected = this.FILTER_FRM.fields[this.requestState.type].value;
    const srchParams = { ...this.requestState.search };
    srchParams.accountStatus = selected.length ? selected : null;
    this.initiateSearch(srchParams);
  };

  @action
  crowdPayCtaHandler = (userId, accountId, ctaAction, sMsg) => {
    const mutation = ctaAction === 'GSPROCESS' ? crowdPayAccountProcess : ctaAction === 'EMAIL' ? crowdPayAccountNotifyGs : (ctaAction === 'APPROVE' || ctaAction === 'DECLINE') ? crowdPayAccountReview : null;
    if (!mutation) {
      return false;
    }
    uiStore.setProgress(`${accountId}_${ctaAction}`);
    let variables = {
      userId,
      accountId,
    };
    if (ctaAction === 'APPROVE' || ctaAction === 'DECLINE') {
      variables = {
        ...variables,
        action: ctaAction,
      };
    }
    return new Promise((resolve, reject) => {
      client
        .mutate({ mutation, variables })
        .then(() => { Helper.toast(sMsg, 'success'); resolve(); })
        .catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
          reject();
        })
        .finally(() => uiStore.setProgress(false));
    });
  }

  @action
  toggleSearch = () => {
    this.filters = !this.filters;
  }

  @computed get getCorwdPayData() {
    return (this.data.data && toJS(this.data.data.listCrowdPayUsers
      && this.data.data.listCrowdPayUsers.crowdPayList)) || [];
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
  reset = () => {
    this.requestState.skip = 0;
    this.requestState.page = 1;
    this.requestState.perPage = 10;
    this.requestState.displayTillIndex = 10;
    this.requestState.search.accountStatus = null;
    this.FILTER_FRM = Validator.prepareFormObject(FILTER_META);
  }
  @computed get loading() {
    return this.data.loading;
  }
}

export default new CrowdpayStore();
