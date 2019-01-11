import { observable, action } from 'mobx';
import { isArray } from 'lodash';
import moment from 'moment';

export class TransactionsStore {
  @observable filters = false;
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
    }
  }
}


export default new TransactionsStore();
