import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../api/gcoolApi';
import { allAccounts } from '../../queries/CrowdPay';

export class CrowdpayStore {
    @observable data = [];
    @action
    initRequest = () => {
      this.data = graphql({ client, query: allAccounts });
    }

    @computed get accounts() {
      return (this.data.data && toJS(this.data.data.allCrowdPayAccounts)) || [];
    }

    @computed get loading() {
      return this.data.loading;
    }
}


export default new CrowdpayStore();
