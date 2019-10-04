import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { orderBy, get } from 'lodash';
import moment from 'moment';
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

    @observable sortOrder = {
      column: null,
      direction: 'asc',
    }

    @action
    setFieldValue = (field, value) => {
      this[field] = value;
    }

    @action
    setSortingOrder = (column = null, direction = null) => {
      this.sortOrder.column = column;
      // this.sortOrder.listData = listData;
      this.sortOrder.direction = direction;
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
      if (this.sortOrder.column && this.sortOrder.direction && this.data && toJS(get(this.data, 'data.paymentsIssuerList'))) {
        return orderBy(
          this.data.data.paymentsIssuerList,
          [issuerList => (this.sortOrder.column !== 'shorthandBusinessName' ? issuerList[this.sortOrder.column] && moment(issuerList[this.sortOrder.column], 'MM/DD/YYYY', true).isValid() ? moment(issuerList[this.sortOrder.column], 'MM/DD/YYYY', true).unix() : '' : issuerList[this.sortOrder.column].toString().toLowerCase())],
          [this.sortOrder.direction],
        );
      }
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
