import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../../api/gcoolApi';
import { allUpdates } from '../../../queries/offering/Updates';

export class UpdateStore {
    @observable data = [];
    @observable filters = false;
    @observable requestState = {
      search: {},
    };

    @action
    initRequest = () => {
      this.data = graphql({ client, query: allUpdates });
    }

    @action
    setInitiateSrch = (name, value) => {
      this.requestState.search[name] = value;
      this.initRequest({ ...this.requestState.search });
    }

    @action
    toggleSearch = () => {
      this.filters = !this.filters;
    }

    @computed get updates() {
      return (this.data.data && toJS(this.data.data.allUpdates)) || [];
    }

    @computed get loading() {
      return this.data.loading;
    }
}


export default new UpdateStore();
