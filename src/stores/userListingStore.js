/* eslint-disable class-methods-use-this */
import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../services/GqlClient2';
import { allUsersQuery } from './queries/users';

export class UserListingStore {
  @observable usersData = [];
  @observable requestState = {
    first: 20,
    skip: 0,
    filters: false,
    sort: {
      by: 'lastLogin',
      direction: 'DESC',
    },
    search: {

    },
  };

  constructor() {
    this.initRequest();
  }

  initRequest = () => {
    this.usersData = graphql({
      client,
      query: allUsersQuery,
      variables: {
        first: 200,
        skip: 0,
        orderBy: `${this.requestState.sort.by}_${this.requestState.sort.direction}`,
      },
    });
  }

  @computed get allUsers() {
    return this.usersData;
  }

  @computed get users() {
    return (this.allUsers.data && toJS(this.allUsers.data.allUsers)) || [];
  }

  @computed get error() {
    return (this.allUsers.error && this.allUsers.error.message) || null;
  }

  @computed get loading() {
    return this.allUsers.loading;
  }

  @computed get count() {
    return this.usersData.count;
  }

  @computed get sortInfo() {
    const info = { ...this.requestState.sort };
    info.direction = (info.direction === 'DESC') ? 'descending' : 'ascending';
    return info;
  }

  @action
  toggleSearch = () => {
    this.requestState.filters = !this.requestState.filters;
    console.log(this.requestState.filters);
  }

  @action
  initiateSort(by, sortable) {
    if (sortable) {
      this.requestState.sort.by = by;
      this.requestState.sort.direction = this.requestState.sort.direction === 'ASC' ? 'DESC' : 'ASC';
      this.initRequest();
    }
  }

  getRandom = (min, max) => Math.floor(Math.random() * min) + max;

  @computed get usersSummary() {
    return {
      total: this.getRandom(250, 400),
      byType: {
        Individual: this.getRandom(50, 80),
        Entity: this.getRandom(50, 80),
        IRA: this.getRandom(50, 80),
      },
    };
  }
}

export default new UserListingStore();
