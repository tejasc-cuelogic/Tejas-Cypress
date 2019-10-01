import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../api/gqlApi';
import { paymentsIssuerList, allRepaymentDetails } from '../../queries/Repayment';

export class PaymentStore {
    @observable data = [];

    @observable details = [];

    @observable filters = false;

    @observable summary = {
      title: false,
      summary: [
        { title: 'Date', content: '7/5/18', type: 0 },
        {
          title: 'Status', content: 'Pending', type: 0, status: 'pending',
        },
        { title: '# of RS', content: 8, type: 0 },
        { title: '# of TL', content: 5, type: 0 },
        { title: 'Processed Date', content: 'N/A', type: 0 },
        { title: 'Amount Repaid', content: 'N/A', type: 0 },
        { title: 'Investor Repaid', content: 'N/A', type: 0 },
      ],
    };

    @observable requestState = {
      search: {},
    };

    @action
    setFieldValue = (field, value) => {
      this[field] = value;
    }

    @action
    initRequest = () => {
      this.data = graphql({ client, query: paymentsIssuerList });
    }

    @action
    initRepaymentDetails = () => {
      this.details = graphql({ client, query: allRepaymentDetails });
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

    @computed get repayments() {
      return (this.data.data && toJS(this.data.data.paymentsIssuerList)) || [];
    }

    @computed get repaymentDetails() {
      return (this.details.data && toJS(this.details.data.allRepaymentDetails)) || [];
    }

    @computed get loading() {
      return this.data.loading;
    }
}


export default new PaymentStore();
