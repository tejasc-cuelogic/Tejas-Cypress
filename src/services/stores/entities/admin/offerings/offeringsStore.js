/* eslint-disable no-underscore-dangle */
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
    page: 1,
    perPage: 10,
    skip: 0,
  };

  @action
  initRequest = (props) => {
    const { first, skip, page } = props ||
    {
      first: this.requestState.perPage,
      skip: this.requestState.skip,
      page: this.requestState.page,
    };
    const params = {};
    this.requestState.page = page || this.requestState.page;
    this.requestState.perPage = first || this.requestState.perPage;
    this.requestState.skip = skip || this.requestState.skip;
    this.data = graphql({
      client,
      query: allOfferings,
      variables: { filters: params, first: first || this.requestState.perPage, skip },
    });
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

  @computed get totalRecords() {
    return (this.data && this.data.data._allOffering2sMeta &&
      this.data.data._allOffering2sMeta.count) || 0;
  }

  @computed get offerings() {
    return (this.data.data && toJS(this.data.data.allOffering2s)) || [];
  }

  @computed get loading() {
    return this.data.loading;
  }
}

export default new OfferingsStore();
