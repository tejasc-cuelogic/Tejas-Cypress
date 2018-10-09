/* eslint-disable class-methods-use-this */
import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import moment from 'moment';
import map from 'lodash/map';
import isArray from 'lodash/isArray';
import { GqlClient as client } from '../../../../api/gqlApi';
import { allUsersQuery } from '../../queries/users';

export class UserListingStore {
  @observable usersData = [];
  @observable filters = false;
  @observable requestState = {
    lek: null,
    filters: false,
    sort: {
      by: 'lastLoginDate',
      direction: 'desc',
    },
    search: {

    },
  };

  @action
  initRequest = () => {
    const { keyword } = this.requestState.search;
    const filters = toJS({ ...this.requestState.search });
    delete filters.keyword;
    const params = [];
    map(filters, (val, key) => {
      if (key !== 'startDate' && key !== 'endDate') {
        params.push({ field: key, value: isArray(val) ? val.join(',') : val });
      }
    });
    if (filters.startDate && filters.endDate) {
      const dateObj = `${moment(filters.startDate).format('YYYY-MM-DD')},${moment(filters.endDate).format('YYYY-MM-DD')}`;
      params.push({ field: 'createdDate', value: dateObj });
    }

    this.usersData = graphql({
      client,
      query: allUsersQuery,
      variables: {
        search: keyword,
        page: 1,
        orderBy: { field: this.requestState.sort.by, sort: this.requestState.sort.direction },
        filters: params || [],
      },
    });
  }

  @computed get allUsers() {
    return this.usersData;
  }

  @computed get users() {
    return (this.allUsers.data
      && this.allUsers.data.listUsers
      && toJS(this.allUsers.data.listUsers.users)
    ) || [];
  }

  @computed get allUsersMeta() {
    return (this.allUsers.data
      && this.allUsers.data.users
      && toJS(this.allUsers.data.users.totalCount)
    ) || [];
  }

  @computed get canLoadMore() {
    return (this.allUsers.data
      && this.allUsers.data.users
      && toJS(this.allUsers.data.users.lek)
    ) ? this.allUsers.data.users.lek.id : null;
  }

  @computed get error() {
    return (this.allUsers.error && this.allUsers.error.message) || null;
  }

  @computed get loading() {
    return this.allUsers.loading;
  }

  @computed get count() {
    return this.users.length || 0;
  }

  @computed get sortInfo() {
    const info = { ...this.requestState.sort };
    info.direction = (info.direction === 'desc') ? 'descending' : 'ascending';
    return info;
  }

  @action
  toggleSearch = () => {
    this.filters = !this.filters;
  }

  @action
  initiateSearch = (srchParams) => {
    this.requestState.lek = null;
    this.requestState.search = srchParams;
    this.initRequest();
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
  removeFilter = (name) => {
    delete this.requestState.search[name];
    this.initRequest();
  }

  @action
  initiateSort(by, sortable) {
    // https://blog.graph.cool/designing-powerful-apis-with-graphql-query-parameters-8c44a04658a9
    if (sortable) {
      this.requestState.sort.by = by;
      this.requestState.sort.direction = this.requestState.sort.direction === 'asc' ? 'desc' : 'asc';
      this.initRequest();
    }
  }

  @action
  loadMore = () => {
    if (this.canLoadMore !== null) {
      this.allUsers.loading = true;
      this.allUsers.ref.fetchMore({
        variables: { lek: this.requestState.canLoadMore },
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
