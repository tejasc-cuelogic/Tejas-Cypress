import { observable, action, reaction } from 'mobx';
import graphql from 'mobx-apollo';
import { find } from 'lodash';
import { getBoxFileDetails } from '../queries/common';
import { GqlClient as client } from '../../../api/gqlApi';

export class CommonStore {
  @observable appName = 'NextSeed';
  @observable token = window.localStorage.getItem('jwt');
  @observable appLoaded = false;
  @observable referralData = [
    {
      referralCode: 'referByChetan',
      slug: '23444360-f164-11e8-b585-0fedde544b95',
    },
    {
      referralCode: 'referByPratik',
      slug: '4ff74fa0-f89a-11e8-90d3-8d6f00045821',
    },
    {
      referralCode: 'referByAlan',
      slug: 'dc0cdd2c-03ec-41e9-bc58-f8a644426e69',
    },
  ];

  constructor() {
    reaction(
      () => this.token,
      (token) => {
        if (token) {
          window.localStorage.setItem('jwt', token);
        } else {
          window.localStorage.removeItem('jwt');
        }
      },
    );
  }

  getBoxFileDetails = fileId => new Promise((resolve) => {
    graphql({
      client,
      query: getBoxFileDetails,
      variables: {
        fileId,
      },
      onFetch: (data) => {
        if (data) {
          resolve(data);
        }
      },
    });
  });

  getReferralCodes = referralCode => new Promise((resolve) => {
    const referral = find(this.referralData, r => r.referralCode === referralCode);
    if (referral) {
      resolve(referral);
    } else {
      resolve('EMPTY');
    }
  });

  @action
  setToken(token) {
    this.token = token;
  }

  @action
  setAppLoaded() {
    this.appLoaded = true;
  }
}

export default new CommonStore();
