/* eslint-disable no-underscore-dangle */
import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import isArray from 'lodash/isArray';
import { GqlClient as client } from '../../../../api/gcoolApi';
import { FormValidator as Validator } from '../../../../helper';
import { allTransactions, addFunds } from '../../queries/transaction';
import { TRANSFER_FUND } from '../../../constants/transaction';
import { userDetailsStore, uiStore } from '../../index';
import Helper from '../../../../helper/utility';

export class TransactionStore {
  @observable data = [];
  @observable filters = false;
  @observable requestState = {
    search: {},
    page: 1,
    perPage: 10,
    skip: 0,
  };
  @observable TRANSFER_FRM = Validator.prepareFormObject(TRANSFER_FUND);
  @observable cash = 9743.33;

  @action
  initRequest = (props) => {
    const { first, skip, page } = props ||
      {
        first: this.requestState.perPage,
        skip: this.requestState.skip,
        page: this.requestState.page,
      };
    const filters = toJS({ ...this.requestState.search });
    const params = {};
    if (filters.transactionType && filters.transactionType.length > 0) {
      params.transactionType_in = toJS(filters.transactionType);
    }
    this.requestState.page = page || this.requestState.page;
    this.requestState.perPage = first || this.requestState.perPage;
    this.requestState.skip = skip || this.requestState.skip;
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
  TransferChange = (values, field, formName = 'TRANSFER_FRM') => {
    this[formName] = Validator.onChange(
      this[formName],
      { name: field, value: values.floatValue },
    );
  };

  @action
  addFunds = (amount, agreementId, accountId) => {
    uiStore.setProgress(true);
    // const account = userDetailsStore.currentActiveAccountDetails;
    const { userDetails } = userDetailsStore;
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: addFunds,
          variables: {
            userId: userDetails.id,
            accountId,
            agreementId,
            amount,
            description: 'new record',
          },
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
          reject();
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }
}

export default new TransactionStore();
