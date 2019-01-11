import { observable, action } from 'mobx';

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
}


export default new TransactionsStore();
