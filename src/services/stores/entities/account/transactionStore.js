/* eslint-disable no-underscore-dangle */
import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import isArray from 'lodash/isArray';
import { GqlClient as client } from '../../../../api/gcoolApi';
import { FormValidator as Validator } from '../../../../helper';
import { allTransactions } from '../../queries/transaction';
import { TRANSFER_FUND } from '../../../constants/transaction';

export class TransactionStore {
  @observable data = [];
  @observable filters = false;
  @observable requestState = { search: {}, page: 1, perPage: 10 };
  @observable TRANSFER_FRM = Validator.prepareFormObject(TRANSFER_FUND);
  @observable cash = 9743.33;

  @action
  initRequest = (props) => {
    const { first, skip, page } = props ||
      { first: this.requestState.perPage, skip: 0, page: this.requestState.page };
    const filters = toJS({ ...this.requestState.search });
    const params = {};
    if (filters.transactionType && filters.transactionType.length > 0) {
      params.transactionType_in = toJS(filters.transactionType);
    }
    this.requestState.page = page || this.requestState.page;
    this.requestState.perPage = first || this.requestState.perPage;
    this.data = graphql({
      client,
      query: allTransactions,
      variables: { filters: params, first: first || this.requestState.perPage, skip },
    });
  }

  @computed get getAllTransactions() {
    return (this.data && this.data.data.allTransactions &&
        toJS(this.data.data.allTransactions)) || [];
  }

  @computed get totalRecords() {
    return (this.data && this.data.data._allTransactionsMeta &&
      this.data.data._allTransactionsMeta.count) || 0;
  }

  @computed get loading() {
    return this.data.loading;
  }

  @computed get error() {
    return (this.data && this.data.error && this.data.error.message) || null;
  }

  @action
  transact = (amount, operation) => {
    this.cash = this.cash + parseFloat(operation === 'add' ? amount : -amount);
    this.TRANSFER_FRM = Validator.prepareFormObject(TRANSFER_FUND);
  }

  @action
  initiateSearch = (srchParams) => {
    this.requestState.search = srchParams;
    this.initRequest();
  }

  @action
  setInitiateSrch = (name, value) => {
    const srchParams = { ...this.requestState.search };
    if ((isArray(value) && value.length > 0) || (typeof value === 'string' && value !== '')) {
      srchParams[name] = value;
    } else {
      delete srchParams[name];
    }
    this.initiateSearch(srchParams);
  }

  @action
  TransferChange = (e, result) => {
    this.TRANSFER_FRM = Validator.onChange(this.TRANSFER_FRM, Validator.pullValues(e, result));
  };
}

export default new TransactionStore();
