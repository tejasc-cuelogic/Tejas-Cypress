import { observable, action } from 'mobx';
import graphql from 'mobx-apollo';
import { get } from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
import { getJwtReferralEmbeddedWidget, getUserRewardBalance, getReferralCreditsInformation, userPartialSignupWithReferralCode, userFullSignupWithReferralCode, upsertUserReferralCredits } from '../../queries/referrals';
import Helper from '../../../../helper/utility';
import { uiStore, userDetailsStore } from '../../index';

export class ReferralStore {
  @observable referralCode = null;

  @action
  getJwtReferralEmbeddedWidget = () => new Promise((resolve, reject) => {
    const { userDetails } = userDetailsStore;
    const saasQuatchUserId = get(userDetails, 'saasquatch.userId');
    const userId = saasQuatchUserId || userDetails.id;
    const payLoad = {
      id: userId,
      accountId: userId,
    };
    if (!saasQuatchUserId) {
      payLoad.email = get(userDetails, 'email.address');
      payLoad.firstName = get(userDetails, 'info.firstName');
      payLoad.lastName = get(userDetails, 'info.lastName');
    }
    graphql({
      client,
      query: getJwtReferralEmbeddedWidget,
      variables: payLoad,
      fetchPolicy: 'network-only',
      onFetch: (data) => {
        if (data) {
          resolve(data);
        }
      },
      onError: () => { Helper.toast('Something went wrong, please try again later.', 'error'); reject(); },
    });
  });

  @action
  getUserRewardBalance = () => new Promise((resolve) => {
    const { userDetails } = userDetailsStore;
    graphql({
      client,
      query: getUserRewardBalance,
      variables: { userId: userDetails.id },
      fetchPolicy: 'network-only',
      onFetch: (data) => {
        if (data) {
          resolve(data);
        }
      },
      onError: () => Helper.toast('Something went wrong, please try again later.', 'error'),
    });
  });

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
      onError: () => Helper.toast('Something went wrong, please try again later.', 'error'),
    });
  });

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
      onError: () => Helper.toast('Something went wrong, please try again later.', 'error'),
    });
  });

  @action
  userPartialFullSignupWithReferralCode = (val, type = 'partial') => {
    const mutation = type === 'partial' ? userPartialSignupWithReferralCode : userFullSignupWithReferralCode;
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation,
          variables: type === 'partial' ? { code: val } : { userId: val },
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
  }

  @action
  upsertUserReferralCredits = userId => new Promise((resolve, reject) => {
    client
      .mutate({
        mutation: upsertUserReferralCredits,
        variables: { userId },
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
}

export default new ReferralStore();
