import { observable, action } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../api/gqlApi';
import { getJwtReferralEmbeddedWidget, getReferralCreditsInformation, userPartialSignupWithReferralCode, userFullSignupWithReferralCode, upsertUserReferralCredits } from '../../queries/referrals';
import Helper from '../../../../helper/utility';
import { uiStore, userDetailsStore } from '../../index';

export class ReferralStore {
  @observable referralCode = null;

  @action
  getJwtReferralEmbeddedWidget = () => new Promise((resolve) => {
    const { userDetails } = userDetailsStore;
    const userId = userDetails.id;
    // const userId = 'abc_123';
    graphql({
      client,
      query: getJwtReferralEmbeddedWidget,
      variables: { userId, accountId: userId },
      fetchPolicy: 'network-only',
      onFetch: data => resolve(data),
      onError: () => Helper.toast('Something went wrong, please try again later.', 'error'),
    });
  });

  @action
  getReferralCreditsInformation = code => new Promise((resolve) => {
    graphql({
      client,
      query: getReferralCreditsInformation,
      variables: { code },
      fetchPolicy: 'network-only',
      onFetch: data => resolve(data),
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
        .then(result => resolve(result))
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
      .then(result => resolve(result))
      .catch((error) => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        uiStore.setErrors(error.message);
        reject(error);
      });
  });
}

export default new ReferralStore();
