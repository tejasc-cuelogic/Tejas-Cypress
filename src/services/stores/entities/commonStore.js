import { observable, action, reaction } from 'mobx';
import graphql from 'mobx-apollo';
import { CONTACT_INFO } from '../../../constants/common';
import { FormValidator as Validator } from '../../../helper';
import { getBoxFileDetails, updateUserReferralCode, fundNotificationSignUp, createCdnSignedUrl, deleteCdnS3File, getsharedLink, adminEmailContent } from '../queries/common';
import { GqlClient as client } from '../../../api/gqlApi';
import Helper from '../../../helper/utility';
import uiStore from './shared/uiStore';

export class CommonStore {
  @observable appName = 'NextSeed';

  @observable token = window.localStorage.getItem('jwt');

  @observable CONTACT_INFO_FRM = Validator.prepareFormObject(CONTACT_INFO);

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
  updateUserReferralCode = referralCode => new Promise((resolve, reject) => {
    client
      .mutate({ mutation: updateUserReferralCode, variables: { referralCode } })
      .then(() => resolve())
      .catch(() => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        reject();
      });
  });

  @action
  formChange = (e, result, formName) => {
    this[formName] = Validator.onChange(this[formName], Validator.pullValues(e, result));
  }

  @action
  resetFormData = (form) => {
    this[form] = Validator.resetFormData(this[form]);
  }

  @action
  fundNotificationSignUp = () => new Promise((resolve, reject) => {
    uiStore.setProgress();
    const { emailAddress } = Validator.ExtractValues(this.CONTACT_INFO_FRM.fields);
    client
      .mutate({ mutation: fundNotificationSignUp, variables: { emailAddress } })
      .then(() => {
        uiStore.setProgress(false);
        resolve();
      })
      .catch(() => {
        uiStore.setProgress(false);
        Helper.toast('Something went wrong, please try again later.', 'error');
        reject();
      });
  });

  @action
  getCdnSignedUrl = (key, allowGif = false) => new Promise((resolve, reject) => {
    client
      .mutate({
        mutation: createCdnSignedUrl,
        variables: { key, allowGif },
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
  adminEmailContent = params => new Promise((res, rej) => {
    graphql({
      client,
      query: adminEmailContent,
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
