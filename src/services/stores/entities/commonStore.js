import { observable, action, reaction } from 'mobx';
import graphql from 'mobx-apollo';
import { getBoxFileDetails, updateUserReferralCode, createCdnSignedUrl, deleteCdnS3File, getsharedLink } from '../queries/common';
import { GqlClient as client } from '../../../api/gqlApi';
import Helper from '../../../helper/utility';

export class CommonStore {
  @observable appName = 'NextSeed';
  @observable token = window.localStorage.getItem('jwt');
  @observable appLoaded = false;
  @observable inProgress = false;

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

  @action
  updateUserReferralCode = (cognitoUserId, referralCode) => new Promise((resolve, reject) => {
    client
      .mutate({ mutation: updateUserReferralCode, variables: { cognitoUserId, referralCode } })
      .then(() => resolve())
      .catch(() => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        reject();
      });
  });

  @action
  getCdnSignedUrl = key => new Promise((resolve, reject) => {
    client
      .mutate({
        mutation: createCdnSignedUrl,
        variables: { key },
      })
      .then(res => resolve(res))
      .catch(() => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        reject();
      });
  });

  @action
  deleteCdnS3File = key => new Promise((resolve, reject) => {
    client
      .mutate({
        mutation: deleteCdnS3File,
        variables: { key },
      })
      .then(res => resolve(res))
      .catch(() => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        reject();
      });
  });

  @action
  setToken(token) {
    this.token = token;
  }

  @action
  setAppLoaded() {
    this.appLoaded = true;
  }

  @action
  setFieldValue(key, val) {
    this[key] = val;
  }

  @action
  getsharedLink = params => new Promise((resolve) => {
    this.setFieldValue('inProgress', params.id || params.uploadId);
    graphql({
      client,
      query: getsharedLink,
      variables: {
        ...params,
      },
      onFetch: (data) => {
        if (data) {
          this.setFieldValue('inProgress', false);
          resolve(data.sharedLink);
        }
      },
      onError: () => {
        this.setFieldValue('inProgress', false);
        Helper.toast('Something went wrong, please try again later.', 'error');
      },
    });
  });
}

export default new CommonStore();
