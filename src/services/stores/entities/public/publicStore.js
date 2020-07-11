import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { get } from 'lodash';
import { getJobListing } from '../../queries/public';
import { authStore, userStore, userDetailsStore, navStore } from '../../index';
import { GqlClient as client } from '../../../../api/publicApi';

export class PublicStore {
  @observable jobListData = {};

  @observable showButton = true;

  @observable redirectUrl = '';

  @action
  setShowButton = () => {
    const { isInvestor } = userStore;
    const { isUserLoggedIn } = authStore;
    this.showButton = (!isUserLoggedIn || (isUserLoggedIn && isInvestor));
  }

  @action
  getRedirectUrl = () => {
    const { signupStatus, pendingStep } = userDetailsStore;
    const { isUserLoggedIn } = authStore;
    const { isInvestor } = userStore;
    const { stepInRoute } = navStore;
    const isFullInvestor = isInvestor && get(signupStatus, 'activeAccounts') && get(signupStatus, 'activeAccounts').length;
    this.redirectUrl = isUserLoggedIn ? (isFullInvestor ? '/offerings' : pendingStep) : `${get(stepInRoute, 'to')}`;
  }

  @action
  getJobListing = () => new Promise((resolve, reject) => {
    this.jobListData = graphql({
      client,
      query: getJobListing,
      onFetch: (data) => {
        if (data) {
          resolve(data);
        }
      },
      onError: () => {
        reject();
      },
    });
  });

  @computed get loading() {
    return this.jobListData.loading;
  }

  @computed get jobsList() {
    return (this.jobListData && this.jobListData.data && toJS(this.jobListData.data.getJobListing)) || [];
  }
}

export default new PublicStore();
