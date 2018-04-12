/* eslint-disable class-methods-use-this */
import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import isArray from 'lodash/isArray';
import { GqlClient as client } from '../../services/GqlClient2';
import { allUsersQuery } from '../queries/users';

export class UserListingStore {
  @observable usersData = [];
  @observable filters = true;
  @observable requestState = {
    first: 10,
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
    const { keyword } = this.requestState.search;
    const filters = toJS({ ...this.requestState.search });
    Object.keys(filters).forEach((key) => {
      const ele = toJS(filters[key]);
      if (isArray(ele)) {
        if (ele.length > 0) {
          filters[`${key}_in`] = ele;
        }
        delete filters[key];
      } else {
        filters[key] = (key.indexOf('_lte') !== -1) ? `${filters[key]}T23:59:59` : filters[key];
      }
    });

    filters.keyword = undefined;

    if (keyword) {
      filters.OR = [
        { firstName: keyword },
        { lastName: keyword },
        { email_contains: keyword },
      ];
    }

    this.usersData = graphql({
      client,
      query: allUsersQuery,
      variables: {
        first: this.requestState.first,
        skip: this.requestState.skip,
        orderBy: `${this.requestState.sort.by}_${this.requestState.sort.direction}`,
        filters,
      },
    });
  }

  @computed get allUsers() {
    return this.usersData;
  }

  @computed get users() {
    return (this.allUsers.data && toJS(this.allUsers.data.allUsers)) || [];
  }

  @computed get allUsersMeta() {
    return (this.allUsers.data && this.allUsers.data._allUsersMeta) ?
      this.allUsers.data._allUsersMeta.count : 0;
  }

  @computed get error() {
    return (this.allUsers.error && this.allUsers.error.message) || null;
  }

  @computed get loading() {
    return this.allUsers.loading;
  }

  @computed get count() {
    return (this.allUsers.data && this.allUsers.data.allUsers) ?
      this.allUsers.data.allUsers.length : 0;
  }

  @computed get sortInfo() {
    const info = { ...this.requestState.sort };
    info.direction = (info.direction === 'DESC') ? 'descending' : 'ascending';
    return info;
  }

  @action
  toggleSearch = () => {
    this.filters = !this.filters;
  }

  @action
  initiateSearch = (srchParams) => {
    this.requestState.skip = 0; // reset
    this.requestState.search = srchParams;
    this.initRequest();
  }

  @action
  setInitiateSrch = (name, value) => {
    const srchParams = { ...this.requestState.search };
    srchParams[name] = value;
    this.initiateSearch(srchParams);
  }

  @action
  initiateSort(by, sortable) {
    // https://blog.graph.cool/designing-powerful-apis-with-graphql-query-parameters-8c44a04658a9
    if (sortable) {
      this.requestState.sort.by = by;
      this.requestState.sort.direction = this.requestState.sort.direction === 'ASC' ? 'DESC' : 'ASC';
      this.initRequest();
    }
  }

  @action
  loadMore = () => {
    if (this.allUsersMeta > this.users.length) {
      this.requestState.skip = this.users.length;
      this.allUsers.loading = true;
      this.allUsers.ref.fetchMore({
        variables: { skip: this.requestState.skip },
        updateQuery: (previousResult, { fetchMoreResult }) => ({
          allUsers: [...previousResult.allUsers, ...fetchMoreResult.allUsers],
        }),
      });
    }
  }

  @computed get usersSummary() {
    return {
      total: this.allUsersMeta,
      count: this.count,
      byType: {
        Individual: 20,
        Entity: 22,
        IRA: 17,
      },
    };
  }
}

export default new UserListingStore();
