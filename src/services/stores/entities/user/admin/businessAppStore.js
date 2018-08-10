import { observable, action, computed, toJS } from 'mobx';
import { includes, isArray, filter, forEach } from 'lodash';
import { FILTER_META } from '../../../../../constants/user';

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
    search: {
    },
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
    return (this.businessApplicationsList && this.businessApplicationsList.data
      && toJS(this.businessApplicationsList.data)
    ) || [];
  }

  @action
  reInitiateApplicationStatusFilterValues(section) {
    this.requestState.search = {};
    this.filterApplicationStatus = FILTER_META.applicationStatus;
    const { values } = this.filterApplicationStatus;
    switch (section) {
      case 'prequal-failed':
        this.filterApplicationStatus.values = values.filter(ele => includes(ele.applicable, 'prequal-failed'));
        break;
      case 'in-progress':
        this.filterApplicationStatus.values = values.filter(ele => includes(ele.applicable, 'in-progress'));
        this.filterApplicationStatus.value = ['UNSTASH'];
        break;
      case 'completed':
        this.filterApplicationStatus.values = values.filter(ele => includes(ele.applicable, 'completed'));
        this.filterApplicationStatus.value = ['NEW', 'REVIEWING'];
        break;
      default: break;
    }
    this.requestState.search.applicationStatus = this.filterApplicationStatus.value;
  }

  @action
  fetchBusinessApplicationsByStatus = (url) => {
    const appType = includes(url, 'prequal-failed') ? 'prequal-failed' : includes(url, 'in-progress') ? 'in-progress' : 'completed';
    this.reInitiateApplicationStatusFilterValues(appType);
    if (appType === 'prequal-failed') {
      this.columnTitle = 'Failed reasons';
      this.businessApplicationsList = {
        data: [{
          applicationId: 'sdf3',
          info: {
            businessName: 'PreQaul 1',
            name: 'Chetan',
            email: 'chetan.cuelogic@nextseed.com',
            phone: 21313213213,
          },
          comment: {
            content: 'Testing comment',
            date: '07/07/2018',
            user: 'Jhone',
          },
          createdDate: '07/07/2018',
          updatedDate: '07/07/2018',
          failedReasons: 'Net income ($100) is lower than required $15,000. Net income ($100) is lower than required $15,000. Net income ($100) is lower than required $15,000',
          applicationStatus: 'PRE_QUALIFICATION_FAILED',
          status: 'DELETED',
          ratings: 0,
        },
        {
          applicationId: 'sdf3',
          info: {
            businessName: 'PreQual 2',
            name: 'Chetan',
            email: 'chetan.cuelogic@nextseed.com',
            phone: 21313213213,
          },
          comment: {
            content: 'Testing comment',
            date: '07/07/2018',
            user: 'Mack',
          },
          createdDate: '07/07/2018',
          updatedDate: '07/07/2018',
          failedReasons: 'Net income ($100) is lower than required $15,000. Net income ($100) is lower than required $15,000. Net income ($100) is lower than required $15,000',
          applicationStatus: 'PRE_QUALIFICATION_FAILED',
          status: 'NEW',
          ratings: 0,
        }],
      };
    } else if (appType === 'in-progress') {
      this.columnTitle = 'Steps completed';
      this.businessApplicationsList = {
        data: [{
          applicationId: 'sdf3',
          info: {
            businessName: 'In Progres 1',
            name: 'Jhon',
            email: 'jhon.cuelogic@nextseed.com',
            phone: 21313213213,
          },
          comment: {
            content: 'Testing comment',
            date: '07/07/2018',
            user: 'Jhone',
          },
          createdDate: '07/07/2018',
          updatedDate: '07/07/2018',
          failedReasons: '',
          applicationStatus: 'PRE_QUALIFICATION_SUBMITTED',
          status: 'DELETED',
          ratings: 0,
          businessDetails: {
            stepStatus: 'COMPLETE',
          },
          businessPerformance: {
            stepStatus: 'IN-PROGRESS',
          },
          businessDocumentation: null,
        },
        {
          applicationId: 'sdf3',
          info: {
            businessName: 'In Progres 2',
            name: 'Jone',
            email: 'jhon.cuelogic@nextseed.com',
            phone: 21313213213,
          },
          comment: {
            content: 'Testing comment',
            date: '07/08/2018',
            user: 'Alex',
          },
          createdDate: '07/08/2018',
          updatedDate: '07/08/2018',
          failedReasons: '',
          applicationStatus: 'PRE_QUALIFICATION_SUBMITTED',
          status: 'STASH',
          ratings: 0,
          businessDetails: {
            stepStatus: 'COMPLETE',
          },
          businessPerformance: {
            stepStatus: 'IN-PROGRESS',
          },
          businessDocumentation: {
            stepStatus: 'COMPLETE',
          },
        },
        {
          applicationId: 'sdf3',
          info: {
            businessName: 'In Progres 3',
            name: 'Jone',
            email: 'jhon.cuelogic@nextseed.com',
            phone: 21313213213,
          },
          comment: {
            content: 'Testing comment',
            date: '07/08/2018',
            user: 'Alex',
          },
          createdDate: '07/08/2018',
          updatedDate: '07/08/2018',
          failedReasons: '',
          applicationStatus: 'PRE_QUALIFICATION_SUBMITTED',
          status: 'NEW',
          ratings: 0,
          businessDetails: {
            stepStatus: 'COMPLETE',
          },
          businessPerformance: {
            stepStatus: 'IN-PROGRESS',
          },
          businessDocumentation: {
            stepStatus: 'COMPLETE',
          },
        }],
      };
    } else if (appType === 'completed') {
      this.columnTitle = '';
      this.businessApplicationsList = {
        data: [{
          applicationId: 'sdf3',
          info: {
            businessName: 'Completed 1',
            name: 'Jhon',
            email: 'jhon.cuelogic@nextseed.com',
            phone: 21313213213,
          },
          comment: {
            content: 'Testing comment',
            date: '07/07/2018',
            user: 'Jhone',
          },
          createdDate: '07/07/2018',
          updatedDate: '07/07/2018',
          failedReasons: '',
          applicationStatus: 'APPLICATION_SUBMITTED',
          status: 'NEW',
          ratings: 0,
          businessDetails: {
            stepStatus: 'COMPLETE',
          },
          businessPerformance: {
            stepStatus: 'COMPLETE',
          },
          businessDocumentation: {
            stepStatus: 'COMPLETE',
          },
        },
        {
          applicationId: 'sdf3',
          info: {
            businessName: 'Fitness Guru',
            name: 'Jone',
            email: 'jhon.cuelogic@nextseed.com',
            phone: 21313213213,
          },
          comment: {
            content: 'Testing comment',
            date: '07/08/2018',
            user: 'Alex',
          },
          createdDate: '07/08/2018',
          updatedDate: '07/08/2018',
          failedReasons: '',
          applicationStatus: 'APPLICATION_SUBMITTED',
          status: 'ACCEPTED',
          ratings: 0,
          businessDetails: {
            stepStatus: 'COMPLETE',
          },
          businessPerformance: {
            stepStatus: 'COMPLETE',
          },
          businessDocumentation: {
            stepStatus: 'COMPLETE',
          },
        },
        {
          applicationId: 'sdf3',
          info: {
            businessName: 'Circuss Guru',
            name: 'Jone',
            email: 'jhon.cuelogic@nextseed.com',
            phone: 21313213213,
          },
          comment: {
            content: 'Testing comment',
            date: '07/08/2018',
            user: 'Alex',
          },
          createdDate: '07/08/2018',
          updatedDate: '07/08/2018',
          failedReasons: '',
          applicationStatus: 'APPLICATION_SUBMITTED',
          status: 'OFFERED',
          ratings: 0,
          businessDetails: {
            stepStatus: 'COMPLETE',
          },
          businessPerformance: {
            stepStatus: 'COMPLETE',
          },
          businessDocumentation: {
            stepStatus: 'COMPLETE',
          },
        },
        {
          applicationId: 'sdf3',
          info: {
            businessName: 'Go Ride',
            name: 'Jone',
            email: 'jhon.cuelogic@nextseed.com',
            phone: 21313213213,
          },
          comment: {
            content: 'Testing comment',
            date: '07/08/2018',
            user: 'Alex',
          },
          createdDate: '07/08/2018',
          updatedDate: '07/08/2018',
          failedReasons: '',
          applicationStatus: 'APPLICATION_SUBMITTED',
          status: 'DELETED',
          ratings: 0,
          businessDetails: {
            stepStatus: 'COMPLETE',
          },
          businessPerformance: {
            stepStatus: 'COMPLETE',
          },
          businessDocumentation: {
            stepStatus: 'COMPLETE',
          },
        }],
      };
    }
    this.backup = this.businessApplicationsList.data;
    const { values } = this.filterApplicationStatus;
    const { data } = this.businessApplicationsList;
    forEach(values, (v, k) => {
      const count = filter(data, app => app.status === v.value).length;
      values[k].label = `${values[k].label} (${count})`;
    });
    this.initRequest();
    // this.businessApplicationsList = graphql({
    //   client,
    //   query: getBusinessApplications,
    // });
  }

  @action
  initRequest = () => {
    const { applicationStatus, keyword } = this.requestState.search;
    if (applicationStatus.length || (keyword && keyword !== '')) {
      this.businessApplicationsList.data = filter(this.backup, app =>
        includes(toJS(applicationStatus), app.status) || includes(app.comment.content, keyword)
          || includes(app.info.businessName, keyword) || includes(app.info.name, keyword) ||
          includes(app.info.email, keyword));
    } else {
      this.businessApplicationsList.data = this.backup;
    }
  }
}

export default new BusinessAppStore();
