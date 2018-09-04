import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../../api/gcoolApi';
import { allOfferings, deleteOffering } from '../../../queries/offerings/creation';
import Helper from '../../../../../helper/utility';

export class OfferingsStore {
  @observable data = [];
  @observable filters = false;
  @observable subTabs = {
    creation: 35,
    live: 34,
    engagement: 76,
    completed: 40,
  };
  @observable requestState = {
    search: {},
  };

  @action
  initRequest = () => {
    this.data = graphql({ client, query: allOfferings });
  }

  @action
  toggleSearch = () => {
    this.filters = !this.filters;
  }

  @action
  setInitiateSrch = (name, value) => {
    this.requestState.search[name] = value;
    this.initRequest({ ...this.requestState.search });
  }

  @action
  deleteOffering = (id) => {
    client
      .mutate({
        mutation: deleteOffering,
        variables: {
          id,
        },
        refetchQueries: [{ query: allOfferings }],
      })
      .then(() => Helper.toast('Offering deleted successfully.', 'success'))
      .catch(() => Helper.toast('Error while deleting offering', 'error'));
  }

  @computed get offerings() {
    return (this.data.data && toJS(this.data.data.allOffering2s)) || [];
  }

  @computed get loading() {
    return this.data.loading;
  }
}

export default new OfferingsStore();
