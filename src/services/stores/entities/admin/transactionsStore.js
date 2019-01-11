import { observable, action, computed } from 'mobx';
import { isArray } from 'lodash';
import moment from 'moment';
import { transactions } from '../../../../services/constants/admin/transactions';

export class TransactionsStore {
  @observable filters = false;
  @observable data = [];
  @observable requestState = {
    page: 1,
    perPage: 10,
    skip: 0,
    filters: false,
    sort: {
      by: 'createdDate',
      direction: 'desc',
    },
    search: {

    },
  };

  @action
  toggleSearch = () => {
    this.filters = !this.filters;
  }

  @action
  initRequest = () => {
    this.data = transactions;
  }

  @computed get allRecords() {
    return this.data;
  }

  initiateSearch = (srchParams) => {
    this.requestState.search = srchParams;
  }

  @action
  setInitiateSrch = (name, value) => {
    if (name === 'startDate' || name === 'endDate') {
      this.requestState.search[name] = value;
      if (this.requestState.search.startDate !== '' && this.requestState.search.endDate !== '') {
        const srchParams = { ...this.requestState.search };
        this.initiateSearch(srchParams);
      }
    } else {
      const srchParams = { ...this.requestState.search };
      if ((isArray(value) && value.length > 0) || (typeof value === 'string' && value !== '')) {
        srchParams[name] = value;
      } else {
        delete srchParams[name];
      }
      this.initiateSearch(srchParams);
    }
  }

  @action
  maskChange = (values, field) => {
    if (moment(values.formattedValue, 'MM-DD-YYYY', true).isValid()) {
      const isoDate = field === 'startDate' ? moment(values.formattedValue).toISOString() :
        moment(values.formattedValue).add(1, 'day').toISOString();
      this.setInitiateSrch(field, isoDate);
    } else {
      this.setInitiateSrch(field, values.value);
    }
  }
}


export default new TransactionsStore();
