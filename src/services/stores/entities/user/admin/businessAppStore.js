import { observable, action, computed, toJS } from 'mobx';
import { includes } from 'lodash';
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

export class BusinessAppStore {
  // @observable businessApplicationsList = [];
  @observable businessApplicationsList = {
    data: [{
      info: {
        businessName: 'Test Business',
        name: 'Chetan',
        email: 'chetan.cuelogic@nextseed.com',
        phone: 21313213213,
      },
      comment: {
        content: 'Testing comment',
        date: '07/07/2018',
      },
      startDate: '07/07/2018',
      lastUpdatedDate: '07/07/2018',
      failedReasons: ['Netincome', 'not eligible'],
      statusType: 'FAILED',
      ratings: 0,
    },
    {
      info: {
        businessName: 'Test Business',
        name: 'Chetan',
        email: 'chetan.cuelogic@nextseed.com',
        phone: 21313213213,
      },
      comment: {
        content: 'Testing comment',
        date: '23/23/2322',
      },
      startDate: '23/23/2322',
      lastUpdatedDate: '23/23/2322',
      statusType: 'IN-PROGRESS',
      ratings: 0,
    }],
  };
  @observable details = 'This is just a hello world page details!';

  @action
  setFieldvalue = (field, value) => {
    this[field] = value;
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
    console.log(appType);
    if (appType === 'in-progress') {
      this.businessApplicationsList = {
        data: [{
          info: {
            businessName: 'Test Business',
            name: 'Chetan',
            email: 'chetan.cuelogic@nextseed.com',
            phone: 21313213213,
          },
          comment: {
            content: 'Testing comment',
            date: '07/07/2018',
          },
          startDate: '07/07/2018',
          lastUpdatedDate: '07/07/2018',
          failedReasons: ['Netincome', 'not eligible'],
          statusType: 'FAILED',
          ratings: 0,
        },
        {
          info: {
            businessName: 'Test Business',
            name: 'Chetan',
            email: 'chetan.cuelogic@nextseed.com',
            phone: 21313213213,
          },
          comment: {
            content: 'Testing comment',
            date: '23/23/2322',
          },
          startDate: '23/23/2322',
          lastUpdatedDate: '23/23/2322',
          statusType: 'IN-PROGRESS',
          ratings: 0,
        }],
      };
    } else {
      this.businessApplicationsList = {
        data: [{
          info: {
            businessName: 'Test Business',
            name: 'Jhon',
            email: 'jhon.cuelogic@nextseed.com',
            phone: 21313213213,
          },
          comment: {
            content: 'Testing comment',
            date: '07/07/2018',
          },
          startDate: '07/07/2018',
          lastUpdatedDate: '07/07/2018',
          failedReasons: ['Netincome', 'not eligible'],
          statusType: 'FAILED',
          ratings: 0,
        },
        {
          info: {
            businessName: 'Test Business',
            name: 'Jone',
            email: 'jhon.cuelogic@nextseed.com',
            phone: 21313213213,
          },
          comment: {
            content: 'Testing comment',
            date: '23/23/2322',
          },
          startDate: '23/23/2322',
          lastUpdatedDate: '23/23/2322',
          statusType: 'FAILED',
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
