import { observable, action, computed, toJS } from 'mobx';
import { includes, isArray, filter, forEach } from 'lodash';
import graphql from 'mobx-apollo';
import { FormValidator as Validator } from '../../../../../helper';
import { GqlClient as client } from '../../../../../api/gqlApi';
import { FILTER_META } from '../../../../../constants/user';
import { BUSINESS_DETAILS_EDIT_META } from '../../../../constants/businessApplication';
import { getBusinessApplicationsDetailsAdmin, getBusinessApplicationAdmin, getBusinessApplicationSummary, updateBusinessApplicationInformation } from '../../../queries/businessApplication';
import Helper from '../../../../../helper/utility';
import { uiStore } from '../../../index';

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
    sort: { by: 'applicationSubmittedDate|desc' },
    search: {},
    page: 1,
    perPage: 100,
  };

  @observable filterApplicationStatus = FILTER_META.applicationStatus;
  @observable BUSINESS_DETAILS_EDIT_FRM = Validator.prepareFormObject(BUSINESS_DETAILS_EDIT_META);

  @action
  setFieldvalue = (field, value) => {
    this[field] = value;
  }

  @action
  inputFieldChnage = (e, res, formName = 'BUSINESS_DETAILS_EDIT_FRM') => {
    this[formName] = Validator.onChange(this[formName], Validator.pullValues(e, res));
  };

  @action
  setKeyword = (e) => {
    this.requestState.search = { ...this.requestState.search, keyword: e.target.value };
  }

  @action
  initiateSearch = (srchParams, sortParams) => {
    this.requestState.lek = { 'page-1': null };
    this.requestState.page = 1;
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
      this.requestState.search = srchParams;
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
  reInitiateApplicationStatusFilterValues(section, noFilter) {
    this.filterApplicationStatus = FILTER_META.applicationStatus;
    const { values } = this.filterApplicationStatus;
    this.filterApplicationStatus.values = values.filter(ele => includes(ele.applicable, section));
    if (!noFilter) {
      // this.filterApplicationStatus.value = section === 'in-progress' ? ['UNSTASH'] :
      // section === 'completed' ? ['NEW', 'REVIEWING'] : [];
      this.requestState.search =
      { ...this.requestState.search, applicationStatus: this.filterApplicationStatus.value };
    } else {
      this.filterApplicationStatus.value = this.requestState.search.applicationStatus;
    }
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
    this.requestState.lek = { 'page-1': null };
    this.requestState.page = 1;
    this.requestState.search.keyword = null;
    this.initRequest();
  }

  @action
  updateApplicationStatusCount = (data) => {
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
    const { data } = this.businessApplicationsList;
    if (applicationStatus && applicationStatus.length && data && data.businessApplicationsAdmin) {
      data.businessApplicationsAdmin.businessApplications = filter(this.backup, app =>
        includes(toJS(applicationStatus), app.applicationStatus));
    } else if (data && data.businessApplicationsAdmin) {
      data.businessApplicationsAdmin.businessApplications = this.backup;
    }
  }

  @action
  initRequest = (props) => {
    const { first, page, noFilter } = props ||
      {
        first: this.requestState.perPage,
        page: this.requestState.page,
        noFilter: false,
      };
    this.requestState.page = page || this.requestState.page;
    this.requestState.perPage = first || this.requestState.perPage;

    const { keyword } = this.requestState.search;
    const { by } = this.requestState.sort;
    const [field, direction] = by.split('|');
    const appType = this.applicationType;
    const applicationTypeFilter = appType === 'prequal-failed' ? 'PRE_QUALIFICATION_FAILED' : appType === 'in-progress' ? 'IN_PROGRESS' : 'COMPLETED';
    let filterParams = {
      applicationType: applicationTypeFilter,
      orderBy: { field: appType === 'prequal-failed' ? 'updatedDate' : field, sort: direction || 'desc' },
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
          const { lek, businessApplications } = data.businessApplicationsAdmin;
          this.requestState = {
            ...this.requestState,
            lek: {
              ...this.requestState.lek,
              [`page-${this.requestState.page + 1}`]: lek,
            },
          };
          this.backup = businessApplications;
          this.reInitiateApplicationStatusFilterValues(appType, noFilter);
          this.updateApplicationStatusCount(
            businessApplications,
            noFilter,
          );
          this.totalRecords = this.summary[appType];
        }
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
      },
    });
  }

  @action
  setBusinessDetails = (businessName, signupCode, utmSource) => {
    this.BUSINESS_DETAILS_EDIT_FRM.fields.businessName.value = businessName;
    this.BUSINESS_DETAILS_EDIT_FRM.fields.signupCode.value = signupCode;
    this.BUSINESS_DETAILS_EDIT_FRM.fields.utmSource.value = utmSource;
  }

  @action
  updateBusinessDetails = (appId, issuerId, appType) => {
    const payload = Validator.ExtractValues(this.BUSINESS_DETAILS_EDIT_FRM.fields);
    const refetchPayLoad = {
      applicationId: appId,
      userId: issuerId,
      applicationType: appType === 'PRE_QUALIFICATION_FAILED' ? 'APPLICATIONS_PREQUAL_FAILED' : 'APPLICATION_COMPLETED',
    };
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: updateBusinessApplicationInformation,
          variables: {
            applicationId: appId,
            issuerId,
            businessName: payload.businessName,
            signupCode: payload.signupCode,
            utmSource: payload.utmSource,
          },
          refetchQueries: [{
            query: getBusinessApplicationsDetailsAdmin,
            variables: refetchPayLoad,
          }],
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
          reject(error);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }
}

export default new BusinessAppStore();
