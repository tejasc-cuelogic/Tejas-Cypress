import { observable, action, reaction } from 'mobx';
import graphql from 'mobx-apollo';
import { getBoxFileDetails, updateUserReferralCode, createCdnSignedUrl, deleteCdnS3File, getsharedLink, getEmail } from '../queries/common';
import { GqlClient as client } from '../../../api/gqlApi';
import Helper from '../../../helper/utility';

export class CommonStore {
  @observable appName = 'NextSeed';

  @observable token = window.localStorage.getItem('jwt');

  @observable appLoaded = false;

  @observable inProgress = false;

  @observable appUpdated = false;

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
    this.setFieldValue('inProgress', fileId);
    graphql({
      client,
      query: getBoxFileDetails,
      variables: {
        fileId,
      },
      fetchPolicy: 'network-only',
      onFetch: (data) => {
        if (data) {
          this.setFieldValue('inProgress', false);
          resolve(data);
        }
      },
      onError: () => {
        this.setFieldValue('inProgress', false);
        Helper.toast('Something went wrong, please try again later.', 'error');
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

  removeLocalStorage = (keys) => {
    keys.map(k => window.localStorage.removeItem(k));
  }

  @action
  setAppLoaded() {
    this.appLoaded = true;
  }

  @action
  setAppUpdated() {
    Helper.toast('The app has been updated! Hooray! Refresh your browser to enjoy the latest and greatest', 'info');
    this.appUpdated = true;
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
      fetchPolicy: 'network-only',
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

  @action
  getEmail = params => new Promise((res, rej) => {
    graphql({
      client,
      query: getEmail,
      fetchPolicy: 'network-only',
      variables: {
        ...params,
      },
      onFetch: (data) => {
        if (data) {
          res(data);
        }
      },
      onError: (e) => {
        rej(e);
        Helper.toast('Something went wrong, please try again later.', 'error');
      },
    });
  });
}

export default new CommonStore();
