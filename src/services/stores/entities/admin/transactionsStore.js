import { observable, action, computed } from 'mobx';
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
}


export default new TransactionsStore();
