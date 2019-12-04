import { observable, action } from 'mobx';
import graphql from 'mobx-apollo';
import { get } from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
import { getUserReferralDetails, getReferralCreditsInformation, userPartialSignupWithReferralCode } from '../../queries/referrals';
import Helper from '../../../../helper/utility';
import { uiStore } from '../../index';

export class ReferralStore {
  @observable referralCode = null;

  @observable referralData = {
    availableCredit: 0,
    spentCredit: 0,
    totalEarnedCredit: 0,
    totalReferredUsers: 0,
    myShareLink: '',
    emailShareLink: '',
    twitterShareLink: '',
    messengerShareLink: '',
    facebookShareLink: '',
    smsShareLink: '',
    messengerMobileShareLink: '',
    loading: false,
  }

  getUserReferralDetails = (userId = false, showToast = true) => new Promise((resolve, reject) => {
    graphql({
      client,
      query: getUserReferralDetails,
      variables: userId ? { userId } : { },
      fetchPolicy: 'network-only',
      onFetch: (data) => {
        if (data) {
          this.setReferralData(data);
          resolve(data);
        }
      },
      onError: () => {
        if (showToast) {
          Helper.toast('Something went wrong, please try again later.', 'error');
        }
        reject();
      },
    });
  });

  @action
  setReferralData = (data) => {
    this.referralData = { ...get(data, 'getUserReferralDetails') };
  }

  @action
  getReferralCreditsInformation = code => new Promise((resolve) => {
    graphql({
      client: clientPublic,
      query: getReferralCreditsInformation,
      variables: { code },
      fetchPolicy: 'network-only',
      onFetch: (data) => {
        if (data) {
          resolve(data);
        }
      },
    });
  });

  @action
  userPartialFullSignupWithReferralCode = (val) => {
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: userPartialSignupWithReferralCode,
          variables: { code: val },
        })
        .then((result) => {
          if (result) {
            resolve(result);
          }
        })
        .catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
          reject(error);
        });
    });
  };

export default new ReferralStore();
