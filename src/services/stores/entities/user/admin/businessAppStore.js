/* eslint-disable no-underscore-dangle */
import { observable, action, computed, toJS } from 'mobx';
import { includes, isArray, filter } from 'lodash';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../../api/gcoolApi';
import { FILTER_META } from '../../../../../constants/user';
import { allBusinessApplicationses } from '../../../queries/businessApplication';
import Helper from '../../../../../helper/utility';

export class BusinessAppStore {
  @observable businessApplicationsList = [];
  @observable backup = [];
  @observable columnTitle = '';
  @observable requestState = {
    lek: null,
    filters: false,
    sort: {
      by: 'lastLoginDate',
      direction: 'desc',
    },
    search: {},
    page: 1,
    perPage: 2,
    skip: 0,
  };

  @observable filterApplicationStatus = FILTER_META.applicationStatus;

  @computed get totalRecords() {
    return (this.businessApplicationsList && this.businessApplicationsList.data &&
      this.businessApplicationsList.data._allBusinessApplicationsesMeta &&
      this.businessApplicationsList.data._allBusinessApplicationsesMeta.count) || 0;
  }

  @action
  setFieldvalue = (field, value) => {
    this[field] = value;
  }

  @action
  initiateSearch = (srchParams) => {
    this.requestState.lek = null;
    this.requestState.search = srchParams;
    this.initRequest();
  }

  @action
  setInitiateSrch = (name, value) => {
    const srchParams = { ...this.requestState.search };
    if (name === 'applicationStatus') {
      const index = this.filterApplicationStatus
        .value.indexOf(value);
      if (index === -1) {
        this.filterApplicationStatus.value.push(value);
      } else {
        this.filterApplicationStatus.value.splice(index, 1);
      }
      srchParams[name] = this.filterApplicationStatus.value;
    } else if ((isArray(value) && value.length > 0) || (typeof value === 'string' && value !== '')) {
      srchParams[name] = value;
    } else {
      delete srchParams[name];
    }
    this.initiateSearch(srchParams);
  }

  @computed get getBusinessApplication() {
    return (this.businessApplicationsList && this.businessApplicationsList.data
      && toJS(this.businessApplicationsList.data.allBusinessApplicationses)
    ) || [];
  }

  @action
  reInitiateApplicationStatusFilterValues(section) {
    this.requestState.search = {};
    this.filterApplicationStatus = FILTER_META.applicationStatus;
    const { values } = this.filterApplicationStatus;
    this.filterApplicationStatus.values = values.filter(ele => includes(ele.applicable, section));
    this.filterApplicationStatus.value = section === 'in-progress' ? ['UNSTASH'] : section === 'completed' ? ['NEW', 'REVIEWING'] : [];
    this.requestState.search.applicationStatus = this.filterApplicationStatus.value;
  }

  @action
  fetchBusinessApplicationsByStatus = (url) => {
    const appType = includes(url, 'prequal-failed') ? 'prequal-failed' : includes(url, 'in-progress') ? 'in-progress' : 'completed';
    this.reInitiateApplicationStatusFilterValues(appType);
    this.columnTitle = appType === 'prequal-failed' ? 'Failed reasons' : appType === 'in-progress' ? 'Steps completed' : '';
    const filterParam = appType === 'prequal-failed' ? 'PRE_QUALIFICATION_FAILED' : appType === 'in-progress' ? 'PRE_QUALIFICATION_SUBMITTED' : 'APPLICATION_SUBMITTED';
    this.businessApplicationsList = graphql({
      client,
      query: allBusinessApplicationses,
      variables: {
        filters: { applicationStatus: filterParam },
        first: 100,
        skip: 0,
      },
      fetchPolicy: 'network-only',
      onFetch: (data) => {
        this.initAction(data.allBusinessApplicationses);
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
      },
    });
  }

  @action
  initAction = (data) => {
    this.backup = data;
    // const { values } = this.filterApplicationStatus;
    // forEach(values, (v, k) => {
    //   const count = filter(data, app => app.status === v.value).length;
    //   values[k].label = `${values[k].label} (${count})`;
    // });
    this.initRequest();
    this.requestState.page = 1;
    this.requestState.perPage = 2;
    this.requestState.skip = 0;
  }

  @action
  initRequest = (props) => {
    const { first, skip, page } = props ||
      {
        first: this.requestState.perPage,
        skip: this.requestState.skip,
        page: this.requestState.page,
      };
    this.requestState.page = page || this.requestState.page;
    this.requestState.perPage = first || this.requestState.perPage;
    this.requestState.skip = skip || this.requestState.skip;

    const { applicationStatus, keyword } = this.requestState.search;
    if (applicationStatus.length || (keyword && keyword !== '')) {
      this.businessApplicationsList.data.allBusinessApplicationses = filter(this.backup, app =>
        includes(toJS(applicationStatus), app.status) || includes(app.commentContent, keyword)
          || includes(app.businessName, keyword) || includes(app.name, keyword) ||
          includes(app.email, keyword)).slice(skip, skip + first);
    } else if (this.backup) {
      this.businessApplicationsList.data.allBusinessApplicationses =
      this.backup.slice(skip, skip + first);
    }
  }
}

export default new BusinessAppStore();
