import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { getJobListing } from '../../queries/public';
import { GqlClient as client } from '../../../../api/publicApi';

export class PublicStore {
  @observable jobListData = {};

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
