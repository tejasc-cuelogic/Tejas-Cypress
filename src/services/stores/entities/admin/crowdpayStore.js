import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../api/gcoolApi';
import { FormValidator as Validator } from '../../../../helper';
import { allAccounts } from '../../queries/CrowdPay';
import { FILTER_META } from '../../../constants/crowdpayAccounts';

export class CrowdpayStore {
    @observable data = [];
    @observable filters = false;
    @observable summary = { ira: 12, entity: 3 };
    @observable requestState = {
      search: {},
    };
    @observable FILTER_FRM = Validator.prepareFormObject(FILTER_META);
    @action
    initRequest = () => {
      this.data = graphql({ client, query: allAccounts });
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

    @action
    fChange = (e, result) => {
      this.FILTER_FRM = Validator.onChange(this.FILTER_FRM, Validator.pullValues(e, result));
    };

    @computed get accounts() {
      return (this.data.data && toJS(this.data.data.allCrowdPayAccounts)) || [];
    }

    @computed get loading() {
      return this.data.loading;
    }
}


export default new CrowdpayStore();
