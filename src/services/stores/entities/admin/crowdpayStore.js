import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { isArray, map } from 'lodash';
import moment from 'moment';
import { GqlClient as client } from '../../../../api/gqlApi';
import { FormValidator as Validator, ClientDb } from '../../../../helper';
import { listCrowdPayUsers, crowdPayAccountProcess, crowdPayAccountReview } from '../../queries/CrowdPay';
import { crowdPayAccountNotifyGs } from '../../queries/account';
import { FILTER_META, CROWDPAY_FILTERS } from '../../../constants/crowdpayAccounts';
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
  @observable isApiHit = false;
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
  setData = (key, value) => {
    this[key] = value;
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
  }

  @action
  setDb = (data) => {
    const updatedData = map(data, d => (
      {
        ...d,
        date: d.created ? parseInt(d.created.date, 10) : d.created,
        created: d.created ? { ...d.created, date: parseInt(d.created.date, 10) }
          : d.created,
      }));
    this.db = ClientDb.initiateDb(updatedData);
  }

  @action
  initRequest = () => {
    this.data = graphql({
      client,
      query: listCrowdPayUsers,
      variables: { limit: 500 },
      fetchPolicy: 'network-only',
      onFetch: () => {
        this.setData('isApiHit', true);
        this.setCrowdpayAccountsSummary();
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
  }

  @action
  initiateFilters = () => {
    this.setAccountTypes(this.requestState.type, false);
    const {
      keyword, startDate, endDate, accountStatus,
    } = this.requestState.search;
    let resultArray = [];
    const accountStatus2 = this.requestState.type === 'review' && !accountStatus ? ['FULL'] : accountStatus;
    ClientDb.filterData('accountStatus', accountStatus2, 'like');
    if (keyword) {
      resultArray = [];
      resultArray = [...resultArray, ...ClientDb.filterData('email', keyword, 'like', false),
        ...ClientDb.filterData('firstName', keyword, 'like', false),
        ...ClientDb.filterData('lastName', keyword, 'like', false)];
      ClientDb.initiateDb(resultArray, true);
    }
    if (startDate && endDate) {
      ClientDb.filterByDate(startDate, endDate);
    }
    this.db = ClientDb.getDatabase();
  }

  @action
  setInitiateSrch = (name, value) => {
    if (name === 'startDate' || name === 'endDate') {
      this.requestState.search[name] = value && moment(value.formattedValue, 'MM-DD-YYYY', true).isValid() ? moment(value.formattedValue, 'MM-DD-YYYY').unix() : undefined;
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

  @computed get getCrowdPayData() {
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
