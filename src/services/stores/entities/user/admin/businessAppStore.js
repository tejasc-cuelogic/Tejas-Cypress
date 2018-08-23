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
  @observable applicationType = 'prequal-failed';
  @observable totalRecords = 0;
  @observable requestState = {
    lek: { 'page-1': null },
    filters: false,
    sort: { by: 'createdDate|desc' },
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
  setKeyword = (e) => {
    this.requestState.search = { ...this.requestState.search, keyword: e.target.value };
  }

  @action
  initiateSearch = (srchParams, sortParams) => {
    this.requestState.lek = { 'page-1': null };
    this.requestState.search = srchParams;
    this.requestState.sort = sortParams;
    this.initRequest();
  }

  @action
  setInitiateSrch = (name, value) => {
    const srchParams = { ...this.requestState.search };
    const sortParams = { ...this.requestState.sort };
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
      if (name === 'by') {
        sortParams[name] = value;
      } else {
        srchParams[name] = value;
      }
    } else {
      delete srchParams[name];
    }
    if (name === 'applicationStatus') {
      this.filterByAppStatus();
    } else {
      this.initiateSearch(srchParams, sortParams);
    }
  }

  @computed get getBusinessApplication() {
    return (this.businessApplicationsList && this.businessApplicationsList.data &&
      this.businessApplicationsList.data.businessApplicationsAdmin &&
      toJS(this.businessApplicationsList.data.businessApplicationsAdmin.businessApplications)
    ) || [];
  }

  @action
  reInitiateApplicationStatusFilterValues(section) {
    this.filterApplicationStatus = FILTER_META.applicationStatus;
    const { values } = this.filterApplicationStatus;
    this.filterApplicationStatus.values = values.filter(ele => includes(ele.applicable, section));
    this.filterApplicationStatus.value = section === 'in-progress' ? ['UNSTASH'] : section === 'completed' ? ['NEW', 'REVIEWING'] : [];
    this.requestState.search =
    { ...this.requestState.search, applicationStatus: this.filterApplicationStatus.value };
    this.filterByAppStatus();
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
    this.applicationType = appType;
    this.initRequest();
  }

  @action
  initAction = (data) => {
    const { values } = this.filterApplicationStatus;
    forEach(values, (v, k) => {
      const count = filter(data, app =>
        app.status === v.value).length;
      values[k].label = `${values[k].label} (${count})`;
    });
  }

  @action
  filterByAppStatus = () => {
    const { applicationStatus } = this.requestState.search;
    const { businessApplicationsAdmin } = this.businessApplicationsList.data;
    if (applicationStatus && applicationStatus.length && businessApplicationsAdmin) {
      businessApplicationsAdmin.businessApplications = filter(this.backup, app =>
        includes(toJS(applicationStatus), app.status));
    } else if (businessApplicationsAdmin) {
      businessApplicationsAdmin.businessApplications = this.backup;
    }
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

    const { keyword } = this.requestState.search;
    const { by } = this.requestState.sort;
    const [field, direction] = by.split('|');
    const appType = this.applicationType;
    const applicationTypeFilter = appType === 'prequal-failed' ? 'PRE_QUALIFICATION_FAILED' : appType === 'in-progress' ? 'PRE_QUALIFICATION_SUBMITTED' : 'APPLICATION_SUBMITTED';
    let filterParams = {
      applicationType: applicationTypeFilter,
      orderBy: { field, sort: direction || 'desc' },
      limit: this.requestState.perPage,
      search: keyword,
    };
    filterParams = this.requestState.lek[`page-${this.requestState.page}`] ?
      { ...filterParams, lek: this.requestState.lek[`page-${this.requestState.page}`] } : { ...filterParams };
    this.businessApplicationsList = graphql({
      client,
      query: getBusinessApplicationAdmin,
      variables: filterParams,
      fetchPolicy: 'network-only',
      onFetch: (data) => {
        if (data) {
          const { lek } = data.businessApplicationsAdmin;
          this.requestState = {
            ...this.requestState,
            lek: {
              ...this.requestState.lek,
              [`page-${this.requestState.page + 1}`]: lek,
            },
          };
          this.reInitiateApplicationStatusFilterValues(appType);
          this.initAction(data.businessApplicationsAdmin.businessApplications);
          this.totalRecords = this.summary[appType];
          this.backup = data.businessApplicationsAdmin.businessApplications;
        }
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
      },
    });
  }
}

export default new BusinessAppStore();
