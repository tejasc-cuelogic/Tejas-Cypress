/* eslint-disable class-methods-use-this, react/jsx-closing-bracket-location */
import { toJS, observable, computed, action } from 'mobx';
import React from 'react';
import graphql from 'mobx-apollo';
import moment from 'moment';
import { capitalize, isArray, uniq } from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import { UserAvatar } from '../../../../theme/shared';
import { allUsersQuery } from '../../queries/users';
import { DELETED_ACCOUNT_STATUS } from '../../../../constants/user';

export class UserListingStore {
  @observable usersData = [];

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
  reset = () => {
    this.requestState = {
      page: 1,
      perPage: 10,
      skip: 0,
      filters: false,
      sort: {
        by: 'createdDate',
        direction: 'desc',
      },
      search: {},
    };
  }

  @action
  initRequest = (reqParams, getAllUsers = false) => {
    const {
      keyword, accountType, accountStatus, startDate, endDate, isDeleted,
    } = this.requestState.search;
    const filters = toJS({ ...this.requestState.search });
    delete filters.keyword;
    let deletedAccountStatus = [];
    const allAccountTypes = ['ADMIN', 'ISSUER', 'INVESTOR', 'IRA', 'INDIVIDUAL', 'ENTITY'];
    const allAccountStatus = ['PARTIAL', 'BASIC', 'FULL', 'MIGRATION_PARTIAL', 'MIGRATION_FULL', 'FROZEN', 'LOCKED', 'UNLOCKED'];
    if (isDeleted) {
      if (accountType && accountType.length && !accountStatus) {
        accountType.forEach((s) => {
          const statusArray = (s === 'ADMIN' || s === 'ISSUER') ? DELETED_ACCOUNT_STATUS[s] : DELETED_ACCOUNT_STATUS.INVESTOR;
          deletedAccountStatus = [...deletedAccountStatus, ...statusArray];
        });
      } else if (accountStatus) {
        deletedAccountStatus = [...deletedAccountStatus, ...DELETED_ACCOUNT_STATUS[accountStatus]];
      } else {
        deletedAccountStatus = [
          ...DELETED_ACCOUNT_STATUS.INVESTOR, ...DELETED_ACCOUNT_STATUS.ISSUER,
          ...DELETED_ACCOUNT_STATUS.ADMIN,
        ];
      }
    }
    let params = {
      search: keyword,
      accountType: !accountType && !accountStatus && !deletedAccountStatus.length ? allAccountTypes : accountType,
      accountStatus: isDeleted ? uniq(deletedAccountStatus) : !accountStatus ? allAccountStatus : accountStatus,
      page: reqParams ? reqParams.page : 1,
      limit: getAllUsers ? 100 : this.requestState.perPage,
    };

    this.requestState.page = params.page;
    if (startDate && endDate) {
      params = {
        ...params,
        ...{ accountCreateFromDate: startDate, accountCreateToDate: endDate },
      };
    }
    this.usersData = graphql({
      client,
      query: allUsersQuery,
      variables: params,
      fetchPolicy: 'network-only',
    });
  }

  @action
  maskChange = (values, field) => {
    if (moment(values.formattedValue, 'MM-DD-YYYY', true).isValid()) {
      const isoDate = field === 'startDate' ? moment(new Date(values.formattedValue)).toISOString()
        : moment(new Date(values.formattedValue)).add(1, 'day').toISOString();
      this.setInitiateSrch(field, isoDate);
    }
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
    return (this.allUsers.data
      && this.allUsers.data.listUsers
      && toJS(this.allUsers.data.listUsers.resultCount)
    ) || 0;
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
  initiateSearch = (srchParams, getAllUsers = false) => {
    this.requestState.search = srchParams;
    this.initRequest(null, getAllUsers);
  }

  @action
  setInitiateSrch = (name, value, type = false) => {
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
      } else if (type === 'checkbox') {
        srchParams[name] = value;
        if (name === 'isDeleted' && ['FROZEN', 'LOCKED', 'UNLOCKED'].includes(srchParams.accountStatus)) {
          delete srchParams.accountStatus;
        }
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

  @computed get usersOptionsForDropdown() {
    const usersOptions = {
      admin: [],
      issuer: [],
    };
    this.users.map((user) => {
      if (user.roles[0] && user.roles[0].scope && usersOptions[user.roles[0].scope]) {
        usersOptions[user.roles[0].scope].push({
          text: `${capitalize(user.info.firstName)} ${capitalize(user.info.lastName)}`,
          value: user.id,
          icon:
  <UserAvatar
    UserInfo={{
      firstName: user.info ? user.info.firstName : '',
      lastName: user.info ? user.info.lastName : '',
      avatarUrl: user.info && user.info.avatar ? user.info.avatar.url : '',
      roles: user.roles.map(r => r.scope),
    }}
    base64url
  />,
        });
      }
      return false;
    });
    return usersOptions;
  }
}

export default new UserListingStore();
