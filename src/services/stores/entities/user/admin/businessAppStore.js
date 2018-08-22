/* eslint-disable no-underscore-dangle */
import { observable, action, computed, toJS } from 'mobx';
import { includes, isArray, filter, forEach } from 'lodash';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../../api/gqlApi';
// import { GqlClient as client2 } from '../../../../../api/gcoolApi';
import { FILTER_META } from '../../../../../constants/user';
import { getBusinessApplicationAdmin, getBusinessApplicationSummary } from '../../../queries/businessApplication';
import Helper from '../../../../../helper/utility';

export class BusinessAppStore {
  @observable businessApplicationsList = [];
  @observable summary = { 'prequal-failed': 0, 'in-progress': 0, completed: 0 };
  @observable backup = [];
  @observable columnTitle = '';
  @observable totalRecords = 0;
  @observable requestState = {
    lek: null,
    filters: false,
    sort: {
      by: 'lastLoginDate',
      direction: 'desc',
    },
    search: {},
    page: 1,
    perPage: 10,
    skip: 0,
  };

  @observable filterApplicationStatus = FILTER_META.applicationStatus;

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
    return (this.businessApplicationsList && this.businessApplicationsList.data &&
      this.businessApplicationsList.data.businessApplicationsAdmin &&
      toJS(this.businessApplicationsList.data.businessApplicationsAdmin.businessApplications)
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
  getBusinessApplicationSummary = () => {
    graphql({
      client,
      query: getBusinessApplicationSummary,
      onFetch: (data) => {
        if (data) {
          const { prequalFaild, inProgress, completed } = data.businessApplicationsSummary;
          this.summary = { 'prequal-failed': prequalFaild, 'in-progress': inProgress, completed };
        }
      },
    });
  }

  @action
  fetchBusinessApplicationsByStatus = (appType) => {
    this.columnTitle = appType === 'prequal-failed' ? 'Failed reasons' : appType === 'in-progress' ? 'Steps completed' : '';
    const appTypeFilter = appType === 'prequal-failed' ? 'PRE_QUALIFICATION_FAILED' : appType === 'in-progress' ? 'PRE_QUALIFICATION_SUBMITTED' : 'APPLICATION_SUBMITTED';
    let filterParams = {
      applicationType: appTypeFilter,
      // orderBy: { field: this.requestState.sort.by, sort: this.requestState.sort.direction },
      limit: this.requestState.perPage,
      search: this.requestState.search.keyword,
    };
    filterParams = this.requestState.lek ?
      { ...filterParams, lek: this.requestState.lek } : { ...filterParams };
    this.businessApplicationsList = graphql({
      client,
      query: getBusinessApplicationAdmin,
      variables: filterParams,
      refetchQueries: { query: getBusinessApplicationSummary },
      fetchPolicy: 'network-only',
      onFetch: (data) => {
        if (data) {
          this.requestState.lek = data.businessApplicationsAdmin.businessApplications.lek;
          this.reInitiateApplicationStatusFilterValues(appType);
          this.initAction(data.businessApplicationsAdmin.businessApplications);
          this.totalRecords = this.summary[appType];
        }
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
      },
    });
  }

  @action
  initAction = (data) => {
    const { values } = this.filterApplicationStatus;
    forEach(values, (v, k) => {
      const count = filter(data, app =>
        app.status === v.value).length;
      values[k].label = `${values[k].label} (${count})`;
    });
    this.backup = data;
    this.initRequest();
    this.requestState.page = 1;
    this.requestState.perPage = 10;
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
    if ((applicationStatus.length || (keyword && keyword !== '')) && this.businessApplicationsList.data.businessApplicationsAdmin) {
      this.businessApplicationsList.data.businessApplicationsAdmin.businessApplications =
      filter(this.backup, app =>
        includes(toJS(applicationStatus), app.status)).slice(skip, skip + first);
    } else if (this.backup && this.businessApplicationsList.data.businessApplicationsAdmin) {
      this.businessApplicationsList.data.businessApplicationsAdmin.businessApplications =
      this.backup.slice(skip, skip + first);
    }
  }
}

export default new BusinessAppStore();
