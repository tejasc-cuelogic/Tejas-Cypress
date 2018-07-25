import { observable, action, computed, toJS } from 'mobx';
import { includes, isArray } from 'lodash';
// import graphql from 'mobx-apollo';
// import { FormValidator as Validator } from '../../../../../helper';
// import { GqlClient as client } from '../../../../../api/gqlApi';
// import Helper from '../../../../../helper/utility';
// import { uiStore, navStore, userStore } from '../../../index';
// import {
//     LENDIO,
//   } from '../../../../constants/businessApplication';
// import {
//     submitApplication,
//   } from '../../../queries/businessApplication';
import { FILTER_META } from '../../../../../constants/user';

export class BusinessAppStore {
  @observable businessApplicationsList = [];
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
    // this.initRequest();
  }

  @action
  setInitiateSrch = (name, value) => {
    const srchParams = { ...this.requestState.search };
    if ((isArray(value) && value.length > 0) || (typeof value === 'string' && value !== '')) {
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

  // @action
  // fetchApplicationDataById = (applicationId) => {
  //   console.log(applicationId);
  //   return new Promise((resolve) => {
  //     this.businessApplicationsDataById = graphql({
  //       client,
  //       query: getBusinessApplicationsById,
  //       variables: {
  //         id: applicationId,
  //       },
  //       fetchPolicy: 'network-only',
  //       onFetch: () => {
  //         this.setBusinessApplicationData();
  //         resolve();
  //       },
  //     });
  //   });
  // }

  @action
  fetchBusinessApplicationsByStatus = (url) => {
    const appType = includes(url, 'prequal-failed') ? 'prequal-failed' : includes(url, 'in-progress') ? 'in-progress' : 'completed';
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
          status: 'NEW',
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
          status: 'REMOVED',
          ratings: 0,
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
          status: 'DELETED',
          ratings: 0,
        },
        {
          applicationId: 'sdf3',
          info: {
            businessName: 'Completed 1',
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
          status: 'REMOVED',
          ratings: 0,
        }],
      };
    }

    // this.businessApplicationsList = graphql({
    //   client,
    //   query: getBusinessApplications,
    // });
  }

  @action
  initRequest = () => {
    this.data = [{ id: 1, title: 'this is a title', createdAt: '03/03/2018' }];
  }

  @computed get allRecords() {
    return this.data;
  }

  @computed get currentRecord() {
    return this.details;
  }
}

export default new BusinessAppStore();
