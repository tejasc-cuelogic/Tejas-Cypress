/* eslint-disable class-methods-use-this */
import { toJS, observable, computed } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../services/GqlClient2';
import { allUsersQuery } from './queries/users';

export class UserListingStore {
  @observable usersData = [];

  constructor() {
    this.usersData = graphql({ client, query: allUsersQuery, variables: { first: 200, skip: 0 } });
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
