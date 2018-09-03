import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../../api/gcoolApi';
import { allOfferings } from '../../../queries/offerings/creation';

export class OfferingsStore {
  @observable data = [];
  @observable filters = false;
  @observable subTabs = {
    creation: 35,
    live: 3,
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

  @computed get offerings() {
    return (this.data.data && toJS(this.data.data.allOffering2s)) || [];
  }

  @computed get loading() {
    return this.data.loading;
  }
}

export default new OfferingsStore();
